export const CAMPUS_WIFI_CONFIG = {
  authorizedSSID: 'SGU-Campus-WiFi-5G',
  backupSSID: 'SGU-Academic-Zone',
  gatewayIp: '172.20.10.1',
  campusLocation: 'Sanjay Ghodawat University - Academic Block A',
  macBindingEnabled: true
};

export const INITIAL_ACTIVE_QR_SESSION = {
  id: 'qr-live-601',
  course: 'B.Tech Computer Science',
  semester: '6th Semester',
  subject: 'CS-601: Machine Learning & AI',
  facultyName: 'Dr. Vasudevan',
  classroom: 'Room 304 (Academic Block A)',
  requiredWifi: 'SGU-Campus-WiFi-5G',
  gatewayIp: '172.20.10.1',
  token: 'SGU-SEC-9842',
  createdAt: new Date().toISOString(),
  expiresInMinutes: 15,
  isActive: true,
  checkedInStudents: ['ST2024-007']
};

export const INITIAL_QR_AUDIT_LOGS = [
  {
    id: 'audit-001',
    studentId: 'ST2024-007',
    studentName: 'Karthik Raja',
    subject: 'CS-601: Machine Learning & AI',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    wifiSSID: 'SGU-Campus-WiFi-5G',
    clientIp: '172.20.10.142',
    status: 'VERIFIED',
    device: 'OnePlus 11 / Chrome Mobile'
  },
  {
    id: 'audit-002',
    studentId: 'ST2024-003',
    studentName: 'Rohan Deshmukh',
    subject: 'CS-601: Machine Learning & AI',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    wifiSSID: 'Jio-5G-Personal',
    clientIp: '49.36.120.89',
    status: 'BLOCKED_UNTRUSTED_NETWORK',
    device: 'iPhone 14 / Safari'
  }
];

export const COURSES_LIST = [
  { id: 'course-cse-6', name: 'B.Tech Computer Science', semester: '6th Semester', code: 'CSE-SEM6' },
  { id: 'course-it-4', name: 'B.Tech Information Technology', semester: '4th Semester', code: 'IT-SEM4' },
  { id: 'course-mech-8', name: 'B.Tech Mechanical Engineering', semester: '8th Semester', code: 'MECH-SEM8' },
  { id: 'course-ece-4', name: 'B.Tech Electronics & Comm.', semester: '4th Semester', code: 'ECE-SEM4' },
  { id: 'course-ds-2', name: 'B.Sc Data Science', semester: '2nd Semester', code: 'DS-SEM2' }
];

export const SUBJECTS_MAP = {
  'B.Tech Computer Science': [
    { code: 'CS-601', name: 'CS-601: Machine Learning & AI', faculty: 'Dr. Vasudevan', totalHours: 42 },
    { code: 'CS-602', name: 'CS-602: Cloud Computing Architecture', faculty: 'Prof. Ramesh Sharma', totalHours: 38 },
    { code: 'CS-603', name: 'CS-603: Web Applications Development', faculty: 'Er. Alok Verma', totalHours: 40 },
    { code: 'CS-604', name: 'CS-604: Information & Network Security', faculty: 'Dr. Ananya Mukherjee', totalHours: 36 },
    { code: 'CS-605', name: 'CS-605: Software Project Management', faculty: 'Prof. Sunita Rao', totalHours: 35 }
  ],
  'B.Tech Information Technology': [
    { code: 'IT-401', name: 'IT-401: Data Structures & Algorithms', faculty: 'Dr. Vasudevan', totalHours: 44 },
    { code: 'IT-402', name: 'IT-402: Database Management Systems', faculty: 'Prof. Ramesh Sharma', totalHours: 40 },
    { code: 'IT-403', name: 'IT-403: Operating Systems', faculty: 'Er. Sandeep Nair', totalHours: 38 }
  ],
  'B.Tech Mechanical Engineering': [
    { code: 'ME-801', name: 'ME-801: Thermodynamics & Heat Transfer', faculty: 'Dr. Harish Chandra', totalHours: 40 },
    { code: 'ME-802', name: 'ME-802: Computer Aided Manufacturing', faculty: 'Er. Alok Verma', totalHours: 36 }
  ],
  'B.Tech Electronics & Comm.': [
    { code: 'EC-401', name: 'EC-401: Microprocessors & Microcontrollers', faculty: 'Er. Sandeep Nair', totalHours: 40 },
    { code: 'EC-402', name: 'EC-402: Signals & Analog Systems', faculty: 'Dr. Vasudevan', totalHours: 38 }
  ],
  'B.Sc Data Science': [
    { code: 'DS-201', name: 'DS-201: Probability & Applied Statistics', faculty: 'Dr. Ramesh Sharma', totalHours: 40 },
    { code: 'DS-202', name: 'DS-202: Python for Data Analysis', faculty: 'Dr. Vasudevan', totalHours: 42 }
  ]
};

// Initial student subject attendance metrics
export const INITIAL_STUDENT_ATTENDANCE = {
  'ST2024-001': { // Aarav Sharma - 82.5% (Good)
    studentId: 'ST2024-001',
    studentName: 'Aarav Sharma',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subjects: [
      { code: 'CS-601', name: 'CS-601: Machine Learning & AI', total: 42, attended: 36, onLeave: 2 },
      { code: 'CS-602', name: 'CS-602: Cloud Computing Architecture', total: 38, attended: 31, onLeave: 1 },
      { code: 'CS-603', name: 'CS-603: Web Applications Development', total: 40, attended: 35, onLeave: 0 },
      { code: 'CS-604', name: 'CS-604: Information & Network Security', total: 36, attended: 28, onLeave: 1 },
      { code: 'CS-605', name: 'CS-605: Software Project Management', total: 35, attended: 28, onLeave: 2 }
    ]
  },
  'ST2024-002': { // Priya Patel - 89.2% (Excellent)
    studentId: 'ST2024-002',
    studentName: 'Priya Patel',
    course: 'B.Tech Information Technology',
    semester: '4th Semester',
    subjects: [
      { code: 'IT-401', name: 'IT-401: Data Structures & Algorithms', total: 44, attended: 40, onLeave: 1 },
      { code: 'IT-402', name: 'IT-402: Database Management Systems', total: 40, attended: 36, onLeave: 0 },
      { code: 'IT-403', name: 'IT-403: Operating Systems', total: 38, attended: 33, onLeave: 2 }
    ]
  },
  'ST2024-003': { // Rohan Deshmukh - 66.8% (CRITICAL DEFICIT ALERT < 75%)
    studentId: 'ST2024-003',
    studentName: 'Rohan Deshmukh',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subjects: [
      { code: 'CS-601', name: 'CS-601: Machine Learning & AI', total: 42, attended: 26, onLeave: 1 },
      { code: 'CS-602', name: 'CS-602: Cloud Computing Architecture', total: 38, attended: 24, onLeave: 2 },
      { code: 'CS-603', name: 'CS-603: Web Applications Development', total: 40, attended: 29, onLeave: 0 },
      { code: 'CS-604', name: 'CS-604: Information & Network Security', total: 36, attended: 23, onLeave: 0 },
      { code: 'CS-605', name: 'CS-605: Software Project Management', total: 35, attended: 25, onLeave: 1 }
    ]
  },
  'ST2024-004': { // Sneha Kulkarni - 91.5% (Excellent)
    studentId: 'ST2024-004',
    studentName: 'Sneha Kulkarni',
    course: 'B.Tech Information Technology',
    semester: '4th Semester',
    subjects: [
      { code: 'IT-401', name: 'IT-401: Data Structures & Algorithms', total: 44, attended: 41, onLeave: 1 },
      { code: 'IT-402', name: 'IT-402: Database Management Systems', total: 40, attended: 37, onLeave: 1 },
      { code: 'IT-403', name: 'IT-403: Operating Systems', total: 38, attended: 34, onLeave: 0 }
    ]
  },
  'ST2024-005': { // Vikramaditya Roy - 71.4% (CRITICAL DEFICIT ALERT < 75%)
    studentId: 'ST2024-005',
    studentName: 'Vikramaditya Roy',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subjects: [
      { code: 'CS-601', name: 'CS-601: Machine Learning & AI', total: 42, attended: 30, onLeave: 0 },
      { code: 'CS-602', name: 'CS-602: Cloud Computing Architecture', total: 38, attended: 26, onLeave: 1 },
      { code: 'CS-603', name: 'CS-603: Web Applications Development', total: 40, attended: 30, onLeave: 1 },
      { code: 'CS-604', name: 'CS-604: Information & Network Security', total: 36, attended: 24, onLeave: 0 },
      { code: 'CS-605', name: 'CS-605: Software Project Management', total: 35, attended: 26, onLeave: 0 }
    ]
  },
  'ST2024-006': { // Ananya Gupta - 87.8% (Good)
    studentId: 'ST2024-006',
    studentName: 'Ananya Gupta',
    course: 'B.Sc Data Science',
    semester: '2nd Semester',
    subjects: [
      { code: 'DS-201', name: 'DS-201: Probability & Applied Statistics', total: 40, attended: 36, onLeave: 1 },
      { code: 'DS-202', name: 'DS-202: Python for Data Analysis', total: 42, attended: 36, onLeave: 1 }
    ]
  },
  'ST2024-007': { // Karthik Raja - 79.5% (Eligible)
    studentId: 'ST2024-007',
    studentName: 'Karthik Raja',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subjects: [
      { code: 'CS-601', name: 'CS-601: Machine Learning & AI', total: 42, attended: 34, onLeave: 0 },
      { code: 'CS-602', name: 'CS-602: Cloud Computing Architecture', total: 38, attended: 30, onLeave: 1 },
      { code: 'CS-603', name: 'CS-603: Web Applications Development', total: 40, attended: 32, onLeave: 0 },
      { code: 'CS-604', name: 'CS-604: Information & Network Security', total: 36, attended: 28, onLeave: 2 },
      { code: 'CS-605', name: 'CS-605: Software Project Management', total: 35, attended: 28, onLeave: 0 }
    ]
  },
  'ST2024-008': { // Divya Nambiar - 85.0% (Good)
    studentId: 'ST2024-008',
    studentName: 'Divya Nambiar',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subjects: [
      { code: 'CS-601', name: 'CS-601: Machine Learning & AI', total: 42, attended: 36, onLeave: 1 },
      { code: 'CS-602', name: 'CS-602: Cloud Computing Architecture', total: 38, attended: 32, onLeave: 1 },
      { code: 'CS-603', name: 'CS-603: Web Applications Development', total: 40, attended: 34, onLeave: 0 },
      { code: 'CS-604', name: 'CS-604: Information & Network Security', total: 36, attended: 31, onLeave: 1 },
      { code: 'CS-605', name: 'CS-605: Software Project Management', total: 35, attended: 30, onLeave: 0 }
    ]
  },
  'ST2024-009': { // Mohit Saini - 69.1% (CRITICAL DEFICIT ALERT < 75%)
    studentId: 'ST2024-009',
    studentName: 'Mohit Saini',
    course: 'B.Tech Mechanical Engineering',
    semester: '8th Semester',
    subjects: [
      { code: 'ME-801', name: 'ME-801: Thermodynamics & Heat Transfer', total: 40, attended: 27, onLeave: 1 },
      { code: 'ME-802', name: 'ME-802: Computer Aided Manufacturing', total: 36, attended: 25, onLeave: 1 }
    ]
  },
  'ST2024-010': { // Kavya Pillai - 94.2% (Excellent)
    studentId: 'ST2024-010',
    studentName: 'Kavya Pillai',
    course: 'B.Tech Electronics & Comm.',
    semester: '4th Semester',
    subjects: [
      { code: 'EC-401', name: 'EC-401: Microprocessors & Microcontrollers', total: 40, attended: 38, onLeave: 0 },
      { code: 'EC-402', name: 'EC-402: Signals & Analog Systems', total: 38, attended: 35, onLeave: 1 }
    ]
  }
};

// Past attendance daily recorded sessions
export const INITIAL_ATTENDANCE_SESSIONS = [
  {
    id: 'att-sess-101',
    date: '2024-10-31',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subject: 'CS-601: Machine Learning & AI',
    markedBy: 'Dr. Vasudevan',
    timestamp: '2024-10-31T09:30:00Z',
    records: [
      { studentId: 'ST2024-001', studentName: 'Aarav Sharma', status: 'Present' },
      { studentId: 'ST2024-003', studentName: 'Rohan Deshmukh', status: 'Absent' },
      { studentId: 'ST2024-005', studentName: 'Vikramaditya Roy', status: 'Present' },
      { studentId: 'ST2024-007', studentName: 'Karthik Raja', status: 'Present' },
      { studentId: 'ST2024-008', studentName: 'Divya Nambiar', status: 'On Leave' }
    ]
  },
  {
    id: 'att-sess-102',
    date: '2024-10-31',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subject: 'CS-602: Cloud Computing Architecture',
    markedBy: 'Prof. Ramesh Sharma',
    timestamp: '2024-10-31T11:15:00Z',
    records: [
      { studentId: 'ST2024-001', studentName: 'Aarav Sharma', status: 'Present' },
      { studentId: 'ST2024-003', studentName: 'Rohan Deshmukh', status: 'Absent' },
      { studentId: 'ST2024-005', studentName: 'Vikramaditya Roy', status: 'Absent' },
      { studentId: 'ST2024-007', studentName: 'Karthik Raja', status: 'Present' },
      { studentId: 'ST2024-008', studentName: 'Divya Nambiar', status: 'Present' }
    ]
  },
  {
    id: 'att-sess-103',
    date: '2024-10-30',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    subject: 'CS-603: Web Applications Development',
    markedBy: 'Er. Alok Verma',
    timestamp: '2024-10-30T14:00:00Z',
    records: [
      { studentId: 'ST2024-001', studentName: 'Aarav Sharma', status: 'Present' },
      { studentId: 'ST2024-003', studentName: 'Rohan Deshmukh', status: 'Present' },
      { studentId: 'ST2024-005', studentName: 'Vikramaditya Roy', status: 'Present' },
      { studentId: 'ST2024-007', studentName: 'Karthik Raja', status: 'On Leave' },
      { studentId: 'ST2024-008', studentName: 'Divya Nambiar', status: 'Present' }
    ]
  },
  {
    id: 'att-sess-104',
    date: '2024-10-30',
    course: 'B.Tech Information Technology',
    semester: '4th Semester',
    subject: 'IT-401: Data Structures & Algorithms',
    markedBy: 'Dr. Vasudevan',
    timestamp: '2024-10-30T10:00:00Z',
    records: [
      { studentId: 'ST2024-002', studentName: 'Priya Patel', status: 'Present' },
      { studentId: 'ST2024-004', studentName: 'Sneha Kulkarni', status: 'Present' }
    ]
  }
];
