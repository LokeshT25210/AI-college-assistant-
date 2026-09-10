const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/insights', authenticateToken, requireRole(['admin']), analyticsController.getAnalytics);
router.get('/announcements', analyticsController.getAnnouncements);

module.exports = router;
