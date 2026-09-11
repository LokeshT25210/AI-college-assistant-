require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/tickets', requestRoutes); // Alias for requests
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Smart Campus Assistant Enterprise API',
    version: '1.0.0'
  });
});

// Reset endpoint for testing & live demos
app.post('/api/system/reset-demo', async (req, res) => {
  await db.reset();
  res.json({ success: true, message: 'Database reset to initial campus demo state.' });
});

// Catch-all for undefined API routes - ALWAYS return JSON, never HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`
  });
});

// Serve frontend static assets from client/dist
const clientDistPath = path.join(__dirname, '../client/dist');
const fs = require('fs');
app.use(express.static(clientDistPath));

// Fallback all non-API GET requests to client/dist/index.html (Single Page App)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🎓 Smart Campus Assistant Server Active`);
    console.log(`📡 URL: http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
    console.log(`📋 API Health: http://127.0.0.1:${PORT}/api/health`);
    console.log(`🔑 Demo Student: alex.kumar@campus.edu / campus123`);
    console.log(`🔑 Demo Admin:   admin@campus.edu / campus123`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use by another running instance.`);
      console.log(`👉 Backend is already running and accessible at http://127.0.0.1:${PORT}`);
    } else {
      console.error('Server startup error:', err);
    }
  });
}

module.exports = app;
