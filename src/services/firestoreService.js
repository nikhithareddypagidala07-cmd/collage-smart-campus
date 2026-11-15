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

export const syncUserProfileToFirestore = async (user) => {
  if (!isFirebaseConfigured || !db || !user?.id) return;
  try {
    const userRef = doc(db, 'users', String(user.id));
    await setDoc(userRef, {
      ...user,
      lastLoginAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Firestore [users] sync error:', error);
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
    console.error('Firestore [users] fetch error:', error);
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
