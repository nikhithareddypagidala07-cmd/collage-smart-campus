import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { Modal } from '../../components/common/Modal';
import { formatDate, timeAgo, isOverdue } from '../../utils/helpers';
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  RotateCcw,
  Building,
  User,
  ArrowRight,
  ShieldAlert,
  Edit3,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const AllComplaints = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialDept = searchParams.get('dept') || 'All';

  const { complaints, categories, departments, updateComplaintStatus, assignStaff, escalateComplaint, showToast } = useComplaints();
  const { users, currentUser } = useAuth();

  const [search, setSearch] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDept, setSelectedDept] = useState(initialDept);

  // Reassignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetComplaint, setTargetComplaint] = useState(null);
  const [newStaffId, setNewStaffId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');

  // Escalation Modal State
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  // Filter complaints
  const filtered = complaints.filter(c => {
    const matchesSearch =
      c.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || c.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesPriority = selectedPriority === 'All' || c.priority.toLowerCase() === selectedPriority.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesDept = selectedDept === 'All' || c.department === selectedDept;

    return matchesSearch && matchesStatus && matchesPriority && matchesDept;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSelectedCategory('All');
    setSelectedDept('All');
  };

  const handleOpenAssignModal = (complaint) => {
    setTargetComplaint(complaint);
    setNewStaffId(complaint.assignedStaffId || '');
    setAssignRemarks('');
    setIsAssignModalOpen(true);
  };

  const handleOpenEscalateModal = (complaint) => {
    setTargetComplaint(complaint);
    setEscalateReason('Overdue resolution past SLA limits requiring direct dean oversight.');
    setIsEscalateModalOpen(true);
  };

  const handleConfirmAssignment = (e) => {
    e.preventDefault();
    if (!targetComplaint || !newStaffId) return;

    const staffObj = users.staff.find(s => s.id === newStaffId);
    if (staffObj) {
      assignStaff(
        targetComplaint.id,
        staffObj,
        assignRemarks || 'Assigned by Dean / Administration Office.',
        `${currentUser?.name || 'Admin'} (Dean Office)`
      );
      setIsAssignModalOpen(false);
      setTargetComplaint(null);
    }
  };

  const handleConfirmEscalation = (e) => {
    e.preventDefault();
    if (!targetComplaint) return;

    escalateComplaint(
      targetComplaint.id,
      escalateReason,
      currentUser?.name || 'Dean of Student Welfare'
    );
    setIsEscalateModalOpen(false);
    setTargetComplaint(null);
  };

  const handleExportCSV = () => {
    const headers = ['TrackingID', 'Title', 'Category', 'Department', 'Priority', 'Status', 'StudentName', 'StudentID', 'SubmissionDate', 'TargetDate'];
    const rows = filtered.map(c => [
      c.trackingId,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.department,
      c.priority,
      c.status,
      c.isConfidential ? 'Confidential' : c.studentName,
      c.isConfidential ? 'N/A' : c.studentId,
      c.submissionDate,
      c.targetResolutionDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartCampus_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filtered.length} complaints to CSV file`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campus-Wide Complaints Central Register</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit, reassign, and escalate all {complaints.length} grievances across college divisions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Data (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Tracking ID, Title, Student Name, Location, or Keyword..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Status Filter
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
              <option value="Escalated">Escalated</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Priority Filter
            </label>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="All">All 10 Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No complaints found matching this criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Tracking ID</th>
                  <th className="px-6 py-3.5">Complaint Title</th>
                  <th className="px-6 py-3.5">Category & Dept</th>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Assigned Officer</th>
                  <th className="px-6 py-3.5 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map(item => {
                  const overdue = isOverdue(item);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {item.trackingId}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{item.category}</div>
                        <div className="text-[11px] text-slate-400">{item.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {item.isConfidential ? 'Anonymous Student' : item.studentName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.isConfidential ? 'Confidential' : item.studentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                        {overdue && (
                          <span className="block text-[10px] font-bold text-rose-600 mt-1">
                            OVERDUE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {item.assignedStaffName || (
                          <span className="text-amber-600 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenAssignModal(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                            title="Assign or reassign department staff"
                          >
                            Assign
                          </button>

                          {item.status !== 'Resolved' && item.status !== 'Escalated' && (
                            <button
                              onClick={() => handleOpenEscalateModal(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                              title="Escalate directly to Dean"
                            >
                              Escalate
                            </button>
                          )}

                          <Link
                            to={`/student/complaints/${item.id}`}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reassign Staff Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Staff: ${targetComplaint?.trackingId}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmAssignment} className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-900 mb-1">
              Issue: {targetComplaint?.title}
            </p>
            <p className="text-xs text-slate-500">
              Department: {targetComplaint?.department}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select Staff Member / Officer <span className="text-rose-500">*</span>
            </label>
            <select
              value={newStaffId}
              onChange={e => setNewStaffId(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose Staff Member</option>
              {users.staff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department} • {s.designation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Assignment Directive Remarks
            </label>
            <textarea
              rows={3}
              value={assignRemarks}
              onChange={e => setAssignRemarks(e.target.value)}
              placeholder="e.g. Please conduct priority inspection and submit fix by 4 PM..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Escalate Modal */}
      <Modal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        title={`Dean Escalation: ${targetComplaint?.trackingId}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmEscalation} className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 inline mr-1.5" />
            Escalating will mark this complaint as <strong>Urgent Escalation</strong>, notify all senior officers, and highlight it on executive dashboards.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Escalation Justification <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={escalateReason}
              onChange={e => setEscalateReason(e.target.value)}
              placeholder="Explain justification for high-level escalation..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEscalateModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Confirm Escalation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
