/**
 * Centralized API client with Automatic Hybrid Cloud / Static Fallback
 * Works with real Node.js Express backend when available, and seamlessly
 * falls back to browser-persisted state on GitHub Pages!
 */

const API_BASE = '/api';

// Seed Knowledge Base for standalone / GitHub Pages static preview
const BUNDLED_POLICIES = [
  {
    category: 'Attendance',
    department: 'Academic Affairs',
    policies: [
      {
        id: 'ATT-001',
        topic: 'Minimum Attendance Requirement for Semester Examinations',
        summary: 'Students must maintain a minimum of 75% attendance in each registered course to be eligible to appear for the end-semester examinations.',
        details: 'Under university academic regulations (Section 4.2), 75% aggregate attendance is mandatory. Attendance between 65% and 74% may be condoned by the Dean on valid medical grounds or university-approved official duty (OD) upon submission of attested documentation within 7 days of absence. Students with attendance below 65% will be detained (NS grade) and must re-register for the course.',
        keywords: ['attendance', '68%', '65%', '74%', '75%', 'exam eligibility', 'semester exams', 'condonation', 'medical certificate', 'detained', 'shortage']
      }
    ]
  },
  {
    category: 'Exams',
    department: 'Examination Cell',
    policies: [
      {
        id: 'EXM-001',
        topic: 'Hall Ticket Generation and Download Deadlines',
        summary: 'Hall tickets are released online 7 days before semester exams commence and can be downloaded from the student portal after clearing fee dues.',
        details: 'To download the hall ticket, students must have nil fee dues, minimum required attendance (75% or approved condonation), and completed course feedback. If the hall ticket download button is disabled, check with Finance or Academic Affairs.',
        keywords: ['hall ticket', 'admit card', 'exam ticket', 'exam deadline', 'download hall ticket', 'examination schedule', 'timetable']
      },
      {
        id: 'EXM-003',
        topic: 'Revaluation and Answer Script Photocopy',
        summary: 'Students may apply for answer script copy and revaluation within 15 days of result declaration.',
        details: 'Fee for answer script photocopy is ₹300 per subject. Fee for revaluation is ₹750 per subject. If the mark changes by more than 15%, the fee is 50% refunded.',
        keywords: ['revaluation', 'recheck', 'answer script', 'photocopy', 'mark review']
      }
    ]
  },
  {
    category: 'Fees',
    department: 'Finance & Accounts',
    policies: [
      {
        id: 'FEE-002',
        topic: 'Payment Gateway Discrepancies and Unpaid Portal Status',
        summary: 'Payments debited from student bank accounts usually sync within 2 to 4 hours. If portal shows unpaid after debit, an official ticket must be created.',
        details: 'Due to bank settlement cycles, successful debits may occasionally experience webhook timeout. Students MUST NOT pay twice. Note your Bank UTR / Transaction Reference Number, bank debit SMS timestamp, and account number. The Finance department will manually reconcile the transaction within 24 business hours.',
        keywords: ['portal shows unpaid', 'paid my fee', 'money deducted', 'payment completed but portal shows pending', 'unpaid', 'double payment', 'utr']
      }
    ]
  },
  {
    category: 'Hostel',
    department: 'Hostel Administration',
    policies: [
      {
        id: 'HST-001',
        topic: 'Room Maintenance and Repair Procedures',
        summary: 'Hostel room maintenance issues (fans, lights, plumbing, furniture, door locks) are serviced within 24 to 48 hours upon ticket submission.',
        details: 'Students experiencing broken fans, electrical switchboard issues, water leakage, or faulty fixtures must log a maintenance request specifying Hostel Block, Wing, and Room number. Electrician and plumber rounds occur daily from 9:30 AM to 1:00 PM and 3:00 PM to 6:00 PM.',
        keywords: ['hostel room fan', 'fan is not working', 'fan broken', 'light not working', 'plumbing', 'tap leaking', 'hostel maintenance']
      }
    ]
  }
];

// Local State Storage helper for GitHub Pages
const STORAGE_KEY_TICKETS = 'campus_local_tickets_v1';

function getLocalTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const initialTickets = [
    {
      ticketId: 'TKT-2026-1042',
      studentId: 'usr-student-01',
      studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489',
      studentEmail: 'alex.kumar@campus.edu',
      category: 'Fees',
      department: 'Finance & Accounts',
      priority: 'High',
      title: 'Semester 5 Tuition Fee deducted but portal showing unpaid',
      description: 'I paid my semester fee of ₹45,000 on Sep 07 via HDFC NetBanking (UTR: HDFC009823101). The amount was deducted from my account, but the fee payment status in the portal still indicates UNPAID.',
      status: 'In Progress',
      urgencyReason: 'Late fine will be triggered if not reconciled before deadline.',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      timeline: [
        {
          stage: 'Submitted',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          actor: 'Alex Kumar (Student)',
          note: 'Ticket automatically classified as High Priority (Finance) via Smart Campus AI-to-Action engine.'
        },
        {
          stage: 'Under Review',
          timestamp: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
          actor: 'Prof. Vikram Mehta (Finance Officer)',
          note: 'Received UTR HDFC009823101. Forwarded to HDFC Payment Gateway settlement desk.'
        },
        {
          stage: 'In Progress',
          timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
          actor: 'Finance Accounts Desk',
          note: 'Settlement confirmed by bank. Ledger update queued for midnight batch sync.'
        }
      ]
    },
    {
      ticketId: 'TKT-2026-0985',
      studentId: 'usr-student-01',
      studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489',
      studentEmail: 'alex.kumar@campus.edu',
      category: 'Hostel',
      department: 'Hostel Administration',
      priority: 'Medium',
      title: 'Ceiling fan making screeching noise and regulator broken in Room 204',
      description: 'Room 204, Block B ceiling fan has stopped rotating smoothly and regulator is non-responsive.',
      status: 'Resolved',
      urgencyReason: 'Hostel resident comfort and ventilation.',
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      timeline: [
        {
          stage: 'Submitted',
          timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
          actor: 'Alex Kumar (Student)',
          note: 'Created via AI Campus Assistant.'
        },
        {
          stage: 'In Progress',
          timestamp: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
          actor: 'Campus Electrical Maintenance',
          note: 'Electrician assigned with replacement capacitor and regulator unit.'
        },
        {
          stage: 'Resolved',
          timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
          actor: 'Hostel Warden Block B',
          note: 'Fan bearing replaced and tested. Resident confirmed working condition.'
        }
      ]
    }
  ];
  saveLocalTickets(initialTickets);
  return initialTickets;
}

function saveLocalTickets(tickets) {
  try {
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
  } catch (e) {}
}

const DEMO_USERS = {
  'alex.kumar@campus.edu': {
    id: 'usr-student-01',
    name: 'Alex Kumar',
    email: 'alex.kumar@campus.edu',
    role: 'student',
    studentId: 'CS-2023-0489',
    department: 'Computer Science & Engineering',
    year: '3rd Year (Semester 5)',
    hostel: 'Block B - Room 204',
    cgpa: 8.42,
    attendance: 68.5,
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  },
  'admin@campus.edu': {
    id: 'usr-admin-01',
    name: 'Dr. S. Raman',
    email: 'admin@campus.edu',
    role: 'admin',
    staffId: 'REG-0042',
    designation: 'Registrar & Chief Grievance Officer',
    department: 'Campus Administration',
    phone: '+91 98401 23456',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
};

function getAuthHeader() {
  const token = localStorage.getItem('campus_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Client-Side AI Resolver for GitHub Pages standalone execution
function localResolveAI(query) {
  const q = query.toLowerCase();

  // Scenario 1: Attendance with percentage check
  if (q.includes('attendance') || q.includes('68%') || (q.includes('exam') && q.includes('attendance'))) {
    return {
      query,
      answer: "Under university academic regulations (Section 4.2), 75% aggregate attendance is mandatory. Since your attendance is at 68.5%, it is below the cutoff but falls within the 65%–74% condonation window. You are eligible to write semester exams ONLY if a formal medical condonation request is submitted to the Dean of Academic Affairs.\n\nOfficial Policy Reference: [ATT-001] \"Minimum Attendance Requirement for Semester Examinations\" under jurisdiction of Academic Affairs.",
      verified: true,
      policyId: 'ATT-001',
      policyTopic: 'Minimum Attendance Requirement',
      category: 'Attendance',
      department: 'Academic Affairs',
      priority: 'High',
      confidence: 0.96,
      actionRequired: true,
      ticketProposal: {
        title: 'Attendance Condonation Request (68.5%)',
        category: 'Attendance',
        department: 'Academic Affairs',
        priority: 'High',
        description: 'Student attendance is at 68.5%, which falls in the 65%-74% condonation band. Requesting Dean review with attached medical clinic documentation.',
        urgencyReason: 'Upcoming end-semester exam hall ticket generation requirement.'
      }
    };
  }

  // Scenario 2: Hostel Room Fan
  if (q.includes('fan') || q.includes('hostel') || q.includes('room 204') || q.includes('broken')) {
    return {
      query,
      answer: "I have classified your issue under **Hostel (Hostel Administration)**.\n\nUniversity policy requires room electrical and civil maintenance issues to be recorded with an official ticket so campus facilities can dispatch an on-duty technician.\n\nI have pre-populated a maintenance ticket for you below. Click **\"Create Official Ticket\"** to dispatch the hostel maintenance team.",
      verified: true,
      policyId: 'HST-001',
      policyTopic: 'Room Maintenance and Repair Procedures',
      category: 'Hostel',
      department: 'Hostel Administration',
      priority: 'Medium',
      confidence: 0.94,
      actionRequired: true,
      ticketProposal: {
        title: 'Hostel Room Maintenance: Ceiling Fan Malfunction',
        category: 'Hostel',
        department: 'Hostel Administration',
        priority: 'Medium',
        description: 'Reported Room Maintenance Issue: "' + query + '". Resident: Alex Kumar (Hostel Block B - Room 204).',
        urgencyReason: 'Hostel resident ventilation and safety.'
      }
    };
  }

  // Scenario 3: Fee Paid but Unpaid
  if (q.includes('fee') || q.includes('unpaid') || q.includes('payment') || q.includes('deducted')) {
    return {
      query,
      answer: "**Notice Regarding Financial Records**: The AI Assistant does not inspect live personal bank ledgers to prevent unauthorized disclosures or guess financial reconciliation.\n\nAs per Finance Department protocol (Policy FEE-002), bank webhook delays can take 2–4 hours to synchronize. Please provide your **Bank UTR / Transaction Reference Number** in the ticket below so the Finance desk can verify the settlement with the merchant bank.",
      verified: true,
      policyId: 'FEE-002',
      policyTopic: 'Payment Gateway Discrepancies and Unpaid Portal Status',
      category: 'Fees',
      department: 'Finance & Accounts',
      priority: 'High',
      confidence: 0.95,
      actionRequired: true,
      ticketProposal: {
        title: 'Payment Reconciliation: Semester Fee Paid but Unpaid in Portal',
        category: 'Fees',
        department: 'Finance & Accounts',
        priority: 'High',
        description: 'Student reported fee payment deducted from bank account, but student portal status remains unpaid. Query: "' + query + '".',
        urgencyReason: 'Late fine fee penalty risk and bank settlement reconciliation needed.'
      }
    };
  }

  // Scenario 4: Anti-Hallucination Safe Fallback
  if (q.includes('elephant') || q.includes('alien') || q.includes('spaceship') || q.length < 5) {
    return {
      query,
      answer: "I cannot verify this specific answer in the approved university knowledge base. To ensure accurate academic guidance and avoid unverified policy information, I have prepared a ticket proposal for the Student Welfare & Administration desk.",
      verified: false,
      policyId: 'SAFE-ESCALATE',
      policyTopic: 'Unverified Campus Query',
      category: 'Campus Administration',
      department: 'Student Welfare & Information Desk',
      priority: 'Medium',
      confidence: 0.35,
      actionRequired: true,
      ticketProposal: {
        title: `Student Inquiry: ${query.length > 50 ? query.substring(0, 50) + '...' : query}`,
        category: 'Campus Administration',
        department: 'Student Welfare & Information Desk',
        priority: 'Medium',
        description: `Inquiry submitted: "${query}". Automated policy verification returned unverified. Forwarding for administrative review.`,
        urgencyReason: 'Direct student inquiry requiring official administrative clarification.'
      }
    };
  }

  // Standard Knowledge Base Inquiry
  return {
    query,
    answer: "Under university academic regulations, official guidelines and schedules are published via the university administrative gazette. Please refer to your student portal or consult the department desk.",
    verified: true,
    policyId: 'GEN-001',
    policyTopic: 'Standard University Guidelines',
    category: 'Academics',
    department: 'Academic Registrar',
    priority: 'Low',
    confidence: 0.88,
    actionRequired: false,
    ticketProposal: null
  };
}

export const api = {
  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback for static GitHub Pages preview
    }

    const matched = DEMO_USERS[email.toLowerCase()] || DEMO_USERS['alex.kumar@campus.edu'];
    return {
      success: true,
      token: 'demo-static-token-' + Date.now(),
      user: matched
    };
  },

  async getProfile() {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const token = localStorage.getItem('campus_token') || '';
    const user = token.includes('admin') ? DEMO_USERS['admin@campus.edu'] : DEMO_USERS['alex.kumar@campus.edu'];
    return { success: true, user };
  },

  async getDemoAccounts() {
    return { success: true, accounts: Object.values(DEMO_USERS) };
  },

  // AI Assistant
  async askAI(query) {
    try {
      const res = await fetch(`${API_BASE}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ query })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback logic for static deployment
    return { success: true, ...localResolveAI(query) };
  },

  async classifyQuery(query) {
    return {
      success: true,
      classification: {
        category: 'Campus Services',
        department: 'Academic Affairs',
        priority: 'Medium'
      }
    };
  },

  async getKnowledgeBase() {
    return { success: true, knowledgeBase: BUNDLED_POLICIES };
  },

  // Requests / Tickets
  async createRequest(ticketData) {
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(ticketData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = getLocalTickets();
    const count = tickets.length + 1045;
    const newTicket = {
      ticketId: `TKT-2026-${count}`,
      studentId: 'usr-student-01',
      studentName: 'Alex Kumar',
      studentRollNo: 'CS-2023-0489',
      studentEmail: 'alex.kumar@campus.edu',
      category: ticketData.category,
      department: ticketData.department,
      priority: ticketData.priority || 'Medium',
      title: ticketData.title,
      description: ticketData.description,
      status: 'Submitted',
      urgencyReason: ticketData.urgencyReason || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          stage: 'Submitted',
          timestamp: new Date().toISOString(),
          actor: 'Alex Kumar (Student)',
          note: 'Request logged via Smart Campus Assistant AI-to-Action engine.'
        }
      ]
    };
    tickets.unshift(newTicket);
    saveLocalTickets(tickets);
    return { success: true, ticket: newTicket };
  },

  async getMyRequests(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/requests/my-requests?${params}`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = getLocalTickets();
    return { success: true, count: tickets.length, requests: tickets };
  },

  async getAllRequests(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/requests?${params}`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = getLocalTickets();
    return { success: true, count: tickets.length, requests: tickets };
  },

  async getRequestDetails(ticketId) {
    try {
      const res = await fetch(`${API_BASE}/requests/${ticketId}`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = getLocalTickets();
    const found = tickets.find(t => t.ticketId === ticketId);
    return { success: !!found, ticket: found };
  },

  async updateRequestStatus(ticketId, updateData) {
    try {
      const res = await fetch(`${API_BASE}/requests/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(updateData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = getLocalTickets();
    const idx = tickets.findIndex(t => t.ticketId === ticketId);
    if (idx !== -1) {
      const t = tickets[idx];
      if (updateData.status && updateData.status !== t.status) {
        t.status = updateData.status;
        t.timeline.push({
          stage: updateData.status,
          timestamp: new Date().toISOString(),
          actor: 'Dr. S. Raman (Registrar)',
          note: updateData.responseNote || `Status updated to ${updateData.status}.`
        });
      }
      t.updatedAt = new Date().toISOString();
      tickets[idx] = t;
      saveLocalTickets(tickets);
      return { success: true, ticket: t };
    }
    return { success: false, message: 'Ticket not found' };
  },

  // Analytics & Insights
  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/analytics/insights`, {
        headers: { ...getAuthHeader() }
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = getLocalTickets();
    const total = tickets.length;
    const pending = tickets.filter(t => t.status === 'Submitted' || t.status === 'Under Review').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;

    return {
      success: true,
      metrics: {
        totalRequests: total,
        pendingRequests: pending,
        inProgressRequests: inProgress,
        resolvedRequests: resolved,
        avgResolutionHours: 28.5,
        resolutionRatePercent: 85
      },
      distributions: {
        byCategory: [
          { name: 'Fees', value: 4 },
          { name: 'Hostel', value: 3 },
          { name: 'Attendance', value: 2 },
          { name: 'Exams', value: 2 },
          { name: 'Certificates', value: 1 }
        ],
        byDepartment: [
          { name: 'Finance & Accounts', value: 4 },
          { name: 'Hostel Administration', value: 3 },
          { name: 'Academic Affairs', value: 2 },
          { name: 'Examination Cell', value: 2 }
        ],
        byPriority: [
          { name: 'Urgent', value: 1 },
          { name: 'High', value: 4 },
          { name: 'Medium', value: 5 },
          { name: 'Low', value: 2 }
        ]
      },
      frequentlyReportedIssues: [
        { issue: 'Payment deducted via UPI/NetBanking but fee portal marks unpaid', count: 4, dept: 'Finance & Accounts' },
        { issue: 'Ceiling fan / regulator speed malfunction in hostel rooms', count: 3, dept: 'Hostel Administration' },
        { issue: 'Medical certificate condonation before hall ticket release', count: 2, dept: 'Academic Affairs' }
      ],
      aiOperationalInsights: [
        {
          id: 'INS-01',
          severity: 'Critical',
          department: 'Finance & Accounts',
          title: 'Payment Gateway Webhook Synchronization Delay',
          count: 4,
          summary: 'Fee-related requests increased recently. The most common issue is payment completed but portal shows pending.',
          rootCause: 'Merchant bank batch clearing takes 2–4 hours; student portal lacks an immediate provisional pending acknowledgement state.',
          recommendation: 'Add a payment-status FAQ, display "Bank Reconciling - 2h Window" banner on student fee portal, and enable automated daily webhook retry cron.',
          impactMetric: 'Reduces 60% of high-priority finance support tickets.'
        },
        {
          id: 'INS-02',
          severity: 'Moderate',
          department: 'Hostel Administration',
          title: 'Hostel Block B Fan Capacitor Fatigue',
          count: 3,
          summary: 'Recurring fan capacitor failures reported across Block B 2nd floor rooms.',
          rootCause: 'Voltage fluctuations during peak afternoon hours and aged regulator potentiometers.',
          recommendation: 'Conduct preventative batch inspection of Block B switchboards during upcoming weekend maintenance window.',
          impactMetric: 'Averts resident escalations and lowers individual emergency service calls.'
        }
      ]
    };
  },

  async getAnnouncements() {
    return {
      success: true,
      announcements: [
        {
          id: 'ann-01',
          title: 'End-Semester Examination Schedule Announced',
          date: '2026-09-08',
          category: 'Exams',
          summary: 'Final timetable for odd-semester 2026 examinations published on exam portal. Hall ticket download opens Sep 15.'
        },
        {
          id: 'ann-02',
          title: 'Tuition Fee Payment Window Extended by 5 Days',
          date: '2026-09-06',
          category: 'Fees',
          summary: 'In view of bank holiday weekend, tuition fee without late fee has been extended to Sep 18, 2026.'
        },
        {
          id: 'ann-03',
          title: 'Hostel Maintenance & Pest Control Schedule',
          date: '2026-09-04',
          category: 'Hostel',
          summary: 'Routine maintenance and electrical safety audit for Blocks A, B, and C during Sep 12-14.'
        }
      ]
    };
  },

  async resetDemo() {
    localStorage.removeItem(STORAGE_KEY_TICKETS);
    return { success: true };
  }
};
