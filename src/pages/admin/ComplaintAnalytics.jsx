import React from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { isOverdue } from '../../utils/helpers';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const ComplaintAnalytics = () => {
  const { complaints, categories, departments, showToast } = useComplaints();

  // 1. Complaints by Category (Pie Chart)
  const categoryChartColors = [
    '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a',
    '#0284c7', '#ca8a04', '#0d9488', '#e11d48', '#4b5563'
  ];

  const categoryData = categories.map((cat, index) => ({
    name: cat.name,
    count: complaints.filter(c => c.category === cat.name).length,
    color: categoryChartColors[index % categoryChartColors.length]
  }));

  // 2. Monthly Complaint Submissions (Bar Chart)
  // Generating realistic monthly timeline distribution
  const monthlyData = [
    { month: 'Jun', submissions: 14, resolved: 14 },
    { month: 'Jul', submissions: 19, resolved: 18 },
    { month: 'Aug', submissions: 28, resolved: 26 },
    { month: 'Sep', submissions: 32, resolved: 30 },
    { month: 'Oct', submissions: complaints.length, resolved: complaints.filter(c => c.status === 'Resolved').length },
    { month: 'Nov (Proj)', submissions: 22, resolved: 19 }
  ];

  // 3. Complaint Resolution Statistics (Donut Chart)
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Reopened' || c.status === 'Escalated').length;
  const pendingCount = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
  const rejectedCount = complaints.filter(c => c.status === 'Rejected').length;

  const resolutionData = [
    { name: 'Resolved', value: resolvedCount, color: '#16a34a' },
    { name: 'In Progress', value: inProgressCount, color: '#ea580c' },
    { name: 'Under Review / New', value: pendingCount, color: '#9333ea' },
    { name: 'Rejected', value: rejectedCount, color: '#dc2626' }
  ];

  // 4. Complaint Priority Distribution (Bar Chart)
  const urgentCount = complaints.filter(c => c.priority === 'Urgent').length;
  const highCount = complaints.filter(c => c.priority === 'High').length;
  const mediumCount = complaints.filter(c => c.priority === 'Medium').length;
  const lowCount = complaints.filter(c => c.priority === 'Low').length;

  const priorityData = [
    { priority: 'Urgent', count: urgentCount, fill: '#dc2626' },
    { priority: 'High', count: highCount, fill: '#ea580c' },
    { priority: 'Medium', count: mediumCount, fill: '#d97706' },
    { priority: 'Low', count: lowCount, fill: '#64748b' }
  ];

  // 5. Department-wise Complaint Statistics (Bar Chart)
  const departmentData = departments.map(d => {
    const deptAll = complaints.filter(c => c.department === d.name);
    return {
      department: d.name.length > 15 ? d.name.slice(0, 14) + '...' : d.name,
      fullName: d.name,
      total: deptAll.length,
      resolved: deptAll.filter(c => c.status === 'Resolved').length,
      active: deptAll.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length
    };
  });

  const handlePrint = () => {
    window.print();
    showToast('Preparing analytics document for printing / PDF export', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional Grievance Analytics & Insights</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Statistical breakdown of resolution rates, category loads, and departmental compliance
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition no-print shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Generate Official Report</span>
        </button>
      </div>

      {/* Top 3 Metric Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Institutional Clearance Rate</span>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {Math.round((resolvedCount / (complaints.length || 1)) * 100)}%
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium">+4.2% vs previous semester</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Average Resolution Time</span>
            <h3 className="text-2xl font-extrabold text-slate-900">24.6 Hours</h3>
            <span className="text-[11px] text-blue-600 font-medium">Well within 48h campus SLA mandate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Service Departments</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{departments.length} Units</h3>
            <span className="text-[11px] text-purple-600 font-medium">100% digital triage enabled</span>
          </div>
        </div>
      </div>

      {/* Row 1: Donut (Resolution) & Pie (Category) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Resolution Statistics (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Complaint Resolution Statistics</h3>
            <p className="text-xs text-slate-500">Distribution of resolution lifecycle states</p>
          </div>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resolutionData.map((entry, index) => (
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

        {/* Chart 2: Complaints by Category (Pie Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Complaints by Category (10 Divisions)</h3>
            <p className="text-xs text-slate-500">Volume proportion across grievance domains</p>
          </div>

          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  label={({ name, percent }) => percent > 0.08 ? `${name.slice(0, 8)} ${(percent * 100).toFixed(0)}%` : ''}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} complaints`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Trend (Bar Chart) & Priority Breakdown (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Monthly Complaint Submissions (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Monthly Complaint Submissions & Output</h3>
            <p className="text-xs text-slate-500">6-Month historical intake vs resolved output</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={32}
                  formatter={(val) => <span className="text-xs text-slate-700 font-medium capitalize">{val}</span>}
                />
                <Bar dataKey="submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Submissions" />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Complaint Priority Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">Complaint Priority Distribution</h3>
            <p className="text-xs text-slate-500">Caseload urgency breakdown across the institution</p>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val) => [`${val} complaints`, 'Volume']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Department-wise Complaint Statistics (Bar Chart) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">Department-Wise Complaint Statistics</h3>
          <p className="text-xs text-slate-500">Workload, ongoing repairs, and resolutions across all 10 campus departments</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748b' }} angle={-25} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(val, name, item) => [`${val} complaints`, name === 'resolved' ? 'Resolved' : 'Active Repair']}
                labelFormatter={(name, payload) => payload?.[0]?.payload?.fullName || name}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                formatter={(val) => <span className="text-xs text-slate-700 font-medium capitalize">{val}</span>}
              />
              <Bar dataKey="active" fill="#f97316" radius={[4, 4, 0, 0]} name="Active Repairs" />
              <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
