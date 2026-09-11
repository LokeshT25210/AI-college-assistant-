const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/insights', authenticateToken, requireRole(['admin']), analyticsController.getAnalytics);
router.get('/announcements', analyticsController.getAnnouncements);
router.get('/database', analyticsController.getDatabaseDump);
router.get('/academic-records', analyticsController.getAcademicRecords);
router.get('/conversations', analyticsController.getConversations);
router.get('/feedbacks', analyticsController.getFeedbacks);
router.post('/feedbacks', analyticsController.createFeedback);
router.get('/audit-logs', analyticsController.getAuditLogs);

module.exports = router;
