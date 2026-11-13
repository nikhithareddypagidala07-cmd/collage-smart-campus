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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-charcoal-900 text-electric-300 border border-electric-400/30 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Sanjay Ghodawat University • Student Academic Attendance</span>
          </div>
          <h1 className="text-2xl font-bold text-sand-100">My Attendance Dashboard</h1>
          <p className="text-xs sm:text-sm text-sand-300">
            Real-time semester attendance records, subject breakdowns, and university 75% compliance tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-sand-400">Semester:</span>
          <span className="px-2.5 py-1 bg-charcoal-900 border border-charcoal-800 rounded-lg text-xs font-bold text-sand-200">
            {stats.semester || '6th Semester'}
          </span>
        </div>
      </div>

      {/* Smart QR Attendance & Wi-Fi Check-In Card */}
      <div className="bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 text-sand-100 rounded-3xl p-6 shadow-xl border border-sand-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-charcoal-900 text-sand-100 border border-sand-400/40 flex items-center justify-center flex-shrink-0 shadow-inner">
            <QrCode className="w-8 h-8 text-electric-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-electric-600/25 text-electric-300 border border-electric-400/40 px-2.5 py-0.5 rounded-full">
                Classroom Digital Attendance
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sand-100 bg-charcoal-900 px-2 py-0.5 rounded-md border border-sand-400/30">
                <Wifi className="w-3 h-3 text-electric-400" />
                {simulatedStudentWifi}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Classroom QR Code Check-In
            </h2>
            <p className="text-xs text-sand-200 mt-0.5 max-w-xl">
              Scan the live lecture QR code displayed on the classroom screen. Automatically verifies your presence via <strong>Sanjay Ghodawat University Wi-Fi</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsQrScannerOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 bg-sand-200 hover:bg-sand-300 text-charcoal-950 font-bold text-xs rounded-xl shadow-lg border border-sand-400 transition flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer transform hover:-translate-y-0.5"
        >
          <Camera className="w-4 h-4 text-electric-600" />
          <span>Scan Lecture QR Code</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* CRITICAL DEFICIT ALERT (< 75%) */}
      {isDeficit ? (
        <div className="bg-rose-950/60 border-2 border-rose-800 rounded-2xl p-6 text-rose-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 bg-rose-900/80 border border-rose-700 px-2.5 py-0.5 rounded-full">
                SGU Mandatory Attendance Warning
              </span>
              <h3 className="text-lg font-bold text-rose-200 mt-1">
                Attendance Deficit Alert: {stats.overallPercentage}% (Below 75% Requirement)
              </h3>
              <p className="text-xs text-rose-300/90 mt-1 leading-relaxed max-w-2xl">
                As per Sanjay Ghodawat University academic regulations, minimum <strong>75% attendance</strong> is compulsory to appear for the End-Semester Final Examinations. You are currently at risk of debarment. Please meet your Faculty Advisor immediately.
              </p>
            </div>
          </div>
          <div className="text-right whitespace-nowrap self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
            <span className="text-xs text-rose-300 font-semibold">Shortfall to 75%:</span>
            <span className="text-2xl font-black text-rose-400">
              {(75 - stats.overallPercentage).toFixed(1)}%
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/60 border border-emerald-800 rounded-2xl p-5 text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-emerald-300">Good Standing:</span> Your overall attendance is <strong>{stats.overallPercentage}%</strong>, which complies with the university's 75% eligibility criteria for end-semester examinations.
          </div>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Overall Percentage */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-charcoal-800 shadow-md text-sand-100">
          <span className="text-xs text-sand-400 font-semibold uppercase tracking-wider block">
            Overall Attendance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl font-black ${isDeficit ? 'text-rose-400' : 'text-electric-400'}`}>
              {stats.overallPercentage}%
            </span>
            <span className="text-[11px] text-sand-400">Min 75% Req.</span>
          </div>
          <div className="w-full bg-charcoal-950 h-2 rounded-full mt-3 overflow-hidden border border-charcoal-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDeficit ? 'bg-rose-500' : 'bg-electric-500'
              }`}
              style={{ width: `${Math.min(100, stats.overallPercentage)}%` }}
            />
          </div>
        </div>

        {/* Classes Attended */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-charcoal-800 shadow-md text-sand-100">
          <span className="text-xs text-sand-400 font-semibold uppercase tracking-wider block">
            Classes Attended
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-400">
              {stats.attendedClasses}
            </span>
            <span className="text-xs text-sand-400">/ {stats.totalClasses} Held</span>
          </div>
          <p className="text-[11px] text-sand-400 mt-2">Across all curriculum subjects</p>
        </div>

        {/* Classes Missed */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-charcoal-800 shadow-md text-sand-100">
          <span className="text-xs text-sand-400 font-semibold uppercase tracking-wider block">
            Classes Missed
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-400">
              {stats.totalClasses - stats.attendedClasses}
            </span>
            <span className="text-xs text-sand-400">Lectures</span>
          </div>
          <p className="text-[11px] text-sand-400 mt-2">Unexcused / Absent</p>
        </div>

        {/* Exam Eligibility */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-charcoal-800 shadow-md text-sand-100">
          <span className="text-xs text-sand-400 font-semibold uppercase tracking-wider block">
            Exam Status
          </span>
          <div className="mt-2">
            {isDeficit ? (
              <span className="inline-block px-3 py-1 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl font-bold text-xs uppercase tracking-wider">
                At Risk (Debarred)
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl font-bold text-xs uppercase tracking-wider">
                Eligible for Exams
              </span>
            )}
          </div>
          <p className="text-[11px] text-sand-400 mt-2">Based on SGU Ordinance</p>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 p-6 shadow-xl space-y-4 text-sand-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-sand-100">Subject-Wise Attendance Breakdown</h3>
            <p className="text-xs text-sand-300">Track eligibility course by course (Requires min 75% per course)</p>
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
                    ? 'border-rose-900/80 bg-rose-950/30'
                    : 'border-charcoal-800 bg-charcoal-950 hover:border-electric-400/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-sand-400 block">{sub.code}</span>
                    <h4 className="font-bold text-sand-100 text-xs sm:text-sm line-clamp-1">{sub.name}</h4>
                  </div>
                  <span
                    className={`font-mono font-black text-sm px-2.5 py-0.5 rounded-lg ${
                      isSubDeficit
                        ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
                        : 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-charcoal-900 h-2 rounded-full overflow-hidden my-2 border border-charcoal-800">
                  <div
                    className={`h-full rounded-full ${isSubDeficit ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-sand-400 pt-1">
                  <span>Attended: <strong className="text-sand-200">{sub.attended}</strong> / {sub.total} classes</span>
                  {isSubDeficit ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Deficit (Below 75%)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
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
      <div className="bg-charcoal-900 rounded-2xl border border-charcoal-800 shadow-xl overflow-hidden text-sand-100">
        <div className="px-6 py-4 border-b border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-sand-100">Lecture-by-Lecture Attendance History</h3>
            <p className="text-xs text-sand-300">Chronological audit trail of marked classes</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-sand-400">Filter Month:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="p-1.5 bg-charcoal-950 border border-charcoal-700 text-sand-100 rounded-lg text-xs focus:ring-1 focus:ring-electric-400"
            >
              <option value="All" className="bg-charcoal-950 text-sand-100">All Months</option>
              <option value="-10-" className="bg-charcoal-950 text-sand-100">October</option>
              <option value="-11-" className="bg-charcoal-950 text-sand-100">November</option>
            </select>
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-sand-400 text-xs">
            No daily sessions logged for this month.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-950 text-sand-300 font-semibold border-b border-charcoal-800">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Subject & Course</th>
                  <th className="px-6 py-3.5">Faculty In-Charge</th>
                  <th className="px-6 py-3.5 text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800 text-sand-200">
                {filteredSessions.map(sess => (
                  <tr key={sess.id} className="hover:bg-charcoal-800/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-sand-200 whitespace-nowrap">
                      {sess.date}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sand-100">
                      {sess.subject}
                    </td>
                    <td className="px-6 py-4 text-sand-400 whitespace-nowrap">
                      {sess.markedBy}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {sess.status === 'Present' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </span>
                      )}
                      {sess.status === 'Absent' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </span>
                      )}
                      {sess.status === 'On Leave' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 font-bold text-xs">
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
