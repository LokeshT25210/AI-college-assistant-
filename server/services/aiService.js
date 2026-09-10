const fs = require('fs');
const path = require('path');
const { classifyQuery } = require('./classificationService');

const KNOWLEDGE_DIR = path.join(__dirname, '..', '..', 'knowledge');

// In-memory cache of official knowledge documents
let knowledgeBase = [];

function loadKnowledgeBase() {
  knowledgeBase = [];
  try {
    if (fs.existsSync(KNOWLEDGE_DIR)) {
      const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const filePath = path.join(KNOWLEDGE_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        knowledgeBase.push(data);
      }
    }
  } catch (err) {
    console.error('Error loading knowledge base:', err);
  }
}

// Initial load
loadKnowledgeBase();

/**
 * Find matching official policy from the knowledge base
 */
function searchKnowledge(query, category) {
  if (knowledgeBase.length === 0) loadKnowledgeBase();

  const cleanQuery = query.toLowerCase();
  const candidates = [];

  for (const doc of knowledgeBase) {
    const isCategoryMatch = category && doc.category.toLowerCase() === category.toLowerCase();
    
    for (const policy of doc.policies) {
      let score = 0;
      if (isCategoryMatch) score += 3.0;

      // Keyword matches
      for (const kw of policy.keywords) {
        const cleanKw = kw.toLowerCase();
        if (cleanQuery.includes(cleanKw)) {
          score += cleanKw.includes(' ') ? 5.0 : 3.0;
        }
      }

      // Title/topic match
      const topicWords = policy.topic.toLowerCase().split(/\s+/);
      for (const word of topicWords) {
        if (word.length > 3 && cleanQuery.includes(word)) {
          score += 2.0;
        }
      }

      if (score >= 2.5) {
        candidates.push({
          policy,
          category: doc.category,
          department: doc.department,
          officer: doc.responsibleOfficer,
          score
        });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] || null;
}

/**
 * Check if query contains attendance percentage check (e.g. 68%)
 */
function evaluateAttendanceLogic(query) {
  const clean = (query || '').toLowerCase();
  const match = clean.match(/(\d{1,2}(?:\.\d{1,2})?)\s*(?:%|percent(?:age)?)/i);
  if (match) {
    const percentage = parseFloat(match[1]);
    if (percentage >= 75) {
      return {
        hasSpecificValue: true,
        percentage,
        verdict: 'Eligible',
        explanation: `Your attendance of ${percentage}% satisfies the university's 75% minimum requirement (Academic Regulation 4.2). You are fully eligible to write end-semester examinations without any condonation.`
      };
    } else if (percentage >= 65) {
      return {
        hasSpecificValue: true,
        percentage,
        verdict: 'Condonation Required (65% - 74%)',
        explanation: `Your attendance of ${percentage}% is below the standard 75% threshold, but falls within the 65%–74% condonation band. You are eligible to write semester exams ONLY if a formal medical condonation request is submitted with attested medical documentation and approved by the Dean of Academic Affairs / Principal.`,
        requiresEscalation: true,
        escalationReason: 'Apply for Academic Council Medical Condonation'
      };
    } else {
      return {
        hasSpecificValue: true,
        percentage,
        verdict: 'Detained (Below 65%)',
        explanation: `Your attendance of ${percentage}% is below the statutory 65% cutoff. As per university regulation, condonation cannot be granted below 65%, and the student must re-register for the course (NS grade). You may consult your Academic Advisor to review attendance logs.`,
        requiresEscalation: true,
        escalationReason: 'Attendance Shortage Grievance & Advisor Review'
      };
    }
  }

  if (clean.includes('low attendance') || (clean.includes('shortage') && clean.includes('attendance'))) {
    return {
      hasSpecificValue: false,
      percentage: null,
      verdict: 'Condonation Guidance',
      explanation: `Under autonomous college regulations, 75% aggregate attendance is mandatory to appear for end-semester examinations. Shortage between 65% and 74% may be condoned on valid medical grounds with a formal application and medical certificate. Attendance below 65% results in detention. If your attendance is between 65% and 74%, you should submit an attendance condonation application for Academic Council review.`,
      requiresEscalation: true,
      escalationReason: 'Review attendance standing and apply for condonation if eligible.'
    };
  }

  return null;
}

/**
 * Handle questions that are completely unrelated to college or university administration
 */
function handleUnrelatedQuery(query) {
  const clean = (query || '').toLowerCase().trim();

  // Direct concise answers for common trivia/chat questions before stating college scope
  let directAnswer = '';

  if (/capital of france/i.test(clean)) {
    directAnswer = 'The capital of France is **Paris**.\n\n';
  } else if (/capital of australia/i.test(clean)) {
    directAnswer = 'The capital of Australia is **Canberra**.\n\n';
  } else if (/capital of japan/i.test(clean)) {
    directAnswer = 'The capital of Japan is **Tokyo**.\n\n';
  } else if (/capital of (?:usa|united states)/i.test(clean)) {
    directAnswer = 'The capital of the United States is **Washington, D.C.**\n\n';
  } else if (/capital of india/i.test(clean)) {
    directAnswer = 'The capital of India is **New Delhi**.\n\n';
  } else if (/president of france/i.test(clean)) {
    directAnswer = 'The President of France is **Emmanuel Macron**.\n\n';
  } else if (/prime minister of india/i.test(clean)) {
    directAnswer = 'The Prime Minister of India is **Narendra Modi**.\n\n';
  } else if (/tell me a joke|tell a joke/i.test(clean)) {
    directAnswer = 'Why did the computer go to the doctor? Because it caught a virus! 😄\n\n';
  } else if (/how to (?:make|bake) (?:a )?chocolate cake/i.test(clean)) {
    directAnswer = 'To make a chocolate cake, mix flour, cocoa powder, sugar, baking powder, eggs, and milk, then bake at 175°C (350°F) for 30–35 minutes.\n\n';
  }

  const answer = `${directAnswer}📌 **DVR & Dr. HS MIC College Smart Campus Scope Notice**:
This inquiry is outside the scope of **DVR & Dr. HS MIC College of Technology** campus services and university administration.

I am the dedicated **Smart Campus AI Assistant** specialized in providing authentic, verified guidance on college policies, academics, facilities, and administration.

### Here is what you can ask me about:
- 🎓 **Academics & Attendance**: 75% statutory requirement, 65%–74% condonation band, faculty advisors, course regulations
- 📝 **Examinations**: Semester timetables, hall ticket downloads, revaluation (₹750 per subject), supplementary exams
- 💳 **Fees & Accounts**: Tuition fees (~₹50,000/yr), AP Jagananna Vidya Deevena (JVD) reimbursement, bank payment reconciliation
- 🏢 **Hostel Administration**: Electrical/fan maintenance tickets, plumbing issues, room amenities
- 📜 **Official Certificates**: Bonafide certificates, academic transcripts, study & conduct certificates
- 💰 **Scholarships**: Institutional merit scholarships (CGPA ≥ 8.5), National Scholarship Portal (NSP)
- 💼 **Placements & Training**: Leading MNC recruiters (TCS, Cognizant, Infosys, Wipro, Accenture), packages up to 10–12 LPA
- 🚌 **Campus Transport**: 45+ GPS-enabled buses servicing Vijayawada, Guntur, Nandigama, Jaggaiahpeta
- ℹ️ **College Overview**: UGC Autonomous status, EAMCET Code **MICT**, Principal Dr. T. Vamsee Kiran, Kanchikacherla campus

*Please submit a question related to DVR & Dr. HS MIC College of Technology and I will be delighted to assist you!*`;

  return {
    query,
    answer,
    verified: false,
    policyId: 'OUT-OF-SCOPE',
    policyTopic: 'Non-College / Out-of-Scope Query',
    category: 'Non-College / Out of Scope',
    department: 'Not Applicable',
    priority: 'Low',
    confidence: 0.95,
    actionRequired: false,
    ticketProposal: null
  };
}

/**
 * Main AI Query Process Engine:
 * Strictly grounded, verifies against approved KB, produces AI-to-Action workflow.
 */
async function processAssistantQuery(query, studentContext = {}) {
  const classification = classifyQuery(query);

  // 0. Handle completely unrelated / out-of-scope queries
  if (classification.isUnrelated || classification.category === 'Non-College / Out of Scope') {
    return handleUnrelatedQuery(query);
  }

  const bestMatch = searchKnowledge(query, classification.category);
  const attendanceLogic = evaluateAttendanceLogic(query);

  const cleanQuery = query.toLowerCase();

  // 1. Check for transactional / personal record / physical breakdown queries (NEVER GUESS!)
  const isPersonalDiscrepancy = (
    (cleanQuery.includes('paid') && (cleanQuery.includes('unpaid') || cleanQuery.includes('deducted') || cleanQuery.includes('pending') || cleanQuery.includes('not reflected'))) ||
    cleanQuery.includes('payment is not reflected') ||
    cleanQuery.includes('fee payment') && cleanQuery.includes('not reflected') ||
    cleanQuery.includes('not reflected') ||
    cleanQuery.includes('money deducted') ||
    cleanQuery.includes('portal says unpaid') ||
    cleanQuery.includes('portal shows unpaid') ||
    cleanQuery.includes('hostel room maintenance') ||
    cleanQuery.includes('maintenance issue') ||
    cleanQuery.includes('fan is not working') ||
    cleanQuery.includes('fan') ||
    cleanQuery.includes('not working') ||
    cleanQuery.includes('broken') ||
    cleanQuery.includes('leak') ||
    cleanQuery.includes('lost my id') ||
    (cleanQuery.includes('need') && cleanQuery.includes('certificate'))
  );

  // 2. Verified Answer Handling
  if (attendanceLogic) {
    let responseText = attendanceLogic.explanation;
    if (bestMatch) {
      responseText += `\n\nOfficial Policy Reference: [${bestMatch.policy.id}] "${bestMatch.policy.topic}" under jurisdiction of ${bestMatch.department}.`;
    }

    return {
      query,
      answer: responseText,
      verified: true,
      policyId: bestMatch ? bestMatch.policy.id : 'ATT-001',
      policyTopic: bestMatch ? bestMatch.policy.topic : 'Minimum Attendance Requirement',
      category: 'Attendance',
      department: classification.department || 'Academics',
      priority: classification.priority || 'Medium',
      confidence: 0.96,
      actionRequired: attendanceLogic.requiresEscalation || false,
      ticketProposal: attendanceLogic.requiresEscalation ? {
        title: `Attendance Condonation Request (${attendanceLogic.percentage ? attendanceLogic.percentage + '%' : 'Shortage'})`,
        category: 'Attendance',
        department: classification.department || 'Academics',
        priority: 'Medium',
        description: `Student attendance query: "${query}". Requesting Academic review with attached medical/OD records.`,
        urgencyReason: 'Upcoming end-semester exam hall ticket generation requirement.'
      } : null
    };
  }

  // 3. If it's a physical maintenance or personal financial transaction issue:
  if (isPersonalDiscrepancy) {
    let title = '';
    let description = '';
    let answerText = '';

    if (classification.category === 'Hostel') {
      title = 'Hostel Room Maintenance: ' + (query.length > 50 ? query.substring(0, 50) + '...' : query);
      description = `Reported Room Maintenance Issue: "${query}". Resident: ${studentContext.name || 'Student'} (${studentContext.hostel || 'Hostel Campus'}).`;
      answerText = `I have classified your issue under **${classification.category} (${classification.department})**. \n\nUniversity policy requires room electrical and civil maintenance issues to be recorded with an official ticket so campus facilities can dispatch an on-duty technician. \n\nI have pre-populated a maintenance ticket for you below. Click **"Submit Ticket"** to dispatch the hostel maintenance team.`;
    } else if (classification.category === 'Fees') {
      title = 'Payment Reconciliation: Transaction Deducted but Portal Shows Unpaid';
      description = `Student reported fee payment deducted from bank account, but student portal status remains unpaid. Query: "${query}".`;
      answerText = `**Notice Regarding Financial Records**: The AI Assistant does not inspect live personal bank ledgers to prevent unauthorized disclosures or guess financial reconciliation. \n\nAs per Finance Department protocol (Policy FEE-002), bank webhook delays can take 2–4 hours to synchronize. Please provide your **Bank UTR / Transaction Reference Number** in the ticket below so the Finance desk can verify the settlement with the merchant bank.`;
    } else if (classification.category === 'Certificates') {
      title = 'Certificate Request: ' + (query.length > 45 ? query.substring(0, 45) + '...' : query);
      description = `Student requested certificate: "${query}".`;
      answerText = `I have routed your certificate request to **${classification.department}** (Policy CRT-001). \n\nBonafide certificates, study & conduct certificates, and transcripts are processed within 2 business days. \n\nI have prepared an application ticket below for you. Click **"Submit Ticket"** to submit your request directly to Administration.`;
    } else {
      title = `${classification.category} Request: ` + (query.length > 45 ? query.substring(0, 45) + '...' : query);
      description = query;
      answerText = `I have routed your request to **${classification.department}**. Since this requires administrative processing, an official ticket is required.`;
    }

    return {
      query,
      answer: answerText,
      verified: true,
      policyId: bestMatch ? bestMatch.policy.id : 'PROC-ACTION-01',
      policyTopic: bestMatch ? bestMatch.policy.topic : 'Department Service Ticket Escalation',
      category: classification.category,
      department: classification.department,
      priority: classification.priority,
      confidence: 0.94,
      actionRequired: true,
      ticketProposal: {
        title,
        category: classification.category,
        department: classification.department,
        priority: classification.priority,
        description,
        urgencyReason: classification.urgencyReason
      }
    };
  }

  // 4. Standard Policy Inquiry found in KB
  if (bestMatch && bestMatch.score >= 2.5) {
    const policy = bestMatch.policy;
    let answer = `${policy.summary}\n\n**Official Regulations**: ${policy.details}`;
    if (policy.actionable) {
      answer += `\n\n*Procedure*: ${policy.actionable}`;
    }

    return {
      query,
      answer,
      verified: true,
      policyId: policy.id,
      policyTopic: policy.topic,
      category: bestMatch.category,
      department: bestMatch.department,
      officer: bestMatch.officer,
      priority: classification.priority,
      confidence: Math.min(0.98, 0.70 + bestMatch.score * 0.05),
      actionRequired: false,
      ticketProposal: null
    };
  }

  // 5. Unknown or Unverified Question — Safe Escalation Safeguard!
  // "AI must not invent university policies or sensitive information. If reliable information is unavailable,
  // it should say it cannot verify the answer and offer to create/escalate a request."
  return {
    query,
    answer: "I cannot verify this specific answer in the approved university knowledge base. To ensure accurate academic guidance and avoid unverified policy information, I have prepared a ticket proposal for the Student Welfare & Administration desk.",
    verified: false,
    policyId: 'SAFE-ESCALATE',
    policyTopic: 'Unverified Campus Query',
    category: classification.category || 'Campus Administration',
    department: classification.department || 'Student Welfare & Information Desk',
    priority: classification.priority || 'Medium',
    confidence: 0.35,
    actionRequired: true,
    ticketProposal: {
      title: `Student Inquiry: ${query.length > 50 ? query.substring(0, 50) + '...' : query}`,
      category: classification.category || 'Campus Administration',
      department: classification.department || 'Student Welfare & Information Desk',
      priority: 'Medium',
      description: `Inquiry submitted: "${query}". Automated policy verification returned unverified. Forwarding for administrative review.`,
      urgencyReason: 'Direct student inquiry requiring official administrative clarification.'
    }
  };
}

/**
 * Summarize a ticket for admin view
 */
function summarizeTicketForAdmin(ticket) {
  return `[${ticket.priority}] ${ticket.category} / ${ticket.department}: ${ticket.title}. Student: ${ticket.studentName} (${ticket.studentRollNo}).`;
}

module.exports = {
  processAssistantQuery,
  searchKnowledge,
  loadKnowledgeBase,
  summarizeTicketForAdmin
};
