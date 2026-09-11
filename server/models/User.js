const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isEnrolled: Boolean,
  affiliation: String,
  studentId: String,
  staffId: String,
  designation: String,
  department: String,
  year: String,
  section: String,
  regulation: String,
  residenceType: String,
  hostel: String,
  busRoute: String,
  cgpa: Number,
  attendance: Number,
  percentage: Number,
  totalMarks: Number,
  maxMarks: Number,
  semesterMarks: [{
    semester: String,
    sgpa: Number,
    percentage: Number,
    totalMarks: Number,
    maxMarks: Number,
    status: { type: String, default: 'PASSED' }
  }],
  phone: String,
  gender: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
