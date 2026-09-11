const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  date: String,
  category: String,
  summary: String
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
