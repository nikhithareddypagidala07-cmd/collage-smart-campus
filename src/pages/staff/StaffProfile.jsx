import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Clock,
  Save,
  ShieldCheck
} from 'lucide-react';

export const StaffProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { complaints, showToast } = useComplaints();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [isEditing, setIsEditing] = useState(false);

  // Department metrics
  const deptComplaints = complaints.filter(
    c => c.department === currentUser?.department || c.assignedStaffId === currentUser?.id
  );
  const resolved = deptComplaints.filter(c => c.status === 'Resolved').length;
  const inProgress = deptComplaints.filter(c => c.status === 'In Progress' || c.status === 'Under Review').length;
  const resolutionRate = deptComplaints.length > 0 ? Math.round((resolved / deptComplaints.length) * 100) : 100;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ phone, designation });
    setIsEditing(false);
    showToast('Staff profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
          alt={currentUser?.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-purple-50 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-sand-100">{currentUser?.name}</h1>
            <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Staff Member
            </span>
          </div>
          <p className="text-xs sm:text-sm text-sand-300 font-medium">
            {currentUser?.designation} • {currentUser?.department}
          </p>
          <p className="text-xs text-sand-400 font-mono">
            Employee Code: {currentUser?.staffId}
          </p>
        </div>

        <div className="flex sm:flex-col gap-3 text-center">
          <div className="bg-charcoal-950 border border-charcoal-800 rounded-xl px-4 py-2">
            <span className="block text-xl font-extrabold text-electric-400">{deptComplaints.length}</span>
            <span className="text-[11px] text-sand-400">Dept Tasks</span>
          </div>
          <div className="bg-charcoal-950 border border-charcoal-800 rounded-xl px-4 py-2">
            <span className="block text-xl font-extrabold text-emerald-600">{resolutionRate}%</span>
            <span className="text-[11px] text-sand-400">Resolve Rate</span>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-charcoal-800">
          <div>
            <h3 className="text-base font-bold text-sand-100">Department Roster Details</h3>
            <p className="text-xs text-sand-400">Official college employee registry</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold text-sand-200 transition"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Contact Info'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Full Name
              </label>
              <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100 font-medium">
                {currentUser?.name}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Employee Identification
              </label>
              <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100 font-mono font-medium">
                {currentUser?.staffId}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Department
              </label>
              <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100 font-medium">
                {currentUser?.department}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Designation
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full p-2.5 bg-charcoal-900 border border-blue-400 rounded-xl text-xs sm:text-sm text-sand-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100">
                  {currentUser?.designation}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Department Email
              </label>
              <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100 font-mono">
                {currentUser?.email}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Extension / Phone
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-charcoal-900 border border-blue-400 rounded-xl text-xs sm:text-sm text-sand-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100">
                  {currentUser?.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4 border-t border-charcoal-800">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
