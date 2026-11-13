import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { Timeline } from '../../components/common/Timeline';
import { Modal } from '../../components/common/Modal';
import { formatDate, timeAgo, isOverdue } from '../../utils/helpers';
import {
  ArrowLeft,
  Copy,
  Check,
  Building,
  User,
  Calendar,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Lock,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { complaints, reopenComplaint, showToast } = useComplaints();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [isReopening, setIsReopening] = useState(false);

  // Find complaint by id or trackingId
  const complaint = complaints.find(
    c => c.id === id || c.trackingId.toLowerCase() === (id || '').toLowerCase()
  );

  if (!complaint) {
    return (
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-12 text-center max-w-lg mx-auto shadow-xs">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-sand-100 mb-1">Complaint Not Found</h2>
        <p className="text-xs text-sand-400 mb-6">
          The requested tracking reference does not exist or may have been deleted.
        </p>
        <Link
          to="/student/complaints"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
        >
          Return to My Complaints
        </Link>
      </div>
    );
  }

  const handleCopyTrackingId = () => {
    navigator.clipboard.writeText(complaint.trackingId);
    setCopied(true);
    showToast('Tracking ID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReopenSubmit = (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;

    setIsReopening(true);
    setTimeout(() => {
      reopenComplaint(complaint.id, reopenReason, currentUser?.name || 'Student');
      setIsReopening(false);
      setIsReopenModalOpen(false);
      setReopenReason('');
    }, 400);
  };

  const isResolved = complaint.status === 'Resolved';
  const isRejected = complaint.status === 'Rejected';
  const isComplaintOverdue = isOverdue(complaint);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/student/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand-300 hover:text-sand-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Tracking ID Badge with Copy Button */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-charcoal-800 rounded-xl text-xs font-mono font-bold text-sand-100">
            <span>{complaint.trackingId}</span>
            <button
              onClick={handleCopyTrackingId}
              className="text-sand-400 hover:text-electric-400 p-0.5 rounded transition"
              title="Copy Tracking ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {isComplaintOverdue && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 animate-bounce" />
          <div>
            <span className="font-bold">Overdue Resolution Notice:</span> This issue has passed its target resolution deadline ({formatDate(complaint.targetResolutionDate)}). The ticket has been flagged for departmental escalation.
          </div>
        </div>
      )}

      {/* Special Resolution Success Banner for Student */}
      {isResolved && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-charcoal-900/20 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                Resolution Verified
              </span>
              <h3 className="text-lg font-bold">This Issue Has Been Resolved</h3>
              <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed">
                Resolved on {formatDate(complaint.resolvedDate)}. If the problem reoccurs or the fix was inadequate, you may reopen this ticket.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReopenModalOpen(true)}
            className="px-4 py-2.5 bg-charcoal-900 text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span>Reopen If Problem Persists</span>
          </button>
        </div>
      )}

      {/* Rejection Notice Banner */}
      {isRejected && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-900 flex items-start gap-3">
          <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">Complaint Rejected by Administration</h4>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              <strong>Official Reason:</strong> {complaint.remarks || 'No detailed reason provided.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Details + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <StatusBadge status={complaint.status} size="lg" />
                <PriorityBadge priority={complaint.priority} size="md" />
                {complaint.isConfidential && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-sand-200 rounded-full text-xs font-medium border border-charcoal-800">
                    <Lock className="w-3 h-3" />
                    <span>Confidential</span>
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-sand-100">
                {complaint.title}
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                Description
              </h4>
              <p className="text-xs sm:text-sm text-sand-200 leading-relaxed whitespace-pre-line bg-charcoal-950 p-4 rounded-xl border border-charcoal-800">
                {complaint.description}
              </p>
            </div>

            {/* Supporting Image Preview */}
            {complaint.evidenceImage && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                  Supporting Image Evidence
                </h4>
                <div className="relative group rounded-xl overflow-hidden border border-charcoal-800 max-w-md bg-slate-100">
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
                    <span>Click to Enlarge</span>
                  </button>
                </div>
              </div>
            )}

            {/* Latest Staff Remarks */}
            <div className="p-4 bg-charcoal-950/60 border border-blue-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <MessageSquare className="w-4 h-4 text-electric-400" />
                <span>Latest Department Progress Remark:</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed pl-6">
                {complaint.remarks || 'Awaiting preliminary inspection.'}
              </p>
            </div>
          </div>

          {/* Interactive Stepper & Audit Trail */}
          <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 sm:p-8 shadow-xs">
            <Timeline history={complaint.history} currentStatus={complaint.status} />
          </div>
        </div>

        {/* Right Column: Metadata & Department Sidebar */}
        <div className="space-y-6">
          <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-400">
              Department & Assignment
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sand-400 block text-[11px]">Assigned Department</span>
                  <span className="font-semibold text-sand-100">{complaint.department}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sand-400 block text-[11px]">Assigned Staff / Officer</span>
                  <span className="font-semibold text-sand-100">{complaint.assignedStaffName || 'Pending Assignment'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CategoryIcon categoryName={complaint.category} className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sand-400 block text-[11px]">Category</span>
                  <span className="font-semibold text-sand-100">{complaint.category}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sand-400 block text-[11px]">Reported Location</span>
                  <span className="font-semibold text-sand-100">{complaint.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sand-400">
              SLA & Timestamps
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-sand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sand-400 block text-[11px]">Submitted On</span>
                  <span className="text-sand-100 font-medium">{formatDate(complaint.submissionDate)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-sand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sand-400 block text-[11px]">Target Resolution Deadline</span>
                  <span className={`font-medium ${isComplaintOverdue ? 'text-rose-600 font-bold' : 'text-sand-100'}`}>
                    {formatDate(complaint.targetResolutionDate)}
                  </span>
                </div>
              </div>

              {complaint.resolvedDate && (
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sand-400 block text-[11px]">Actual Resolved Date</span>
                    <span className="text-emerald-700 font-bold">{formatDate(complaint.resolvedDate)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Student Actions */}
          {isResolved && (
            <button
              onClick={() => setIsReopenModalOpen(true)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reopen This Complaint</span>
            </button>
          )}
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
          <p className="text-xs text-sand-400">
            Uploaded by {complaint.isConfidential ? 'Anonymous Student' : complaint.studentName} on {formatDate(complaint.submissionDate)}
          </p>
        </div>
      </Modal>

      {/* Reopen Reason Modal */}
      <Modal
        isOpen={isReopenModalOpen}
        onClose={() => setIsReopenModalOpen(false)}
        title="Reopen Resolved Complaint"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleReopenSubmit} className="space-y-4">
          <p className="text-xs text-sand-300 leading-relaxed">
            Please explain why this complaint is being reopened. What issue persists or requires further maintenance?
          </p>
          <div>
            <label className="block text-xs font-semibold text-sand-200 uppercase mb-1">
              Persistence Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={reopenReason}
              onChange={e => setReopenReason(e.target.value)}
              placeholder="e.g. The fan sparked again when turned to speed 3. Problem was not permanently fixed."
              className="w-full p-3 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsReopenModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-sand-200 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReopening || !reopenReason.trim()}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
            >
              {isReopening ? 'Submitting...' : 'Confirm Reopen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
