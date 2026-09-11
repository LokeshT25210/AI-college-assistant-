const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  logId: { type: String, unique: true, index: true },
  action: { type: String, required: true },
  actorId: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, default: 'student' },
  targetEntity: { type: String, enum: ['Ticket', 'User', 'AcademicRecord', 'Authentication', 'System', 'Feedback'], default: 'Ticket' },
  targetId: { type: String, default: '' },
  details: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
