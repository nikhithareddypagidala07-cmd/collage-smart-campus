import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { Timeline } from '../../components/common/Timeline';
import { Modal } from '../../components/common/Modal';
import { formatDate, timeAgo, isOverdue, maskPhoneNumber } from '../../utils/helpers';
import {
  ArrowLeft,
  Building,
  User,
  Phone,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  MessageSquare,
  UserCheck,
  Send,
  AlertTriangle,
  Cog,
  ShieldAlert
} from 'lucide-react';

export const StaffComplaintDetails = () => {
  const { id } = useParams();
  const { currentUser, users } = useAuth();
  const { complaints, updateComplaintStatus, assignStaff, showToast } = useComplaints();
  const navigate = useNavigate();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Status Update State
  const [selectedStatus, setSelectedStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const complaint = complaints.find(
    c => c.id === id || c.trackingId.toLowerCase() === (id || '').toLowerCase()
  );

  // Initialize selected status from complaint
  useState(() => {
    if (complaint) {
      setSelectedStatus(complaint.status);
      setSelectedStaffId(complaint.assignedStaffId || currentUser?.id || '');
    }
  });

  if (!complaint) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Complaint Not Found</h2>
        <Link
          to="/staff/assigned"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 mt-4 inline-block"
        >
          Return to Assigned Complaints
        </Link>
      </div>
    );
  }

  // Get department staff list for reassigning
  const deptStaffMembers = users.staff.filter(
    s => s.department === complaint.department || s.department === currentUser?.department
  );

  const handleUpdateStatusAndRemarks = (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      showToast('Please enter an update remark explaining the progress or action taken.', 'error');
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      // 1. If staff assignment changed
      if (selectedStaffId && selectedStaffId !== complaint.assignedStaffId) {
        const staffObj = users.staff.find(s => s.id === selectedStaffId);
        if (staffObj) {
          assignStaff(complaint.id, staffObj, remarks, `${currentUser?.name} (${currentUser?.designation})`);
        }
      }

      // 2. Update status
      if (selectedStatus && selectedStatus !== complaint.status) {
        updateComplaintStatus(
          complaint.id,
          selectedStatus,
          remarks,
          `${currentUser?.name} (${currentUser?.designation})`
        );
      } else {
        // Just add remarks update if status is unchanged
        updateComplaintStatus(
          complaint.id,
          complaint.status,
          remarks,
          `${currentUser?.name} (${currentUser?.designation})`
        );
      }

      setIsUpdating(false);
      setRemarks('');
      showToast('Complaint status and progress remarks recorded successfully!', 'success');
    }, 400);
  };

  const handleQuickAssignSelf = () => {
    assignStaff(
      complaint.id,
      currentUser,
      `Accepted and taken up by ${currentUser?.name}.`,
      `${currentUser?.name} (${currentUser?.designation})`
    );
    setSelectedStaffId(currentUser?.id);
  };

  const overdue = isOverdue(complaint);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/staff/assigned"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Complaints</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800">
            {complaint.trackingId}
          </div>
        </div>
      </div>

      {/* Overdue Warning */}
      {overdue && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-900 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 animate-bounce" />
            <div>
              <span className="font-bold">Overdue Resolution Warning:</span> This complaint has passed its SLA target date ({formatDate(complaint.targetResolutionDate)}). Please update status and complete repair promptly.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Details + Staff Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <StatusBadge status={complaint.status} size="lg" />
                <PriorityBadge priority={complaint.priority} size="md" />
                {complaint.isConfidential && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                    <Lock className="w-3 h-3" />
                    <span>Confidential Student</span>
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {complaint.title}
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Student Grievance Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {complaint.description}
              </p>
            </div>

            {/* Evidence Image */}
            {complaint.evidenceImage && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Supporting Photo Evidence
                </h4>
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 max-w-md bg-slate-100">
                  <img
                    src={complaint.evidenceImage}
                    alt="Supporting Evidence"
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Inspect High-Resolution Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Stepper & Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <Timeline history={complaint.history} currentStatus={complaint.status} />
          </div>
        </div>

        {/* Right Col: Staff Control Panel */}
        <div className="space-y-6">
          {/* Action Form: Update Status, Remarks, Assign */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Cog className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Department Action Panel</h3>
            </div>

            <form onSubmit={handleUpdateStatusAndRemarks} className="space-y-4">
              {/* Change Status Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Update Lifecycle Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Submitted">Submitted (Pending Triage)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress (Active Work)</option>
                  <option value="Resolved">Resolved (Work Completed)</option>
                  <option value="Rejected">Rejected (Out of scope / Invalid)</option>
                </select>
              </div>

              {/* Assign Technician */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Assigned Technician
                  </label>
                  {complaint.assignedStaffId !== currentUser?.id && (
                    <button
                      type="button"
                      onClick={handleQuickAssignSelf}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Assign to Me
                    </button>
                  )}
                </div>
                <select
                  value={selectedStaffId}
                  onChange={e => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {users.staff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.department} - {s.designation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Remarks / Resolution Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Progress Remarks / Resolution Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={
                    selectedStatus === 'Resolved'
                      ? 'Detail the resolution: replaced parts, verified fix, technician name...'
                      : selectedStatus === 'Rejected'
                      ? 'Specify mandatory institutional reason for rejection...'
                      : 'Provide on-site inspection findings or work update for the student...'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Remarks will be saved to the permanent audit trail and notified to the student.
                </span>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isUpdating ? 'Saving...' : 'Submit Update & Notify Student'}</span>
              </button>
            </form>
          </div>

          {/* Student & Location Metadata */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student & Location Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Submitted By</span>
                  <span className="font-semibold text-slate-800">
                    {complaint.isConfidential ? 'Anonymous Student (Confidential)' : complaint.studentName}
                  </span>
                  {!complaint.isConfidential && (
                    <span className="text-slate-500 block text-[11px] font-mono">{complaint.studentId}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Incident Location</span>
                  <span className="font-semibold text-slate-800">{complaint.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Registered Date</span>
                  <span className="text-slate-800 font-medium">{formatDate(complaint.submissionDate)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Target SLA Resolution</span>
                  <span className={`font-semibold ${overdue ? 'text-rose-600' : 'text-slate-800'}`}>
                    {formatDate(complaint.targetResolutionDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="Supporting Image Evidence"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-3 text-center">
          <img
            src={complaint.evidenceImage}
            alt="Evidence Detailed View"
            className="w-full max-h-[70vh] object-contain rounded-xl bg-slate-900"
          />
          <p className="text-xs text-slate-500">
            Uploaded by {complaint.isConfidential ? 'Anonymous Student' : complaint.studentName} on {formatDate(complaint.submissionDate)}
          </p>
        </div>
      </Modal>
    </div>
  );
};
