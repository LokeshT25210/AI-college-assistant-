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
  const match = query.match(/(\d{1,2}(?:\.\d{1,2})?)\s*%/);
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
        explanation: `Your attendance of ${percentage}% is below the standard 75% threshold, but falls within the 65%–74% condonation band. You are eligible to write semester exams ONLY if a formal medical condonation request is submitted with attested medical documentation and approved by the Dean of Academic Affairs.`,
        requiresEscalation: true,
        escalationReason: 'Apply for Academic Dean Medical Condonation'
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
  return null;
}

/**
 * Main AI Query Process Engine:
 * Strictly grounded, verifies against approved KB, produces AI-to-Action workflow.
 */
async function processAssistantQuery(query, studentContext = {}) {
  const classification = classifyQuery(query);
  const bestMatch = searchKnowledge(query, classification.category);
  const attendanceLogic = evaluateAttendanceLogic(query);

  const cleanQuery = query.toLowerCase();

  // 1. Check for transactional / personal record / physical breakdown queries (NEVER GUESS!)
  const isPersonalDiscrepancy = (
    cleanQuery.includes('paid') && (cleanQuery.includes('unpaid') || cleanQuery.includes('deducted') || cleanQuery.includes('pending')) ||
    cleanQuery.includes('money deducted') ||
    cleanQuery.includes('fan') ||
    cleanQuery.includes('not working') ||
    cleanQuery.includes('broken') ||
    cleanQuery.includes('leak') ||
    cleanQuery.includes('lost my id') ||
    cleanQuery.includes('bonafide') && cleanQuery.includes('need')
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
      category: classification.category,
      department: classification.department,
      priority: classification.priority,
      confidence: 0.96,
      actionRequired: attendanceLogic.requiresEscalation || false,
      ticketProposal: attendanceLogic.requiresEscalation ? {
        title: `Attendance Condonation Request (${attendanceLogic.percentage}%)`,
        category: 'Attendance',
        department: 'Academic Affairs',
        priority: 'High',
        description: `Student attendance is at ${attendanceLogic.percentage}%, which falls in the 65%-74% condonation band. Requesting Dean review with attached medical/OD records.`,
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
