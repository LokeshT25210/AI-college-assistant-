const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedbackId: { type: String, unique: true, index: true },
  ticketId: { type: String, index: true },
  userId: { type: String, index: true },
  studentName: { type: String, default: 'Student' },
  studentRollNo: { type: String, default: 'N/A' },
  category: { type: String, default: 'General' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  aspects: {
    responseTime: { type: Number, min: 1, max: 5 },
    resolutionQuality: { type: Number, min: 1, max: 5 },
    staffPoliteness: { type: Number, min: 1, max: 5 }
  },
  resolvedInSLA: { type: Boolean, default: true },
  feedbackType: { type: String, enum: ['Ticket Resolution', 'AI Copilot', 'Administrative Service', 'Campus Facilities'], default: 'Ticket Resolution' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
