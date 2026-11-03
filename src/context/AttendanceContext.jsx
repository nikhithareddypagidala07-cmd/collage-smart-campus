import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  COURSES_LIST,
  SUBJECTS_MAP,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_ATTENDANCE_SESSIONS,
  CAMPUS_WIFI_CONFIG,
  INITIAL_ACTIVE_QR_SESSION,
  INITIAL_QR_AUDIT_LOGS
} from '../data/attendanceMockData';

const AttendanceContext = createContext();

const STORAGE_KEY_SESSIONS = 'sgu_attendance_sessions';
const STORAGE_KEY_METRICS = 'sgu_student_attendance_metrics';
const STORAGE_KEY_QR_SESSION = 'sgu_active_qr_session';
const STORAGE_KEY_QR_AUDIT = 'sgu_qr_audit_logs';

export const AttendanceProvider = ({ children }) => {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved attendance sessions', e);
      }
    }
    return INITIAL_ATTENDANCE_SESSIONS;
  });

  const [studentMetrics, setStudentMetrics] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_METRICS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved student metrics', e);
      }
    }
    return INITIAL_STUDENT_ATTENDANCE;
  });

  // Active QR Session state
  const [activeQrSession, setActiveQrSession] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_QR_SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved QR session', e);
      }
    }
    return INITIAL_ACTIVE_QR_SESSION;
  });

  // QR & Wi-Fi Check-in Audit Logs
  const [qrAuditLogs, setQrAuditLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_QR_AUDIT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved QR audit logs', e);
      }
    }
    return INITIAL_QR_AUDIT_LOGS;
  });

  // Simulated student Wi-Fi connection
  // Options: 'SGU-Campus-WiFi-5G', 'Jio-5G-Personal', 'Home-Broadband'
  const [simulatedStudentWifi, setSimulatedStudentWifi] = useState('SGU-Campus-WiFi-5G');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_METRICS, JSON.stringify(studentMetrics));
  }, [studentMetrics]);

  useEffect(() => {
    if (activeQrSession) {
      localStorage.setItem(STORAGE_KEY_QR_SESSION, JSON.stringify(activeQrSession));
    } else {
      localStorage.removeItem(STORAGE_KEY_QR_SESSION);
    }
  }, [activeQrSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QR_AUDIT, JSON.stringify(qrAuditLogs));
  }, [qrAuditLogs]);

  // Mark attendance manually for a lecture session (Staff bulk form)
  const recordAttendanceSession = ({ date, course, semester, subject, markedBy, records }) => {
    const newSession = {
      id: `att-sess-${Date.now()}`,
      date,
      course,
      semester,
      subject,
      markedBy,
      timestamp: new Date().toISOString(),
      records
    };

    setSessions(prev => [newSession, ...prev]);

    // Update cumulative student metrics
    setStudentMetrics(prev => {
      const updated = { ...prev };

      records.forEach(rec => {
        const studentRec = updated[rec.studentId];
        if (studentRec && studentRec.subjects) {
          const subjectEntry = studentRec.subjects.find(s => s.name === subject || s.code === subject.split(':')[0]);
          if (subjectEntry) {
            subjectEntry.total += 1;
            if (rec.status === 'Present') {
              subjectEntry.attended += 1;
            } else if (rec.status === 'On Leave') {
              subjectEntry.onLeave = (subjectEntry.onLeave || 0) + 1;
            }
          }
        }
      });

      return updated;
    });

    return newSession;
  };

  // Start a new Live QR Attendance Session (Faculty)
  const startQrSession = ({ course, semester, subject, classroom, facultyName, requiredWifi }) => {
    const newSession = {
      id: `qr-sess-${Date.now()}`,
      course,
      semester,
      subject,
      classroom: classroom || 'Room 304 (Academic Block A)',
      facultyName: facultyName || 'Faculty',
      requiredWifi: requiredWifi || CAMPUS_WIFI_CONFIG.authorizedSSID,
      gatewayIp: CAMPUS_WIFI_CONFIG.gatewayIp,
      token: `SGU-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      expiresInMinutes: 15,
      isActive: true,
      checkedInStudents: []
    };

    setActiveQrSession(newSession);
    return newSession;
  };

  // Stop / Close QR Attendance Session
  const stopQrSession = () => {
    setActiveQrSession(prev => prev ? { ...prev, isActive: false } : null);
  };

  // Regenerate dynamic OTP token (rotating security token)
  const rotateSessionToken = () => {
    if (!activeQrSession) return;
    setActiveQrSession(prev => ({
      ...prev,
      token: `SGU-${Math.floor(1000 + Math.random() * 9000)}`
    }));
  };

  // Process Student QR Scan with Campus Wi-Fi Verification
  const markAttendanceViaQr = ({ studentId, studentName, scannedToken, networkSSID, device }) => {
    const currentSession = activeQrSession;

    if (!currentSession || !currentSession.isActive) {
      return {
        success: false,
        reason: 'SESSION_EXPIRED',
        message: 'No active lecture QR session found. Please ask your professor to start a session.'
      };
    }

    // 1. Wi-Fi Verification Check
    const wifiMatch = networkSSID === currentSession.requiredWifi || networkSSID === CAMPUS_WIFI_CONFIG.backupSSID;
    const clientIp = wifiMatch ? `172.20.10.${Math.floor(20 + Math.random() * 200)}` : '49.36.120.89';

    if (!wifiMatch) {
      // Log blocked proxy attempt
      const blockedLog = {
        id: `audit-${Date.now()}`,
        studentId,
        studentName,
        subject: currentSession.subject,
        timestamp: new Date().toISOString(),
        wifiSSID: networkSSID || 'External Cellular Data',
        clientIp,
        status: 'BLOCKED_UNTRUSTED_NETWORK',
        device: device || 'Mobile Device'
      };

      setQrAuditLogs(prev => [blockedLog, ...prev]);

      return {
        success: false,
        reason: 'WIFI_MISMATCH',
        message: `Attendance Blocked: You must be connected to Sanjay Ghodawat University Wi-Fi ("${currentSession.requiredWifi}") inside the classroom. Connected to "${networkSSID}".`,
        networkStatus: 'UNTRUSTED_EXTERNAL'
      };
    }

    // 2. Duplicate Check
    if (currentSession.checkedInStudents.includes(studentId)) {
      return {
        success: false,
        reason: 'ALREADY_CHECKED_IN',
        message: 'Attendance already marked for this lecture session.',
        networkStatus: 'VERIFIED'
      };
    }

    // 3. Mark Present & Update Records
    setActiveQrSession(prev => ({
      ...prev,
      checkedInStudents: [...prev.checkedInStudents, studentId]
    }));

    // Update cumulative student metrics
    setStudentMetrics(prev => {
      const updated = { ...prev };
      const studentRec = updated[studentId];
      if (studentRec && studentRec.subjects) {
        const sub = studentRec.subjects.find(
          s => s.name === currentSession.subject || s.code === currentSession.subject.split(':')[0]
        );
        if (sub) {
          sub.total += 1;
          sub.attended += 1;
        }
      }
      return updated;
    });

    // Add to audit trail
    const successLog = {
      id: `audit-${Date.now()}`,
      studentId,
      studentName,
      subject: currentSession.subject,
      timestamp: new Date().toISOString(),
      wifiSSID: networkSSID,
      clientIp,
      status: 'VERIFIED',
      device: device || 'Personal Mobile / Chrome'
    };

    setQrAuditLogs(prev => [successLog, ...prev]);

    return {
      success: true,
      message: `Verified & Marked: Present in ${currentSession.classroom}`,
      session: currentSession,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Helper: compute summary for a student
  const getStudentStats = (studentId) => {
    const data = studentMetrics[studentId];
    if (!data || !data.subjects || data.subjects.length === 0) {
      return {
        studentId,
        studentName: 'Student',
        totalClasses: 0,
        attendedClasses: 0,
        overallPercentage: 0,
        isBelowThreshold: false,
        subjects: []
      };
    }

    let totalHeld = 0;
    let totalAttended = 0;

    const subjectsWithPercent = data.subjects.map(sub => {
      totalHeld += sub.total;
      totalAttended += sub.attended;
      const percentage = sub.total > 0 ? Math.round((sub.attended / sub.total) * 1000) / 10 : 0;
      return {
        ...sub,
        percentage,
        isDeficit: percentage < 75
      };
    });

    const overallPercentage = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 0;

    return {
      studentId: data.studentId,
      studentName: data.studentName,
      course: data.course,
      semester: data.semester,
      totalClasses: totalHeld,
      attendedClasses: totalAttended,
      overallPercentage,
      isBelowThreshold: overallPercentage < 75,
      subjects: subjectsWithPercent
    };
  };

  // Helper: get list of low-attendance students (< 75%)
  const getLowAttendanceStudents = () => {
    return Object.keys(studentMetrics)
      .map(id => getStudentStats(id))
      .filter(s => s.isBelowThreshold)
      .sort((a, b) => a.overallPercentage - b.overallPercentage);
  };

  return (
    <AttendanceContext.Provider
      value={{
        sessions,
        courses: COURSES_LIST,
        subjectsMap: SUBJECTS_MAP,
        studentMetrics,
        wifiConfig: CAMPUS_WIFI_CONFIG,
        activeQrSession,
        qrAuditLogs,
        simulatedStudentWifi,
        setSimulatedStudentWifi,
        startQrSession,
        stopQrSession,
        rotateSessionToken,
        markAttendanceViaQr,
        recordAttendanceSession,
        getStudentStats,
        getLowAttendanceStudents
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
