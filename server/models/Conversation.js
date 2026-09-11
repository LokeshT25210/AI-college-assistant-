const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, unique: true, index: true },
  sessionId: { type: String, index: true },
  userId: { type: String, index: true, default: 'guest' },
  studentName: { type: String, default: 'Guest Student' },
  studentRollNo: { type: String, default: 'N/A' },
  query: { type: String, required: true },
  category: { type: String, default: 'General' },
  department: { type: String, default: 'Academics' },
  answer: { type: String, required: true },
  verified: { type: Boolean, default: false },
  policyId: { type: String, default: null },
  confidence: { type: Number, default: 0.95 },
  ticketProposed: { type: Boolean, default: false },
  proposedTicket: { type: mongoose.Schema.Types.Mixed, default: null },
  modelUsed: { type: String, default: 'gemini-3.5-flash-lite' },
  userFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    helpful: Boolean,
    comment: String
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
