const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Request = require('../models/Request');
const Announcement = require('../models/Announcement');

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
  if (!force) {
    const count = await User.countDocuments();
    if (count > 0) return;
  }
  console.log('Seeding campus database in MongoDB Atlas...');
  const hash = bcrypt.hashSync('campus123', bcrypt.genSaltSync(10));
  const users = [
    { id: 'usr-student-01', name: 'Alex Kumar', email: 'alex.kumar@campus.edu', password: hash, role: 'student', studentId: 'CS-2023-0489', department: 'Computer Science & Engineering', year: '3rd Year (Semester 5)', regulation: 'R20 Autonomous', hostel: 'Block B - Room 204', cgpa: 8.42, attendance: 68.5, phone: '+91 98765 43210', isEnrolled: true },
    { id: 'usr-student-02', name: 'Priya Sharma', email: 'priya.sharma@campus.edu', password: hash, role: 'student', studentId: 'EC-2023-0112', department: 'Electronics & Communication', year: '3rd Year (Semester 5)', regulation: 'R23 Autonomous', hostel: 'Block A - Room 118', cgpa: 9.15, attendance: 84.0, isEnrolled: true },
    { id: 'usr-student-std', name: 'Priya Sharma', email: 'student@mictech.ac.in', password: hash, role: 'student', studentId: '21H71A0502', department: 'Computer Science & Engineering', year: 'B.Tech 3rd Year (Semester 5)', regulation: 'R20 Autonomous', hostel: 'Day Scholar - Bus Route 01', cgpa: 8.80, attendance: 84.0, isEnrolled: true },
    { id: 'usr-student-03', name: 'K. Sai Rahul', email: '21h71a0501@mictech.ac.in', password: hash, role: 'student', studentId: '21H71A0501', department: 'Computer Science & Engineering (AI&ML)', year: 'B.Tech 4th Year (Semester 7)', regulation: 'R20 Autonomous', cgpa: 9.40, attendance: 91.5, isEnrolled: true },
    { id: 'usr-student-04', name: 'Ananya Reddy', email: '23h71a1205@mictech.ac.in', password: hash, role: 'student', studentId: '23H71A1205', department: 'Information Technology', year: 'B.Tech 2nd Year (Semester 3)', regulation: 'R23 Autonomous', hostel: 'Campus Girls Hostel - Saraswati Block', cgpa: 8.10, attendance: 72.0, isEnrolled: true },
    { id: 'usr-student-05', name: 'M. Karthik Varma', email: '22h71a0408@mictech.ac.in', password: hash, role: 'student', studentId: '22H71A0408', department: 'Electronics & Communication Engineering', year: 'B.Tech 3rd Year (Semester 5)', regulation: 'R20 Autonomous', cgpa: 7.20, attendance: 58.0, isEnrolled: true },
    { id: 'usr-student-9505', name: 'Lokesh', email: 'mogililokesh10@gmail.com', password: hash, role: 'student', isEnrolled: true, affiliation: 'Enrolled College Student', studentId: '23H71A0590', department: 'Computer Science & Engineering', year: 'B.Tech 1st Year (Semester 1)', section: 'Section A', regulation: 'R23 Autonomous', residenceType: 'Day Scholar', hostel: 'Route 01 - Vijayawada (Benz Circle & High Court)', cgpa: 8.5, attendance: 85, phone: '7386962418', gender: 'Male' },
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
      ticketId: 'TKT-2026-1042',
      studentId: 'usr-student-01',
      studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489',
      studentEmail: 'alex.kumar@campus.edu',
      category: 'Fees',
      department: 'Finance & Accounts',
      priority: 'High',
      title: 'Semester 5 Tuition Fee deducted but portal showing unpaid',
      description: 'I paid my semester fee of Rs 45,000 via NetBanking. The amount was deducted from my account, but portal shows UNPAID.',
      status: 'In Progress',
      urgencyReason: 'Late fine will be triggered if not reconciled.',
      timeline: [{ stage: 'Submitted', timestamp: new Date(), actor: 'Alex Kumar (Student)', note: 'Auto-escalated ticket.' }]
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
      title: 'Ceiling fan making screeching noise in Room 204',
      description: 'Room 204 ceiling fan needs repair.',
      status: 'Resolved',
      urgencyReason: 'Hostel room amenity.',
      timeline: [{ stage: 'Submitted', timestamp: new Date(), actor: 'Alex Kumar (Student)', note: 'Submitted.' }]
    }
  ];
  try {
    await User.insertMany(users, { ordered: false });
    await Announcement.insertMany(announcements, { ordered: false });
    await Request.insertMany(requests, { ordered: false });
    console.log('Seed data inserted successfully');
  } catch (err) {
    if (err.code !== 11000) console.error('Seed error:', err.message);
  }
}

let memUsers = null, memRequests = [], memAnnouncements = [];
function ensureMemData() {
  if (memUsers) return;
  const hash = bcrypt.hashSync('campus123', bcrypt.genSaltSync(10));
  memUsers = [
    { id: 'usr-student-01', name: 'Alex Kumar', email: 'alex.kumar@campus.edu', password: hash, role: 'student', studentId: 'CS-2023-0489', department: 'Computer Science & Engineering', year: '3rd Year (Semester 5)', cgpa: 8.42, attendance: 68.5, isEnrolled: true },
    { id: 'usr-student-02', name: 'Priya Sharma', email: 'priya.sharma@campus.edu', password: hash, role: 'student', studentId: 'EC-2023-0112', department: 'Electronics & Communication', year: '3rd Year (Semester 5)', cgpa: 9.15, attendance: 84.0, isEnrolled: true },
    { id: 'usr-admin-01', name: 'Dr. S. Raman', email: 'admin@campus.edu', password: hash, role: 'admin', staffId: 'EMP-002', department: 'Campus Administration' },
    { id: 'usr-student-9505', name: 'Lokesh', email: 'mogililokesh10@gmail.com', password: hash, role: 'student', isEnrolled: true, studentId: '23H71A0590', department: 'Computer Science & Engineering', year: 'B.Tech 1st Year (Semester 1)', section: 'Section A', cgpa: 8.5, attendance: 85 }
  ];
  memAnnouncements = [{ id: 'ann-01', title: 'Offline Mode', date: new Date().toISOString().split('T')[0], category: 'System', summary: 'MongoDB unavailable. Using in-memory data.' }];
}
function usesMongo() { return isConnected && mongoose.connection.readyState === 1; }

const db = {
  async connect() {
    await connectDB();
  },
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
    const newReq = { ticketId, studentId: reqData.studentId, studentName: reqData.studentName, studentRollNo: reqData.studentRollNo, studentEmail: reqData.studentEmail, category: reqData.category, department: reqData.department, priority: reqData.priority || 'Medium', title: reqData.title, description: reqData.description, specifications: reqData.specifications || {}, status: reqData.status || 'Submitted', urgencyReason: reqData.urgencyReason || '', timeline: [{ stage: 'Submitted', timestamp: new Date(), actor: reqData.studentName + ' (Student)', note: reqData.sourceNote || 'Submitted through Smart Campus Assistant.' }], adminNotes: reqData.adminNotes || null, resolvedAt: null };
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
  async getAnnouncements() {
    await connectDB();
    if (usesMongo()) return Announcement.find({}).sort({ date: -1 }).lean();
    ensureMemData(); return memAnnouncements;
  },
  async reset() {
    await connectDB();
    if (usesMongo()) {
      await User.deleteMany({});
      await Request.deleteMany({});
      await Announcement.deleteMany({});
      await seedIfEmpty(true);
      return true;
    }
    memUsers = null; memRequests = []; memAnnouncements = [];
    ensureMemData(); return true;
  }
};

module.exports = db;
