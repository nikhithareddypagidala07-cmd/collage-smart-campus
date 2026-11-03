import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_COMPLAINTS,
  INITIAL_CATEGORIES,
  INITIAL_DEPARTMENTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { generateTrackingId } from '../utils/helpers';

const ComplaintContext = createContext();

const STORAGE_KEY_COMPLAINTS = 'smartcampus_complaints';
const STORAGE_KEY_CATEGORIES = 'smartcampus_categories';
const STORAGE_KEY_DEPARTMENTS = 'smartcampus_departments';
const STORAGE_KEY_NOTIFS = 'smartcampus_notifications';

export const ComplaintProvider = ({ children }) => {
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

  // Sync to LocalStorage
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
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Notification Helper
  const createNotification = ({ userId, userRole, title, message, complaintId, trackingId }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userRole,
      title,
      message,
      complaintId,
      trackingId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Submit Complaint
  const submitComplaint = (formData, studentUser) => {
    const trackingId = generateTrackingId();
    const now = new Date();

    // Find category info to compute SLA target
    const categoryObj = categories.find(c => c.name === formData.category);
    const slaHours = categoryObj ? categoryObj.slaHours : 48;
    const targetDate = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

    const newComplaint = {
      id: `cmp-${Date.now()}`,
      trackingId,
      title: formData.title,
      category: formData.category,
      department: formData.department || (categoryObj ? categoryObj.department : 'General Student Affairs'),
      description: formData.description,
      priority: formData.priority || 'Medium',
      status: 'Submitted',
      studentId: studentUser.studentId,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      studentPhone: studentUser.phone || '',
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
          performer: formData.isConfidential ? 'Anonymous Student (Confidential)' : `${studentUser.name} (Student)`,
          remarks: 'Complaint registered via portal with picture evidence.'
        }
      ],
      remarks: 'Awaiting department review and staff assignment.'
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Notify student
    createNotification({
      userId: studentUser.studentId,
      userRole: 'student',
      title: 'Complaint Registered',
      message: `Your complaint "${newComplaint.title}" has been registered successfully with ID ${trackingId}.`,
      complaintId: newComplaint.id,
      trackingId: newComplaint.trackingId
    });

    // Notify Admin
    createNotification({
      userId: 'adm-01',
      userRole: 'admin',
      title: 'New Student Complaint',
      message: `New ${newComplaint.priority} complaint submitted: "${newComplaint.title}" under ${newComplaint.category}.`,
      complaintId: newComplaint.id,
      trackingId: newComplaint.trackingId
    });

    showToast(`Complaint submitted successfully! Tracking ID: ${trackingId}`, 'success');
    return newComplaint;
  };

  // Update Status
  const updateComplaintStatus = (complaintId, newStatus, remarks = '', performerName = 'Staff Member') => {
    const now = new Date().toISOString();
    let updatedComplaint = null;

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const newHistoryItem = {
            status: newStatus,
            timestamp: now,
            performer: performerName,
            remarks: remarks || `Status transitioned to ${newStatus}.`
          };

          updatedComplaint = {
            ...c,
            status: newStatus,
            remarks: remarks || c.remarks,
            resolvedDate: newStatus === 'Resolved' ? now : (newStatus === 'Reopened' ? null : c.resolvedDate),
            history: [...c.history, newHistoryItem]
          };
          return updatedComplaint;
        }
        return c;
      })
    );

    if (updatedComplaint) {
      // Notify student
      createNotification({
        userId: updatedComplaint.studentId,
        userRole: 'student',
        title: `Status Changed: ${newStatus}`,
        message: `Your complaint ${updatedComplaint.trackingId} status has changed to "${newStatus}". Remarks: ${remarks || 'No remarks provided.'}`,
        complaintId: updatedComplaint.id,
        trackingId: updatedComplaint.trackingId
      });

      showToast(`Complaint ${updatedComplaint.trackingId} updated to ${newStatus}`, 'info');
    }

    return updatedComplaint;
  };

  // Assign Staff
  const assignStaff = (complaintId, staffObj, remarks = '', assignedBy = 'Administrator') => {
    const now = new Date().toISOString();
    let target = null;

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const newStatus = c.status === 'Submitted' ? 'Under Review' : c.status;
          const newHistory = [
            ...c.history,
            {
              status: newStatus,
              timestamp: now,
              performer: assignedBy,
              remarks: `Assigned to ${staffObj.name} (${staffObj.department}). ${remarks}`
            }
          ];

          target = {
            ...c,
            status: newStatus,
            assignedStaffId: staffObj.id,
            assignedStaffName: staffObj.name,
            remarks: remarks || `Assigned to ${staffObj.name}`,
            history: newHistory
          };
          return target;
        }
        return c;
      })
    );

    if (target) {
      // Notify Staff
      createNotification({
        userId: staffObj.id,
        userRole: 'staff',
        title: 'New Complaint Assigned',
        message: `You have been assigned complaint ${target.trackingId}: "${target.title}".`,
        complaintId: target.id,
        trackingId: target.trackingId
      });

      // Notify Student
      createNotification({
        userId: target.studentId,
        userRole: 'student',
        title: 'Staff Assigned',
        message: `Complaint ${target.trackingId} has been assigned to ${staffObj.name} from ${staffObj.department}.`,
        complaintId: target.id,
        trackingId: target.trackingId
      });

      showToast(`Complaint assigned to ${staffObj.name}`, 'success');
    }
  };

  // Reopen Complaint
  const reopenComplaint = (complaintId, studentRemarks = '', studentName = 'Student') => {
    const now = new Date().toISOString();
    let updated = null;

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const newHistory = [
            ...c.history,
            {
              status: 'Reopened',
              timestamp: now,
              performer: `${studentName} (Student)`,
              remarks: `Reopened by student: ${studentRemarks || 'Issue persists after initial resolution.'}`
            }
          ];

          updated = {
            ...c,
            status: 'Reopened',
            resolvedDate: null,
            remarks: `Reopened: ${studentRemarks}`,
            history: newHistory
          };
          return updated;
        }
        return c;
      })
    );

    if (updated) {
      // Notify Admin
      createNotification({
        userId: 'adm-01',
        userRole: 'admin',
        title: 'Complaint Reopened',
        message: `Complaint ${updated.trackingId} was reopened by student with remark: "${studentRemarks}".`,
        complaintId: updated.id,
        trackingId: updated.trackingId
      });

      // Notify assigned staff if any
      if (updated.assignedStaffId) {
        createNotification({
          userId: updated.assignedStaffId,
          userRole: 'staff',
          title: 'Complaint Reopened',
          message: `Complaint ${updated.trackingId} has been reopened by student. Immediate review requested.`,
          complaintId: updated.id,
          trackingId: updated.trackingId
        });
      }

      showToast(`Complaint ${updated.trackingId} has been reopened.`, 'warning');
    }
  };

  // Escalate Complaint
  const escalateComplaint = (complaintId, escalationReason = '', adminName = 'Administrator') => {
    const now = new Date().toISOString();
    let updated = null;

    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const newHistory = [
            ...c.history,
            {
              status: 'Escalated',
              timestamp: now,
              performer: `${adminName} (Admin Office)`,
              remarks: `Escalated: ${escalationReason || 'Complaint overdue or requires high-level intervention.'}`
            }
          ];

          updated = {
            ...c,
            status: 'Escalated',
            priority: 'Urgent',
            remarks: `Escalated: ${escalationReason}`,
            history: newHistory
          };
          return updated;
        }
        return c;
      })
    );

    if (updated) {
      createNotification({
        userId: updated.studentId,
        userRole: 'student',
        title: 'Complaint Escalated',
        message: `Your complaint ${updated.trackingId} has been escalated for high-priority management.`,
        complaintId: updated.id,
        trackingId: updated.trackingId
      });

      showToast(`Complaint ${updated.trackingId} escalated successfully`, 'error');
    }
  };

  // Notification methods
  const markNotificationRead = (notifId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, isRead: true } : n)
    );
  };

  const markAllNotificationsRead = (userId) => {
    setNotifications(prev =>
      prev.map(n => (!userId || n.userId === userId) ? { ...n, isRead: true } : n)
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

  // Reset to initial mock data
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
        showToast,
        removeToast,
        submitComplaint,
        updateComplaintStatus,
        assignStaff,
        reopenComplaint,
        escalateComplaint,
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
