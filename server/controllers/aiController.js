const { processAssistantQuery } = require('../services/aiService');
const { classifyQuery } = require('../services/classificationService');
const fs = require('fs');
const path = require('path');

const KNOWLEDGE_DIR = path.join(__dirname, '..', '..', 'knowledge');

exports.ask = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query text is required and cannot be empty.'
      });
    }

    const studentContext = req.user ? {
      name: req.user.name,
      studentId: req.user.studentId,
      department: req.user.department,
      hostel: req.user.hostel,
      cgpa: req.user.cgpa,
      attendance: req.user.attendance
    } : {};

    const result = await processAssistantQuery(query.trim(), studentContext);

    // Persist to MongoDB Conversation collection in background
    try {
      const db = require('../db/database');
      await db.createConversation({
        conversationId: `CNV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        sessionId: req.body.sessionId || `sess-${req.user ? req.user.id : 'anon'}`,
        userId: req.user ? req.user.id : 'guest',
        studentName: req.user ? req.user.name : 'Guest Student',
        studentRollNo: req.user ? (req.user.studentId || 'N/A') : 'N/A',
        query: query.trim(),
        category: result.category || 'General',
        department: result.department || 'Academics',
        answer: result.answer || '',
        verified: result.verified || false,
        policyId: result.policyId || null,
        confidence: result.confidence || 0.95,
        ticketProposed: Boolean(result.ticketProposal),
        proposedTicket: result.ticketProposal || null,
        modelUsed: result.model || 'gemini-3.5-flash-lite'
      });
    } catch (dbErr) {
      console.error('Failed to log conversation to MongoDB:', dbErr.message);
    }

    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error('AI processing error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process inquiry via AI Assistant engine.'
    });
  }
};

exports.classify = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Query is required.' });
    }

    const classification = classifyQuery(query.trim());
    return res.json({
      success: true,
      classification
    });
  } catch (err) {
    console.error('Classification error:', err);
    return res.status(500).json({ success: false, message: 'Error running classification.' });
  }
};

exports.getKnowledge = async (req, res) => {
  try {
    const categories = [];
    if (fs.existsSync(KNOWLEDGE_DIR)) {
      const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const filePath = path.join(KNOWLEDGE_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        categories.push({
          category: data.category,
          department: data.department,
          responsibleOfficer: data.responsibleOfficer,
          policiesCount: data.policies.length,
          policies: data.policies.map(p => ({ id: p.id, topic: p.topic, summary: p.summary }))
        });
      }
    }
    return res.json({ success: true, knowledgeBase: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve knowledge base.' });
  }
};
