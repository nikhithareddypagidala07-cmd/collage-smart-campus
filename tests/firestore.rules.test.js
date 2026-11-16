import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import fs from 'node:fs';
import net from 'node:net';

const PROJECT_ID = 'campus-care-ae2b5';

const checkPortOpen = (host, port, timeout = 600) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(timeout);
    socket.once('connect', () => {
      isResolved = true;
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.once('error', () => {
      if (!isResolved) {
        isResolved = true;
        resolve(false);
      }
    });
    socket.connect(port, host);
  });
};

const isEmulatorActive = await checkPortOpen('127.0.0.1', 8080, 500);

let testEnv;

if (isEmulatorActive) {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        host: '127.0.0.1',
        port: 8080,
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
    });
  });

  beforeEach(async () => {
    if (testEnv) await testEnv.clearFirestore();
  });

  afterAll(async () => {
    if (testEnv) await testEnv.cleanup();
  });
}

describe.skipIf(!isEmulatorActive)('CampusCare Firestore Security Rules (Emulator Suite)', () => {
  it('allows a student to read their own complaint', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'complaints', 'complaint-1'), {
        studentUid: 'student-1',
        status: 'Submitted',
        studentEmail: 'student@example.com',
        isPublic: false,
        isConfidential: true,
      });
    });

    const studentDb = testEnv.authenticatedContext('student-1', {
      email: 'student@example.com',
    }).firestore();

    await assertSucceeds(
      getDoc(doc(studentDb, 'complaints', 'complaint-1'))
    );
  });

  it('blocks a student from reading another student’s confidential complaint', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'complaints', 'complaint-2'), {
        studentUid: 'student-1',
        status: 'Submitted',
        studentEmail: 'student@example.com',
        isPublic: false,
        isConfidential: true,
      });
    });

    const otherStudentDb = testEnv.authenticatedContext('student-2', {
      email: 'other@example.com',
    }).firestore();

    await assertFails(
      getDoc(doc(otherStudentDb, 'complaints', 'complaint-2'))
    );
  });

  it('blocks a student from creating attendance records directly', async () => {
    const studentDb = testEnv.authenticatedContext('student-1').firestore();

    await assertFails(
      setDoc(doc(studentDb, 'student_attendance', 'attendance-1'), {
        studentUid: 'student-1',
        status: 'Present',
      })
    );
  });

  it('blocks an unauthenticated user from reading complaints', async () => {
    const db = testEnv.unauthenticatedContext().firestore();

    await assertFails(
      getDoc(doc(db, 'complaints', 'complaint-1'))
    );
  });

  it('prevents a student from changing their own profile role', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users', 'student-1'), {
        role: 'student',
        email: 'student@example.com',
        name: 'Test Student',
      });
    });

    const studentDb = testEnv.authenticatedContext('student-1', {
      email: 'student@example.com',
    }).firestore();

    await assertFails(
      updateDoc(doc(studentDb, 'users', 'student-1'), {
        role: 'admin',
      })
    );
  });

  it('allows a student to submit a complaint with their verified studentUid', async () => {
    const studentDb = testEnv.authenticatedContext('student-1', {
      email: 'student@example.com',
    }).firestore();

    await assertSucceeds(
      setDoc(doc(studentDb, 'complaints', 'student-valid-cmp'), {
        studentUid: 'student-1',
        status: 'Submitted',
        studentEmail: 'student@example.com',
        title: 'Water filter broken',
        category: 'Water Supply',
        department: 'Water & Plumbing Dept',
      })
    );
  });

  it('blocks a student from forging a complaint with another user’s studentUid', async () => {
    const studentDb = testEnv.authenticatedContext('student-1', {
      email: 'student@example.com',
    }).firestore();

    await assertFails(
      setDoc(doc(studentDb, 'complaints', 'forged-student-cmp'), {
        studentUid: 'victim-student-99',
        status: 'Submitted',
        studentEmail: 'student@example.com',
      })
    );
  });

  it('blocks a student from creating a complaint with status already set to Resolved', async () => {
    const studentDb = testEnv.authenticatedContext('student-1', {
      email: 'student@example.com',
    }).firestore();

    await assertFails(
      setDoc(doc(studentDb, 'complaints', 'bypass-status-cmp'), {
        studentUid: 'student-1',
        status: 'Resolved',
        studentEmail: 'student@example.com',
      })
    );
  });

  it('allows staff to read complaints assigned to their department', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'complaints', 'electrical-cmp'), {
        studentUid: 'student-1',
        status: 'Submitted',
        studentEmail: 'student@example.com',
        department: 'Electrical Maintenance',
        isConfidential: false,
      });
    });

    const staffDb = testEnv.authenticatedContext('staff-elec-1', {
      email: 'suresh@smartcampus.edu',
      role: 'staff',
      department: 'Electrical Maintenance',
    }).firestore();

    await assertSucceeds(
      getDoc(doc(staffDb, 'complaints', 'electrical-cmp'))
    );
  });

  it('blocks staff from reading confidential complaints from another department', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'complaints', 'hostel-confidential'), {
        studentUid: 'student-1',
        status: 'Submitted',
        studentEmail: 'student@example.com',
        department: 'Hostel Administration',
        isConfidential: true,
      });
    });

    const staffDb = testEnv.authenticatedContext('staff-elec-1', {
      email: 'suresh@smartcampus.edu',
      role: 'staff',
      department: 'Electrical Maintenance',
    }).firestore();

    await assertFails(
      getDoc(doc(staffDb, 'complaints', 'hostel-confidential'))
    );
  });
});
