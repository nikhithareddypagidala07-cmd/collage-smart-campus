import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useAuth } from '../../context/AuthContext';
import {
  QrCode,
  Wifi,
  WifiOff,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const StudentQrScannerModal = ({ isOpen, onClose, onAttendanceMarked }) => {
  const {
    activeQrSession,
    wifiConfig,
    simulatedStudentWifi,
    setSimulatedStudentWifi,
    markAttendanceViaQr
  } = useAttendance();

  const { currentUser } = useAuth();

  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'success', 'blocked'
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const isWifiAuthorized =
    simulatedStudentWifi === wifiConfig.authorizedSSID ||
    simulatedStudentWifi === wifiConfig.backupSSID;

  const handleScanAction = () => {
    setScanState('scanning');

    setTimeout(() => {
      const studentId = currentUser?.studentId || 'ST2024-001';
      const studentName = currentUser?.name || 'Aarav Sharma';

      const result = markAttendanceViaQr({
        studentId,
        studentName,
        scannedToken: activeQrSession?.token,
        networkSSID: simulatedStudentWifi,
        device: 'Personal Mobile (Chrome / Android 14)'
      });

      if (result.success) {
        setScanState('success');
        setFeedback(result);
        if (onAttendanceMarked) onAttendanceMarked(result);
      } else {
        setScanState('blocked');
        setFeedback(result);
      }
    }, 1200);
  };

  const handleResetScanner = () => {
    setScanState('idle');
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col transition-all">
        {/* Header */}
        <div className="px-6 py-4 bg-charcoal-950 text-white flex items-center justify-between border-b border-charcoal-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-charcoal-900 text-sand-100 border border-sand-400/40 flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 text-electric-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Classroom QR Attendance Scanner</span>
              </h2>
              <p className="text-xs text-sand-300/80">
                Sanjay Ghodawat University • Wi-Fi Validated Check-In
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-sand-300 hover:text-white rounded-lg hover:bg-charcoal-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Wi-Fi Network Inspector Bar & Simulator */}
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              isWifiAuthorized
                ? 'bg-emerald-50/80 border-emerald-200'
                : 'bg-rose-50/80 border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isWifiAuthorized ? (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                    <WifiOff className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Your Current Network:
                  </span>
                  <span className={`text-xs font-bold font-mono ${isWifiAuthorized ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {simulatedStudentWifi}
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isWifiAuthorized
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                }`}
              >
                {isWifiAuthorized ? 'CAMPUS WI-FI VERIFIED' : 'UNAUTHORIZED NETWORK'}
              </span>
            </div>

            {/* Network Simulator Dropdown */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-600 font-medium">Simulate Network:</span>
              <select
                value={simulatedStudentWifi}
                onChange={(e) => {
                  setSimulatedStudentWifi(e.target.value);
                  handleResetScanner();
                }}
                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SGU-Campus-WiFi-5G">🟢 SGU-Campus-WiFi-5G (Classroom AP)</option>
                <option value="SGU-Academic-Zone">🟢 SGU-Academic-Zone (Classroom Backup)</option>
                <option value="Jio-5G-Personal">🔴 Jio 5G / Mobile Hotspot (External)</option>
                <option value="Home-Broadband">🔴 Home Wi-Fi (Off Campus)</option>
              </select>
            </div>
          </div>

          {/* Viewfinder / Scanner State */}
          {scanState === 'idle' && (
            <div className="space-y-4">
              {/* Camera Viewfinder Simulation */}
              <div className="relative aspect-4/3 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center p-6 text-center">
                {/* Viewfinder Target Framing Brackets */}
                <div className="absolute inset-8 pointer-events-none">
                  {/* Top-Left Corner */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400"></div>
                  {/* Top-Right Corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400"></div>
                  {/* Bottom-Left Corner */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400"></div>
                  {/* Bottom-Right Corner */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400"></div>
                </div>

                {/* Animated Laser Scanning Line */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_8px_#3b82f6] animate-pulse"></div>

                {/* Center QR Target Guidance */}
                <div className="w-24 h-24 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-white/50 backdrop-blur-2xs mb-3">
                  <QrCode className="w-12 h-12" />
                </div>

                <p className="text-xs text-slate-300 font-medium">
                  Point camera at the classroom projector screen
                </p>

                {/* Live Detected Broadcast Pill */}
                {activeQrSession?.isActive ? (
                  <div className="mt-3 px-3 py-1 bg-blue-900/60 border border-blue-700/60 rounded-full text-[11px] text-blue-200">
                    Detected: <strong className="text-white">{activeQrSession.subject}</strong> ({activeQrSession.classroom})
                  </div>
                ) : (
                  <div className="mt-3 px-3 py-1 bg-amber-900/60 border border-amber-700/60 rounded-full text-[11px] text-amber-200">
                    No active lecture broadcast detected.
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleScanAction}
                disabled={!activeQrSession?.isActive}
                className="w-full py-3.5 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 font-bold text-sm rounded-xl border border-sand-400/50 hover:border-electric-400 shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-electric-400" />
                <span>Scan & Mark Attendance</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Anti-Proxy Verification Active
                </span>
                <span>Gateway: {wifiConfig.gatewayIp}</span>
              </div>
            </div>
          )}

          {/* Scanning Animation State */}
          {scanState === 'scanning' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                <QrCode className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Verifying Classroom Credentials...</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Validating dynamic token with <strong>{simulatedStudentWifi}</strong>
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS State: Attendance Verified */}
          {scanState === 'success' && (
            <div className="py-6 px-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-200/60 text-emerald-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  Verified & Present
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Attendance Recorded Successfully!
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  {feedback?.message || 'Your classroom attendance has been registered.'}
                </p>
              </div>

              {/* Verified Details Card */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-800">{currentUser?.name || 'Aarav Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-semibold text-slate-800">{activeQrSession?.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Classroom:</span>
                  <span className="font-semibold text-slate-800">{activeQrSession?.classroom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Network Validated:</span>
                  <span className="font-mono font-bold text-emerald-700">{simulatedStudentWifi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="font-mono text-slate-800">{feedback?.timestamp || 'Just now'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* BLOCKED State: Proxy Attempt Detected */}
          {scanState === 'blocked' && (
            <div className="py-6 px-4 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
                <ShieldAlert className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-rose-200/80 text-rose-900 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  Proxy Security Triggered
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Attendance Rejected!
                </h3>
                <p className="text-xs text-rose-700 mt-1 max-w-sm mx-auto">
                  {feedback?.message}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Detected Network:</span>
                  <span className="font-mono font-bold text-rose-600">{simulatedStudentWifi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Required Network:</span>
                  <span className="font-mono font-bold text-blue-600">{wifiConfig.authorizedSSID}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit Status:</span>
                  <span className="font-semibold text-rose-700">Violation Logged in Admin Center</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedStudentWifi(wifiConfig.authorizedSSID);
                    handleResetScanner();
                  }}
                  className="flex-1 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-sand-100 font-bold text-xs rounded-xl border border-sand-400/50 hover:border-electric-400 shadow-md transition flex items-center justify-center gap-1"
                >
                  <Wifi className="w-3.5 h-3.5 text-electric-400" />
                  <span>Connect to SGU Wi-Fi & Retry</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetScanner}
                  className="py-2.5 px-3 bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 font-bold text-xs rounded-xl transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px]">
            Sanjay Ghodawat University • Automated Proxy Prevention
          </span>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
