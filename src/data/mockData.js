// Realistic Mock Data for Smart Campus Issue Resolution System

export const INITIAL_DEPARTMENTS = [
  { id: 'dept-acad', name: 'Academic Affairs', head: 'Dr. Ramesh Sharma', email: 'academics@smartcampus.edu', phone: '+91 98765 43210', activeComplaints: 3 },
  { id: 'dept-hostel', name: 'Hostel Administration', head: 'Prof. Sunita Rao', email: 'hostel@smartcampus.edu', phone: '+91 98765 43211', activeComplaints: 5 },
  { id: 'dept-infr', name: 'Campus Estate & Maintenance', head: 'Er. Alok Verma', email: 'estate@smartcampus.edu', phone: '+91 98765 43212', activeComplaints: 4 },
  { id: 'dept-sanit', name: 'Sanitation & Housekeeping', head: 'Mrs. Geeta Patel', email: 'sanitation@smartcampus.edu', phone: '+91 98765 43213', activeComplaints: 2 },
  { id: 'dept-trans', name: 'Transport Division', head: 'Mr. Gurpreet Singh', email: 'transport@smartcampus.edu', phone: '+91 98765 43214', activeComplaints: 2 },
  { id: 'dept-elec', name: 'Electrical Maintenance', head: 'Er. Sandeep Nair', email: 'electrical@smartcampus.edu', phone: '+91 98765 43215', activeComplaints: 3 },
  { id: 'dept-water', name: 'Water & Plumbing Dept', head: 'Mr. Manoj Kumar', email: 'plumbing@smartcampus.edu', phone: '+91 98765 43216', activeComplaints: 2 },
  { id: 'dept-lib', name: 'Library Administration', head: 'Dr. Ananya Mukherjee', email: 'library@smartcampus.edu', phone: '+91 98765 43217', activeComplaints: 1 },
  { id: 'dept-cant', name: 'Food & Catering Services', head: 'Chef K. Venkatesh', email: 'canteen@smartcampus.edu', phone: '+91 98765 43218', activeComplaints: 2 },
  { id: 'dept-affairs', name: 'General Student Affairs', head: 'Dr. Meenakshi Sundaram', email: 'studentaffairs@smartcampus.edu', phone: '+91 98765 43219', activeComplaints: 1 }
];

export const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Academics',
    iconName: 'GraduationCap',
    department: 'Academic Affairs',
    description: 'Course scheduling, faculty availability, lab equipment, grading queries',
    slaHours: 48
  },
  {
    id: 'cat-2',
    name: 'Hostel Facilities',
    iconName: 'Building2',
    department: 'Hostel Administration',
    description: 'Room furniture, hostel Wi-Fi, wardens, laundry, common room',
    slaHours: 24
  },
  {
    id: 'cat-3',
    name: 'Infrastructure',
    iconName: 'Wrench',
    department: 'Campus Estate & Maintenance',
    description: 'Classroom benches, projectors, civil repairs, walkway lighting',
    slaHours: 72
  },
  {
    id: 'cat-4',
    name: 'Sanitation and Hygiene',
    iconName: 'Sparkles',
    department: 'Sanitation & Housekeeping',
    description: 'Washroom cleaning, dustbins, campus cleanliness, pest control',
    slaHours: 12
  },
  {
    id: 'cat-5',
    name: 'Transportation',
    iconName: 'Bus',
    department: 'Transport Division',
    description: 'College bus schedule, route issues, driver conduct, vehicle maintenance',
    slaHours: 24
  },
  {
    id: 'cat-6',
    name: 'Electrical Issues',
    iconName: 'Zap',
    department: 'Electrical Maintenance',
    description: 'Power cut, fan repair, tube lights, switchboards, air conditioners',
    slaHours: 24
  },
  {
    id: 'cat-7',
    name: 'Water Supply',
    iconName: 'Droplet',
    department: 'Water & Plumbing Dept',
    description: 'Drinking water coolers, RO filters, tap leakage, bathroom water shortage',
    slaHours: 12
  },
  {
    id: 'cat-8',
    name: 'Library',
    iconName: 'BookOpen',
    department: 'Library Administration',
    description: 'Digital catalog, quiet zones, book reservations, reference section AC',
    slaHours: 48
  },
  {
    id: 'cat-9',
    name: 'Canteen',
    iconName: 'Utensils',
    department: 'Food & Catering Services',
    description: 'Food hygiene, pricing, mess menu diversity, drinking water in mess',
    slaHours: 24
  },
  {
    id: 'cat-10',
    name: 'Other Campus Issues',
    iconName: 'HelpCircle',
    department: 'General Student Affairs',
    description: 'Sports complex, medical room, security gates, anti-ragging support',
    slaHours: 48
  }
];

export const INITIAL_STUDENTS = [
  {
    id: 'std-01',
    username: 'student01',
    password: 'student123',
    name: 'Aarav Sharma',
    studentId: 'ST2024-001',
    email: 'aarav.sharma@smartcampus.edu',
    phone: '+91 98761 00001',
    role: 'student',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    hostelBlock: 'Block-A (Aryabhatta)',
    roomNo: '304',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-02',
    username: 'student02',
    password: 'student123',
    name: 'Priya Patel',
    studentId: 'ST2024-002',
    email: 'priya.patel@smartcampus.edu',
    phone: '+91 98761 00002',
    role: 'student',
    course: 'B.Tech Information Technology',
    semester: '4th Semester',
    hostelBlock: 'Block-C (Gargi)',
    roomNo: '112',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-03',
    username: 'student03',
    password: 'student123',
    name: 'Rohan Deshmukh',
    studentId: 'ST2024-003',
    email: 'rohan.d@smartcampus.edu',
    phone: '+91 98761 00003',
    role: 'student',
    course: 'B.Tech Mechanical Engineering',
    semester: '8th Semester',
    hostelBlock: 'Block-B (Bhaskara)',
    roomNo: '215',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-04',
    username: 'student04',
    password: 'student123',
    name: 'Sneha Kulkarni',
    studentId: 'ST2024-004',
    email: 'sneha.k@smartcampus.edu',
    phone: '+91 98761 00004',
    role: 'student',
    course: 'B.Tech Electronics & Comm.',
    semester: '4th Semester',
    hostelBlock: 'Block-C (Gargi)',
    roomNo: '208',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-05',
    username: 'student05',
    password: 'student123',
    name: 'Vikramaditya Roy',
    studentId: 'ST2024-005',
    email: 'vikram.roy@smartcampus.edu',
    phone: '+91 98761 00005',
    role: 'student',
    course: 'B.Tech Civil Engineering',
    semester: '6th Semester',
    hostelBlock: 'Day Scholar',
    roomNo: 'N/A',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-06',
    username: 'student06',
    password: 'student123',
    name: 'Ananya Gupta',
    studentId: 'ST2024-006',
    email: 'ananya.g@smartcampus.edu',
    phone: '+91 98761 00006',
    role: 'student',
    course: 'B.Sc Data Science',
    semester: '2nd Semester',
    hostelBlock: 'Block-D (Maitreyi)',
    roomNo: '104',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-07',
    username: 'student07',
    password: 'student123',
    name: 'Karthik Raja',
    studentId: 'ST2024-007',
    email: 'karthik.r@smartcampus.edu',
    phone: '+91 98761 00007',
    role: 'student',
    course: 'MBA Tech Management',
    semester: '2nd Semester',
    hostelBlock: 'Block-A (Aryabhatta)',
    roomNo: '410',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-08',
    username: 'student08',
    password: 'student123',
    name: 'Divya Nambiar',
    studentId: 'ST2024-008',
    email: 'divya.n@smartcampus.edu',
    phone: '+91 98761 00008',
    role: 'student',
    course: 'B.Tech Biotechnology',
    semester: '6th Semester',
    hostelBlock: 'Block-C (Gargi)',
    roomNo: '315',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-09',
    username: 'student09',
    password: 'student123',
    name: 'Mohit Saini',
    studentId: 'ST2024-009',
    email: 'mohit.saini@smartcampus.edu',
    phone: '+91 98761 00009',
    role: 'student',
    course: 'B.Tech Electrical Engineering',
    semester: '4th Semester',
    hostelBlock: 'Block-B (Bhaskara)',
    roomNo: '102',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'std-10',
    username: 'student10',
    password: 'student123',
    name: 'Kavya Pillai',
    studentId: 'ST2024-010',
    email: 'kavya.p@smartcampus.edu',
    phone: '+91 98761 00010',
    role: 'student',
    course: 'B.Arch Architecture',
    semester: '6th Semester',
    hostelBlock: 'Day Scholar',
    roomNo: 'N/A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_STAFF = [
  {
    id: 'stf-01',
    username: 'staff01',
    password: 'staff123',
    name: 'Suresh Kumar',
    staffId: 'EMP-ELE-102',
    department: 'Electrical Maintenance',
    designation: 'Senior Electrical Engineer',
    email: 'suresh.elec@smartcampus.edu',
    phone: '+91 98762 00001',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stf-02',
    username: 'staff02',
    password: 'staff123',
    name: 'Neeta Choudhary',
    staffId: 'EMP-HST-204',
    department: 'Hostel Administration',
    designation: 'Chief Hostel Warden',
    email: 'neeta.warden@smartcampus.edu',
    phone: '+91 98762 00002',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stf-03',
    username: 'staff03',
    password: 'staff123',
    name: 'Rajeev Nair',
    staffId: 'EMP-SNT-301',
    department: 'Sanitation & Housekeeping',
    designation: 'Sanitation Supervisor',
    email: 'rajeev.sanit@smartcampus.edu',
    phone: '+91 98762 00003',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stf-04',
    username: 'staff04',
    password: 'staff123',
    name: 'Dr. Vasudevan',
    staffId: 'EMP-ACD-405',
    department: 'Academic Affairs',
    designation: 'Associate Dean of Academics',
    email: 'vasudevan.acad@smartcampus.edu',
    phone: '+91 98762 00004',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'stf-05',
    username: 'staff05',
    password: 'staff123',
    name: 'Jagdish Chauhan',
    staffId: 'EMP-TRN-509',
    department: 'Transport Division',
    designation: 'Transport Operations In-Charge',
    email: 'jagdish.trans@smartcampus.edu',
    phone: '+91 98762 00005',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ADMIN = {
  id: 'adm-01',
  username: 'admin',
  password: 'admin123',
  name: 'Dr. Rajeshwar Rao',
  adminId: 'ADM-DIR-001',
  designation: 'Dean of Student Welfare & Campus Operations',
  department: 'Administration',
  email: 'dean.welfare@smartcampus.edu',
  phone: '+91 98760 99999',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const INITIAL_COMPLAINTS = [
  {
    id: 'cmp-001',
    trackingId: 'CMP-2024-8192',
    title: 'Ceiling Fan Making Heavy Sparking Noise in Room 304',
    category: 'Electrical Issues',
    department: 'Electrical Maintenance',
    description: 'The ceiling fan in Room 304 Block-A emits a high pitch buzzing sound and threw spark flashes when set to regulator speed 4. It poses a serious fire hazard and prevents students from studying.',
    priority: 'Urgent',
    status: 'In Progress',
    studentId: 'ST2024-001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@smartcampus.edu',
    studentPhone: '+91 98761 00001',
    location: 'Hostel Block-A, Room 304',
    isConfidential: false,
    submissionDate: '2024-10-28T09:30:00Z',
    targetResolutionDate: '2024-10-29T18:00:00Z',
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Suresh Kumar',
    evidenceImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-28T09:30:00Z',
        performer: 'Aarav Sharma (Student)',
        remarks: 'Complaint registered via portal with picture evidence.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-28T10:15:00Z',
        performer: 'Admin Office',
        remarks: 'Assigned automatically to Electrical Maintenance division.'
      },
      {
        status: 'In Progress',
        timestamp: '2024-10-28T11:00:00Z',
        performer: 'Suresh Kumar (Electrical Staff)',
        remarks: 'Inspected regulator wiring. Capacitor needs replacement. Scheduled for 3:00 PM today.'
      }
    ],
    remarks: 'Capacitor replacement part dispatched from campus store. Work in progress.'
  },
  {
    id: 'cmp-002',
    trackingId: 'CMP-2024-7401',
    title: 'Water Cooler RO Filter Giving Foul Odor on 2nd Floor Block-C',
    category: 'Water Supply',
    department: 'Water & Plumbing Dept',
    description: 'The cold drinking water dispenser on the 2nd floor corridor of Gargi Hostel smells damp and water has a strange taste. Please replace the RO membrane urgently.',
    priority: 'High',
    status: 'Submitted',
    studentId: 'ST2024-002',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@smartcampus.edu',
    studentPhone: '+91 98761 00002',
    location: 'Hostel Block-C (Gargi), 2nd Floor Corridor',
    isConfidential: false,
    submissionDate: '2024-10-31T08:15:00Z',
    targetResolutionDate: '2024-11-01T12:00:00Z',
    assignedStaffId: null,
    assignedStaffName: 'Unassigned',
    evidenceImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-31T08:15:00Z',
        performer: 'Priya Patel (Student)',
        remarks: 'Complaint registered. Requesting water quality test.'
      }
    ],
    remarks: 'Awaiting inspection team assignment.'
  },
  {
    id: 'cmp-003',
    trackingId: 'CMP-2024-6311',
    title: 'Projector HDMI Audio/Video Flicker in Lecture Hall LH-201',
    category: 'Infrastructure',
    department: 'Campus Estate & Maintenance',
    description: 'The roof-mounted Epson projector in LH-201 keeps turning blue and disconnecting during daily lectures. Classes have to pause multiple times.',
    priority: 'Medium',
    status: 'Resolved',
    studentId: 'ST2024-003',
    studentName: 'Rohan Deshmukh',
    studentEmail: 'rohan.d@smartcampus.edu',
    studentPhone: '+91 98761 00003',
    location: 'Main Academic Complex, LH-201',
    isConfidential: false,
    submissionDate: '2024-10-25T14:20:00Z',
    targetResolutionDate: '2024-10-27T17:00:00Z',
    resolvedDate: '2024-10-26T16:30:00Z',
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Suresh Kumar',
    evidenceImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-25T14:20:00Z',
        performer: 'Rohan Deshmukh (Student)',
        remarks: 'Reported HDMI connection instability in LH-201.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-25T15:00:00Z',
        performer: 'Estate Office',
        remarks: 'Technician notified.'
      },
      {
        status: 'In Progress',
        timestamp: '2024-10-26T10:00:00Z',
        performer: 'Suresh Kumar',
        remarks: 'Replaced faulty 15-meter in-wall HDMI 2.0 cable with new braided fiber optic line.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-26T16:30:00Z',
        performer: 'Suresh Kumar',
        remarks: 'Tested with faculty laptop for 45 minutes continuous 4K stream. Issue resolved cleanly.'
      }
    ],
    remarks: 'Replaced in-wall cable. Faculty sign-off received.'
  },
  {
    id: 'cmp-004',
    trackingId: 'CMP-2024-5120',
    title: 'Unhygienic Food Serving & Lack of Hairnets in Campus South Mess',
    category: 'Canteen',
    department: 'Food & Catering Services',
    description: 'During dinner hours, servers were observed handling food without disposable gloves or hair nets. Multiple students noticed hair strands in vegetable curry.',
    priority: 'High',
    status: 'In Progress',
    studentId: 'ST2024-004',
    studentName: 'Sneha Kulkarni',
    studentEmail: 'sneha.k@smartcampus.edu',
    studentPhone: '+91 98761 00004',
    location: 'South Campus Dining Hall',
    isConfidential: true,
    submissionDate: '2024-10-29T21:00:00Z',
    targetResolutionDate: '2024-10-31T12:00:00Z',
    assignedStaffId: 'stf-02',
    assignedStaffName: 'Neeta Choudhary',
    evidenceImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-29T21:00:00Z',
        performer: 'Anonymous Student (Confidential)',
        remarks: 'Confidential report submitted with photograph.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-30T09:00:00Z',
        performer: 'Admin Office',
        remarks: 'Escalated to Chief Hostel Warden and Food Committee.'
      },
      {
        status: 'In Progress',
        timestamp: '2024-10-30T14:30:00Z',
        performer: 'Neeta Choudhary',
        remarks: 'Surprise inspection conducted. Warning issued to catering contractor. Mandatory hairnet policy enforced.'
      }
    ],
    remarks: 'Inspection carried out. Follow-up inspection scheduled for tomorrow.'
  },
  {
    id: 'cmp-005',
    trackingId: 'CMP-2024-4902',
    title: 'College Bus Route #12 Running 35 Minutes Late Consistently',
    category: 'Transportation',
    department: 'Transport Division',
    description: 'Bus #12 departing from Metro Station to Campus is consistently delayed by over 30 minutes every morning, causing 40+ students to miss first hour attendance.',
    priority: 'Medium',
    status: 'Under Review',
    studentId: 'ST2024-005',
    studentName: 'Vikramaditya Roy',
    studentEmail: 'vikram.roy@smartcampus.edu',
    studentPhone: '+91 98761 00005',
    location: 'City Route 12 - Metro Station Junction',
    isConfidential: false,
    submissionDate: '2024-10-30T10:00:00Z',
    targetResolutionDate: '2024-11-02T16:00:00Z',
    assignedStaffId: 'stf-05',
    assignedStaffName: 'Jagdish Chauhan',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-30T10:00:00Z',
        performer: 'Vikramaditya Roy (Student)',
        remarks: 'Reported timing mismatch and chronic delay.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-30T11:20:00Z',
        performer: 'Jagdish Chauhan (Transport)',
        remarks: 'Checking GPS tracking logs of vehicle KA-05-8821.'
      }
    ],
    remarks: 'Analyzing morning traffic bottleneck near Ring Road flyover.'
  },
  {
    id: 'cmp-006',
    trackingId: 'CMP-2024-3881',
    title: 'Severe Clogging in Washrooms of Central Library 1st Floor',
    category: 'Sanitation and Hygiene',
    department: 'Sanitation & Housekeeping',
    description: 'Water is overflowing from wash basins and two toilets are choked in the central library west wing, resulting in an unbearable foul smell on the entire floor.',
    priority: 'Urgent',
    status: 'Escalated',
    studentId: 'ST2024-006',
    studentName: 'Ananya Gupta',
    studentEmail: 'ananya.g@smartcampus.edu',
    studentPhone: '+91 98761 00006',
    location: 'Central Library, 1st Floor West Wing',
    isConfidential: false,
    submissionDate: '2024-10-27T08:00:00Z',
    targetResolutionDate: '2024-10-27T20:00:00Z',
    assignedStaffId: 'stf-03',
    assignedStaffName: 'Rajeev Nair',
    evidenceImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-27T08:00:00Z',
        performer: 'Ananya Gupta (Student)',
        remarks: 'Washroom flooding reported.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-27T08:45:00Z',
        performer: 'Sanitation Dept',
        remarks: 'Acknowledged.'
      },
      {
        status: 'Escalated',
        timestamp: '2024-10-28T10:00:00Z',
        performer: 'Dean of Student Affairs',
        remarks: 'Resolution delayed past 24-hour SLA. Escalated to Chief Sanitation Engineer for immediate deep clearing.'
      }
    ],
    remarks: 'Main drainage line blocked by construction debris. Emergency suction truck ordered.'
  },
  {
    id: 'cmp-007',
    trackingId: 'CMP-2024-2910',
    title: 'Missing Reference Textbooks for Machine Learning Course CS-602',
    category: 'Library',
    department: 'Library Administration',
    description: 'Only 2 copies of the prescribed textbook "Pattern Recognition & Machine Learning by Bishop" are available for a batch of 140 students. Please procure additional copies or e-book licenses.',
    priority: 'Medium',
    status: 'Resolved',
    studentId: 'ST2024-001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@smartcampus.edu',
    studentPhone: '+91 98761 00001',
    location: 'Central Library, Computer Science Stack',
    isConfidential: false,
    submissionDate: '2024-10-20T11:10:00Z',
    targetResolutionDate: '2024-10-25T18:00:00Z',
    resolvedDate: '2024-10-24T15:00:00Z',
    assignedStaffId: 'stf-04',
    assignedStaffName: 'Dr. Vasudevan',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-20T11:10:00Z',
        performer: 'Aarav Sharma (Student)',
        remarks: 'Requested book addition for semester curriculum.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-21T09:30:00Z',
        performer: 'Dr. Vasudevan',
        remarks: 'Checking institutional Springer & IEEE subscription.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-24T15:00:00Z',
        performer: 'Dr. Vasudevan',
        remarks: 'Procured 10 hard copies and activated campus-wide unlimited digital e-book access on the library portal.'
      }
    ],
    remarks: 'Access credentials and direct Springer link broadcasted to CS batch.'
  },
  {
    id: 'cmp-008',
    trackingId: 'CMP-2024-1922',
    title: 'Lab Air Conditioning Breakdown in Advanced Computing Center',
    category: 'Academics',
    department: 'Academic Affairs',
    description: 'Server racks and 60 high-performance workstations are overheating because both 5-ton split AC units in Lab 3 have stopped cooling. Machines are shutting down mid-simulation.',
    priority: 'Urgent',
    status: 'In Progress',
    studentId: 'ST2024-007',
    studentName: 'Karthik Raja',
    studentEmail: 'karthik.r@smartcampus.edu',
    studentPhone: '+91 98761 00007',
    location: 'Computer Center, Lab 3',
    isConfidential: false,
    submissionDate: '2024-10-29T13:45:00Z',
    targetResolutionDate: '2024-10-30T14:00:00Z',
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Suresh Kumar',
    evidenceImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-29T13:45:00Z',
        performer: 'Karthik Raja (Student)',
        remarks: 'Lab temperatures exceeded 38 degrees Celsius.'
      },
      {
        status: 'In Progress',
        timestamp: '2024-10-29T15:30:00Z',
        performer: 'Suresh Kumar',
        remarks: 'Gas recharge in progress and compressor servicing underway.'
      }
    ],
    remarks: 'Compressor 1 repaired. Unit 2 gas leak fix underway.'
  },
  {
    id: 'cmp-009',
    trackingId: 'CMP-2024-9104',
    title: 'Streetlights Not Working on North Campus Girls Hostel Pathway',
    category: 'Electrical Issues',
    department: 'Electrical Maintenance',
    description: 'Four consecutive street lamps on the walkway from the main academic building to Gargi hostel are non-functional, creating a completely dark, unsafe zone at night.',
    priority: 'Urgent',
    status: 'Under Review',
    studentId: 'ST2024-002',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@smartcampus.edu',
    studentPhone: '+91 98761 00002',
    location: 'North Walkway between Academic Block B and Hostel Block C',
    isConfidential: false,
    submissionDate: '2024-10-31T07:45:00Z',
    targetResolutionDate: '2024-11-01T18:00:00Z',
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Suresh Kumar',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-31T07:45:00Z',
        performer: 'Priya Patel (Student)',
        remarks: 'Safety hazard highlighted for evening return hours.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-31T08:30:00Z',
        performer: 'Campus Security & Electrical Team',
        remarks: 'High priority inspection scheduled for afternoon shift.'
      }
    ],
    remarks: 'Checking circuit breaker at distribution box DB-4.'
  },
  {
    id: 'cmp-010',
    trackingId: 'CMP-2024-8233',
    title: 'Wi-Fi Signal Strength Dropping to Zero in Block-B 2nd Floor',
    category: 'Hostel Facilities',
    department: 'Hostel Administration',
    description: 'Access Point AP-B-201 is continuously rebooting. Students are unable to access LMS or submit online assignments from their hostel study desks.',
    priority: 'Medium',
    status: 'Reopened',
    studentId: 'ST2024-003',
    studentName: 'Rohan Deshmukh',
    studentEmail: 'rohan.d@smartcampus.edu',
    studentPhone: '+91 98761 00003',
    location: 'Hostel Block-B, 2nd Floor',
    isConfidential: false,
    submissionDate: '2024-10-22T16:00:00Z',
    targetResolutionDate: '2024-10-25T12:00:00Z',
    assignedStaffId: 'stf-02',
    assignedStaffName: 'Neeta Choudhary',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-22T16:00:00Z',
        performer: 'Rohan Deshmukh (Student)',
        remarks: 'Reported erratic hostel Wi-Fi connection.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-24T11:00:00Z',
        performer: 'IT Support',
        remarks: 'Router rebooted remotely and test ping verified.'
      },
      {
        status: 'Reopened',
        timestamp: '2024-10-25T19:30:00Z',
        performer: 'Rohan Deshmukh (Student)',
        remarks: 'Reopened by student: The router drops offline again whenever more than 10 devices connect.'
      }
    ],
    remarks: 'Hardware hardware fault suspected. Network team to replace router with enterprise PoE AP.'
  },
  {
    id: 'cmp-011',
    trackingId: 'CMP-2024-7112',
    title: 'Cracked Window Panes in Civil Workshop Drawing Hall',
    category: 'Infrastructure',
    department: 'Campus Estate & Maintenance',
    description: 'During recent storm, tree branch shattered the glass pane on window #4. Glass shards on the floor near drafting tables pose an injury hazard.',
    priority: 'High',
    status: 'Resolved',
    studentId: 'ST2024-005',
    studentName: 'Vikramaditya Roy',
    studentEmail: 'vikram.roy@smartcampus.edu',
    studentPhone: '+91 98761 00005',
    location: 'Civil Engineering Block, Drawing Hall 1',
    isConfidential: false,
    submissionDate: '2024-10-18T10:00:00Z',
    targetResolutionDate: '2024-10-20T17:00:00Z',
    resolvedDate: '2024-10-19T16:00:00Z',
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Suresh Kumar',
    evidenceImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-18T10:00:00Z',
        performer: 'Vikramaditya Roy (Student)',
        remarks: 'Glass hazard reported.'
      },
      {
        status: 'In Progress',
        timestamp: '2024-10-18T12:00:00Z',
        performer: 'Maintenance Dept',
        remarks: 'Carpentry and glazing vendor called.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-19T16:00:00Z',
        performer: 'Estate Maintenance Team',
        remarks: 'New laminated safety glass installed, area thoroughly swept.'
      }
    ],
    remarks: 'Replaced with 6mm toughened safety glass.'
  },
  {
    id: 'cmp-012',
    trackingId: 'CMP-2024-6540',
    title: 'Incorrect Mid-Term Marks Uploaded on Student ERP Portal',
    category: 'Academics',
    department: 'Academic Affairs',
    description: 'The marks uploaded for course MAT-201 (Applied Calculus) do not reflect the re-evaluation signed by Prof. K. Verma. Total shows 18 instead of 26.',
    priority: 'Medium',
    status: 'Under Review',
    studentId: 'ST2024-004',
    studentName: 'Sneha Kulkarni',
    studentEmail: 'sneha.k@smartcampus.edu',
    studentPhone: '+91 98761 00004',
    location: 'Dean Academics Office',
    isConfidential: false,
    submissionDate: '2024-10-30T15:00:00Z',
    targetResolutionDate: '2024-11-03T18:00:00Z',
    assignedStaffId: 'stf-04',
    assignedStaffName: 'Dr. Vasudevan',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-30T15:00:00Z',
        performer: 'Sneha Kulkarni (Student)',
        remarks: 'Submitted copy of signed marksheet correction.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-31T09:15:00Z',
        performer: 'Dr. Vasudevan',
        remarks: 'Cross-verifying with original physical evaluation sheet from Math department.'
      }
    ],
    remarks: 'Awaiting confirmation from course coordinator.'
  },
  {
    id: 'cmp-013',
    trackingId: 'CMP-2024-5890',
    title: 'Request for Personal Counseling Slot on Weekend (Declined)',
    category: 'Other Campus Issues',
    department: 'General Student Affairs',
    description: 'Requesting personal academic counseling on Sunday midnight.',
    priority: 'Low',
    status: 'Rejected',
    studentId: 'ST2024-008',
    studentName: 'Divya Nambiar',
    studentEmail: 'divya.n@smartcampus.edu',
    studentPhone: '+91 98761 00008',
    location: 'Student Health & Wellness Center',
    isConfidential: true,
    submissionDate: '2024-10-15T22:00:00Z',
    targetResolutionDate: '2024-10-17T18:00:00Z',
    resolvedDate: '2024-10-16T11:00:00Z',
    assignedStaffId: 'stf-04',
    assignedStaffName: 'Dr. Vasudevan',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-15T22:00:00Z',
        performer: 'Divya Nambiar (Student)',
        remarks: 'Requested after-hours slot.'
      },
      {
        status: 'Rejected',
        timestamp: '2024-10-16T11:00:00Z',
        performer: 'General Student Affairs Office',
        remarks: 'Rejected: Standard counseling services are available Monday through Saturday 9 AM to 6 PM. For 24/7 urgent mental health support, please contact the campus medical helpline.'
      }
    ],
    remarks: 'Invalid time slot requested. Re-directed to official medical emergency hotline.'
  },
  {
    id: 'cmp-014',
    trackingId: 'CMP-2024-4412',
    title: 'Broken Dumbbells and Treadmill Malfunction in Campus Gym',
    category: 'Other Campus Issues',
    department: 'General Student Affairs',
    description: 'Treadmill #2 belt slips suddenly at speed 8+, which is dangerous. Also two 15kg rubber dumbbells have cracked grips.',
    priority: 'Medium',
    status: 'Submitted',
    studentId: 'ST2024-009',
    studentName: 'Mohit Saini',
    studentEmail: 'mohit.saini@smartcampus.edu',
    studentPhone: '+91 98761 00009',
    location: 'Sports Complex Gymnasium',
    isConfidential: false,
    submissionDate: '2024-10-31T11:00:00Z',
    targetResolutionDate: '2024-11-03T18:00:00Z',
    assignedStaffId: null,
    assignedStaffName: 'Unassigned',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-31T11:00:00Z',
        performer: 'Mohit Saini (Student)',
        remarks: 'Gym equipment wear and tear reported.'
      }
    ],
    remarks: 'Forwarded to Physical Director for maintenance inspection.'
  },
  {
    id: 'cmp-015',
    trackingId: 'CMP-2024-3209',
    title: 'Hostel Washing Machine #3 Vibrating Violently and Leaking Water',
    category: 'Hostel Facilities',
    department: 'Hostel Administration',
    description: 'The front load washing machine in Block-A laundry room shakes violently during spin cycle and leaks detergent water all over the floor.',
    priority: 'High',
    status: 'In Progress',
    studentId: 'ST2024-001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@smartcampus.edu',
    studentPhone: '+91 98761 00001',
    location: 'Hostel Block-A Basement Laundry Room',
    isConfidential: false,
    submissionDate: '2024-10-29T17:15:00Z',
    targetResolutionDate: '2024-10-31T18:00:00Z',
    assignedStaffId: 'stf-02',
    assignedStaffName: 'Neeta Choudhary',
    evidenceImage: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80',
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-29T17:15:00Z',
        performer: 'Aarav Sharma (Student)',
        remarks: 'Laundry room hazard reported.'
      },
      {
        status: 'In Progress',
        timestamp: '2024-10-30T10:00:00Z',
        performer: 'Neeta Choudhary',
        remarks: 'Drum bearing worn out. Warranty repair technician requested from IFB service center.'
      }
    ],
    remarks: 'Authorized technician visiting campus on Friday.'
  },
  {
    id: 'cmp-016',
    trackingId: 'CMP-2024-2198',
    title: 'Sanitary Napkin Vending Machine Out of Stock in Block-D',
    category: 'Sanitation and Hygiene',
    department: 'Sanitation & Housekeeping',
    description: 'The automated vending machine on the ground floor of Maitreyi Hostel has been empty for over 5 days. Coin insertion mechanism also gets stuck.',
    priority: 'Urgent',
    status: 'Resolved',
    studentId: 'ST2024-006',
    studentName: 'Ananya Gupta',
    studentEmail: 'ananya.g@smartcampus.edu',
    studentPhone: '+91 98761 00006',
    location: 'Hostel Block-D (Maitreyi), Ground Floor',
    isConfidential: false,
    submissionDate: '2024-10-26T09:00:00Z',
    targetResolutionDate: '2024-10-26T21:00:00Z',
    resolvedDate: '2024-10-26T17:00:00Z',
    assignedStaffId: 'stf-03',
    assignedStaffName: 'Rajeev Nair',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-26T09:00:00Z',
        performer: 'Ananya Gupta (Student)',
        remarks: 'Urgent hygiene supply shortage reported.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-26T17:00:00Z',
        performer: 'Rajeev Nair',
        remarks: 'Refilled machine with 100 units and calibrated coin receiver sensor.'
      }
    ],
    remarks: 'Refilled and functional. Routine weekly inspection schedule set.'
  },
  {
    id: 'cmp-017',
    trackingId: 'CMP-2024-1502',
    title: 'Stray Dogs Entering Food Court Area in Evening',
    category: 'Other Campus Issues',
    department: 'General Student Affairs',
    description: 'Multiple stray dogs enter the open dining patio near cafeteria around 7 PM, creating fear among students and knocking over food trays.',
    priority: 'Medium',
    status: 'Under Review',
    studentId: 'ST2024-010',
    studentName: 'Kavya Pillai',
    studentEmail: 'kavya.p@smartcampus.edu',
    studentPhone: '+91 98761 00010',
    location: 'Main Food Court Courtyard',
    isConfidential: false,
    submissionDate: '2024-10-31T09:30:00Z',
    targetResolutionDate: '2024-11-03T18:00:00Z',
    assignedStaffId: 'stf-02',
    assignedStaffName: 'Neeta Choudhary',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-31T09:30:00Z',
        performer: 'Kavya Pillai (Student)',
        remarks: 'Safety & hygiene concern raised regarding stray animals.'
      },
      {
        status: 'Under Review',
        timestamp: '2024-10-31T11:00:00Z',
        performer: 'Campus Security',
        remarks: 'Patrol guards instructed to install perimeter mesh gate at food court access lane.'
      }
    ],
    remarks: 'Security team procuring boundary fencing.'
  },
  {
    id: 'cmp-018',
    trackingId: 'CMP-2024-9901',
    title: 'Broken Commode Flush Valve Causing Continuous Water Waste',
    category: 'Water Supply',
    department: 'Water & Plumbing Dept',
    description: 'Flush valve in cubicle 3 of Block-B Ground Floor washroom is stuck open, wasting hundreds of liters of water continuously into the drain.',
    priority: 'High',
    status: 'Resolved',
    studentId: 'ST2024-003',
    studentName: 'Rohan Deshmukh',
    studentEmail: 'rohan.d@smartcampus.edu',
    studentPhone: '+91 98761 00003',
    location: 'Hostel Block-B, Ground Floor Restroom',
    isConfidential: false,
    submissionDate: '2024-10-21T07:30:00Z',
    targetResolutionDate: '2024-10-21T19:30:00Z',
    resolvedDate: '2024-10-21T14:15:00Z',
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Suresh Kumar',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-21T07:30:00Z',
        performer: 'Rohan Deshmukh (Student)',
        remarks: 'Reported water wastage.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-21T14:15:00Z',
        performer: 'Plumbing Unit',
        remarks: 'Dual flush pneumatic valve replaced with new unit.'
      }
    ],
    remarks: 'Fixed promptly. No further leakage.'
  },
  {
    id: 'cmp-019',
    trackingId: 'CMP-2024-8834',
    title: 'Overdue Assignment Submission Server Timeout during Exam Week',
    category: 'Academics',
    department: 'Academic Affairs',
    description: 'The Moodle server crashed right at 11:55 PM during database assignment submission deadline, preventing 25 students from uploading their archives.',
    priority: 'Urgent',
    status: 'Resolved',
    studentId: 'ST2024-001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@smartcampus.edu',
    studentPhone: '+91 98761 00001',
    location: 'Online LMS / Academic Server',
    isConfidential: false,
    submissionDate: '2024-10-14T23:58:00Z',
    targetResolutionDate: '2024-10-15T12:00:00Z',
    resolvedDate: '2024-10-15T09:30:00Z',
    assignedStaffId: 'stf-04',
    assignedStaffName: 'Dr. Vasudevan',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-14T23:58:00Z',
        performer: 'Aarav Sharma (Student)',
        remarks: 'Reported timeout error screenshot.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-15T09:30:00Z',
        performer: 'Dr. Vasudevan',
        remarks: 'Deadline extended by 24 hours for all enrolled students. Cloud server RAM doubled from 16GB to 32GB.'
      }
    ],
    remarks: 'Deadline officially extended and notification sent via campus portal.'
  },
  {
    id: 'cmp-020',
    trackingId: 'CMP-2024-7721',
    title: 'Bus Driver Reckless Driving and Speeding on Highway Route 7',
    category: 'Transportation',
    department: 'Transport Division',
    description: 'Bus #7 driver was driving at excessive speeds and overtaking abruptly on the highway this morning, causing severe concern among student passengers.',
    priority: 'Urgent',
    status: 'In Progress',
    studentId: 'ST2024-002',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@smartcampus.edu',
    studentPhone: '+91 98761 00002',
    location: 'Campus Bus Route 7, National Highway Stretch',
    isConfidential: true,
    submissionDate: '2024-10-29T10:15:00Z',
    targetResolutionDate: '2024-10-30T17:00:00Z',
    assignedStaffId: 'stf-05',
    assignedStaffName: 'Jagdish Chauhan',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-29T10:15:00Z',
        performer: 'Anonymous Student (Confidential)',
        remarks: 'Reported reckless bus driving.'
      },
      {
        status: 'In Progress',
        timestamp: '2024-10-29T14:00:00Z',
        performer: 'Jagdish Chauhan',
        remarks: 'Summoned driver for inquiry. Speed governor telematics telemetry logs being reviewed.'
      }
    ],
    remarks: 'Driver removed from highway route pending formal safety audit.'
  },
  {
    id: 'cmp-021',
    trackingId: 'CMP-2024-6619',
    title: 'Damaged Wooden Floorboards in Badminton Court 2',
    category: 'Infrastructure',
    department: 'Campus Estate & Maintenance',
    description: 'Two synthetic-finished wooden planks have warped and popped up in badminton court 2, creating an ankle tripping risk during matches.',
    priority: 'Medium',
    status: 'Submitted',
    studentId: 'ST2024-007',
    studentName: 'Karthik Raja',
    studentEmail: 'karthik.r@smartcampus.edu',
    studentPhone: '+91 98761 00007',
    location: 'Indoor Sports Arena, Badminton Court 2',
    isConfidential: false,
    submissionDate: '2024-10-31T10:30:00Z',
    targetResolutionDate: '2024-11-04T18:00:00Z',
    assignedStaffId: null,
    assignedStaffName: 'Unassigned',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-31T10:30:00Z',
        performer: 'Karthik Raja (Student)',
        remarks: 'Damage reported with request for urgent repair.'
      }
    ],
    remarks: 'Pending sports officer inspection.'
  },
  {
    id: 'cmp-022',
    trackingId: 'CMP-2024-5544',
    title: 'Non-Functional Drinking Water Tap Near Mechanical Workshop',
    category: 'Water Supply',
    department: 'Water & Plumbing Dept',
    description: 'The outdoor water tap right outside the welding workshop is leaking constantly and has zero pressure. Students have to walk 400 meters to get water.',
    priority: 'Low',
    status: 'Resolved',
    studentId: 'ST2024-003',
    studentName: 'Rohan Deshmukh',
    studentEmail: 'rohan.d@smartcampus.edu',
    studentPhone: '+91 98761 00003',
    location: 'Mechanical Block, Workshop Exit 2',
    isConfidential: false,
    submissionDate: '2024-10-12T09:00:00Z',
    targetResolutionDate: '2024-10-15T18:00:00Z',
    resolvedDate: '2024-10-13T15:30:00Z',
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Suresh Kumar',
    evidenceImage: null,
    history: [
      {
        status: 'Submitted',
        timestamp: '2024-10-12T09:00:00Z',
        performer: 'Rohan Deshmukh (Student)',
        remarks: 'Water tap malfunction reported.'
      },
      {
        status: 'Resolved',
        timestamp: '2024-10-13T15:30:00Z',
        performer: 'Plumbing Team',
        remarks: 'Replaced brass bib cock and cleared lime scale from intake pipe.'
      }
    ],
    remarks: 'Repaired and flow verified.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    userId: 'ST2024-001',
    userRole: 'student',
    title: 'Status Updated: Fan Repair',
    message: 'Your complaint CMP-2024-8192 status changed to "In Progress". Suresh Kumar has been assigned.',
    complaintId: 'cmp-001',
    trackingId: 'CMP-2024-8192',
    timestamp: '2024-10-28T11:00:00Z',
    isRead: false
  },
  {
    id: 'notif-002',
    userId: 'ST2024-001',
    userRole: 'student',
    title: 'Complaint Resolved: CS Books',
    message: 'Your complaint CMP-2024-2910 has been resolved! Unlimited digital e-book access is now active.',
    complaintId: 'cmp-007',
    trackingId: 'CMP-2024-2910',
    timestamp: '2024-10-24T15:00:00Z',
    isRead: true
  },
  {
    id: 'notif-003',
    userId: 'stf-01',
    userRole: 'staff',
    title: 'New Complaint Assigned',
    message: 'You have been assigned urgent complaint CMP-2024-8192 (Ceiling Fan Sparking Noise).',
    complaintId: 'cmp-001',
    trackingId: 'CMP-2024-8192',
    timestamp: '2024-10-28T10:15:00Z',
    isRead: false
  },
  {
    id: 'notif-004',
    userId: 'adm-01',
    userRole: 'admin',
    title: 'Complaint Escalation Alert',
    message: 'Complaint CMP-2024-3881 (Washrooms Library) has breached SLA and has been escalated.',
    complaintId: 'cmp-006',
    trackingId: 'CMP-2024-3881',
    timestamp: '2024-10-28T10:00:00Z',
    isRead: false
  },
  {
    id: 'notif-005',
    userId: 'ST2024-003',
    userRole: 'student',
    title: 'Complaint Reopened',
    message: 'Your complaint CMP-2024-8233 (Hostel Wi-Fi) status has been marked as Reopened for deeper investigation.',
    complaintId: 'cmp-010',
    trackingId: 'CMP-2024-8233',
    timestamp: '2024-10-25T19:30:00Z',
    isRead: false
  }
];
