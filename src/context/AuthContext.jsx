import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { INITIAL_STUDENTS, INITIAL_STAFF, INITIAL_ADMIN } from '../data/mockData';
import {
  fetchUserProfileFromFirestore,
  syncUserProfileToFirestore,
  createUserProfileInFirestore
} from '../services/firestoreService';

const AuthContext = createContext();

const STORAGE_KEY_AUTH = 'smartcampus_auth_user';
const STORAGE_KEY_USERS = 'smartcampus_users';

export const AuthProvider = ({ children }) => {
  // Institutional user directory for demo & directory lookups
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return {
      students: INITIAL_STUDENTS,
      staff: INITIAL_STAFF,
      admin: INITIAL_ADMIN
    };
  });

  // Active user session state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved auth', e);
      }
    }
    // Default to student01 initially for demo preview if not logged in
    return { ...INITIAL_STUDENTS[0], isDemoMode: true };
  });

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  // Sync active user to localStorage and Firestore when changed
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
      // Only sync non-demo authenticated users to Firestore
      if (isFirebaseConfigured && !currentUser.isDemoMode) {
        syncUserProfileToFirestore(currentUser);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentUser]);

  // Firebase Auth State Listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const tokenResult = await fbUser.getIdTokenResult();
          const claimRole = tokenResult.claims?.role;
          const profileDoc = await fetchUserProfileFromFirestore(fbUser.uid);

          const resolvedRole = claimRole || profileDoc?.role || 'student';

          const authenticatedUser = {
            uid: fbUser.uid,
            id: fbUser.uid,
            email: fbUser.email,
            name: profileDoc?.name || fbUser.displayName || fbUser.email.split('@')[0],
            role: resolvedRole,
            studentId: profileDoc?.studentId || (resolvedRole === 'student' ? `ST2024-${fbUser.uid.slice(0, 4).toUpperCase()}` : null),
            course: profileDoc?.course || 'B.Tech Computer Science',
            semester: profileDoc?.semester || '1st Semester',
            department: profileDoc?.department || (resolvedRole === 'staff' ? 'General Staff' : 'Academic Affairs'),
            staffId: profileDoc?.staffId || null,
            adminId: profileDoc?.adminId || null,
            ...(profileDoc || {}),
            isDemoMode: false
          };

          setCurrentUser(authenticatedUser);
          setAuthError(null);
        } catch (err) {
          console.error('Error synchronizing user profile from Firestore:', err);
        } finally {
          setIsAuthLoading(false);
        }
      } else {
        // Firebase user is signed out
        // Only keep user if an explicit demo session was active
        const saved = localStorage.getItem(STORAGE_KEY_AUTH);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.isDemoMode) {
              setCurrentUser(parsed);
              setIsAuthLoading(false);
              return;
            }
          } catch (e) {
            // ignore
          }
        }
        setCurrentUser(null);
        setIsAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Genuine Firebase Email/Password Login
   * Accepts either an email or an institutional username.
   * If login fails, reports the exact error and DOES NOT silently fall back to mock data.
   */
  const login = async (identifier, password) => {
    setAuthError(null);
    const trimmedInput = (identifier || '').trim();
    const trimmedPass = (password || '').trim();

    if (!trimmedInput || !trimmedPass) {
      const msg = 'Please enter both username/email and password.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (isFirebaseConfigured && auth) {
      try {
        setIsAuthLoading(true);

        // Convert institutional username to email if needed
        let emailToUse = trimmedInput;
        if (!emailToUse.includes('@')) {
          const lower = emailToUse.toLowerCase();
          if (lower === 'admin') {
            emailToUse = 'admin@smartcampus.edu';
          } else if (lower.startsWith('staff')) {
            emailToUse = `${lower}@smartcampus.edu`;
          } else if (lower.startsWith('student')) {
            emailToUse = `${lower}@smartcampus.edu`;
          } else {
            emailToUse = `${lower}@smartcampus.edu`;
          }
        }

        // Genuine Firebase Authentication call
        const userCredential = await signInWithEmailAndPassword(auth, emailToUse, trimmedPass);
        const fbUser = userCredential.user;

        // Fetch custom claims from token
        const tokenResult = await fbUser.getIdTokenResult(true);
        const claimRole = tokenResult.claims?.role;

        // Fetch user profile from Cloud Firestore
        let profile = await fetchUserProfileFromFirestore(fbUser.uid);

        // If user document does not exist yet (e.g. created directly in Firebase Console)
        if (!profile) {
          const defaultRole = claimRole || (emailToUse.includes('admin') ? 'admin' : (emailToUse.includes('staff') ? 'staff' : 'student'));
          // In Firestore rules, regular client writes cannot assign staff/admin roles
          // Safe profile role for client creation is 'student' unless verified by claim
          const safeRole = claimRole || 'student';

          profile = {
            uid: fbUser.uid,
            id: fbUser.uid,
            name: fbUser.displayName || trimmedInput.split('@')[0],
            email: fbUser.email,
            role: safeRole,
            studentId: `ST2024-${fbUser.uid.slice(0, 4).toUpperCase()}`,
            course: 'B.Tech Computer Science',
            semester: '1st Semester',
            hostelBlock: 'Day Scholar',
            roomNo: 'N/A',
            phone: '',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };

          try {
            await createUserProfileInFirestore(profile);
          } catch (e) {
            console.warn('Initial profile create notice:', e.message);
          }
        }

        const resolvedRole = claimRole || profile?.role || 'student';

        const finalUser = {
          ...profile,
          uid: fbUser.uid,
          id: fbUser.uid,
          email: fbUser.email,
          name: profile?.name || fbUser.displayName || fbUser.email.split('@')[0],
          role: resolvedRole,
          isDemoMode: false
        };

        setCurrentUser(finalUser);
        setIsAuthLoading(false);
        return { success: true, user: finalUser };
      } catch (err) {
        setIsAuthLoading(false);

        // Map Firebase error codes to helpful, user-friendly messages
        let friendlyMessage = 'Authentication failed. Please verify your credentials.';
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          friendlyMessage = 'Invalid credentials. If you are a new student, please click "Register" to create your account.';
        } else if (err.code === 'auth/invalid-email') {
          friendlyMessage = 'Please enter a valid institutional email address.';
        } else if (err.code === 'auth/user-disabled') {
          friendlyMessage = 'This account has been disabled by campus administration.';
        } else if (err.code === 'auth/too-many-requests') {
          friendlyMessage = 'Too many failed attempts. Access temporarily locked. Please try again later.';
        } else if (err.code === 'auth/network-request-failed') {
          friendlyMessage = 'Network error: Unable to reach Firebase. Check your internet connection.';
        } else if (err.message) {
          friendlyMessage = err.message;
        }

        setAuthError(friendlyMessage);
        // Requirement 3: Strictly return failure without falling back to mock authentication
        return { success: false, message: friendlyMessage, code: err.code };
      }
    }

    // Only when Firebase is completely unconfigured (offline development mode)
    const lowerUser = trimmedInput.toLowerCase();
    if (users.admin.username.toLowerCase() === lowerUser && users.admin.password === trimmedPass) {
      const userObj = { ...users.admin, isDemoMode: true };
      setCurrentUser(userObj);
      return { success: true, user: userObj };
    }
    const staffMember = users.staff.find(s => s.username.toLowerCase() === lowerUser && s.password === trimmedPass);
    if (staffMember) {
      const userObj = { ...staffMember, isDemoMode: true };
      setCurrentUser(userObj);
      return { success: true, user: userObj };
    }
    const student = users.students.find(s => s.username.toLowerCase() === lowerUser && s.password === trimmedPass);
    if (student) {
      const userObj = { ...student, isDemoMode: true };
      setCurrentUser(userObj);
      return { success: true, user: userObj };
    }

    return { success: false, message: 'Invalid demo credentials.' };
  };

  /**
   * Student Self-Registration via Firebase Authentication
   * Role is non-negotiably locked to 'student'.
   */
  const registerStudent = async ({ email, password, name, studentId, course, semester, hostelBlock, roomNo, phone }) => {
    setAuthError(null);

    if (!isFirebaseConfigured || !auth) {
      const msg = 'Firebase Authentication is not configured.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();
    const trimmedName = (name || '').trim();

    if (!trimmedEmail || !trimmedPass) {
      const msg = 'Email and password are required.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (trimmedPass.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (!trimmedName) {
      const msg = 'Please enter your full name.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    try {
      setIsAuthLoading(true);

      // Create account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
      const fbUser = userCredential.user;

      // Update Firebase Auth display name
      try {
        await updateFirebaseProfile(fbUser, { displayName: trimmedName });
      } catch (e) {
        console.warn('Profile displayName update notice:', e.message);
      }

      // Security requirement: Role is strictly locked to 'student'
      const studentProfile = {
        uid: fbUser.uid,
        id: fbUser.uid,
        name: trimmedName,
        email: fbUser.email,
        role: 'student', // Students CANNOT self-elevate to staff or admin
        studentId: (studentId || '').trim() || `ST2024-${fbUser.uid.slice(0, 4).toUpperCase()}`,
        course: course || 'B.Tech Computer Science',
        semester: semester || '1st Semester',
        hostelBlock: hostelBlock || 'Day Scholar',
        roomNo: roomNo || 'N/A',
        phone: (phone || '').trim() || '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isDemoMode: false
      };

      // Create user document in Cloud Firestore (users/{uid})
      await createUserProfileInFirestore(studentProfile);

      setCurrentUser(studentProfile);
      setIsAuthLoading(false);
      return { success: true, user: studentProfile };
    } catch (err) {
      setIsAuthLoading(false);
      let friendlyMessage = 'Registration failed. Please check your information.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please provide a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password must be at least 6 characters long.';
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setAuthError(friendlyMessage);
      return { success: false, message: friendlyMessage, code: err.code };
    }
  };

  /**
   * Demo / Evaluation Mode Login
   * Clearly marked as demo mode so it is never confused with live Firebase Auth.
   */
  const quickLogin = (role, customId = null) => {
    let selected = null;
    if (role === 'admin') {
      selected = { ...users.admin, isDemoMode: true };
    } else if (role === 'staff') {
      const match = customId ? users.staff.find(s => s.id === customId) : users.staff[0];
      selected = { ...(match || users.staff[0]), isDemoMode: true };
    } else {
      const match = customId ? users.students.find(s => s.id === customId || s.studentId === customId) : users.students[0];
      selected = { ...(match || users.students[0]), isDemoMode: true };
    }
    setCurrentUser(selected);
    return selected;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Firebase signOut notice:', err.message);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    if (currentUser.isDemoMode) {
      setUsers(prev => {
        if (updated.role === 'admin') return { ...prev, admin: updated };
        if (updated.role === 'staff') return { ...prev, staff: prev.staff.map(s => s.id === updated.id ? updated : s) };
        return { ...prev, students: prev.students.map(s => s.id === updated.id ? updated : s) };
      });
    } else if (isFirebaseConfigured) {
      // Sync allowed fields to Firestore
      syncUserProfileToFirestore(updated);
    }
  };

  const addMockUser = (newUser) => {
    setUsers(prev => {
      if (newUser.role === 'staff') return { ...prev, staff: [newUser, ...prev.staff] };
      return { ...prev, students: [newUser, ...prev.students] };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        registerStudent,
        quickLogin,
        demoLogin: quickLogin,
        logout,
        updateProfile,
        addMockUser,
        isAuthLoading,
        authError,
        isAuthenticated: !!currentUser,
        isFirebaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
