const db = require('../db/database');

exports.createRequest = async (req, res) => {
  try {
    const { title, description, category, department, priority, urgencyReason, specifications } = req.body;

    // Validation: Empty or invalid input
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Request title cannot be empty.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Request description cannot be empty.' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Campus category is required.' });
    }

    // Duplicate detection safeguard: check if user recently submitted exact same title within 5 minutes
    const existing = await db.getRequests({ studentId: req.user.id });
    const duplicate = existing.find(r => 
      r.title.toLowerCase().trim() === title.toLowerCase().trim() &&
      r.category.toLowerCase() === category.toLowerCase() &&
      (new Date() - new Date(r.createdAt)) < 5 * 60 * 1000
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `Duplicate request detected: You already submitted an identical ticket (${duplicate.ticketId}) recently. Please check your active requests.`,
        existingTicketId: duplicate.ticketId
      });
    }

    const newTicket = await db.createRequest({
      studentId: req.user.id,
      studentName: req.user.name,
      studentRollNo: req.user.studentId || req.user.staffId || 'N/A',
      studentEmail: req.user.email,
      title: title.trim(),
      description: description.trim(),
      category,
      department: department || 'General Campus Administration',
      priority: priority || 'Medium',
      urgencyReason: urgencyReason || 'Standard submission via student portal.',
      specifications: specifications || {},
      sourceNote: 'Created via Smart Campus Assistant AI-to-Action workflow.'
    });

    return res.status(201).json({
      success: true,
      message: `Official ticket ${newTicket.ticketId} created successfully.`,
      ticket: newTicket
    });
  } catch (err) {
    console.error('Error creating request:', err);
    return res.status(500).json({ success: false, message: 'Server error while generating request ticket.' });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const { status, category } = req.query;
    let list = await db.getRequests({ studentId: req.user.id });

    if (status && status !== 'all') {
      list = list.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (category && category !== 'all') {
      list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }

    return res.json({
      success: true,
      count: list.length,
      requests: list
    });
  } catch (err) {
    console.error('Error fetching student requests:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving tickets.' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status, department, category, priority, search } = req.query;
    let list = await db.getRequests();

    if (status && status !== 'all') {
      list = list.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (department && department !== 'all') {
      list = list.filter(r => r.department.toLowerCase() === department.toLowerCase());
    }
    if (category && category !== 'all') {
      list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    if (priority && priority !== 'all') {
      list = list.filter(r => r.priority.toLowerCase() === priority.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(r =>
        r.ticketId.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.studentRollNo.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      count: list.length,
      requests: list
    });
  } catch (err) {
    console.error('Error fetching admin requests:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving requests.' });
  }
};

exports.getRequestDetails = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await db.getRequestById(ticketId);

    if (!ticket) {
      return res.status(404).json({ success: false, message: `Ticket ${ticketId} not found.` });
    }

    // Security check: Unauthorized student cannot view another student's requests
    if (req.user.role === 'student' && ticket.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to access another student\'s ticket record.'
      });
    }

    return res.json({
      success: true,
      ticket
    });
  } catch (err) {
    console.error('Error fetching ticket details:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving ticket details.' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, responseNote, priority, department, adminNotes } = req.body;

    const validStatuses = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const actorName = `${req.user.name} (${req.user.designation || 'Administrator'})`;

    const updated = await db.updateRequest(ticketId, {
      status,
      responseNote,
      priority,
      department,
      adminNotes
    }, actorName);

    if (!updated) {
      return res.status(404).json({ success: false, message: `Ticket ${ticketId} not found.` });
    }

    return res.json({
      success: true,
      message: `Ticket ${ticketId} updated successfully.`,
      ticket: updated
    });
  } catch (err) {
    console.error('Error updating ticket:', err);
    return res.status(500).json({ success: false, message: 'Server error updating ticket status.' });
  }
};

