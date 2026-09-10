const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

// Optional auth for testing, but injects student context if token present
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('../middleware/auth');
  const db = require('../db/database');

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (!err && decodedUser) {
      req.user = db.findUserById(decodedUser.id);
    }
    next();
  });
}

router.post('/ask', optionalAuth, aiController.ask);
router.post('/classify', aiController.classify);
router.get('/knowledge', aiController.getKnowledge);

module.exports = router;
