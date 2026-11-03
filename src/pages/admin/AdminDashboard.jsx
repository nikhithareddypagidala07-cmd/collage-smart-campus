import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { CategoryIcon } from '../../components/common/CategoryIcon';
import { formatDate, timeAgo, isOverdue } from '../../utils/helpers';
import {
  FileText,
  CheckCircle2,
  Clock,
  Cog,
  AlertTriangle,
  Timer,
  ArrowRight,
  Shield,
  TrendingUp,
  BarChart3,
  Users,
  Building,
  AlertOctagon
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const AdminDashboard = () => {
  const { complaints, categories, departments } = useComplaints();
  const navigate = useNavigate();

  // 6 Required Statistics
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const pending = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Reopened' || c.status === 'Escalated').length;
  const overdueCount = complaints.filter(c => isOverdue(c)).length;
  const avgResolutionTime = '24.6 hrs';

  // Overdue and escalated queue
  const urgentQueue = complaints.filter(
    c => (c.status === 'Escalated' || isOverdue(c) || c.priority === 'Urgent') && c.status !== 'Resolved'
  );

  // Mini Chart Data: Complaints by Status for Donut
  const statusChartData = [
    { name: 'Resolved', value: resolved, color: '#16a34a' },
    { name: 'In Progress', value: inProgress, color: '#ea580c' },
    { name: 'Pending Review', value: pending, color: '#9333ea' },
    { name: 'Overdue / Escalated', value: overdueCount, color: '#dc2626' }
  ];

  // Category Distribution Data (Top 5)
  const categoryData = categories.slice(0, 5).map(cat => ({
    name: cat.name.split(' ')[0],
    fullName: cat.name,
    count: complaints.filter(c => c.category === cat.name).length
  }));

  return (
    <div className="space-y-8">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2 border border-rose-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Campus Executive Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Grievance Governance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time campus-wide monitoring, SLA escalation controls, and departmental performance auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/analytics"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Deep Analytics</span>
          </Link>
          <Link
            to="/admin/complaints"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition"
          >
            <span>All Complaints</span>
          </Link>
        </div>
      </div>

      {/* 6 Required Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Issues"
          value={total}
          icon={FileText}
          color="blue"
          subtext="Campus-wide logged"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
          subtext="Successfully closed"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="purple"
          subtext="Awaiting triage"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={Cog}
          color="orange"
          subtext="Active maintenance"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          icon={AlertTriangle}
          color="rose"
          subtext="Breached SLA target"
        />
        <StatCard
          title="Avg Turnaround"
          value={avgResolutionTime}
          icon={Timer}
          color="navy"
          subtext="SLA benchmark"
        />
      </div>

      {/* Overdue & Escalation Priority Alert Strip */}
      {urgentQueue.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>High Priority Attention Needed ({urgentQueue.length} Complaints)</span>
            </div>
            <Link
              to="/admin/escalations"
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
            >
              <span>Escalation Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {urgentQueue.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-rose-700">{item.trackingId}</span>
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{item.department} • {item.location}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-rose-600 font-bold">
                    {isOverdue(item) ? 'SLA EXPIRED' : item.status}
                  </span>
                  <Link
                    to={`/admin/complaints?search=${item.trackingId}`}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Snapshot Visual Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Resolution Status Overview</h3>
              <p className="text-xs text-slate-500">Live breakdown of all campus grievances</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {Math.round((resolved / total) * 100)}% Resolved
            </span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} complaints`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-xs text-slate-700 font-medium">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Issue Categories</h3>
              <p className="text-xs text-slate-500">Highest volume infrastructure domains</p>
            </div>
            <Link to="/admin/analytics" className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              View All 10 →
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val} complaints`, 'Total']}
                  labelFormatter={(name) => `Category: ${name}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links & Department Workload Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Workloads & Oversight</h3>
            <p className="text-xs text-slate-500">Status across all 10 registered degree college divisions</p>
          </div>
          <Link to="/admin/departments" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
            Manage Departments →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Department Name</th>
                <th className="px-6 py-3.5">Supervising Officer</th>
                <th className="px-6 py-3.5">Active Issues</th>
                <th className="px-6 py-3.5">Resolved Issues</th>
                <th className="px-6 py-3.5">Total Assigned</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {departments.slice(0, 5).map(dept => {
                const deptAll = complaints.filter(c => c.department === dept.name);
                const deptActive = deptAll.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;
                const deptResolved = deptAll.filter(c => c.status === 'Resolved').length;

                return (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {dept.head}
                    </td>
                    <td className="px-6 py-4 font-semibold text-orange-600">
                      {deptActive}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {deptResolved}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {deptAll.length}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/complaints?dept=${encodeURIComponent(dept.name)}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Inspect Queue
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
