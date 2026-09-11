const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  credits: { type: Number, default: 3 },
  internalMarks: { type: Number, default: 0 },
  externalMarks: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 100 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: 'A' },
  gradePoints: { type: Number, default: 9 },
  status: { type: String, default: 'PASSED' }
}, { _id: false });

const academicRecordSchema = new mongoose.Schema({
  recordId: { type: String, unique: true, index: true },
  studentId: { type: String, required: true, index: true },
  studentRollNo: { type: String, required: true, index: true },
  studentName: { type: String, required: true },
  department: { type: String, required: true },
  regulation: { type: String, default: 'R23 Autonomous' },
  semester: { type: String, required: true },
  academicYear: { type: String, default: '2026-27' },
  subjects: [subjectSchema],
  totalMarksObtained: { type: Number, default: 0 },
  maximumTotalMarks: { type: Number, default: 0 },
  overallPercentage: { type: Number, default: 0 },
  sgpa: { type: Number, default: 0 },
  cgpa: { type: Number, default: 0 },
  attendancePercentage: { type: Number, default: 85 },
  standing: { type: String, default: 'Distinction' },
  verifiedBy: { type: String, default: 'Controller of Examinations (CoE)' },
  publishedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AcademicRecord', academicRecordSchema);
