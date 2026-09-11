const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  stage: String,
  timestamp: { type: Date, default: Date.now },
  actor: String,
  note: String
}, { _id: false });

const requestSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true, index: true },
  studentId: { type: String, required: true, index: true },
  studentName: String,
  studentRollNo: String,
  studentEmail: String,
  category: String,
  department: String,
  priority: { type: String, default: 'Medium' },
  title: String,
  description: String,
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, default: 'Submitted' },
  urgencyReason: String,
  sourceNote: String,
  timeline: [timelineSchema],
  adminNotes: { type: String, default: null },
  resolvedAt: { type: Date, default: null }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Request', requestSchema);
