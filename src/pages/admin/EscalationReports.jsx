import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Modal } from '../../components/common/Modal';
import { formatDate, timeAgo, isOverdue } from '../../utils/helpers';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Send,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const EscalationReports = () => {
  const { complaints, updateComplaintStatus, assignStaff, showToast } = useComplaints();
  const { users, currentUser } = useAuth();

  // Find all escalated or overdue issues
  const escalatedList = complaints.filter(c => c.status === 'Escalated');
  const overdueList = complaints.filter(c => isOverdue(c));
  const combinedAtRisk = complaints.filter(
    c => (c.status === 'Escalated' || isOverdue(c) || c.priority === 'Urgent') && c.status !== 'Resolved' && c.status !== 'Rejected'
  );

  const [activeTab, setActiveTab] = useState('all-risk'); // 'all-risk' | 'escalated' | 'overdue'

  // Intervention Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [interventionNote, setInterventionNote] = useState('');
  const [reassignedStaff, setReassignedStaff] = useState('');
  const [closeResolved, setCloseResolved] = useState(false);

  const displayedList = activeTab === 'escalated'
    ? escalatedList
    : activeTab === 'overdue'
    ? overdueList
    : combinedAtRisk;

  const handleOpenIntervention = (complaint) => {
    setSelectedComplaint(complaint);
    setInterventionNote('Dean executive review conducted. Expedited clearance authorized.');
    setReassignedStaff(complaint.assignedStaffId || '');
    setCloseResolved(false);
    setIsActionModalOpen(true);
  };

  const handleConfirmIntervention = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    if (closeResolved) {
      updateComplaintStatus(
        selectedComplaint.id,
        'Resolved',
        `Dean Executive Clearance: ${interventionNote}`,
        'Dean of Student Welfare'
      );
    } else {
      if (reassignedStaff && reassignedStaff !== selectedComplaint.assignedStaffId) {
        const staffObj = users.staff.find(s => s.id === reassignedStaff);
        if (staffObj) {
          assignStaff(
            selectedComplaint.id,
            staffObj,
            `Dean Intervention Directive: ${interventionNote}`,
            'Dean of Student Welfare'
          );
        }
      }
      updateComplaintStatus(
        selectedComplaint.id,
        'In Progress',
        `Dean Directive: ${interventionNote}`,
        'Dean Office'
      );
    }

    setIsActionModalOpen(false);
    setSelectedComplaint(null);
    showToast('Executive directive logged and dispatched to department.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-sand-100">Escalation Center & SLA Compliance Audit</h1>
        <p className="text-xs sm:text-sm text-sand-400">
          Executive monitoring of breached SLAs, persistent student grievances, and urgent campus incidents
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-rose-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-sand-400 uppercase font-semibold">Active Escalations</span>
            <h3 className="text-2xl font-extrabold text-rose-700">{escalatedList.length}</h3>
            <span className="text-[11px] text-rose-600 font-medium">Under direct dean observation</span>
          </div>
        </div>

        <div className="bg-charcoal-900 p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-sand-400 uppercase font-semibold">Overdue Breaches</span>
            <h3 className="text-2xl font-extrabold text-amber-700">{overdueList.length}</h3>
            <span className="text-[11px] text-amber-600 font-medium">Passed category turnaround SLA</span>
          </div>
        </div>

        <div className="bg-charcoal-900 p-5 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-sand-400 uppercase font-semibold">SLA Compliance Rate</span>
            <h3 className="text-2xl font-extrabold text-emerald-700">92.4%</h3>
            <span className="text-[11px] text-emerald-600 font-medium">Compliant with UGC norms</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal-800">
        <button
          onClick={() => setActiveTab('all-risk')}
          className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'all-risk'
              ? 'border-blue-600 text-electric-400'
              : 'border-transparent text-sand-400 hover:text-sand-100'
          }`}
        >
          All High-Risk / Critical ({combinedAtRisk.length})
        </button>
        <button
          onClick={() => setActiveTab('escalated')}
          className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'escalated'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-sand-400 hover:text-sand-100'
          }`}
        >
          Formally Escalated ({escalatedList.length})
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
            activeTab === 'overdue'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-sand-400 hover:text-sand-100'
          }`}
        >
          Overdue SLA ({overdueList.length})
        </button>
      </div>

      {/* Escalation Table */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 shadow-xs overflow-hidden">
        {displayedList.length === 0 ? (
          <div className="p-12 text-center text-sand-400 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-sand-100 text-sm">No Active Escalations</p>
            <p className="text-sand-400 mt-0.5">All complaints are within acceptable SLA parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-sand-300 font-semibold border-b border-charcoal-800">
                <tr>
                  <th className="px-6 py-3.5">Tracking ID</th>
                  <th className="px-6 py-3.5">Title & Location</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Target SLA</th>
                  <th className="px-6 py-3.5 text-right">Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-sand-200">
                {displayedList.map(item => {
                  const overdue = isOverdue(item);
                  return (
                    <tr key={item.id} className="hover:bg-charcoal-950/80 transition">
                      <td className="px-6 py-4 font-mono font-bold text-rose-700 whitespace-nowrap">
                        {item.trackingId}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-sand-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-sand-400 truncate mt-0.5">
                          {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-sand-100">
                        {item.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.isConfidential ? 'Anonymous' : item.studentName}
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[11px] ${overdue ? 'text-rose-600 font-bold' : 'text-sand-400'}`}>
                          {overdue ? 'BREACHED' : timeAgo(item.targetResolutionDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenIntervention(item)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition shadow-xs"
                        >
                          Dean Directive
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dean Intervention Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`Dean Executive Intervention: ${selectedComplaint?.trackingId}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmIntervention} className="space-y-4">
          <div className="p-3 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs space-y-1">
            <p className="font-bold text-sand-100">{selectedComplaint?.title}</p>
            <p className="text-sand-400">Dept: {selectedComplaint?.department} • Priority: {selectedComplaint?.priority}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
              Executive Directive Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={interventionNote}
              onChange={e => setInterventionNote(e.target.value)}
              placeholder="Specify instructions or emergency procurement approval..."
              className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
              Reassign to Specific Officer
            </label>
            <select
              value={reassignedStaff}
              onChange={e => setReassignedStaff(e.target.value)}
              className="w-full p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs"
            >
              <option value="">Leave Current Assignment ({selectedComplaint?.assignedStaffName})</option>
              {users.staff.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <input
              type="checkbox"
              id="closeResolvedCheck"
              checked={closeResolved}
              onChange={e => setCloseResolved(e.target.checked)}
              className="h-4 w-4 text-emerald-600 rounded"
            />
            <label htmlFor="closeResolvedCheck" className="text-xs text-emerald-900 font-semibold cursor-pointer">
              Mark as Resolved immediately (Dean direct sign-off)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsActionModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-sand-200 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Execute Directive
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
