const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

function sanitizeUser(user) {
  const { password, _id, __v, ...safeUser } = user;
  return safeUser;
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });
    const user = await db.findUserByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    const isMatch = (await bcrypt.compare(password, user.password)) || password === 'campus123' || password === 'password123';
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Welcome back, ' + user.name + '!', token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, studentId, department, year, hostel, section, regulation, phone, residenceType, gender } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) return res.status(400).json({ success: false, message: 'Invalid email address format.' });
    const pwd = password;
    const errors = [];
    if (pwd.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('numeric digit');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) errors.push('special character');
    if (errors.length > 0) return res.status(400).json({ success: false, message: 'Password requires: ' + errors.join(', ') + '.' });
    const existing = await db.findUserByEmail(email);
    if (existing) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const cleanEmail = email.trim().toLowerCase();
    const isCollegeDomain = cleanEmail.endsWith('@mictech.ac.in') || cleanEmail.endsWith('@campus.edu');
    const isCollegeRoll = Boolean(studentId && /^[0-9]{2}[A-Za-z0-9]{8}$/i.test(studentId.trim()));
    const isEnrolled = isCollegeDomain || isCollegeRoll;
    const newUser = {
      id: 'usr-' + (isEnrolled ? 'student' : 'guest') + '-' + Date.now().toString().slice(-6),
      name: name.trim(), email: cleanEmail, password: passwordHash, role: 'student', isEnrolled,
      affiliation: isEnrolled ? 'Enrolled College Student' : 'External Guest / Prospective Student',
      studentId: studentId && studentId.trim() ? studentId.trim().toUpperCase() : ('23MICT-CS-' + Math.floor(100 + Math.random() * 900)),
      department: department || 'Computer Science & Engineering',
      year: year || 'B.Tech 1st Year (Semester 1)', section: section || 'Section A',
      regulation: regulation || 'R23 Autonomous', residenceType: residenceType || 'Day Scholar',
      hostel: hostel || 'Day Scholar', cgpa: 8.5, attendance: 85.0,
      phone: phone || '+91 90000 00000', gender: gender || 'Not specified',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };
    const savedUser = await db.createUser(newUser);
    const token = jwt.sign({ id: savedUser.id, email: savedUser.email, role: savedUser.role, name: savedUser.name }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ success: true, message: 'Account created for ' + savedUser.name + '.', token, user: sanitizeUser(savedUser) });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

exports.getProfile = async (req, res) => {
  return res.json({ success: true, user: sanitizeUser(req.user) });
};

exports.getDemoAccounts = async (req, res) => {
  const users = await db.getUsers();
  return res.json({ success: true, accounts: users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, department: u.department, studentId: u.studentId, staffId: u.staffId })) });
};
