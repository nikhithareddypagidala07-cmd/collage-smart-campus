import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { useComplaints } from '../../context/ComplaintContext';
import { formatDate } from '../../utils/helpers';
import {
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  CheckCheck,
  AlertCircle,
  Sparkles,
  History,
  GraduationCap,
  QrCode
} from 'lucide-react';
import { ClassroomQrModal } from '../../components/attendance/ClassroomQrModal';

export const StaffAttendance = () => {
  const { currentUser, users } = useAuth();
  const { courses, subjectsMap, sessions, recordAttendanceSession } = useAttendance();
  const { showToast } = useComplaints();

  // Form Selections
  const [selectedCourse, setSelectedCourse] = useState('B.Tech Computer Science');
  const [selectedSubject, setSelectedSubject] = useState(subjectsMap['B.Tech Computer Science']?.[0]?.name || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Get students enrolled in selected course
  const enrolledStudents = (users.students || []).filter(
    s => s.course === selectedCourse || s.course.includes(selectedCourse.split(' ')[1] || 'Computer')
  );

  // Local state for attendance records: { [studentId]: 'Present' | 'Absent' | 'On Leave' }
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const initial = {};
    enrolledStudents.forEach(s => {
      initial[s.studentId] = 'Present';
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { activeQrSession } = useAttendance();

  // Update subjects list when course changes
  const handleCourseChange = (e) => {
    const newCourse = e.target.value;
    setSelectedCourse(newCourse);
    const newSubjects = subjectsMap[newCourse] || [];
    if (newSubjects.length > 0) {
      setSelectedSubject(newSubjects[0].name);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    enrolledStudents.forEach(s => {
      updated[s.studentId] = status;
    });
    setAttendanceMap(updated);
    showToast(`Marked all students as ${status}`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enrolledStudents.length === 0) {
      showToast('No students enrolled in this selected class roster.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const recordsArray = enrolledStudents.map(s => ({
        studentId: s.studentId,
        studentName: s.name,
        status: attendanceMap[s.studentId] || 'Present'
      }));

      recordAttendanceSession({
        date: selectedDate,
        course: selectedCourse,
        semester: '6th Semester',
        subject: selectedSubject,
        markedBy: currentUser?.name || 'Faculty Member',
        records: recordsArray
      });

      setIsSubmitting(false);
      showToast(`Attendance recorded successfully for ${selectedSubject}!`, 'success');
    }, 400);
  };

  // Metrics for current session
  const totalStudents = enrolledStudents.length;
  const presentCount = enrolledStudents.filter(s => (attendanceMap[s.studentId] || 'Present') === 'Present').length;
  const absentCount = enrolledStudents.filter(s => attendanceMap[s.studentId] === 'Absent').length;
  const onLeaveCount = enrolledStudents.filter(s => attendanceMap[s.studentId] === 'On Leave').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Classroom QR Code Modal */}
      <ClassroomQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Sanjay Ghodawat University • Faculty Attendance Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Lecture Attendance Marker</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Select course, subject, and date to record and submit student attendance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 rounded-xl font-bold text-xs shadow-md border border-sand-400/50 hover:border-electric-400 transition flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-electric-400" />
            <span>Generate Classroom QR</span>
            {activeQrSession?.isActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Control Bar: Class, Subject, Date Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Session Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select Class / Program
            </label>
            <select
              value={selectedCourse}
              onChange={handleCourseChange}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.semester})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Subject / Course Code
            </label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(subjectsMap[selectedCourse] || []).map(s => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Lecture Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Real-time Tally Strip & Batch Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-600">Total: <strong>{totalStudents}</strong></span>
            <span className="text-emerald-600">Present: <strong>{presentCount}</strong></span>
            <span className="text-rose-600">Absent: <strong>{absentCount}</strong></span>
            <span className="text-amber-600">On Leave: <strong>{onLeaveCount}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Roster Marking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Enrolled Student Roster</h3>
            <p className="text-xs text-slate-500">Mark attendance status for each student in the batch</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
            {selectedCourse}
          </span>
        </div>

        {enrolledStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No students registered in this course. Please select another program.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Roll / Student ID</th>
                  <th className="px-6 py-3.5">Student Name</th>
                  <th className="px-6 py-3.5">Semester & Hostel</th>
                  <th className="px-6 py-3.5 text-center">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {enrolledStudents.map(student => {
                  const currentStatus = attendanceMap[student.studentId] || 'Present';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono font-bold text-blue-700">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span className="font-bold text-slate-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {student.semester} • {student.hostelBlock}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'Present')}
                            className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1 transition ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'Absent')}
                            className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1 transition ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          {/* On Leave Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'On Leave')}
                            className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1 transition ${
                              currentStatus === 'On Leave'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>On Leave</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || enrolledStudents.length === 0}
            className="px-6 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-md border border-sand-400/50 hover:border-electric-400 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-electric-400" />
            <span>{isSubmitting ? 'Recording...' : 'Submit Attendance Record'}</span>
          </button>
        </div>
      </div>

      {/* Recent Lecture History Recorded by Faculty */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900">Recent Attendance Sessions Log</h3>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {sessions.slice(0, 4).map(sess => (
            <div key={sess.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{sess.subject}</p>
                <p className="text-slate-500 text-[11px]">
                  {sess.course} • Marked by {sess.markedBy} • {sess.records.length} students recorded
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-slate-700 font-semibold">{sess.date}</span>
                <span className="block text-[10px] text-emerald-600 font-bold">Saved to LocalStorage</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
