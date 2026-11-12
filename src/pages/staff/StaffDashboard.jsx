import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { formatDate, timeAgo, isOverdue } from '../../utils/helpers';
import {
  Briefcase,
  Clock,
  Cog,
  CheckCircle2,
  AlertTriangle,
  Search,
  ArrowRight,
  Filter,
  Building,
  UserCheck
} from 'lucide-react';

export const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const { complaints } = useComplaints();
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  // Filter complaints assigned to this staff member's department
  // If currentUser is staff01 (Electrical Maintenance), show Electrical Maintenance complaints
  // Or show complaints assigned to this staff member
  const departmentComplaints = complaints.filter(
    c => c.department === currentUser?.department || c.assignedStaffId === currentUser?.id
  );

  // Statistics
  const total = departmentComplaints.length;
  const newComplaints = departmentComplaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = departmentComplaints.filter(c => c.status === 'In Progress' || c.status === 'Reopened' || c.status === 'Escalated').length;
  const resolved = departmentComplaints.filter(c => c.status === 'Resolved').length;
  const overdueCount = departmentComplaints.filter(c => isOverdue(c)).length;

  // Filter list
  const filtered = departmentComplaints.filter(c => {
    const matchesSearch =
      c.trackingId.toLowerCase().includes(searchTrackingId.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTrackingId.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTrackingId.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Urgent & Overdue queue
  const attentionNeeded = departmentComplaints.filter(
    c => (c.priority === 'Urgent' || isOverdue(c)) && c.status !== 'Resolved' && c.status !== 'Rejected'
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-charcoal-950 border border-sand-400/30 rounded-2xl p-6 sm:p-8 text-sand-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-600/25 text-electric-300 border border-electric-400/30 text-xs font-bold mb-2">
            <Building className="w-3.5 h-3.5 text-electric-400" />
            <span>{currentUser?.department}</span>
            <span>•</span>
            <span>{currentUser?.staffId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Staff Resolution Workbench
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-sand-200/90">
            Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.designation})
          </p>
        </div>

        <Link
          to="/staff/assigned"
          className="px-5 py-2.5 bg-sand-200 hover:bg-sand-300 text-charcoal-950 font-bold text-xs sm:text-sm rounded-xl border border-sand-400 shadow-xs transition flex items-center gap-2"
        >
          <span>View All Department Tasks</span>
          <ArrowRight className="w-4 h-4 text-electric-600" />
        </Link>
      </div>

      {/* 5 Required Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Assigned"
          value={total}
          icon={Briefcase}
          color="blue"
          subtext="Total department tasks"
        />
        <StatCard
          title="New / Unassigned"
          value={newComplaints}
          icon={Clock}
          color="purple"
          subtext="Requires triage"
        />
        <StatCard
          title="In-Progress"
          value={inProgress}
          icon={Cog}
          color="orange"
          subtext="Under active repair"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
          subtext="Sign-off completed"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          icon={AlertTriangle}
          color="rose"
          subtext="Exceeded SLA target"
        />
      </div>

      {/* Overdue & Urgent Action Alert Callout */}
      {attentionNeeded.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Urgent Attention Required ({attentionNeeded.length} Critical Issues)</span>
            </div>
            <span className="text-[11px] text-rose-700 font-medium hidden sm:inline">
              Action within SLA prevents executive escalation to Dean
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attentionNeeded.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-rose-700">{item.trackingId}</span>
                    <PriorityBadge priority={item.priority} size="sm" />
                    {isOverdue(item) && (
                      <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                        OVERDUE
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">{item.location}</p>
                </div>

                <Link
                  to={`/staff/complaints/${item.id}`}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition"
                >
                  Action
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Quick Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTrackingId}
            onChange={e => setSearchTrackingId(e.target.value)}
            placeholder="Search tracking ID, issue title, or student name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Assigned Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Department Complaints Queue ({filtered.length})
            </h3>
            <p className="text-xs text-slate-500">
              Directly assigned to {currentUser?.department}
            </p>
          </div>

          <Link
            to="/staff/assigned"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Detailed View & Filters →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No complaints found matching this filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Tracking ID</th>
                  <th className="px-6 py-3.5">Title & Location</th>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Assigned Staff</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">SLA Target</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
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
                        <div className="font-medium text-slate-800">
                          {item.isConfidential ? 'Anonymous Student' : item.studentName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.isConfidential ? 'Confidential' : item.studentId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={item.priority} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {item.assignedStaffName || (
                          <span className="text-amber-600 font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[11px] ${overdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                          {overdue ? 'EXPIRED' : timeAgo(item.targetResolutionDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Link
                          to={`/staff/complaints/${item.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
