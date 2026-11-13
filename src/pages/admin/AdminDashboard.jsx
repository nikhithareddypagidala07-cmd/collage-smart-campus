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
      <div className="bg-charcoal-950 border border-sand-400/30 rounded-2xl p-6 sm:p-8 text-sand-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-600/25 text-electric-300 border border-electric-400/30 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5 text-electric-400" />
            <span>Campus Executive Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Institutional Grievance Governance
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-sand-200/90 max-w-xl">
            Real-time campus-wide monitoring, SLA escalation controls, and departmental performance auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/analytics"
            className="px-4 py-2.5 bg-sand-200 hover:bg-sand-300 text-charcoal-950 font-bold text-xs sm:text-sm rounded-xl border border-sand-400 shadow-xs transition flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-electric-600" />
            <span>Deep Analytics</span>
          </Link>
          <Link
            to="/admin/complaints"
            className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 font-bold text-xs sm:text-sm rounded-xl border border-sand-400/40 hover:border-electric-400 transition"
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
        <div className="bg-rose-950/50 border border-rose-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>High Priority Attention Needed ({urgentQueue.length} Complaints)</span>
            </div>
            <Link
              to="/admin/escalations"
              className="text-xs font-semibold text-rose-300 hover:text-rose-200 flex items-center gap-1"
            >
              <span>Escalation Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {urgentQueue.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="bg-charcoal-950 p-3.5 rounded-xl border border-rose-900/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-rose-400">{item.trackingId}</span>
                    <PriorityBadge priority={item.priority} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-sand-100 truncate mb-1">{item.title}</h4>
                  <p className="text-[11px] text-sand-400 truncate">{item.department} • {item.location}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-charcoal-800 flex items-center justify-between">
                  <span className="text-[10px] text-rose-400 font-bold">
                    {isOverdue(item) ? 'SLA EXPIRED' : item.status}
                  </span>
                  <Link
                    to={`/admin/complaints?search=${item.trackingId}`}
                    className="text-xs text-electric-400 hover:underline font-semibold"
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
        <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 shadow-xl text-sand-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-sand-100">Resolution Status Overview</h3>
              <p className="text-xs text-sand-300">Live breakdown of all campus grievances</p>
            </div>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full">
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
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46', color: '#f5f5f4', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-xs text-sand-200 font-medium">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Distribution */}
        <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 shadow-xl text-sand-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-sand-100">Top Issue Categories</h3>
              <p className="text-xs text-sand-300">Highest volume infrastructure domains</p>
            </div>
            <Link to="/admin/analytics" className="text-xs text-electric-400 hover:text-electric-300 font-semibold">
              View All 10 →
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <Tooltip
                  formatter={(val) => [`${val} complaints`, 'Total']}
                  labelFormatter={(name) => `Category: ${name}`}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46', color: '#f5f5f4', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0066FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links & Department Workload Roster */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 shadow-xl overflow-hidden text-sand-100">
        <div className="px-6 py-4 border-b border-charcoal-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-sand-100">Department Workloads & Oversight</h3>
            <p className="text-xs text-sand-300">Status across all 10 registered degree college divisions</p>
          </div>
          <Link to="/admin/departments" className="text-xs font-semibold text-electric-400 hover:text-electric-300">
            Manage Departments →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-950 text-sand-300 font-semibold border-b border-charcoal-800">
              <tr>
                <th className="px-6 py-3.5">Department Name</th>
                <th className="px-6 py-3.5">Supervising Officer</th>
                <th className="px-6 py-3.5">Active Issues</th>
                <th className="px-6 py-3.5">Resolved Issues</th>
                <th className="px-6 py-3.5">Total Assigned</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-800 text-sand-200">
              {departments.slice(0, 5).map(dept => {
                const deptAll = complaints.filter(c => c.department === dept.name);
                const deptActive = deptAll.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;
                const deptResolved = deptAll.filter(c => c.status === 'Resolved').length;

                return (
                  <tr key={dept.id} className="hover:bg-charcoal-800/40 transition">
                    <td className="px-6 py-4 font-bold text-sand-100">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-sand-300">
                      {dept.head}
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-400">
                      {deptActive}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-400">
                      {deptResolved}
                    </td>
                    <td className="px-6 py-4 font-bold text-sand-200">
                      {deptAll.length}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/complaints?dept=${encodeURIComponent(dept.name)}`}
                        className="text-xs font-semibold text-electric-400 hover:text-electric-300"
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
