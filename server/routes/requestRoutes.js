const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Student & Authenticated user routes
router.post('/', authenticateToken, requestController.createRequest);
router.get('/my-requests', authenticateToken, requestController.getMyRequests);
router.get('/:ticketId', authenticateToken, requestController.getRequestDetails);

// Admin-only routes
router.get('/', authenticateToken, requireRole(['admin']), requestController.getAllRequests);
router.patch('/:ticketId/status', authenticateToken, requireRole(['admin']), requestController.updateRequestStatus);

module.exports = router;
