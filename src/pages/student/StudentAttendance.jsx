import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { formatDate } from '../../utils/helpers';
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Award,
  TrendingUp,
  Filter,
  GraduationCap,
  QrCode,
  Wifi,
  Camera,
  ArrowRight
} from 'lucide-react';
import { StudentQrScannerModal } from '../../components/attendance/StudentQrScannerModal';

export const StudentAttendance = () => {
  const { currentUser } = useAuth();
  const { getStudentStats, sessions, simulatedStudentWifi } = useAttendance();

  // Get statistics for logged-in student
  const stats = getStudentStats(currentUser?.studentId || 'ST2024-001');

  const [selectedMonth, setSelectedMonth] = useState('All');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Filter lecture sessions where this student was recorded
  const studentSessions = sessions
    .map(sess => {
      const rec = sess.records.find(r => r.studentId === currentUser?.studentId);
      if (!rec) return null;
      return {
        id: sess.id,
        date: sess.date,
        subject: sess.subject,
        markedBy: sess.markedBy,
        status: rec.status
      };
    })
    .filter(Boolean);

  const filteredSessions = studentSessions.filter(sess => {
    if (selectedMonth === 'All') return true;
    return sess.date.includes(selectedMonth);
  });

  const isDeficit = stats.isBelowThreshold; // < 75%

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-8">
      {/* Student QR Scanner Modal */}
      <StudentQrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Sanjay Ghodawat University • Student Academic Attendance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time semester attendance records, subject breakdowns, and university 75% compliance tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Semester:</span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
            {stats.semester || '6th Semester'}
          </span>
        </div>
      </div>

      {/* Smart QR Attendance & Wi-Fi Check-In Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/30 text-blue-300 border border-blue-400/30 flex items-center justify-center flex-shrink-0 shadow-inner">
            <QrCode className="w-8 h-8 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                Classroom Digital Attendance
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                <Wifi className="w-3 h-3" />
                {simulatedStudentWifi}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Classroom QR Code Check-In
            </h2>
            <p className="text-xs text-blue-200 mt-0.5 max-w-xl">
              Scan the live lecture QR code displayed on the classroom screen. Automatically verifies your presence via <strong>Sanjay Ghodawat University Wi-Fi</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsQrScannerOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Scan Lecture QR Code</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* CRITICAL DEFICIT ALERT (< 75%) */}
      {isDeficit ? (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 text-rose-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-200/80 px-2.5 py-0.5 rounded-full">
                SGU Mandatory Attendance Warning
              </span>
              <h3 className="text-lg font-bold text-rose-950 mt-1">
                Attendance Deficit Alert: {stats.overallPercentage}% (Below 75% Requirement)
              </h3>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed max-w-2xl">
                As per Sanjay Ghodawat University academic regulations, minimum <strong>75% attendance</strong> is compulsory to appear for the End-Semester Final Examinations. You are currently at risk of debarment. Please meet your Faculty Advisor immediately.
              </p>
            </div>
          </div>
          <div className="text-right whitespace-nowrap self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
            <span className="text-xs text-rose-700 font-semibold">Shortfall to 75%:</span>
            <span className="text-2xl font-black text-rose-700">
              {(75 - stats.overallPercentage).toFixed(1)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-emerald-950">Good Standing:</span> Your overall attendance is <strong>{stats.overallPercentage}%</strong>, which complies with the university's 75% eligibility criteria for end-semester examinations.
          </div>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overall Percentage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Overall Attendance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-black ${isDeficit ? 'text-rose-600' : 'text-blue-600'}`}>
              {stats.overallPercentage}%
            </span>
            <span className="text-[11px] text-slate-400">Min 75% Req.</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDeficit ? 'bg-rose-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, stats.overallPercentage)}%` }}
            />
          </div>
        </div>

        {/* Classes Attended */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Classes Attended
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">
              {stats.attendedClasses}
            </span>
            <span className="text-xs text-slate-400">/ {stats.totalClasses} Held</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Across all curriculum subjects</p>
        </div>

        {/* Classes Missed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Classes Missed
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-600">
              {stats.totalClasses - stats.attendedClasses}
            </span>
            <span className="text-xs text-slate-400">Lectures</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Unexcused / Absent</p>
        </div>

        {/* Exam Eligibility */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Exam Status
          </span>
          <div className="mt-2">
            {isDeficit ? (
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-xl font-bold text-xs uppercase tracking-wider">
                At Risk (Debarred)
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs uppercase tracking-wider">
                Eligible for Exams
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Based on SGU Ordinance</p>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Subject-Wise Attendance Breakdown</h3>
            <p className="text-xs text-slate-500">Track eligibility course by course (Requires min 75% per course)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.subjects.map(sub => {
            const isSubDeficit = sub.percentage < 75;

            return (
              <div
                key={sub.code}
                className={`p-4 rounded-xl border transition ${
                  isSubDeficit
                    ? 'border-rose-300 bg-rose-50/30'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400 block">{sub.code}</span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{sub.name}</h4>
                  </div>
                  <span
                    className={`font-mono font-black text-sm px-2.5 py-0.5 rounded-lg ${
                      isSubDeficit
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full ${isSubDeficit ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Attended: <strong>{sub.attended}</strong> / {sub.total} classes</span>
                  {isSubDeficit ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Deficit (Below 75%)
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Eligible
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Lecture Attendance Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Lecture-by-Lecture Attendance History</h3>
            <p className="text-xs text-slate-500">Chronological audit trail of marked classes</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Month:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="All">All Months</option>
              <option value="-10-">October</option>
              <option value="-11-">November</option>
            </select>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No daily sessions logged for this month.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Subject & Course</th>
                  <th className="px-6 py-3.5">Faculty In-Charge</th>
                  <th className="px-6 py-3.5 text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSessions.map(sess => (
                  <tr key={sess.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {sess.date}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {sess.subject}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {sess.markedBy}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {sess.status === 'Present' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </span>
                      )}
                      {sess.status === 'Absent' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </span>
                      )}
                      {sess.status === 'On Leave' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>On Leave</span>
                        </span>
                      )}
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
