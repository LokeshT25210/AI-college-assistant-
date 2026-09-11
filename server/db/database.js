const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'campus_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data generator
function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('campus123', salt);

  return {
    users: [
      {
        id: 'usr-student-01',
        name: 'Alex Kumar',
        email: 'alex.kumar@campus.edu',
        password: passwordHash,
        role: 'student',
        studentId: 'CS-2023-0489',
        department: 'Computer Science & Engineering',
        year: '3rd Year (Semester 5)',
        regulation: 'R20 Autonomous',
        hostel: 'Block B - Room 204',
        cgpa: 8.42,
        attendance: 68.5,
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-02',
        name: 'Priya Sharma',
        email: 'priya.sharma@campus.edu',
        password: passwordHash,
        role: 'student',
        studentId: 'EC-2023-0112',
        department: 'Electronics & Communication',
        year: '3rd Year (Semester 5)',
        regulation: 'R23 Autonomous',
        hostel: 'Block A - Room 118',
        cgpa: 9.15,
        attendance: 84.0,
        phone: '+91 98765 88990',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-std',
        name: 'Priya Sharma',
        email: 'student@mictech.ac.in',
        password: passwordHash,
        role: 'student',
        studentId: '21H71A0502',
        department: 'Computer Science & Engineering',
        year: 'B.Tech 3rd Year (Semester 5)',
        regulation: 'R20 Autonomous',
        hostel: 'Day Scholar - Bus Route 01 (Vijayawada)',
        cgpa: 8.80,
        attendance: 84.0,
        phone: '+91 98765 88990',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-03',
        name: 'K. Sai Rahul',
        email: '21h71a0501@mictech.ac.in',
        password: passwordHash,
        role: 'student',
        studentId: '21H71A0501',
        department: 'Computer Science & Engineering (AI&ML)',
        year: 'B.Tech 4th Year (Semester 7)',
        regulation: 'R20 Autonomous',
        hostel: 'Day Scholar - Bus Route 01 (Vijayawada)',
        cgpa: 9.40,
        attendance: 91.5,
        phone: '+91 98765 11223',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: '2022-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-04',
        name: 'Ananya Reddy',
        email: '23h71a1205@mictech.ac.in',
        password: passwordHash,
        role: 'student',
        studentId: '23H71A1205',
        department: 'Information Technology',
        year: 'B.Tech 2nd Year (Semester 3)',
        regulation: 'R23 Autonomous',
        hostel: 'Campus Girls Hostel - Saraswati Block',
        cgpa: 8.10,
        attendance: 72.0,
        phone: '+91 98765 33445',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        createdAt: '2024-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-05',
        name: 'M. Karthik Varma',
        email: '22h71a0408@mictech.ac.in',
        password: passwordHash,
        role: 'student',
        studentId: '22H71A0408',
        department: 'Electronics & Communication Engineering',
        year: 'B.Tech 3rd Year (Semester 5)',
        regulation: 'R20 Autonomous',
        hostel: 'Day Scholar - Bus Route 05 (Guntur)',
        cgpa: 7.20,
        attendance: 58.0,
        phone: '+91 98765 55667',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-06',
        name: 'Sneha Patel',
        email: 'sneha.patel@campus.edu',
        password: passwordHash,
        role: 'student',
        studentId: '21H71A1202',
        department: 'Information Technology',
        year: 'B.Tech 4th Year (Semester 7)',
        regulation: 'R20 Autonomous',
        hostel: 'Day Scholar - Bus Route 08 (Ibrahimpatnam)',
        cgpa: 8.85,
        attendance: 86.5,
        phone: '+91 98765 77889',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        createdAt: '2022-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-07',
        name: 'Rohan Das',
        email: 'rohan.das@campus.edu',
        password: passwordHash,
        role: 'student',
        studentId: '24H71A0101',
        department: 'Civil Engineering',
        year: 'B.Tech 1st Year (Semester 1)',
        regulation: 'R23 Autonomous',
        hostel: 'Campus Boys Hostel - Block A',
        cgpa: 7.90,
        attendance: 78.0,
        phone: '+91 98765 99001',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-08',
        name: 'T. Harika',
        email: '22h71a0204@mictech.ac.in',
        password: passwordHash,
        role: 'student',
        studentId: '22H71A0204',
        department: 'Electrical & Electronics Engineering',
        year: 'B.Tech 3rd Year (Semester 5)',
        regulation: 'R20 Autonomous',
        hostel: 'Campus Girls Hostel - Saraswati Block',
        cgpa: 8.60,
        attendance: 81.0,
        phone: '+91 98765 22334',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: '2023-08-01T09:00:00.000Z'
      },
      {
        id: 'usr-student-9505',
        name: 'Lokesh',
        email: 'mogililokesh10@gmail.com',
        password: passwordHash,
        role: 'student',
        isEnrolled: true,
        affiliation: 'Enrolled College Student',
        studentId: '23H71A0590',
        department: 'Computer Science & Engineering',
        year: 'B.Tech 1st Year (Semester 1)',
        section: 'Section A',
        regulation: 'R23 Autonomous',
        residenceType: 'Day Scholar',
        hostel: 'Route 01 - Vijayawada (Benz Circle & High Court)',
        cgpa: 8.5,
        attendance: 85,
        phone: '7386962418',
        gender: 'Male',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-09-11T05:58:19.505Z'
      },
      {
        id: 'usr-admin-principal',
        name: 'Dr. T. Vamsee Kiran',
        email: 'principal@mictech.ac.in',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-001',
        designation: 'Principal & Head of Institution',
        department: "Principal's Office & Administration",
        phone: '+91 8678 273535',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2018-06-01T09:00:00.000Z'
      },
      {
        id: 'usr-admin-01',
        name: 'Dr. S. Raman',
        email: 'admin@campus.edu',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-002',
        designation: 'Registrar & Chief Grievance Officer',
        department: 'Campus Administration',
        phone: '+91 98401 23456',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        createdAt: '2020-01-15T09:00:00.000Z'
      },
      {
        id: 'usr-admin-coe',
        name: 'Dr. K. Srinivas',
        email: 'coe@mictech.ac.in',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-003',
        designation: 'Controller of Examinations (CoE)',
        department: 'Examination Cell',
        phone: '+91 8678 273536',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2019-03-10T09:00:00.000Z'
      },
      {
        id: 'usr-admin-02',
        name: 'Prof. Vikram Mehta',
        email: 'finance@campus.edu',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-004',
        designation: 'Finance Officer',
        department: 'Finance & Accounts',
        phone: '+91 98402 34567',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        createdAt: '2021-03-10T09:00:00.000Z'
      },
      {
        id: 'usr-admin-hod-cse',
        name: 'Dr. P. Sunitha',
        email: 'hod.cse@mictech.ac.in',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-005',
        designation: 'Head of Department (HOD) - CSE',
        department: 'Computer Science & Engineering',
        phone: '+91 8678 273540',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        createdAt: '2019-07-01T09:00:00.000Z'
      },
      {
        id: 'usr-admin-hod-ece',
        name: 'Dr. M. Raghava',
        email: 'hod.ece@mictech.ac.in',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-006',
        designation: 'Head of Department (HOD) - ECE',
        department: 'Electronics & Communication Engineering',
        phone: '+91 8678 273542',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2020-08-15T09:00:00.000Z'
      },
      {
        id: 'usr-admin-warden',
        name: 'Capt. R. Rajesh',
        email: 'warden@mictech.ac.in',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-007',
        designation: 'Chief Hostel Warden',
        department: 'Hostel Administration',
        phone: '+91 98403 45678',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2021-01-10T09:00:00.000Z'
      },
      {
        id: 'usr-admin-transport',
        name: 'G. Venkat Rao',
        email: 'transport@mictech.ac.in',
        password: passwordHash,
        role: 'admin',
        staffId: 'EMP-008',
        designation: 'Transport & Fleet Manager',
        department: 'Campus Transport & Fleet Management',
        phone: '+91 98404 56789',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        createdAt: '2019-11-20T09:00:00.000Z'
      }
    ],
    requests: [
      {
        ticketId: 'TKT-2026-1042',
        studentId: 'usr-student-01',
        studentName: 'Alex Kumar',
        studentRollNo: 'CS-2023-0489',
        studentEmail: 'alex.kumar@campus.edu',
        category: 'Fees',
        department: 'Finance & Accounts',
        priority: 'High',
        title: 'Semester 5 Tuition Fee deducted but portal showing unpaid',
        description: 'I paid my semester fee of ₹45,000 on Sep 07 via HDFC NetBanking (UTR: HDFC009823101). The amount was deducted from my account, but the fee payment status in the portal still indicates UNPAID.',
        status: 'In Progress',
        urgencyReason: 'Late fine will be triggered if not reconciled before deadline.',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        timeline: [
          {
            stage: 'Submitted',
            timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
            actor: 'Alex Kumar (Student)',
            note: 'Ticket automatically classified as High Priority (Finance) via Smart Campus AI-to-Action engine.'
          },
          {
            stage: 'Under Review',
            timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
            actor: 'Prof. Vikram Mehta (Finance Officer)',
            note: 'Received UTR HDFC009823101. Forwarded to HDFC Payment Gateway settlement desk for batch reconciliation.'
          },
          {
            stage: 'In Progress',
            timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
            actor: 'Finance Accounts Desk',
            note: 'Settlement confirmed by bank. Ledger update queued for midnight batch sync.'
          }
        ],
        adminNotes: 'Transaction batch acknowledged by gateway. Auto-clearance pending overnight batch sync.',
        resolvedAt: null
      },
      {
        ticketId: 'TKT-2026-0985',
        studentId: 'usr-student-01',
        studentName: 'Alex Kumar',
        studentRollNo: 'CS-2023-0489',
        studentEmail: 'alex.kumar@campus.edu',
        category: 'Hostel',
        department: 'Hostel Administration',
        priority: 'Medium',
        title: 'Ceiling fan making screeching noise and regulator broken in Room 204',
        description: 'Room 204, Block B ceiling fan has stopped rotating smoothly and regulator is non-responsive.',
        status: 'Resolved',
        urgencyReason: 'Hostel resident comfort and ventilation.',
        createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        timeline: [
          {
            stage: 'Submitted',
            timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
            actor: 'Alex Kumar (Student)',
            note: 'Created via AI Campus Assistant.'
          },
          {
            stage: 'Under Review',
            timestamp: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
            actor: 'Hostel Warden Block B',
            note: 'Maintenance job scheduled for afternoon electrician rounds.'
          },
          {
            stage: 'In Progress',
            timestamp: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
            actor: 'Campus Electrical Maintenance',
            note: 'Electrician assigned with replacement capacitor and stepped regulator unit.'
          },
          {
            stage: 'Resolved',
            timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
            actor: 'Hostel Warden Block B',
            note: 'Fan bearing replaced and tested. Resident confirmed working condition.'
          }
        ],
        adminNotes: 'Replaced capacitor and fan regulator switch. Signature logged.',
        resolvedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
      },
      {
        ticketId: 'TKT-2026-1011',
        studentId: 'usr-student-02',
        studentName: 'Priya Sharma',
        studentRollNo: 'EC-2023-0112',
        studentEmail: 'priya.sharma@campus.edu',
        category: 'Certificates',
        department: 'Student Affairs & Certificates',
        priority: 'Low',
        title: 'Bonafide Certificate request for passport application',
        description: 'Requesting official signed bonafide certificate stating current enrollment in B.Tech ECE for passport renewal.',
        status: 'Resolved',
        urgencyReason: 'Passport office appointment scheduled next Tuesday.',
        createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        timeline: [
          {
            stage: 'Submitted',
            timestamp: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
            actor: 'Priya Sharma (Student)',
            note: 'Submitted certificate issuance request.'
          },
          {
            stage: 'In Progress',
            timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
            actor: 'Student Records Section',
            note: 'Verification of academic record completed.'
          },
          {
            stage: 'Resolved',
            timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
            actor: 'Dr. S. Raman (Registrar)',
            note: 'Digital bonafide certificate with QR code issued and attached to student portal.'
          }
        ],
        adminNotes: 'Digital certificate issued: CERT-BF-2026-4412.',
        resolvedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      },
      {
        ticketId: 'TKT-2026-1055',
        studentId: 'usr-student-02',
        studentName: 'Priya Sharma',
        studentRollNo: 'EC-2023-0112',
        studentEmail: 'priya.sharma@campus.edu',
        category: 'Fees',
        department: 'Finance & Accounts',
        priority: 'High',
        title: 'Exam fee deducted twice from UPI but receipt generated only once',
        description: 'During online exam registration, first payment errored out at UPI gateway but was debited. Second payment succeeded. Need refund of ₹1,500.',
        status: 'Under Review',
        urgencyReason: 'Double debit on student savings account.',
        createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        timeline: [
          {
            stage: 'Submitted',
            timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
            actor: 'Priya Sharma (Student)',
            note: 'Auto-escalated from AI Chat regarding duplicate payment.'
          },
          {
            stage: 'Under Review',
            timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
            actor: 'Prof. Vikram Mehta (Finance Officer)',
            note: 'Validating duplicate reference with bank payment switch.'
          }
        ],
        adminNotes: 'Duplicate charge verified. Initiating merchant reversal.',
        resolvedAt: null
      },
      {
        ticketId: 'TKT-2026-1060',
        studentId: 'usr-student-01',
        studentName: 'Alex Kumar',
        studentRollNo: 'CS-2023-0489',
        studentEmail: 'alex.kumar@campus.edu',
        category: 'Attendance',
        department: 'Academic Affairs',
        priority: 'Medium',
        title: 'Medical condonation request for viral fever absence (Sep 01 - Sep 06)',
        description: 'Seeking attendance condonation for 6 days absence due to viral fever. Attaching medical certificate and fitness certificate from campus health clinic.',
        status: 'Submitted',
        urgencyReason: 'Attendance margin currently at 68.5% requiring condonation to meet 75% exam cutoff.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        timeline: [
          {
            stage: 'Submitted',
            timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
            actor: 'Alex Kumar (Student)',
            note: 'Submitted attendance condonation application via assistant escalation.'
          }
        ],
        adminNotes: null,
        resolvedAt: null
      }
    ],
    announcements: [
      {
        id: 'ann-01',
        title: 'End-Semester Examination Schedule Announced',
        date: '2026-09-08',
        category: 'Exams',
        summary: 'Final timetable for odd-semester 2026 examinations published on exam portal. Hall ticket download opens Sep 15.'
      },
      {
        id: 'ann-02',
        title: 'Tuition Fee Payment Window Extended by 5 Days',
        date: '2026-09-06',
        category: 'Fees',
        summary: 'In view of bank holiday weekend, tuition fee without late fee has been extended to Sep 18, 2026.'
      },
      {
        id: 'ann-03',
        title: 'Hostel Maintenance & Pest Control Schedule',
        date: '2026-09-04',
        category: 'Hostel',
        summary: 'Routine maintenance and electrical safety audit for Blocks A, B, and C during Sep 12-14.'
      }
    ]
  };
}

class Database {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, resetting to initial seed:', err);
      this.data = getInitialData();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to persist database to file:', err);
    }
  }

  // Users
  getUsers() {
    return this.data.users;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmail(email) {
    if (!email) return null;
    const clean = email.toLowerCase().trim();

    // 1. Direct email match
    let found = this.data.users.find(u => u.email.toLowerCase() === clean);
    if (found) return found;

    // 2. Student ID or Roll Number match
    found = this.data.users.find(u => u.studentId && u.studentId.toLowerCase().trim() === clean);
    if (found) return found;

    // 3. Staff ID match
    found = this.data.users.find(u => u.staffId && u.staffId.toLowerCase().trim() === clean);
    if (found) return found;

    // 4. Email starts with Roll Number (e.g., 21h71a0501@mictech.ac.in -> 21H71A0501)
    if (clean.includes('@')) {
      const rollPart = clean.split('@')[0].trim();
      found = this.data.users.find(u => u.studentId && u.studentId.toLowerCase().trim() === rollPart);
      if (found) return found;
    }

    // 5. Common Institutional Aliases
    const ALIAS_MAP = {
      'student@mictech.ac.in': 'student@mictech.ac.in',
      'priya.sharma@campus.edu': 'priya.sharma@campus.edu',
      'coe@mictech.ac.in': 'coe@mictech.ac.in',
      'admin@mictech.ac.in': 'coe@mictech.ac.in',
      'registrar@mictech.ac.in': 'admin@campus.edu',
      'admin@campus.edu': 'admin@campus.edu',
      'finance@mictech.ac.in': 'finance@campus.edu',
      'finance@campus.edu': 'finance@campus.edu',
      'hod.cse@mictech.ac.in': 'hod.cse@mictech.ac.in',
      'cse.hod@mictech.ac.in': 'hod.cse@mictech.ac.in',
      'hod.ece@mictech.ac.in': 'hod.ece@mictech.ac.in',
      'ece.hod@mictech.ac.in': 'hod.ece@mictech.ac.in',
      'warden@mictech.ac.in': 'warden@mictech.ac.in',
      'hostel.warden@mictech.ac.in': 'warden@mictech.ac.in'
    };

    if (ALIAS_MAP[clean]) {
      const targetEmail = ALIAS_MAP[clean];
      return this.data.users.find(u => u.email.toLowerCase() === targetEmail);
    }

    return null;
  }

  createUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  // Requests / Tickets
  getRequests(filter = {}) {
    let list = [...this.data.requests];
    if (filter.studentId) {
      list = list.filter(r => r.studentId === filter.studentId);
    }
    if (filter.department) {
      list = list.filter(r => r.department.toLowerCase() === filter.department.toLowerCase());
    }
    if (filter.category) {
      list = list.filter(r => r.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.status) {
      list = list.filter(r => r.status.toLowerCase() === filter.status.toLowerCase());
    }
    // Sort descending by creation date
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getRequestById(ticketId) {
    return this.data.requests.find(r => r.ticketId === ticketId);
  }

  createRequest(reqData) {
    // Generate next ticket ID: TKT-2026-XXXX
    const count = this.data.requests.length + 1045;
    const ticketId = reqData.ticketId || `TKT-2026-${count}`;
    
    const newRequest = {
      ticketId,
      studentId: reqData.studentId,
      studentName: reqData.studentName,
      studentRollNo: reqData.studentRollNo,
      studentEmail: reqData.studentEmail,
      category: reqData.category,
      department: reqData.department,
      priority: reqData.priority || 'Medium',
      title: reqData.title,
      description: reqData.description,
      specifications: reqData.specifications || {},
      status: reqData.status || 'Submitted',
      urgencyReason: reqData.urgencyReason || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          stage: 'Submitted',
          timestamp: new Date().toISOString(),
          actor: `${reqData.studentName} (Student)`,
          note: reqData.sourceNote || 'Request submitted through Smart Campus Assistant.'
        }
      ],
      adminNotes: reqData.adminNotes || null,
      resolvedAt: null
    };

    this.data.requests.unshift(newRequest);
    this.save();
    return newRequest;
  }

  updateRequest(ticketId, updates, actorName = 'Campus Administrator') {
    const idx = this.data.requests.findIndex(r => r.ticketId === ticketId);
    if (idx === -1) return null;

    const req = this.data.requests[idx];
    const oldStatus = req.status;

    if (updates.status && updates.status !== oldStatus) {
      req.status = updates.status;
      req.timeline.push({
        stage: updates.status,
        timestamp: new Date().toISOString(),
        actor: actorName,
        note: updates.responseNote || updates.adminNotes || `Status advanced to ${updates.status}.`
      });
      if (updates.status === 'Resolved') {
        req.resolvedAt = new Date().toISOString();
      }
    } else if (updates.responseNote) {
      // Just adding a note without status change
      req.timeline.push({
        stage: req.status,
        timestamp: new Date().toISOString(),
        actor: actorName,
        note: updates.responseNote
      });
    }

    if (updates.priority) req.priority = updates.priority;
    if (updates.department) req.department = updates.department;
    if (updates.adminNotes) req.adminNotes = updates.adminNotes;
    req.updatedAt = new Date().toISOString();

    this.data.requests[idx] = req;
    this.save();
    return req;
  }

  // Announcements
  getAnnouncements() {
    return this.data.announcements;
  }

  // Reset database to seed (useful for testing or demo reset)
  reset() {
    this.data = getInitialData();
    this.save();
    return true;
  }
}

const db = new Database();
module.exports = db;
