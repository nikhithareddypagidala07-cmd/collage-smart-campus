import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_COMPLAINTS,
  INITIAL_CATEGORIES,
  INITIAL_DEPARTMENTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { generateTrackingId } from '../utils/helpers';
import { isFirebaseConfigured } from '../firebase';
import { useAuth } from './AuthContext';
import {
  subscribeToRoleScopedComplaints,
  addComplaintToFirestore,
  updateComplaintInFirestore,
  subscribeToUserNotifications,
  addNotificationToFirestore,
  markNotificationReadInFirestore
} from '../services/firestoreService';

const ComplaintContext = createContext();

const STORAGE_KEY_COMPLAINTS = 'smartcampus_complaints';
const STORAGE_KEY_CATEGORIES = 'smartcampus_categories';
const STORAGE_KEY_DEPARTMENTS = 'smartcampus_departments';
const STORAGE_KEY_NOTIFS = 'smartcampus_notifications';

export const ComplaintProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Complaints State
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing complaints from localStorage', e);
      }
    }
    return INITIAL_COMPLAINTS;
  });

  // Categories State
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing categories from localStorage', e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  // Departments State
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DEPARTMENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing departments from localStorage', e);
      }
    }
    return INITIAL_DEPARTMENTS;
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing notifications from localStorage', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Toast Notification State
  const [toasts, setToasts] = useState([]);
  const [firestoreLoading, setFirestoreLoading] = useState(false);
  const [firestoreError, setFirestoreError] = useState(null);

  // Sync to LocalStorage (local persistence & offline cache)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DEPARTMENTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helper
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ================= REAL-TIME FIRESTORE SUBSCRIPTIONS =================

  // 1. Complaint Subscription (Strictly Role-Scoped)
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser || currentUser.isDemoMode) {
      setFirestoreLoading(false);
      return;
    }

    setFirestoreLoading(true);
    setFirestoreError(null);

    const unsubscribe = subscribeToRoleScopedComplaints(
      currentUser,
      (firestoreComplaints) => {
        setFirestoreLoading(false);
        setFirestoreError(null);
        if (firestoreComplaints) {
          setComplaints(prev => {
            const map = new Map(firestoreComplaints.map(item => [item.id || item.trackingId, item]));
            // Also preserve local items if they have not yet synced
            const merged = [...firestoreComplaints];
            prev.forEach(item => {
              const key = item.id || item.trackingId;
              if (!map.has(key) && item.studentUid === currentUser.uid) {
                merged.push(item);
              }
            });
            return merged;
          });
        }
      },
      (error) => {
        setFirestoreLoading(false);
        const errMsg = error.message || 'Permission denied or network error reaching Firestore.';
        setFirestoreError(errMsg);
        console.warn('Firestore complaints subscription notice:', errMsg);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser]);

  // 2. Real-time Notifications Subscription
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser || currentUser.isDemoMode) {
      return;
    }

    const unsubscribe = subscribeToUserNotifications(
      currentUser,
      (firestoreNotifs) => {
        if (firestoreNotifs && firestoreNotifs.length > 0) {
          setNotifications(prev => {
            const map = new Map(firestoreNotifs.map(n => [n.id, n]));
            const merged = [...firestoreNotifs];
            prev.forEach(n => {
              if (!map.has(n.id)) merged.push(n);
            });
            return merged;
          });
        }
      },
      (err) => {
        console.warn('Notifications subscription notice:', err.message);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser]);

  // Add Notification Helper (Local + Firestore)
  const createNotification = useCallback(async ({ userId, recipientUid, senderUid, userRole, title, message, complaintId, trackingId }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: userId || 'student',
      recipientUid: recipientUid || userId,
      senderUid: senderUid || currentUser?.uid || 'system',
      userRole,
      title,
      message,
      complaintId,
      trackingId,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (isFirebaseConfigured && !currentUser?.isDemoMode) {
      try {
        await addNotificationToFirestore(newNotif);
      } catch (e) {
        console.warn('Firestore notification write notice:', e.message);
      }
    }
  }, [currentUser]);

  // ================= COMPLAINT ACTIONS =================

  // Submit Complaint
  const submitComplaint = async (formData, studentUser) => {
    const trackingId = generateTrackingId();
    const now = new Date();

    // Find category info to compute SLA target
    const categoryObj = categories.find(c => c.name === formData.category);
    const slaHours = categoryObj ? categoryObj.slaHours : 48;
    const targetDate = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

    const docId = `cmp-${Date.now()}`;
    const newComplaint = {
      id: docId,
      trackingId,
      title: formData.title,
      category: formData.category,
      department: formData.department || (categoryObj ? categoryObj.department : 'General Student Affairs'),
      description: formData.description,
      priority: formData.priority || 'Medium',
      status: 'Submitted',
      studentUid: studentUser?.uid || studentUser?.id,
      studentId: studentUser?.studentId || 'N/A',
      studentName: studentUser?.name || 'Student',
      studentEmail: studentUser?.email || '',
      studentPhone: studentUser?.phone || '',
      location: formData.location || 'Campus Premise',
      isConfidential: !!formData.isConfidential,
      submissionDate: now.toISOString(),
      targetResolutionDate: targetDate.toISOString(),
      resolvedDate: null,
      assignedStaffId: null,
      assignedStaffName: 'Unassigned',
      evidenceImage: formData.evidenceImage || null,
      history: [
        {
          status: 'Submitted',
          timestamp: now.toISOString(),
          performer: formData.isConfidential ? 'Anonymous Student (Confidential)' : `${studentUser?.name || 'Student'} (Student)`,
          remarks: 'Complaint registered via portal with picture evidence.'
        }
      ],
      remarks: 'Awaiting department review and staff assignment.'
    };

    // If Firebase is active and not demo mode, persist to Cloud Firestore first
    if (isFirebaseConfigured && !studentUser?.isDemoMode) {
      try {
        await addComplaintToFirestore(newComplaint);
      } catch (err) {
        showToast(`Failed to submit complaint to Cloud Firestore: ${err.message}`, 'error');
        throw err; // Strict: No silent local fallback on Firebase failure
      }
    }

    setComplaints(prev => [newComplaint, ...prev]);

    // Send notifications
    createNotification({
      userId: studentUser.studentId,
      recipientUid: studentUser.uid || studentUser.id,
      senderUid: studentUser.uid || studentUser.id,
      userRole: 'student',
      title: 'Complaint Registered',
      message: `Your complaint "${newComplaint.title}" has been registered successfully with tracking ID ${trackingId}.`,
      complaintId: newComplaint.id,
      trackingId: newComplaint.trackingId
    });

    createNotification({
      userId: 'adm-01',
      recipientUid: 'admin',
      senderUid: studentUser.uid || studentUser.id,
      userRole: 'admin',
      title: 'New Student Complaint',
      message: `New ${newComplaint.priority} complaint submitted: "${newComplaint.title}" under ${newComplaint.category}.`,
      complaintId: newComplaint.id,
      trackingId: newComplaint.trackingId
    });

    showToast(`Complaint submitted successfully! Tracking ID: ${trackingId}`, 'success');
    return newComplaint;
  };

  // Update Status (Staff / Admin)
  const updateComplaintStatus = async (complaintId, newStatus, remarks = '', performerName = 'Staff Member') => {
    const now = new Date().toISOString();
    let updatedComplaint = null;

    const targetComplaint = complaints.find(c => c.id === complaintId);
    if (!targetComplaint) return null;

    const newHistoryItem = {
      status: newStatus,
      timestamp: now,
      performer: performerName,
      remarks: remarks || `Status transitioned to ${newStatus}.`
    };

    updatedComplaint = {
      ...targetComplaint,
      status: newStatus,
      remarks: remarks || targetComplaint.remarks,
      resolvedDate: newStatus === 'Resolved' ? now : (newStatus === 'Reopened' ? null : targetComplaint.resolvedDate),
      history: [...(targetComplaint.history || []), newHistoryItem]
    };

    // Cloud Firestore Sync
    if (isFirebaseConfigured && !currentUser?.isDemoMode) {
      try {
        await updateComplaintInFirestore(complaintId, {
          status: newStatus,
          remarks: updatedComplaint.remarks,
          resolvedDate: updatedComplaint.resolvedDate,
          history: updatedComplaint.history
        });
      } catch (err) {
        showToast(`Cloud Firestore status update error: ${err.message}`, 'error');
        throw err;
      }
    }

    setComplaints(prev => prev.map(c => c.id === complaintId ? updatedComplaint : c));

    // Notify student
    createNotification({
      userId: updatedComplaint.studentId,
      recipientUid: updatedComplaint.studentUid,
      senderUid: currentUser?.uid || 'staff',
      userRole: 'student',
      title: `Status Changed: ${newStatus}`,
      message: `Your complaint ${updatedComplaint.trackingId} status has changed to "${newStatus}". Remarks: ${remarks || 'No remarks provided.'}`,
      complaintId: updatedComplaint.id,
      trackingId: updatedComplaint.trackingId
    });

    showToast(`Complaint ${updatedComplaint.trackingId} updated to ${newStatus}`, 'info');
    return updatedComplaint;
  };

  // Assign Staff (Admin)
  const assignStaff = async (complaintId, staffObj, remarks = '', assignedBy = 'Administrator') => {
    const now = new Date().toISOString();
    const target = complaints.find(c => c.id === complaintId);
    if (!target) return null;

    const newStatus = target.status === 'Submitted' ? 'Under Review' : target.status;
    const newHistory = [
      ...(target.history || []),
      {
        status: newStatus,
        timestamp: now,
        performer: assignedBy,
        remarks: `Assigned to ${staffObj.name} (${staffObj.department}). ${remarks}`
      }
    ];

    const updated = {
      ...target,
      status: newStatus,
      assignedStaffId: staffObj.id,
      assignedStaffName: staffObj.name,
      assignedStaffUid: staffObj.uid || staffObj.id,
      remarks: remarks || `Assigned to ${staffObj.name}`,
      history: newHistory
    };

    if (isFirebaseConfigured && !currentUser?.isDemoMode) {
      try {
        await updateComplaintInFirestore(complaintId, {
          status: newStatus,
          assignedStaffId: updated.assignedStaffId,
          assignedStaffName: updated.assignedStaffName,
          assignedStaffUid: updated.assignedStaffUid,
          remarks: updated.remarks,
          history: updated.history
        });
      } catch (err) {
        showToast(`Cloud Firestore assignment sync error: ${err.message}`, 'error');
        throw err;
      }
    }

    setComplaints(prev => prev.map(c => c.id === complaintId ? updated : c));

    // Notify Staff
    createNotification({
      userId: staffObj.id,
      recipientUid: staffObj.uid || staffObj.id,
      senderUid: currentUser?.uid || 'admin',
      userRole: 'staff',
      title: 'New Complaint Assigned',
      message: `You have been assigned complaint ${updated.trackingId}: "${updated.title}".`,
      complaintId: updated.id,
      trackingId: updated.trackingId
    });

    // Notify Student
    createNotification({
      userId: updated.studentId,
      recipientUid: updated.studentUid,
      senderUid: currentUser?.uid || 'admin',
      userRole: 'student',
      title: 'Staff Assigned',
      message: `Complaint ${updated.trackingId} has been assigned to ${staffObj.name} (${staffObj.department}).`,
      complaintId: updated.id,
      trackingId: updated.trackingId
    });

    showToast(`Complaint assigned to ${staffObj.name}`, 'success');
    return updated;
  };

  // Reopen Complaint (Student)
  const reopenComplaint = async (complaintId, studentRemarks = '', studentName = 'Student') => {
    const now = new Date().toISOString();
    const target = complaints.find(c => c.id === complaintId);
    if (!target) return null;

    const newHistory = [
      ...(target.history || []),
      {
        status: 'Reopened',
        timestamp: now,
        performer: `${studentName} (Student)`,
        remarks: `Reopened by student: ${studentRemarks || 'Issue persists after initial resolution.'}`
      }
    ];

    const updated = {
      ...target,
      status: 'Reopened',
      resolvedDate: null,
      remarks: `Reopened: ${studentRemarks}`,
      history: newHistory
    };

    if (isFirebaseConfigured && !currentUser?.isDemoMode) {
      try {
        await updateComplaintInFirestore(complaintId, {
          status: 'Reopened',
          resolvedDate: null,
          remarks: updated.remarks,
          history: updated.history
        });
      } catch (err) {
        showToast(`Cloud Firestore reopen sync error: ${err.message}`, 'error');
        throw err;
      }
    }

    setComplaints(prev => prev.map(c => c.id === complaintId ? updated : c));

    // Notify Admin
    createNotification({
      userId: 'adm-01',
      recipientUid: 'admin',
      senderUid: currentUser?.uid || 'student',
      userRole: 'admin',
      title: 'Complaint Reopened',
      message: `Complaint ${updated.trackingId} was reopened by student with remark: "${studentRemarks}".`,
      complaintId: updated.id,
      trackingId: updated.trackingId
    });

    showToast(`Complaint ${updated.trackingId} has been reopened.`, 'warning');
    return updated;
  };

  // Escalate Complaint (Admin)
  const escalateComplaint = async (complaintId, escalationReason = '', adminName = 'Administrator') => {
    const now = new Date().toISOString();
    const target = complaints.find(c => c.id === complaintId);
    if (!target) return null;

    const newHistory = [
      ...(target.history || []),
      {
        status: 'Escalated',
        timestamp: now,
        performer: `${adminName} (Admin Office)`,
        remarks: `Escalated: ${escalationReason || 'Complaint overdue or requires high-level intervention.'}`
      }
    ];

    const updated = {
      ...target,
      status: 'Escalated',
      priority: 'Urgent',
      remarks: `Escalated: ${escalationReason}`,
      history: newHistory
    };

    if (isFirebaseConfigured && !currentUser?.isDemoMode) {
      try {
        await updateComplaintInFirestore(complaintId, {
          status: 'Escalated',
          priority: 'Urgent',
          remarks: updated.remarks,
          history: updated.history
        });
      } catch (err) {
        showToast(`Cloud Firestore escalation error: ${err.message}`, 'error');
        throw err;
      }
    }

    setComplaints(prev => prev.map(c => c.id === complaintId ? updated : c));
    showToast(`Complaint ${updated.trackingId} escalated successfully`, 'error');
    return updated;
  };

  // Submit Feedback (Student on Resolved Complaint)
  const submitFeedback = async (complaintId, rating, comment = '') => {
    const target = complaints.find(c => c.id === complaintId);
    if (!target) return null;

    const feedbackPayload = {
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      comment: String(comment || '').trim(),
      submittedAt: new Date().toISOString(),
      submittedByUid: currentUser?.uid || currentUser?.id || 'anonymous'
    };

    if (isFirebaseConfigured && !currentUser?.isDemoMode) {
      try {
        await updateComplaintInFirestore(complaintId, {
          feedback: feedbackPayload
        });
      } catch (err) {
        showToast(`Feedback submission error: ${err.message}`, 'error');
        throw err;
      }
    }

    const updated = {
      ...target,
      feedback: feedbackPayload
    };

    setComplaints(prev => prev.map(c => c.id === complaintId ? updated : c));
    showToast('Thank you! Your resolution feedback has been recorded.', 'success');
    return updated;
  };

  // Notification management
  const markNotificationRead = (notifId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, isRead: true } : n)
    );
    if (isFirebaseConfigured && !currentUser?.isDemoMode) {
      markNotificationReadInFirestore(notifId);
    }
  };

  const markAllNotificationsRead = (userId) => {
    setNotifications(prev =>
      prev.map(n => (!userId || n.userId === userId || n.recipientUid === userId) ? { ...n, isRead: true } : n)
    );
  };

  // Categories management
  const addCategory = (categoryData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      ...categoryData
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully`, 'success');
  };

  const updateCategory = (catId, updatedFields) => {
    setCategories(prev =>
      prev.map(c => c.id === catId ? { ...c, ...updatedFields } : c)
    );
    showToast('Category updated successfully', 'success');
  };

  // Departments management
  const addDepartment = (deptData) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      activeComplaints: 0,
      ...deptData
    };
    setDepartments(prev => [...prev, newDept]);
    showToast(`Department "${newDept.name}" created`, 'success');
  };

  // Reset to initial default state
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_COMPLAINTS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEY_NOTIFS);
    localStorage.removeItem('smartcampus_users');
    localStorage.removeItem('smartcampus_auth_user');

    setComplaints(INITIAL_COMPLAINTS);
    setCategories(INITIAL_CATEGORIES);
    setDepartments(INITIAL_DEPARTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);

    showToast('Demo data reset to initial default state!', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        categories,
        departments,
        notifications,
        toasts,
        firestoreLoading,
        firestoreError,
        showToast,
        removeToast,
        submitComplaint,
        updateComplaintStatus,
        assignStaff,
        reopenComplaint,
        escalateComplaint,
        submitFeedback,
        markNotificationRead,
        markAllNotificationsRead,
        addCategory,
        updateCategory,
        addDepartment,
        resetDemoData
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
