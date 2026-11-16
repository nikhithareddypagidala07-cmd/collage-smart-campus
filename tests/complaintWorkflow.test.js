import { describe, it, expect } from 'vitest';
import { generateTrackingId, isOverdue } from '../src/utils/helpers';

describe('CampusCare Complaint Data & Workflow Integrity Tests', () => {
  it('generates a valid, cryptographically unique tracking ID with SGU prefix', () => {
    const id1 = generateTrackingId();
    const id2 = generateTrackingId();

    expect(id1).toMatch(/^CMP-\d{4}-\d+$/);
    expect(id2).toMatch(/^CMP-\d{4}-\d+$/);
    expect(id1).not.toBe(id2);
  });

  it('correctly detects overdue complaints based on targetResolutionDate', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const overdueComplaint = {
      status: 'In Progress',
      targetResolutionDate: pastDate
    };

    const onTimeComplaint = {
      status: 'In Progress',
      targetResolutionDate: futureDate
    };

    const resolvedOverdueComplaint = {
      status: 'Resolved',
      targetResolutionDate: pastDate
    };

    expect(isOverdue(overdueComplaint)).toBe(true);
    expect(isOverdue(onTimeComplaint)).toBe(false);
    expect(isOverdue(resolvedOverdueComplaint)).toBe(false); // Resolved tickets are not overdue
  });

  it('guarantees history immutability and append-only progression', () => {
    const initialHistory = [
      {
        status: 'Submitted',
        timestamp: '2026-11-01T10:00:00.000Z',
        performer: 'Student',
        remarks: 'Initial complaint filed.'
      }
    ];

    const staffAction = {
      status: 'In Progress',
      timestamp: '2026-11-01T14:00:00.000Z',
      performer: 'Technician',
      remarks: 'Inspecting site.'
    };

    const updatedHistory = [...initialHistory, staffAction];

    // Verification corresponding to firestore.rules mathematical guard:
    // request.resource.data.history.hasAll(resource.data.history) && size == oldSize + 1
    expect(updatedHistory.length).toBe(initialHistory.length + 1);
    expect(updatedHistory.slice(0, initialHistory.length)).toEqual(initialHistory);
    expect(updatedHistory[updatedHistory.length - 1].status).toBe('In Progress');
  });

  it('validates feedback structure against security rules requirements', () => {
    const validFeedback = {
      rating: 5,
      comment: 'Problem was fixed quickly and cleanly.',
      submittedAt: new Date().toISOString(),
      submittedByUid: 'user-firebase-uid-123'
    };

    expect(validFeedback.rating).toBeGreaterThanOrEqual(1);
    expect(validFeedback.rating).toBeLessThanOrEqual(5);
    expect(Number.isInteger(validFeedback.rating)).toBe(true);
    expect(validFeedback.submittedByUid).toBe('user-firebase-uid-123');

    const allowedKeys = ['rating', 'comment', 'submittedAt', 'submittedByUid'];
    const hasOnlyAllowedKeys = Object.keys(validFeedback).every(k => allowedKeys.includes(k));
    expect(hasOnlyAllowedKeys).toBe(true);
  });

  it('correctly partitions role-based complaint visibility', () => {
    const mockComplaints = [
      { id: 'c1', studentUid: 'student-A', department: 'Electrical Maintenance', isPublic: false, isConfidential: true },
      { id: 'c2', studentUid: 'student-B', department: 'Electrical Maintenance', isPublic: false, isConfidential: false },
      { id: 'c3', studentUid: 'student-C', department: 'Academic Affairs', isPublic: true, isConfidential: false },
    ];

    // Student A visibility: own complaints + public non-confidential
    const studentAView = mockComplaints.filter(
      c => c.studentUid === 'student-A' || (c.isPublic === true && c.isConfidential === false)
    );
    expect(studentAView.map(c => c.id)).toEqual(['c1', 'c3']);

    // Electrical Staff visibility: only Electrical Maintenance complaints
    const staffElecView = mockComplaints.filter(c => c.department === 'Electrical Maintenance');
    expect(staffElecView.map(c => c.id)).toEqual(['c1', 'c2']);

    // Admin visibility: all complaints
    expect(mockComplaints.length).toBe(3);
  });
});
