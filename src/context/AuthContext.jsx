import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_STAFF, INITIAL_ADMIN } from '../data/mockData';

const AuthContext = createContext();

const STORAGE_KEY_AUTH = 'smartcampus_auth_user';
const STORAGE_KEY_USERS = 'smartcampus_users';

export const AuthProvider = ({ children }) => {
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

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved auth', e);
      }
    }
    // Default to student01 for seamless initial preview if not logged in, or null
    return INITIAL_STUDENTS[0];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentUser]);

  const login = (username, password) => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Check Admin
    if (users.admin.username.toLowerCase() === trimmedUser && users.admin.password === trimmedPass) {
      setCurrentUser(users.admin);
      return { success: true, user: users.admin };
    }

    // Check Staff
    const staffMember = users.staff.find(
      s => s.username.toLowerCase() === trimmedUser && s.password === trimmedPass
    );
    if (staffMember) {
      setCurrentUser(staffMember);
      return { success: true, user: staffMember };
    }

    // Check Students
    const student = users.students.find(
      s => s.username.toLowerCase() === trimmedUser && s.password === trimmedPass
    );
    if (student) {
      setCurrentUser(student);
      return { success: true, user: student };
    }

    return { success: false, message: 'Invalid username or password. Check demo credentials on the login page.' };
  };

  const quickLogin = (role, customId = null) => {
    if (role === 'admin') {
      setCurrentUser(users.admin);
      return users.admin;
    }
    if (role === 'staff') {
      const selected = customId ? users.staff.find(s => s.id === customId) : users.staff[0];
      setCurrentUser(selected || users.staff[0]);
      return selected || users.staff[0];
    }
    if (role === 'student') {
      const selected = customId ? users.students.find(s => s.id === customId || s.studentId === customId) : users.students[0];
      setCurrentUser(selected || users.students[0]);
      return selected || users.students[0];
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    setUsers(prev => {
      if (updated.role === 'admin') {
        return { ...prev, admin: updated };
      }
      if (updated.role === 'staff') {
        return {
          ...prev,
          staff: prev.staff.map(s => s.id === updated.id ? updated : s)
        };
      }
      return {
        ...prev,
        students: prev.students.map(s => s.id === updated.id ? updated : s)
      };
    });
  };

  const addMockUser = (newUser) => {
    setUsers(prev => {
      if (newUser.role === 'staff') {
        return { ...prev, staff: [newUser, ...prev.staff] };
      }
      return { ...prev, students: [newUser, ...prev.students] };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        quickLogin,
        logout,
        updateProfile,
        addMockUser,
        isAuthenticated: !!currentUser
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
