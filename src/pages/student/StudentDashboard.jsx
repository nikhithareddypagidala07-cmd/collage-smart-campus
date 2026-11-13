import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { formatDate, timeAgo } from '../../utils/helpers';
import {
  PlusCircle,
  FileText,
  Clock,
  Cog,
  CheckCircle2,
  Search,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { complaints } = useComplaints();
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  // Filter complaints submitted by current student
  const studentComplaints = complaints.filter(c => c.studentId === currentUser?.studentId);

  // Statistics
  const total = studentComplaints.length;
  const pending = studentComplaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = studentComplaints.filter(c => c.status === 'In Progress' || c.status === 'Escalated' || c.status === 'Reopened').length;
  const resolved = studentComplaints.filter(c => c.status === 'Resolved').length;

  const handleQuickTrack = (e) => {
    e.preventDefault();
    const query = searchTrackingId.trim().toUpperCase();
    if (!query) return;

    const found = complaints.find(c => c.trackingId.toUpperCase() === query);
    if (found) {
      navigate(`/student/complaints/${found.id}`);
    } else {
      setSearchError(`No complaint found with ID "${query}". Please check the number.`);
    }
  };

  const recentComplaints = [...studentComplaints].sort(
    (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)
  ).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 border border-sand-400/30 rounded-2xl p-6 sm:p-8 text-sand-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-electric-600/25 text-electric-300 border border-electric-400/30 text-xs font-bold mb-2">
            <span>Student Portal</span>
            <span>•</span>
            <span>{currentUser?.studentId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-sand-200/90 max-w-xl">
            {currentUser?.course} • {currentUser?.hostelBlock} • Room {currentUser?.roomNo}
          </p>
        </div>

        <Link
          to="/student/submit"
          className="px-5 py-3 bg-sand-200 text-charcoal-950 hover:bg-sand-300 font-bold text-xs sm:text-sm rounded-xl shadow-md border border-sand-400 flex items-center gap-2 transition whitespace-nowrap transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4 text-electric-600" />
          <span>Lodge New Complaint</span>
        </Link>
      </div>

      {/* Quick Tracking Search Bar */}
      <div className="bg-charcoal-900 rounded-xl border border-charcoal-800 p-4 shadow-md">
        <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-sand-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTrackingId}
              onChange={(e) => {
                setSearchTrackingId(e.target.value);
                setSearchError('');
              }}
              placeholder="Track complaint by ID (e.g. CMP-2024-8192)..."
              className="w-full pl-9 pr-3 py-2 bg-charcoal-950 border border-charcoal-700 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-electric-400 focus:border-electric-400 font-mono uppercase text-sand-100 placeholder-charcoal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-charcoal-800 hover:bg-charcoal-700 text-sand-100 rounded-lg text-xs font-bold transition border border-sand-400/40 hover:border-electric-400 shadow-xs"
          >
            Track Status
          </button>
        </form>
        {searchError && (
          <p className="text-xs text-rose-400 mt-2 pl-1 font-medium">{searchError}</p>
        )}
      </div>

      {/* 4 Required Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={total}
          icon={FileText}
          color="blue"
          subtext="Lifetime submitted"
        />
        <StatCard
          title="Pending Review"
          value={pending}
          icon={Clock}
          color="purple"
          subtext="Awaiting staff action"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={Cog}
          color="orange"
          subtext="Being investigated"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
          subtext="Issues closed successfully"
        />
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 shadow-xl overflow-hidden text-sand-100">
        <div className="px-6 py-4 border-b border-charcoal-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-sand-100">My Recent Complaints</h3>
            <p className="text-xs text-sand-300">Track and monitor status of issues lodged by your account</p>
          </div>
          <Link
            to="/student/complaints"
            className="text-xs font-semibold text-electric-400 hover:text-electric-300 flex items-center gap-1"
          >
            <span>View All ({studentComplaints.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-charcoal-950 text-sand-400 flex items-center justify-center mx-auto mb-3 border border-charcoal-800">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-sand-100 mb-1">No Complaints Submitted Yet</h4>
            <p className="text-xs text-sand-300 max-w-sm mx-auto mb-4">
              Everything in your campus facilities seems to be running smoothly! If you encounter any issue, submit it here.
            </p>
            <Link
              to="/student/submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-800 text-sand-100 border border-sand-400/40 hover:border-electric-400 rounded-xl text-xs font-semibold hover:bg-charcoal-700"
            >
              <PlusCircle className="w-4 h-4 text-electric-400" />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-sand-300 font-semibold border-b border-charcoal-800">
                <tr>
                  <th className="px-6 py-3">Tracking ID</th>
                  <th className="px-6 py-3">Issue Title & Category</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-sand-200">
                {recentComplaints.map(item => (
                  <tr key={item.id} className="hover:bg-charcoal-800/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-electric-400">
                      {item.trackingId}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-sand-100 truncate">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-sand-300 mt-0.5">
                        <CategoryIcon categoryName={item.category} className="w-3.5 h-3.5 text-sand-400" />
                        <span>{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-sand-300">
                      {item.department}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-sand-400 whitespace-nowrap">
                      {timeAgo(item.submissionDate)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/student/complaints/${item.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sand-100 bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 hover:border-electric-400/50 px-2.5 py-1 rounded-lg transition"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3 text-electric-400" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
