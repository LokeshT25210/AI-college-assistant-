const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Request = require('../models/Request');
const Announcement = require('../models/Announcement');
const AcademicRecord = require('../models/AcademicRecord');
const Conversation = require('../models/Conversation');
const Feedback = require('../models/Feedback');
const AuditLog = require('../models/AuditLog');

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://mogililokesh10_db_user:fJvpGCR78RcOO0vV@cluster0.znvpnv1.mongodb.net/campus_db?retryWrites=true&w=majority';

let isConnected = false;
let connectPromise = null;

function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return Promise.resolve();
  if (connectPromise) return connectPromise;
  connectPromise = (async () => {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000, socketTimeoutMS: 45000 });
      isConnected = true;
      console.log('MongoDB Atlas connected');
      await seedIfEmpty();
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
      console.warn('Falling back to in-memory database');
    } finally {
      connectPromise = null;
    }
  })();
  return connectPromise;
}
connectDB();

async function seedIfEmpty(force = false) {
  console.log('Ensuring all 7 collections are initialized in MongoDB Atlas...');
  const hash = bcrypt.hashSync('campus123', bcrypt.genSaltSync(10));

  const users = [
    {
      id: 'usr-student-01', name: 'Alex Kumar', email: 'alex.kumar@campus.edu', password: hash,
      role: 'student', studentId: 'CS-2023-0489', department: 'Computer Science & Engineering',
      year: '3rd Year (Semester 5)', regulation: 'R20 Autonomous', hostel: 'Block B - Room 204',
      cgpa: 8.42, attendance: 68.5, percentage: 84.2, totalMarks: 673, maxMarks: 800,
      semesterMarks: [
        { semester: 'Semester 1', sgpa: 8.50, percentage: 85.0, totalMarks: 680, maxMarks: 800, status: 'PASSED' },
        { semester: 'Semester 2', sgpa: 8.35, percentage: 83.5, totalMarks: 668, maxMarks: 800, status: 'PASSED' },
        { semester: 'Semester 3', sgpa: 8.40, percentage: 84.0, totalMarks: 672, maxMarks: 800, status: 'PASSED' },
        { semester: 'Semester 4', sgpa: 8.43, percentage: 84.3, totalMarks: 674, maxMarks: 800, status: 'PASSED' }
      ],
      phone: '+91 98765 43210', isEnrolled: true
    },
    {
      id: 'usr-student-02', name: 'Priya Sharma', email: 'priya.sharma@campus.edu', password: hash,
      role: 'student', studentId: 'EC-2023-0112', department: 'Electronics & Communication',
      year: '3rd Year (Semester 5)', regulation: 'R23 Autonomous', hostel: 'Block A - Room 118',
      cgpa: 9.15, attendance: 84.0, percentage: 91.5, totalMarks: 732, maxMarks: 800,
      semesterMarks: [
        { semester: 'Semester 1', sgpa: 9.20, percentage: 92.0, totalMarks: 736, maxMarks: 800, status: 'PASSED' },
        { semester: 'Semester 2', sgpa: 9.10, percentage: 91.0, totalMarks: 728, maxMarks: 800, status: 'PASSED' }
      ],
      phone: '+91 98765 88990', isEnrolled: true
    },
    {
      id: 'usr-student-std', name: 'Priya Sharma', email: 'student@mictech.ac.in', password: hash,
      role: 'student', studentId: '21H71A0502', department: 'Computer Science & Engineering',
      year: 'B.Tech 3rd Year (Semester 5)', regulation: 'R20 Autonomous', hostel: 'Day Scholar - Bus Route 01',
      cgpa: 8.80, attendance: 84.0, percentage: 88.0, totalMarks: 704, maxMarks: 800, isEnrolled: true
    },
    {
      id: 'usr-student-03', name: 'K. Sai Rahul', email: '21h71a0501@mictech.ac.in', password: hash,
      role: 'student', studentId: '21H71A0501', department: 'Computer Science & Engineering (AI&ML)',
      year: 'B.Tech 4th Year (Semester 7)', regulation: 'R20 Autonomous', cgpa: 9.40, attendance: 91.5,
      percentage: 94.0, totalMarks: 752, maxMarks: 800, isEnrolled: true
    },
    {
      id: 'usr-student-04', name: 'Ananya Reddy', email: '23h71a1205@mictech.ac.in', password: hash,
      role: 'student', studentId: '23H71A1205', department: 'Information Technology',
      year: 'B.Tech 2nd Year (Semester 3)', regulation: 'R23 Autonomous', hostel: 'Campus Girls Hostel - Saraswati Block',
      cgpa: 8.10, attendance: 72.0, percentage: 81.0, totalMarks: 648, maxMarks: 800, isEnrolled: true
    },
    {
      id: 'usr-student-05', name: 'M. Karthik Varma', email: '22h71a0408@mictech.ac.in', password: hash,
      role: 'student', studentId: '22H71A0408', department: 'Electronics & Communication Engineering',
      year: 'B.Tech 3rd Year (Semester 5)', regulation: 'R20 Autonomous', cgpa: 7.20, attendance: 58.0,
      percentage: 72.0, totalMarks: 576, maxMarks: 800, isEnrolled: true
    },
    {
      id: 'usr-student-9505', name: 'Lokesh', email: 'mogililokesh10@gmail.com', password: hash,
      role: 'student', isEnrolled: true, affiliation: 'Enrolled College Student', studentId: '23H71A0590',
      department: 'Computer Science & Engineering', year: 'B.Tech 1st Year (Semester 1)', section: 'Section A',
      regulation: 'R23 Autonomous', residenceType: 'Day Scholar', hostel: 'Route 01 - Vijayawada (Benz Circle & High Court)',
      cgpa: 8.5, attendance: 85, percentage: 85.0, totalMarks: 680, maxMarks: 800,
      semesterMarks: [
        { semester: 'Semester 1', sgpa: 8.50, percentage: 85.0, totalMarks: 680, maxMarks: 800, status: 'PASSED' }
      ],
      phone: '7386962418', gender: 'Male'
    },
    { id: 'usr-admin-01', name: 'Dr. S. Raman', email: 'admin@campus.edu', password: hash, role: 'admin', staffId: 'EMP-002', designation: 'Registrar & Chief Grievance Officer', department: 'Campus Administration' },
    { id: 'usr-admin-coe', name: 'Dr. K. Srinivas', email: 'coe@mictech.ac.in', password: hash, role: 'admin', staffId: 'EMP-003', designation: 'Controller of Examinations (CoE)', department: 'Examination Cell' },
    { id: 'usr-admin-02', name: 'Prof. Vikram Mehta', email: 'finance@campus.edu', password: hash, role: 'admin', staffId: 'EMP-004', designation: 'Finance Officer', department: 'Finance & Accounts' },
    { id: 'usr-admin-hod-cse', name: 'Dr. P. Sunitha', email: 'hod.cse@mictech.ac.in', password: hash, role: 'admin', staffId: 'EMP-005', designation: 'Head of Department (HOD) - CSE', department: 'Computer Science & Engineering' },
    { id: 'usr-admin-warden', name: 'Capt. R. Rajesh', email: 'warden@mictech.ac.in', password: hash, role: 'admin', staffId: 'EMP-007', designation: 'Chief Hostel Warden', department: 'Hostel Administration' },
    { id: 'usr-admin-principal', name: 'Dr. T. Vamsee Kiran', email: 'principal@mictech.ac.in', password: hash, role: 'admin', staffId: 'EMP-001', designation: 'Principal & Head of Institution', department: "Principal's Office & Administration" },
  ];

  const announcements = [
    { id: 'ann-01', title: 'End-Semester Examination Schedule Announced', date: '2026-09-08', category: 'Exams', summary: 'Final timetable for odd-semester 2026 examinations published. Hall ticket download opens Sep 15.' },
    { id: 'ann-02', title: 'Tuition Fee Payment Window Extended by 5 Days', date: '2026-09-06', category: 'Fees', summary: 'Tuition fee without late fee extended to Sep 18, 2026.' },
    { id: 'ann-03', title: 'Hostel Maintenance & Pest Control Schedule', date: '2026-09-04', category: 'Hostel', summary: 'Routine maintenance audit for Blocks A, B, and C during Sep 12-14.' },
  ];

  const requests = [
    {
      ticketId: 'TKT-2026-1042', studentId: 'usr-student-01', studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489', studentEmail: 'alex.kumar@campus.edu', category: 'Fees',
      department: 'Finance & Accounts', priority: 'High',
      title: 'Semester 5 Tuition Fee deducted but portal showing unpaid',
      description: 'I paid my semester fee of Rs 45,000 via NetBanking. The amount was deducted from my account, but portal shows UNPAID.',
      status: 'In Progress', urgencyReason: 'Late fine will be triggered if not reconciled.',
      timeline: [{ stage: 'Submitted', timestamp: new Date(), actor: 'Alex Kumar (Student)', note: 'Auto-escalated ticket.' }]
    },
    {
      ticketId: 'TKT-2026-0985', studentId: 'usr-student-01', studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489', studentEmail: 'alex.kumar@campus.edu', category: 'Hostel',
      department: 'Hostel Administration', priority: 'Medium',
      title: 'Ceiling fan making screeching noise in Room 204',
      description: 'Room 204 ceiling fan needs repair.',
      status: 'Resolved', urgencyReason: 'Hostel room amenity.',
      timeline: [{ stage: 'Submitted', timestamp: new Date(), actor: 'Alex Kumar (Student)', note: 'Submitted.' }]
    },
    {
      ticketId: 'TKT-2026-1011', studentId: 'usr-student-02', studentName: 'Priya Sharma',
      studentRollNo: 'EC-2023-0112', studentEmail: 'priya.sharma@campus.edu', category: 'Certificates',
      department: 'Student Affairs & Certificates', priority: 'Low',
      title: 'Bonafide Certificate request for passport application',
      description: 'Requesting official signed bonafide certificate for passport renewal.',
      status: 'Resolved', urgencyReason: 'Passport office appointment next Tuesday.',
      timeline: [{ stage: 'Submitted', timestamp: new Date(), actor: 'Priya Sharma (Student)', note: 'Submitted.' }]
    }
  ];

  const academicRecords = [
    {
      recordId: 'ACAD-2026-0590-S1',
      studentId: 'usr-student-9505',
      studentRollNo: '23H71A0590',
      studentName: 'Lokesh',
      department: 'Computer Science & Engineering',
      regulation: 'R23 Autonomous',
      semester: 'B.Tech 1st Year (Semester 1)',
      academicYear: '2026-27',
      subjects: [
        { subjectCode: '23CS101', subjectName: 'Linear Algebra & Calculus', credits: 4, internalMarks: 27, externalMarks: 61, totalMarks: 88, maxMarks: 100, percentage: 88.0, grade: 'O', gradePoints: 10, status: 'PASSED' },
        { subjectCode: '23CS102', subjectName: 'Engineering Physics', credits: 3, internalMarks: 25, externalMarks: 58, totalMarks: 83, maxMarks: 100, percentage: 83.0, grade: 'A+', gradePoints: 9, status: 'PASSED' },
        { subjectCode: '23CS103', subjectName: 'Problem Solving & Python Programming', credits: 3, internalMarks: 28, externalMarks: 63, totalMarks: 91, maxMarks: 100, percentage: 91.0, grade: 'O', gradePoints: 10, status: 'PASSED' },
        { subjectCode: '23CS104', subjectName: 'Basic Electrical & Electronics Engineering', credits: 3, internalMarks: 24, externalMarks: 56, totalMarks: 80, maxMarks: 100, percentage: 80.0, grade: 'A', gradePoints: 8, status: 'PASSED' },
        { subjectCode: '23CS105', subjectName: 'Python Programming Laboratory', credits: 1.5, internalMarks: 29, externalMarks: 65, totalMarks: 94, maxMarks: 100, percentage: 94.0, grade: 'O', gradePoints: 10, status: 'PASSED' },
        { subjectCode: '23CS106', subjectName: 'Engineering Physics Laboratory', credits: 1.5, internalMarks: 28, externalMarks: 64, totalMarks: 92, maxMarks: 100, percentage: 92.0, grade: 'O', gradePoints: 10, status: 'PASSED' }
      ],
      totalMarksObtained: 528,
      maximumTotalMarks: 600,
      overallPercentage: 88.0,
      sgpa: 8.50,
      cgpa: 8.50,
      attendancePercentage: 85.0,
      standing: 'First Class with Distinction',
      verifiedBy: 'Dr. K. Srinivas (Controller of Examinations)'
    },
    {
      recordId: 'ACAD-2026-0489-S4',
      studentId: 'usr-student-01',
      studentRollNo: 'CS-2023-0489',
      studentName: 'Alex Kumar',
      department: 'Computer Science & Engineering',
      regulation: 'R20 Autonomous',
      semester: 'B.Tech 2nd Year (Semester 4)',
      academicYear: '2025-26',
      subjects: [
        { subjectCode: '20CS401', subjectName: 'Design & Analysis of Algorithms', credits: 3, internalMarks: 26, externalMarks: 58, totalMarks: 84, maxMarks: 100, percentage: 84.0, grade: 'A+', gradePoints: 9, status: 'PASSED' },
        { subjectCode: '20CS402', subjectName: 'Operating Systems', credits: 3, internalMarks: 25, externalMarks: 59, totalMarks: 84, maxMarks: 100, percentage: 84.0, grade: 'A+', gradePoints: 9, status: 'PASSED' },
        { subjectCode: '20CS403', subjectName: 'Database Management Systems', credits: 3, internalMarks: 28, externalMarks: 60, totalMarks: 88, maxMarks: 100, percentage: 88.0, grade: 'O', gradePoints: 10, status: 'PASSED' },
        { subjectCode: '20CS404', subjectName: 'Computer Networks', credits: 3, internalMarks: 24, externalMarks: 57, totalMarks: 81, maxMarks: 100, percentage: 81.0, grade: 'A', gradePoints: 8, status: 'PASSED' }
      ],
      totalMarksObtained: 337,
      maximumTotalMarks: 400,
      overallPercentage: 84.25,
      sgpa: 8.42,
      cgpa: 8.42,
      attendancePercentage: 68.5,
      standing: 'First Class'
    }
  ];

  const conversations = [
    {
      conversationId: 'CNV-2026-001',
      sessionId: 'sess-alex-01',
      userId: 'usr-student-01',
      studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489',
      query: 'My attendance is 68%. Can I write the semester exams?',
      category: 'Attendance',
      department: 'Academic Affairs',
      answer: 'Under University Academic Regulation 4.2, minimum attendance is 75%. However, 68% falls within the 65%–74% Dean Condonation band. You may apply with an attested medical certificate.',
      verified: true,
      policyId: 'ATT-001',
      confidence: 0.96,
      ticketProposed: true,
      modelUsed: 'gemini-3.5-flash-lite'
    },
    {
      conversationId: 'CNV-2026-002',
      sessionId: 'sess-priya-01',
      userId: 'usr-student-02',
      studentName: 'Priya Sharma',
      studentRollNo: 'EC-2023-0112',
      query: 'When is the deadline to download hall tickets for exams?',
      category: 'Exams',
      department: 'Examination Cell',
      answer: 'Hall tickets for semester examinations are released on the college portal 7 days prior to examination commencement. Download opens on Sep 15, 2026.',
      verified: true,
      policyId: 'EXM-001',
      confidence: 0.98,
      ticketProposed: false,
      modelUsed: 'gemini-3.5-flash-lite'
    }
  ];

  const feedbacks = [
    {
      feedbackId: 'FDB-2026-001',
      ticketId: 'TKT-2026-0985',
      userId: 'usr-student-01',
      studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489',
      category: 'Hostel',
      rating: 5,
      comment: 'Technician arrived promptly and replaced the faulty capacitor. Room fan is now silent and fully operational.',
      aspects: { responseTime: 5, resolutionQuality: 5, staffPoliteness: 5 },
      resolvedInSLA: true,
      feedbackType: 'Ticket Resolution'
    },
    {
      feedbackId: 'FDB-2026-002',
      ticketId: 'TKT-2026-1011',
      userId: 'usr-student-02',
      studentName: 'Priya Sharma',
      studentRollNo: 'EC-2023-0112',
      category: 'Certificates',
      rating: 5,
      comment: 'Digital Bonafide with secure verification QR code generated within 24 hours. Very helpful!',
      aspects: { responseTime: 5, resolutionQuality: 5, staffPoliteness: 4 },
      resolvedInSLA: true,
      feedbackType: 'Administrative Service'
    }
  ];

  const auditLogs = [
    {
      logId: 'AUD-2026-001',
      action: 'SYSTEM_BOOTSTRAP',
      actorId: 'system',
      actorName: 'Smart Campus Core',
      actorRole: 'system',
      targetEntity: 'System',
      targetId: 'MongoDB_Atlas',
      details: 'All 7 MongoDB Atlas collections successfully connected and verified.',
      ipAddress: '127.0.0.1'
    },
    {
      logId: 'AUD-2026-002',
      action: 'TICKET_STATUS_UPDATED',
      actorId: 'usr-admin-01',
      actorName: 'Dr. S. Raman',
      actorRole: 'admin',
      targetEntity: 'Ticket',
      targetId: 'TKT-2026-0985',
      details: 'Advanced ticket status to Resolved after on-site technician completion.',
      ipAddress: '192.168.1.10'
    },
    {
      logId: 'AUD-2026-003',
      action: 'ACADEMIC_RECORD_PUBLISHED',
      actorId: 'usr-admin-coe',
      actorName: 'Dr. K. Srinivas',
      actorRole: 'admin',
      targetEntity: 'AcademicRecord',
      targetId: 'ACAD-2026-0590-S1',
      details: 'Published official semester 1 marksheet and SGPA 8.50 for student 23H71A0590.',
      ipAddress: '192.168.1.25'
    }
  ];

  try {
    if (force || (await User.countDocuments()) === 0) {
      if (force) await User.deleteMany({});
      await User.insertMany(users, { ordered: false });
    }
    if (force || (await Announcement.countDocuments()) === 0) {
      if (force) await Announcement.deleteMany({});
      await Announcement.insertMany(announcements, { ordered: false });
    }
    if (force || (await Request.countDocuments()) === 0) {
      if (force) await Request.deleteMany({});
      await Request.insertMany(requests, { ordered: false });
    }
    if (force || (await AcademicRecord.countDocuments()) === 0) {
      if (force) await AcademicRecord.deleteMany({});
      await AcademicRecord.insertMany(academicRecords, { ordered: false });
    }
    if (force || (await Conversation.countDocuments()) === 0) {
      if (force) await Conversation.deleteMany({});
      await Conversation.insertMany(conversations, { ordered: false });
    }
    if (force || (await Feedback.countDocuments()) === 0) {
      if (force) await Feedback.deleteMany({});
      await Feedback.insertMany(feedbacks, { ordered: false });
    }
    if (force || (await AuditLog.countDocuments()) === 0) {
      if (force) await AuditLog.deleteMany({});
      await AuditLog.insertMany(auditLogs, { ordered: false });
    }
    console.log('All 7 collections successfully populated in MongoDB Atlas');
  } catch (err) {
    if (err.code !== 11000) console.error('Seed error:', err.message);
  }
}

let memUsers = null, memRequests = [], memAnnouncements = [], memAcademicRecords = [], memConversations = [], memFeedbacks = [], memAuditLogs = [];
function ensureMemData() {
  if (memUsers) return;
  const hash = bcrypt.hashSync('campus123', bcrypt.genSaltSync(10));
  memUsers = [
    { id: 'usr-student-01', name: 'Alex Kumar', email: 'alex.kumar@campus.edu', password: hash, role: 'student', studentId: 'CS-2023-0489', department: 'Computer Science & Engineering', year: '3rd Year (Semester 5)', cgpa: 8.42, attendance: 68.5, percentage: 84.2, isEnrolled: true },
    { id: 'usr-student-02', name: 'Priya Sharma', email: 'priya.sharma@campus.edu', password: hash, role: 'student', studentId: 'EC-2023-0112', department: 'Electronics & Communication', year: '3rd Year (Semester 5)', cgpa: 9.15, attendance: 84.0, percentage: 91.5, isEnrolled: true },
    { id: 'usr-admin-01', name: 'Dr. S. Raman', email: 'admin@campus.edu', password: hash, role: 'admin', staffId: 'EMP-002', department: 'Campus Administration' },
    { id: 'usr-student-9505', name: 'Lokesh', email: 'mogililokesh10@gmail.com', password: hash, role: 'student', isEnrolled: true, studentId: '23H71A0590', department: 'Computer Science & Engineering', year: 'B.Tech 1st Year (Semester 1)', section: 'Section A', cgpa: 8.5, attendance: 85, percentage: 85.0 }
  ];
  memAnnouncements = [{ id: 'ann-01', title: 'Offline Mode', date: new Date().toISOString().split('T')[0], category: 'System', summary: 'MongoDB unavailable. Using in-memory data.' }];
}
function usesMongo() { return isConnected && mongoose.connection.readyState === 1; }

const db = {
  async connect() { await connectDB(); },

  // ── Users ──
  async getUsers() {
    await connectDB();
    if (usesMongo()) return User.find({}).lean();
    ensureMemData(); return memUsers;
  },
  async findUserById(id) {
    await connectDB();
    if (usesMongo()) return User.findOne({ id }).lean();
    ensureMemData(); return memUsers.find(u => u.id === id) || null;
  },
  async findUserByEmail(email) {
    await connectDB();
    if (!email) return null;
    const clean = email.toLowerCase().trim();
    if (usesMongo()) {
      let u = await User.findOne({ email: clean }).lean();
      if (u) return u;
      u = await User.findOne({ studentId: { $regex: new RegExp('^' + clean + '$', 'i') } }).lean();
      if (u) return u;
      u = await User.findOne({ staffId: { $regex: new RegExp('^' + clean + '$', 'i') } }).lean();
      if (u) return u;
      if (clean.includes('@')) {
        const roll = clean.split('@')[0].trim();
        u = await User.findOne({ studentId: { $regex: new RegExp('^' + roll + '$', 'i') } }).lean();
        if (u) return u;
      }
      const ALIASES = { 'admin@mictech.ac.in': 'coe@mictech.ac.in', 'registrar@mictech.ac.in': 'admin@campus.edu', 'finance@mictech.ac.in': 'finance@campus.edu', 'cse.hod@mictech.ac.in': 'hod.cse@mictech.ac.in', 'hostel.warden@mictech.ac.in': 'warden@mictech.ac.in' };
      if (ALIASES[clean]) return User.findOne({ email: ALIASES[clean] }).lean();
      return null;
    }
    ensureMemData();
    return memUsers.find(u => u.email.toLowerCase() === clean) || null;
  },
  async createUser(user) {
    await connectDB();
    if (usesMongo()) { const doc = new User(user); await doc.save(); return doc.toObject(); }
    ensureMemData(); memUsers.push(user); return user;
  },

  // ── Requests / Tickets ──
  async getRequests(filter) {
    await connectDB();
    filter = filter || {};
    if (usesMongo()) {
      const q = {};
      if (filter.studentId) q.studentId = filter.studentId;
      if (filter.department) q.department = new RegExp('^' + filter.department + '$', 'i');
      if (filter.category) q.category = new RegExp('^' + filter.category + '$', 'i');
      if (filter.status) q.status = new RegExp('^' + filter.status + '$', 'i');
      return Request.find(q).sort({ createdAt: -1 }).lean();
    }
    let list = memRequests.slice();
    if (filter.studentId) list = list.filter(r => r.studentId === filter.studentId);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  async getRequestById(ticketId) {
    await connectDB();
    if (usesMongo()) return Request.findOne({ ticketId }).lean();
    return memRequests.find(r => r.ticketId === ticketId) || null;
  },
  async createRequest(reqData) {
    await connectDB();
    const count = usesMongo() ? await Request.countDocuments() : memRequests.length;
    const ticketId = reqData.ticketId || ('TKT-2026-' + (1045 + count));
    const newReq = {
      ticketId, studentId: reqData.studentId, studentName: reqData.studentName,
      studentRollNo: reqData.studentRollNo, studentEmail: reqData.studentEmail,
      category: reqData.category, department: reqData.department,
      priority: reqData.priority || 'Medium', title: reqData.title,
      description: reqData.description, specifications: reqData.specifications || {},
      status: reqData.status || 'Submitted', urgencyReason: reqData.urgencyReason || '',
      timeline: [{ stage: 'Submitted', timestamp: new Date(), actor: reqData.studentName + ' (Student)', note: reqData.sourceNote || 'Submitted through Smart Campus Assistant.' }],
      adminNotes: reqData.adminNotes || null, resolvedAt: null
    };
    if (usesMongo()) { const doc = new Request(newReq); await doc.save(); return doc.toObject(); }
    memRequests.unshift(newReq); return newReq;
  },
  async updateRequest(ticketId, updates, actorName) {
    await connectDB();
    actorName = actorName || 'Campus Administrator';
    if (usesMongo()) {
      const req = await Request.findOne({ ticketId });
      if (!req) return null;
      if (updates.status && updates.status !== req.status) {
        req.status = updates.status;
        req.timeline.push({ stage: updates.status, timestamp: new Date(), actor: actorName, note: updates.responseNote || updates.adminNotes || ('Status advanced to ' + updates.status + '.') });
        if (updates.status === 'Resolved') req.resolvedAt = new Date();
      } else if (updates.responseNote) {
        req.timeline.push({ stage: req.status, timestamp: new Date(), actor: actorName, note: updates.responseNote });
      }
      if (updates.priority) req.priority = updates.priority;
      if (updates.department) req.department = updates.department;
      if (updates.adminNotes) req.adminNotes = updates.adminNotes;
      await req.save();
      return req.toObject();
    }
    const idx = memRequests.findIndex(r => r.ticketId === ticketId);
    if (idx === -1) return null;
    const req = memRequests[idx];
    if (updates.status && updates.status !== req.status) {
      req.status = updates.status;
      req.timeline.push({ stage: updates.status, timestamp: new Date().toISOString(), actor: actorName, note: updates.responseNote || 'Status updated.' });
      if (updates.status === 'Resolved') req.resolvedAt = new Date().toISOString();
    }
    if (updates.priority) req.priority = updates.priority;
    if (updates.adminNotes) req.adminNotes = updates.adminNotes;
    req.updatedAt = new Date().toISOString();
    return req;
  },

  // ── Academic Records (Marks & Percentages) ──
  async getAcademicRecords(filter) {
    await connectDB();
    filter = filter || {};
    if (usesMongo()) {
      const q = {};
      if (filter.studentId) q.studentId = filter.studentId;
      if (filter.studentRollNo) q.studentRollNo = new RegExp('^' + filter.studentRollNo + '$', 'i');
      if (filter.semester) q.semester = filter.semester;
      return AcademicRecord.find(q).sort({ createdAt: -1 }).lean();
    }
    return memAcademicRecords;
  },
  async createAcademicRecord(data) {
    await connectDB();
    if (usesMongo()) {
      const doc = new AcademicRecord(data);
      await doc.save();
      return doc.toObject();
    }
    memAcademicRecords.unshift(data);
    return data;
  },

  // ── Conversations (Chat History) ──
  async getConversations(filter) {
    await connectDB();
    filter = filter || {};
    if (usesMongo()) {
      const q = {};
      if (filter.userId) q.userId = filter.userId;
      if (filter.sessionId) q.sessionId = filter.sessionId;
      return Conversation.find(q).sort({ createdAt: -1 }).lean();
    }
    return memConversations;
  },
  async createConversation(data) {
    await connectDB();
    if (usesMongo()) {
      const doc = new Conversation(data);
      await doc.save();
      return doc.toObject();
    }
    memConversations.unshift(data);
    return data;
  },

  // ── Feedbacks ──
  async getFeedbacks(filter) {
    await connectDB();
    filter = filter || {};
    if (usesMongo()) {
      const q = {};
      if (filter.userId) q.userId = filter.userId;
      if (filter.ticketId) q.ticketId = filter.ticketId;
      return Feedback.find(q).sort({ createdAt: -1 }).lean();
    }
    return memFeedbacks;
  },
  async createFeedback(data) {
    await connectDB();
    if (usesMongo()) {
      const doc = new Feedback(data);
      await doc.save();
      return doc.toObject();
    }
    memFeedbacks.unshift(data);
    return data;
  },

  // ── Audit Logs ──
  async getAuditLogs(filter) {
    await connectDB();
    filter = filter || {};
    if (usesMongo()) {
      const q = {};
      if (filter.actorId) q.actorId = filter.actorId;
      if (filter.targetEntity) q.targetEntity = filter.targetEntity;
      return AuditLog.find(q).sort({ timestamp: -1 }).limit(100).lean();
    }
    return memAuditLogs;
  },
  async createAuditLog(data) {
    await connectDB();
    if (usesMongo()) {
      const doc = new AuditLog(data);
      await doc.save();
      return doc.toObject();
    }
    memAuditLogs.unshift(data);
    return data;
  },

  // ── Announcements ──
  async getAnnouncements() {
    await connectDB();
    if (usesMongo()) return Announcement.find({}).sort({ date: -1 }).lean();
    ensureMemData(); return memAnnouncements;
  },

  // ── Reset ──
  async reset() {
    await connectDB();
    if (usesMongo()) {
      await User.deleteMany({});
      await Request.deleteMany({});
      await Announcement.deleteMany({});
      await AcademicRecord.deleteMany({});
      await Conversation.deleteMany({});
      await Feedback.deleteMany({});
      await AuditLog.deleteMany({});
      await seedIfEmpty(true);
      return true;
    }
    memUsers = null; memRequests = []; memAnnouncements = [];
    ensureMemData(); return true;
  }
};

module.exports = db;
