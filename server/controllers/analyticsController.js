const db = require('../db/database');
const { generateCampusInsights } = require('../services/insightService');

exports.getAnalytics = async (req, res) => {
  try {
    const requests = await db.getRequests();
    const insights = generateCampusInsights(requests);

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...insights
    });
  } catch (err) {
    console.error('Error computing analytics:', err);
    return res.status(500).json({ success: false, message: 'Server error generating analytics telemetry.' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const list = await db.getAnnouncements();
    return res.json({
      success: true,
      announcements: list
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error loading announcements.' });
  }
};

exports.getDatabaseDump = async (req, res) => {
  try {
    const users = await db.getUsers();
    const rawUsers = users.map(u => {
      const { password, ...safe } = u;
      return safe;
    });
    const requests = await db.getRequests();
    const announcements = await db.getAnnouncements();
    const academicRecords = await db.getAcademicRecords();
    const conversations = await db.getConversations();
    const feedbacks = await db.getFeedbacks();
    const auditLogs = await db.getAuditLogs();

    return res.json({
      success: true,
      database: {
        storageType: 'MongoDB Atlas Cloud Database (Cluster0 / campus_db)',
        totalCollections: 7,
        stats: {
          usersCount: rawUsers.length,
          requestsCount: requests.length,
          announcementsCount: announcements.length,
          academicRecordsCount: academicRecords.length,
          conversationsCount: conversations.length,
          feedbacksCount: feedbacks.length,
          auditLogsCount: auditLogs.length
        },
        collections: {
          users: rawUsers,
          requests,
          announcements,
          academicRecords,
          conversations,
          feedbacks,
          auditLogs
        }
      }
    });
  } catch (err) {
    console.error('Error retrieving database dump:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving database dump.' });
  }
};

exports.getAcademicRecords = async (req, res) => {
  try {
    const filter = {};
    if (req.user && req.user.role === 'student') {
      filter.studentId = req.user.id;
    }
    const records = await db.getAcademicRecords(filter);
    return res.json({ success: true, count: records.length, records });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching academic records.' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const filter = {};
    if (req.user && req.user.role === 'student') {
      filter.userId = req.user.id;
    }
    const conversations = await db.getConversations(filter);
    return res.json({ success: true, count: conversations.length, conversations });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching conversations.' });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await db.getFeedbacks();
    return res.json({ success: true, count: feedbacks.length, feedbacks });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching feedbacks.' });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const { ticketId, rating, comment, category, feedbackType } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: 'Rating (1-5) is required.' });

    const newFeedback = await db.createFeedback({
      feedbackId: `FDB-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      ticketId: ticketId || 'N/A',
      userId: req.user ? req.user.id : 'guest',
      studentName: req.user ? req.user.name : 'Student',
      studentRollNo: req.user ? (req.user.studentId || 'N/A') : 'N/A',
      category: category || 'General',
      rating: Number(rating),
      comment: comment || '',
      feedbackType: feedbackType || 'Ticket Resolution'
    });

    return res.status(201).json({ success: true, feedback: newFeedback });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error submitting feedback.' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await db.getAuditLogs();
    return res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching audit logs.' });
  }
};

