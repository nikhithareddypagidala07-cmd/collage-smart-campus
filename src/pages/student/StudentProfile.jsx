import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Building,
  CheckCircle2,
  FileText,
  Save,
  Shield
} from 'lucide-react';

export const StudentProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { complaints, showToast } = useComplaints();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [hostelBlock, setHostelBlock] = useState(currentUser?.hostelBlock || '');
  const [roomNo, setRoomNo] = useState(currentUser?.roomNo || '');
  const [isEditing, setIsEditing] = useState(false);

  const studentComplaints = complaints.filter(c => c.studentId === currentUser?.studentId);
  const resolved = studentComplaints.filter(c => c.status === 'Resolved').length;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ phone, hostelBlock, roomNo });
    setIsEditing(false);
    showToast('Profile information updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={currentUser?.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-sand-100">{currentUser?.name}</h1>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Student
            </span>
          </div>
          <p className="text-xs sm:text-sm text-sand-300 font-medium">
            {currentUser?.course} • {currentUser?.semester}
          </p>
          <p className="text-xs text-sand-400 font-mono">
            Student Identification: {currentUser?.studentId}
          </p>
        </div>

        <div className="flex sm:flex-col gap-3 text-center">
          <div className="bg-charcoal-950 border border-charcoal-800 rounded-xl px-4 py-2">
            <span className="block text-xl font-extrabold text-electric-400">{studentComplaints.length}</span>
            <span className="text-[11px] text-sand-400">Submitted</span>
          </div>
          <div className="bg-charcoal-950 border border-charcoal-800 rounded-xl px-4 py-2">
            <span className="block text-xl font-extrabold text-emerald-600">{resolved}</span>
            <span className="text-[11px] text-sand-400">Resolved</span>
          </div>
        </div>
      </div>

      {/* Details & Edit Form */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-charcoal-800">
          <div>
            <h3 className="text-base font-bold text-sand-100">Student Account Information</h3>
            <p className="text-xs text-sand-400">Official college records and contact data</p>
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
                Student ID
              </label>
              <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100 font-mono font-medium">
                {currentUser?.studentId}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                College Email (Institutional)
              </label>
              <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100 font-mono">
                {currentUser?.email}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Contact Phone Number
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Hostel Block Assignment
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={hostelBlock}
                  onChange={e => setHostelBlock(e.target.value)}
                  className="w-full p-2.5 bg-charcoal-900 border border-blue-400 rounded-xl text-xs sm:text-sm text-sand-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100">
                  {currentUser?.hostelBlock}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-400 mb-1">
                Hostel Room Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={roomNo}
                  onChange={e => setRoomNo(e.target.value)}
                  className="w-full p-2.5 bg-charcoal-900 border border-blue-400 rounded-xl text-xs sm:text-sm text-sand-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="p-2.5 bg-charcoal-950 border border-charcoal-800 rounded-xl text-xs sm:text-sm text-sand-100">
                  {currentUser?.roomNo || 'N/A'}
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
