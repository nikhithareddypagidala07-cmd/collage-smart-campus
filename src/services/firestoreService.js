import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

/**
 * Cloud Firestore Service Layer for CampusCare
 * Provides seamless sync between React Contexts and Firebase Firestore.
 * Automatically falls back gracefully if Firebase credentials are not yet configured.
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

// ================= COMPLAINTS =================

export const subscribeToComplaints = (callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const complaintsRef = collection(db, 'complaints');
    const q = query(complaintsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      callback(items);
    }, (error) => {
      console.warn('Firestore [complaints] subscription notice:', error.message);
    });
  } catch (error) {
    console.warn('Firestore [complaints] query notice:', error.message);
    return () => {};
  }
};

export const addComplaintToFirestore = async (complaintData) => {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const complaintsRef = collection(db, 'complaints');
    const docRef = await addDoc(complaintsRef, {
      ...complaintData,
      createdAt: complaintData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Firestore [complaints] create error:', error);
    throw error;
  }
};

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

// ================= ATTENDANCE SESSIONS =================

export const subscribeToAttendanceSessions = (callback) => {
  if (!isFirebaseConfigured || !db) return () => {};
  try {
    const sessionsRef = collection(db, 'attendance_sessions');
    return onSnapshot(sessionsRef, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
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
