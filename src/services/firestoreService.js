import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

/**
 * Cloud Firestore Service Layer for CampusCare
 * Connects React Contexts and pages to genuine Cloud Firestore operations.
 * Enforces role-scoped queries matching firestore.rules so permissions are never violated.
 */

// ================= USER PROFILES =================

export const createUserProfileInFirestore = async (userProfile) => {
  if (!isFirebaseConfigured || !db || !userProfile?.uid) return null;
  try {
    const userRef = doc(db, 'users', String(userProfile.uid));
    const sanitized = {
      uid: userProfile.uid,
      id: userProfile.uid,
      name: userProfile.name || '',
      email: userProfile.email || '',
      role: 'student', // strictly enforced by security rules
      studentId: userProfile.studentId || '',
      course: userProfile.course || 'B.Tech Computer Science',
      semester: userProfile.semester || '1st Semester',
      hostelBlock: userProfile.hostelBlock || 'Day Scholar',
      roomNo: userProfile.roomNo || 'N/A',
      phone: userProfile.phone || '',
      createdAt: userProfile.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    await setDoc(userRef, sanitized, { merge: true });
    return sanitized;
  } catch (error) {
    console.error('Firestore [users] create error:', error);
    throw error;
  }
};

export const syncUserProfileToFirestore = async (user) => {
  if (!isFirebaseConfigured || !db || (!user?.uid && !user?.id)) return;
  try {
    const docId = String(user.uid || user.id);
    const userRef = doc(db, 'users', docId);
    // Sanitize: do not sync passwords or transient demo state to Firestore
    const { password, isDemoMode, ...safeData } = user;
    await setDoc(userRef, {
      ...safeData,
      lastLoginAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore [users] sync notice:', error.message);
  }
};

export const fetchUserProfileFromFirestore = async (userId) => {
  if (!isFirebaseConfigured || !db || !userId) return null;
  try {
    const userRef = doc(db, 'users', String(userId));
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
  } catch (error) {
    console.warn('Firestore [users] fetch notice:', error.message);
  }
  return null;
};

export const fetchAllUsersFromFirestore = async () => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(d => ({ ...d.data(), id: d.id, uid: d.id }));
  } catch (error) {
    console.warn('Firestore [users] fetchAll notice:', error.message);
    return [];
  }
};

// ================= COMPLAINTS (ROLE-SCOPED) =================

/**
 * Subscribes to real-time complaint updates strictly scoped by the user's role.
 * - Admin: All complaints across campus
 * - Staff: Complaints belonging to their department or assigned to them
 * - Student: Their own submitted complaints (plus public campus announcements)
 */
export const subscribeToRoleScopedComplaints = (user, onData, onError) => {
  if (!isFirebaseConfigured || !db || !user || user.isDemoMode) {
    return () => {};
  }

  const complaintsRef = collection(db, 'complaints');
  const role = user.role || 'student';
  const uid = user.uid;

  // 1. ADMIN QUERY: Global campus visibility
  if (role === 'admin') {
    try {
      const q = query(complaintsRef, orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          onData(items);
        },
        (error) => {
          console.error('Firestore [admin complaints] listener error:', error);
          if (onError) onError(error);
        }
      );
    } catch (err) {
      if (onError) onError(err);
      return () => {};
    }
  }

  // 2. STAFF QUERY: Department-scoped visibility
  if (role === 'staff') {
    try {
      const staffDept = user.department || 'General Student Affairs';
      const q = query(complaintsRef, where('department', '==', staffDept));
      return onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
          // In-memory sort by createdAt / submissionDate desc
          items.sort((a, b) => new Date(b.createdAt || b.submissionDate || 0) - new Date(a.createdAt || a.submissionDate || 0));
          onData(items);
        },
        (error) => {
          console.error('Firestore [staff complaints] listener error:', error);
          if (onError) onError(error);
        }
      );
    } catch (err) {
      if (onError) onError(err);
      return () => {};
    }
  }

  // 3. STUDENT QUERY: Own tickets + Public Campus Complaints
  try {
    let myItems = [];
    let publicItems = [];

    const mergeAndBroadcast = () => {
      const map = new Map();
      myItems.forEach(item => map.set(item.id || item.trackingId, item));
      publicItems.forEach(item => {
        const key = item.id || item.trackingId;
        if (!map.has(key)) map.set(key, item);
      });
      const combined = Array.from(map.values());
      combined.sort((a, b) => new Date(b.createdAt || b.submissionDate || 0) - new Date(a.createdAt || a.submissionDate || 0));
      onData(combined);
    };

    // Query 3A: Student's own complaints
    const qMy = query(complaintsRef, where('studentUid', '==', uid));
    const unsubMy = onSnapshot(
      qMy,
      (snapshot) => {
        myItems = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        mergeAndBroadcast();
      },
      (error) => {
        console.error('Firestore [student complaints] listener error:', error);
        if (onError) onError(error);
      }
    );

    // Query 3B: Public non-confidential complaints
    const qPublic = query(
      complaintsRef,
      where('isPublic', '==', true),
      where('isConfidential', '==', false)
    );
    const unsubPublic = onSnapshot(
      qPublic,
      (snapshot) => {
        publicItems = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        mergeAndBroadcast();
      },
      (error) => {
        console.warn('Firestore [public complaints] notice:', error.message);
      }
    );

    return () => {
      unsubMy();
      unsubPublic();
    };
  } catch (err) {
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * Creates a new complaint document in Firestore using a predictable ID
 */
export const addComplaintToFirestore = async (complaintData) => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const docId = String(complaintData.id || `cmp-${Date.now()}`);
    const complaintRef = doc(db, 'complaints', docId);
    const payload = {
      ...complaintData,
      id: docId,
      createdAt: complaintData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(complaintRef, payload);
    return docId;
  } catch (error) {
    console.error('Firestore [complaints] create error:', error);
    throw error;
  }
};

/**
 * Updates an existing complaint document in Firestore
 */
export const updateComplaintInFirestore = async (complaintId, updates) => {
  if (!isFirebaseConfigured || !db || !complaintId) return;
  try {
    const complaintRef = doc(db, 'complaints', String(complaintId));
    await updateDoc(complaintRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firestore [complaints] update error:', error);
    throw error;
  }
};

// ================= NOTIFICATIONS =================

/**
 * Subscribes to real-time notifications for the active user
 */
export const subscribeToUserNotifications = (user, onData, onError) => {
  if (!isFirebaseConfigured || !db || !user || user.isDemoMode) {
    return () => {};
  }

  const notifsRef = collection(db, 'notifications');
  const role = user.role || 'student';
  const uid = user.uid;

  try {
    // Admin reads admin alerts; Student/Staff read notifications addressed to their UID or role
    const q = role === 'admin'
      ? query(notifsRef, orderBy('timestamp', 'desc'), limit(50))
      : query(notifsRef, where('recipientUid', '==', uid));

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        items.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
        onData(items);
      },
      (error) => {
        console.warn('Firestore [notifications] subscription notice:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    if (onError) onError(err);
    return () => {};
  }
};

export const addNotificationToFirestore = async (notifData) => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const docId = String(notifData.id || `notif-${Date.now()}`);
    const notifRef = doc(db, 'notifications', docId);
    await setDoc(notifRef, {
      ...notifData,
      id: docId,
      timestamp: notifData.timestamp || new Date().toISOString()
    });
    return docId;
  } catch (error) {
    console.warn('Firestore [notifications] create notice:', error.message);
    return null;
  }
};

export const markNotificationReadInFirestore = async (notifId) => {
  if (!isFirebaseConfigured || !db || !notifId) return;
  try {
    const notifRef = doc(db, 'notifications', String(notifId));
    await updateDoc(notifRef, {
      isRead: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore [notifications] mark read notice:', error.message);
  }
};

// ================= ATTENDANCE SESSIONS =================

export const subscribeToAttendanceSessions = (callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const sessionsRef = collection(db, 'attendance_sessions');
    return onSnapshot(sessionsRef, (snapshot) => {
      const sessions = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
      callback(sessions);
    }, (error) => {
      console.warn('Firestore [attendance_sessions] subscription notice:', error.message);
    });
  } catch (error) {
    console.warn('Firestore [attendance_sessions] query notice:', error.message);
    return () => {};
  }
};

export const saveAttendanceSessionToFirestore = async (session) => {
  if (!isFirebaseConfigured || !db || !session?.id) return;
  try {
    const sessionRef = doc(db, 'attendance_sessions', String(session.id));
    await setDoc(sessionRef, {
      ...session,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Firestore [attendance_sessions] save error:', error);
  }
};

// ================= STUDENT ATTENDANCE RECORDS =================

export const recordAttendanceCheckinToFirestore = async (record) => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const recordRef = collection(db, 'student_attendance');
    await addDoc(recordRef, {
      ...record,
      recordedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Firestore [student_attendance] check-in error:', error);
  }
};
