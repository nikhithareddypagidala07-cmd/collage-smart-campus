import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Users,
  AlertTriangle,
  Download,
  Send,
  CheckCircle2,
  Calendar,
  GraduationCap,
  BookOpen,
  Filter,
  FileSpreadsheet,
  Search,
  QrCode,
  Wifi,
  ShieldCheck,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const AdminAttendance = () => {
  const {
    getLowAttendanceStudents,
    studentMetrics,
    sessions,
    courses,
    qrAuditLogs,
    wifiConfig
  } = useAttendance();
  const { showToast } = useComplaints();
  const { users } = useAuth();

  const [activeTab, setActiveTab] = useState('defaulters'); // 'defaulters' | 'qrAudit'
  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');

  // Low-attendance students (< 75%)
  const lowAttendanceList = getLowAttendanceStudents();

  // All students attendance list
  const allStudentsList = Object.keys(studentMetrics).map(id => {
    const student = studentMetrics[id];
    let total = 0;
    let attended = 0;
    student.subjects.forEach(s => {
      total += s.total;
      attended += s.attended;
    });
    const percentage = total > 0 ? Math.round((attended / total) * 1000) / 10 : 0;
    return {
      studentId: student.studentId,
      studentName: student.studentName,
      course: student.course,
      semester: student.semester,
      totalClasses: total,
      attendedClasses: attended,
      percentage,
      isBelowThreshold: percentage < 75
    };
  });

  const filteredDefaulters = lowAttendanceList.filter(s => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'All' || s.course === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  // Recharts: Department / Course average attendance
  const courseAverages = [
    { name: 'CSE (6th Sem)', average: 81.2, fill: '#2563eb' },
    { name: 'IT (4th Sem)', average: 90.3, fill: '#10b981' },
    { name: 'Mech (8th Sem)', average: 69.1, fill: '#ef4444' }, // Below 75
    { name: 'ECE (4th Sem)', average: 94.2, fill: '#10b981' },
    { name: 'DS (2nd Sem)', average: 87.8, fill: '#2563eb' }
  ];

  // Overall campus metrics
  const totalStudents = Object.keys(studentMetrics).length;
  const defaultersCount = lowAttendanceList.length;
  const complianceRate = Math.round(((totalStudents - defaultersCount) / totalStudents) * 100);

  const handleSendWarning = (student) => {
    showToast(
      `Statutory Warning Letter generated & dispatched to ${student.studentName} (${student.overallPercentage}% attendance). Shortfall: ${(75 - student.overallPercentage).toFixed(1)}%`,
      'warning'
    );
  };

  const handleSendAllWarnings = () => {
    showToast(
      `Bulk Notice Broadcasted: Official Warning Letters dispatched to all ${defaultersCount} students below 75% attendance threshold.`,
      'warning'
    );
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Course', 'Semester', 'Classes Attended', 'Total Classes', 'Attendance %', 'Status'];
    const rows = filteredDefaulters.map(s => [
      s.studentId,
      `"${s.studentName}"`,
      `"${s.course}"`,
      `"${s.semester}"`,
      s.attendedClasses,
      s.totalClasses,
      `${s.overallPercentage}%`,
      'DEBARMENT RISK (< 75%)'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SGU_Attendance_Defaulters_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Defaulters attendance report exported as CSV.', 'success');
  };

  const handleExportQrLogs = () => {
    const headers = ['Audit ID', 'Timestamp', 'Student ID', 'Student Name', 'Subject', 'Connected Wi-Fi SSID', 'Client IP', 'Status', 'Device'];
    const rows = (qrAuditLogs || []).map(l => [
      l.id,
      `"${formatDate(l.timestamp)}"`,
      l.studentId,
      `"${l.studentName}"`,
      `"${l.subject}"`,
      `"${l.wifiSSID}"`,
      l.clientIp,
      l.status,
      `"${l.device}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SGU_WiFi_QR_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Classroom Wi-Fi check-in audit logs exported to CSV.', 'success');
  };

  const verifiedQrScans = (qrAuditLogs || []).filter(l => l.status === 'VERIFIED').length;
  const blockedProxyAttempts = (qrAuditLogs || []).filter(l => l.status.includes('BLOCKED')).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Sanjay Ghodawat University • Academic Attendance & Compliance Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Monitoring & Audit</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            University-wide attendance compliance oversight, low-attendance interventions, and classroom Wi-Fi verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={activeTab === 'defaulters' ? handleExportCSV : handleExportQrLogs}
            className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-electric-600" />
            <span>{activeTab === 'defaulters' ? 'Export Defaulters CSV' : 'Export Wi-Fi Logs CSV'}</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus Compliance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{complianceRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">&gt; 75% Criteria</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Students exam eligible</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Defaulters (&lt; 75%)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">{defaultersCount}</span>
            <span className="text-xs text-rose-600 font-semibold">Immediate Action</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Debarment risk students</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">QR Wi-Fi Check-ins</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-700">{verifiedQrScans}</span>
            <span className="text-xs text-blue-600 font-semibold">Verified</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{wifiConfig.authorizedSSID}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lectures Recorded</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{sessions.length}</span>
            <span className="text-xs text-slate-500 font-semibold">Sessions</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across 5 engineering branches</span>
        </div>
      </div>

      {/* Recharts Analytics Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Branch-Wise Average Attendance Comparison</h3>
            <p className="text-xs text-slate-500">Benchmark comparison against Sanjay Ghodawat University 75% standard</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            75% Mandatory Benchmark
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={courseAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Attendance Average']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                {courseAverages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.average < 75 ? '#dc2626' : '#2563eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('defaulters')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'defaulters'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low Attendance Defaulters</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'defaulters' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-800'}`}>
            {defaultersCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('qrAudit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'qrAudit'
              ? 'bg-charcoal-900 text-sand-100 border border-sand-400/40 shadow-sm'
              : 'bg-white text-charcoal-700 hover:text-charcoal-950 border border-sand-300'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-electric-500" />
          <span>QR & Wi-Fi Check-In Audit Logs</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'qrAudit' ? 'bg-electric-600 text-white' : 'bg-sand-200 text-charcoal-900'}`}>
            {(qrAuditLogs || []).length}
          </span>
        </button>
      </div>

      {/* TAB 1: Low Attendance Defaulters Table (< 75%) */}
      {activeTab === 'defaulters' && (
        <div className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-rose-50/70 border-b border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-rose-950">
                  Low Attendance Defaulters List (&lt; 75% Threshold)
                </h3>
              </div>
              <p className="text-xs text-rose-800">
                Students at risk of semester examination debarment requiring immediate intervention
              </p>
            </div>

            {defaultersCount > 0 && (
              <button
                onClick={handleSendAllWarnings}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Warning to All Defaulters</span>
              </button>
            )}
          </div>

          {/* Filter Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search defaulter by name or student ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="w-full sm:w-auto">
              <select
                value={selectedCourseFilter}
                onChange={e => setSelectedCourseFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              >
                <option value="All">All Branches</option>
                {courses.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredDefaulters.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No defaulter students found matching this criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Roll / Student ID</th>
                    <th className="px-6 py-3.5">Student Name</th>
                    <th className="px-6 py-3.5">Branch & Semester</th>
                    <th className="px-6 py-3.5">Classes Attended</th>
                    <th className="px-6 py-3.5">Current Attendance</th>
                    <th className="px-6 py-3.5">Shortfall to 75%</th>
                    <th className="px-6 py-3.5 text-right">Intervention Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDefaulters.map(student => {
                    const shortfall = (75 - student.overallPercentage).toFixed(1);

                    return (
                      <tr key={student.studentId} className="hover:bg-rose-50/30 transition">
                        <td className="px-6 py-4 font-mono font-bold text-rose-700 whitespace-nowrap">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {student.course} ({student.semester})
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          <strong>{student.attendedClasses}</strong> / {student.totalClasses} classes
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono font-black text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                            {student.overallPercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-rose-600 whitespace-nowrap">
                          -{shortfall}% deficit
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleSendWarning(student)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-xs transition shadow-2xs flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Warning</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QR Code & Campus Wi-Fi Check-In Audit Logs */}
      {activeTab === 'qrAudit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Classroom QR & Campus Wi-Fi Verification Log
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Tamper-resistant audit trail with client IP, SSID matching, and proxy rejection tracking
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-semibold">
                Authorized SSID: {wifiConfig.authorizedSSID}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-950">Verified Check-Ins</span>
              </div>
              <span className="font-mono font-bold text-emerald-700">{verifiedQrScans}</span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-semibold text-rose-950">Blocked Proxy Attempts</span>
              </div>
              <span className="font-mono font-bold text-rose-700">{blockedProxyAttempts}</span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-950">Classroom Gateway IP</span>
              </div>
              <span className="font-mono font-bold text-blue-700">{wifiConfig.gatewayIp}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Student ID & Name</th>
                  <th className="px-6 py-3.5">Subject / Lecture</th>
                  <th className="px-6 py-3.5">Connected Wi-Fi SSID</th>
                  <th className="px-6 py-3.5">Client IP</th>
                  <th className="px-6 py-3.5">Device</th>
                  <th className="px-6 py-3.5 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(qrAuditLogs || []).map(log => {
                  const isVerified = log.status === 'VERIFIED';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{log.studentName}</span>
                        <span className="font-mono text-[11px] text-slate-500">{log.studentId}</span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-700 font-medium">
                        {log.subject}
                      </td>
                      <td className="px-6 py-3.5 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {log.wifiSSID}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-600">
                        {log.clientIp}
                      </td>
                      <td className="px-6 py-3.5 text-slate-500 text-[11px]">
                        {log.device}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-[11px]">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            BLOCKED (PROXY)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
