import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  QrCode,
  Wifi,
  ShieldCheck,
  Users,
  Clock,
  RotateCw,
  X,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Building
} from 'lucide-react';

export const ClassroomQrModal = ({ isOpen, onClose }) => {
  const {
    activeQrSession,
    startQrSession,
    stopQrSession,
    rotateSessionToken,
    courses,
    subjectsMap,
    wifiConfig
  } = useAttendance();

  const [selectedCourse, setSelectedCourse] = useState(courses[0].name);
  const [selectedSubject, setSelectedSubject] = useState(subjectsMap[courses[0].name][0].name);
  const [classroom, setClassroom] = useState('Room 304 (Academic Block A)');
  const [secondsRemaining, setSecondsRemaining] = useState(20);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Countdown timer for dynamic rotating security token
  useEffect(() => {
    if (!isOpen || !activeQrSession?.isActive) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          rotateSessionToken();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, activeQrSession?.isActive, rotateSessionToken]);

  if (!isOpen) return null;

  const handleStartNewSession = (e) => {
    e.preventDefault();
    startQrSession({
      course: selectedCourse,
      semester: courses.find(c => c.name === selectedCourse)?.semester || 'Current Semester',
      subject: selectedSubject,
      classroom,
      facultyName: 'Dr. Vasudevan',
      requiredWifi: wifiConfig.authorizedSSID
    });
    setSecondsRemaining(20);
  };

  const qrPayload = JSON.stringify({
    university: 'Sanjay Ghodawat University',
    portal: 'SGU Smart Campus',
    sessionId: activeQrSession?.id,
    subject: activeQrSession?.subject,
    classroom: activeQrSession?.classroom,
    requiredWifi: activeQrSession?.requiredWifi,
    token: activeQrSession?.token,
    timestamp: Date.now()
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen ? 'w-full h-full max-w-none rounded-none' : 'w-full max-w-2xl max-h-[92vh]'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-navy-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Classroom QR Attendance Generator</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                  Wi-Fi Geofence Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Sanjay Ghodawat University • Dynamic Classroom Broadcast
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title={isFullScreen ? 'Exit Projector Mode' : 'Projector Fullscreen Mode'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Wi-Fi Geofence Security Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-900 block">
                  Mandatory Campus Wi-Fi Gatekeeper:
                </span>
                <span className="text-xs font-mono font-bold text-blue-700 bg-white/80 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                  SSID: {wifiConfig.authorizedSSID}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-500 block">Classroom Location</span>
              <span className="text-xs font-semibold text-slate-800">{activeQrSession?.classroom || classroom}</span>
            </div>
          </div>

          {/* Active Session Display OR Configure New Session */}
          {activeQrSession?.isActive ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Code Container with Projector Framing */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-blue-300 relative">
                {/* Dynamic Token Badge */}
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-2xs text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-slate-500 font-medium">Rotating Token:</span>
                  <span className="font-mono font-bold text-blue-600">{activeQrSession.token}</span>
                </div>

                {/* Scalable QR Code */}
                <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200">
                  <QRCodeSVG
                    value={qrPayload}
                    size={220}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* Rotating Timer Progress */}
                <div className="mt-4 w-full max-w-[220px]">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <RotateCw className="w-3 h-3 animate-spin text-blue-500" />
                      Refreshes in:
                    </span>
                    <span className="font-mono font-bold text-blue-600">{secondsRemaining}s</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(secondsRemaining / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-center text-slate-500">
                  Students must scan using the SGU Student Portal while connected to <strong>{wifiConfig.authorizedSSID}</strong>.
                </p>
              </div>

              {/* Session Details & Real-Time Roster */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Live Lecture
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      BROADCASTING
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {activeQrSession.subject}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeQrSession.course} • {activeQrSession.semester}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Faculty In-Charge:</span>
                    <span className="font-semibold text-slate-800">{activeQrSession.facultyName}</span>
                  </div>
                </div>

                {/* Live Attendees Counter */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">Classroom Verified Scans</span>
                        <span className="text-[11px] text-emerald-700">Real-time attendance check-ins</span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-emerald-700">
                      {activeQrSession.checkedInStudents.length}
                    </span>
                  </div>

                  {activeQrSession.checkedInStudents.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-emerald-200 text-xs text-emerald-900">
                      <span className="font-semibold">Recent check-in: </span>
                      <span>Student ID {activeQrSession.checkedInStudents[activeQrSession.checkedInStudents.length - 1]}</span>
                    </div>
                  )}
                </div>

                {/* Session Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={rotateSessionToken}
                    className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Regenerate Code</span>
                  </button>
                  <button
                    onClick={stopQrSession}
                    className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs transition"
                  >
                    End Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Configure and Start Session Form */
            <form onSubmit={handleStartNewSession} className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  No live lecture session is currently active. Select a course and subject to broadcast a new classroom QR code for students to scan.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Course / Degree</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      setSelectedSubject(subjectsMap[e.target.value][0].name);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.semester})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    {subjectsMap[selectedCourse]?.map(s => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classroom / Lecture Hall</label>
                <input
                  type="text"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="e.g. Room 304 (Academic Block A)"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch Classroom QR Attendance Broadcast</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-Proxy Protection: Only scans within "{wifiConfig.authorizedSSID}" are recorded.</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-medium text-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
