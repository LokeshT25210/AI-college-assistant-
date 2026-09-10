const db = require('../db/database');
const { generateCampusInsights } = require('../services/insightService');

exports.getAnalytics = async (req, res) => {
  try {
    const requests = db.getRequests();
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
    const list = db.getAnnouncements();
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
    const rawUsers = db.getUsers().map(u => {
      const { password, ...safe } = u;
      return safe;
    });
    const requests = db.getRequests();
    const announcements = db.getAnnouncements();

    return res.json({
      success: true,
      database: {
        storageType: 'ACID-Compliant Persistent JSON Store (campus_db.json)',
        totalCollections: 3,
        stats: {
          usersCount: rawUsers.length,
          requestsCount: requests.length,
          announcementsCount: announcements.length
        },
        collections: {
          users: rawUsers,
          requests: requests,
          announcements: announcements
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving database dump.' });
  }
};
