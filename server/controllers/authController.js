const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, studentId, department, year, hostel, section, regulation, phone, residenceType, gender } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this institutional email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: `usr-student-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: passwordHash,
      role: 'student',
      studentId: studentId ? studentId.trim() : `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      department: department || 'General Undergraduate Studies',
      year: year || '1st Year (Semester 1)',
      section: section || 'Section A',
      regulation: regulation || 'R23 Autonomous',
      residenceType: residenceType || 'Day Scholar',
      hostel: hostel || 'Day Scholar',
      cgpa: 8.50,
      attendance: 85.0,
      phone: phone || '+91 90000 00000',
      gender: gender || 'Not specified',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: `Account created successfully for ${newUser.name}.`,
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during student registration.' });
  }
};

exports.getProfile = async (req, res) => {
  return res.json({
    success: true,
    user: sanitizeUser(req.user)
  });
};

exports.getDemoAccounts = async (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    studentId: u.studentId,
    staffId: u.staffId
  }));
  return res.json({ success: true, accounts: users });
};
