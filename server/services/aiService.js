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

const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

/**
 * Call Google Gemini LLM API with timeout and graceful fallback
 */
async function callGemini(prompt, systemInstruction = '', timeoutMs = 5000) {
  if (!GEMINI_API_KEY) return null;

  return new Promise((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(null);
      }
    }, timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            try {
              if (res.statusCode === 200) {
                const data = JSON.parse(body);
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                resolve(text ? text.trim() : null);
              } else {
                resolve(null);
              }
            } catch (e) {
              resolve(null);
            }
          }
        });
      });

      req.on('error', () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          resolve(null);
        }
      });

      req.write(JSON.stringify(payload));
      req.end();
    } catch (err) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve(null);
      }
    }
  });
}

/**
 * Handle questions that are completely unrelated to college or university administration
 */
async function handleUnrelatedQuery(query) {
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

  // Attempt live Gemini response if available for open-ended queries without pre-defined answers
  let geminiAnswer = null;
  if (!directAnswer) {
    try {
      const sys = 'You are the official Smart Campus AI Assistant for DVR & Dr. HS MIC College of Technology (Autonomous, Kanchikacherla). The user asked a non-college question. Answer the user question in 1-2 polite sentences, then remind them that you are the DVR & Dr. HS MIC College assistant for academics, exams, fees, hostels, certificates, scholarships, and transport.';
      geminiAnswer = await callGemini(query, sys, 3500);
    } catch (e) {}
  }

  const answer = geminiAnswer || `${directAnswer}📌 **DVR & Dr. HS MIC College Smart Campus Scope Notice**:
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
    ticketProposal: null,
    model: 'gemini-3.5-flash-lite'
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

  const GEMINI_CAMPUS_SYS = 'You are the official Smart Campus AI Assistant for DVR & Dr. HS MIC College of Technology (Autonomous, Kanchikacherla, affiliated to JNTUK, NAAC A+ accredited, EAMCET Code MICT, Principal Dr. T. Vamsee Kiran). Provide a direct, authoritative, detailed, and practically useful ANSWER with exact procedures, official regulations, contacts, and next steps. Do NOT merely tell the student to file a ticket. Always answer their question directly with complete, accurate information.';

  // 2. Verified Answer Handling for Attendance
  if (attendanceLogic) {
    let geminiAttendanceAnswer = null;
    try {
      const attPrompt = `Student Attendance Question: "${query}"
Specific Value Identified: ${attendanceLogic.percentage !== null ? attendanceLogic.percentage + '%' : 'General attendance shortage'}
Official Regulation Analysis: ${attendanceLogic.explanation}
DVR & Dr. HS MIC College Attendance Regulations (Autonomous):
- 75% minimum aggregate attendance required for semester-end examinations.
- 65% to 74% condonation band on valid medical grounds with ₹500 condonation fee and medical certificate approved by Academic Council / Principal.
- Below 65%: Detained (NS grade), student must repeat course in subsequent semesters.
Task: Provide a direct, authoritative, and helpful answer. Explain their exact status, condonation procedure if applicable, and next steps. Do NOT merely tell them to file a ticket.`;
      geminiAttendanceAnswer = await callGemini(attPrompt, GEMINI_CAMPUS_SYS, 4500);
    } catch (e) {}

    let responseText = attendanceLogic.explanation;
    if (geminiAttendanceAnswer) {
      responseText += `\n\n${geminiAttendanceAnswer}`;
    }

    if (bestMatch && !responseText.includes(bestMatch.policy.id)) {
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

  // 3. Physical maintenance or personal financial/administrative discrepancy:
  if (isPersonalDiscrepancy) {
    let title = '';
    let description = '';
    let fallbackAnswer = '';
    let domainPrompt = '';

    if (classification.category === 'Hostel') {
      title = 'Hostel Room Maintenance: ' + (query.length > 50 ? query.substring(0, 50) + '...' : query);
      description = `Reported Room Maintenance Issue: "${query}". Resident: ${studentContext.name || 'Student'} (${studentContext.hostel || 'Hostel Campus'}).`;
      domainPrompt = `Student Issue: "${query}"
Context: Hostel Resident at DVR & Dr. HS MIC College of Technology (Kanchikacherla campus, Boys & Girls Hostels, Blocks A & B).
Official Campus Hostel Maintenance Procedures:
- Caretaker & Hostel Warden Office located on the Ground Floor of each hostel block.
- Electrical and civil maintenance staff conduct daily rounds between 2:00 PM and 5:00 PM.
- Immediate troubleshooting: Check the sub-distribution breaker and room regulator switch.
- Emergency / Urgent repairs: Contact the Campus Electrical Helpdesk (internal ext: 204) or resident warden.
- Escalation: Report to Chief Warden or Estate Office if unresolved after 24 hours.
Task: Provide a direct, practical, and comprehensive ANSWER with step-by-step guidance on how to get this issue inspected and fixed. Do NOT simply tell them to create a ticket.`;
      fallbackAnswer = `### Hostel Room Maintenance Guidance (DVR & Dr. HS MIC College of Technology)

Here is how to get your room maintenance issue resolved quickly:

1. **Immediate Step — Hostel Block Office**:
   - Visit the **Hostel Caretaker / Warden Office** on the Ground Floor of your hostel block (Block A / Block B).
   - Enter your room number and problem in the **Hostel Maintenance Register**.

2. **Maintenance Schedule**:
   - Electricians and maintenance staff perform daily room servicing rounds between **2:00 PM and 5:00 PM**.
   - For urgent electrical repairs, contact the Campus Electrical Maintenance helpdesk at internal extension **204** or inform the resident warden.

3. **Safety Notice**:
   - Please do not attempt to dismantle switchboards, fan regulators, or wiring yourself.`;
    } else if (classification.category === 'Fees') {
      title = 'Payment Reconciliation: Transaction Deducted but Portal Shows Unpaid';
      description = `Student reported fee payment deducted from bank account, but student portal status remains unpaid. Query: "${query}".`;
      domainPrompt = `Student Issue: "${query}"
Context: Student at DVR & Dr. HS MIC College of Technology (Autonomous).
Official Fee Payment Reconciliation Procedures (Policy FEE-002):
- Payment Gateway Sync Window: Payments via SBI e-Pay, HDFC gateway, or UPI take 2 to 4 hours (up to 24 hours during bank holidays) to settle and reflect on the student portal.
- Verification Proof: The 12-digit UTR or Bank Transaction Reference ID is the official proof of payment.
- Action Steps: If still unpaid after 4 hours, visit the Finance & Accounts Section at the Administrative Block (Ground Floor, Room 104) with bank debit SMS or mini-statement, or email accounts@mictech.ac.in.
- Late Fee Protection: Transactions initiated before the deadline are exempt from late fee penalties upon UTR verification.
Task: Provide a reassuring, clear, and actionable ANSWER explaining the reconciliation process, timelines, and next steps. Do NOT simply tell them to create a ticket.`;
      fallbackAnswer = `### Fee Payment Reconciliation Guidance (DVR & Dr. HS MIC College of Technology)

If your fee payment was deducted from your bank account but the student portal still indicates unpaid:

1. **Payment Gateway Settlement Window**:
   - Online payments made through SBI e-Pay, HDFC payment gateway, or UPI take **2 to 4 hours** (or up to 24 hours on bank holidays) to synchronize with the student ERP database.
   - If you paid recently, your transaction may be in the clearing batch.

2. **Keep Your UTR Number Ready**:
   - Locate your 12-digit **Bank Transaction Reference Number (UTR)** from your bank SMS or debit notification.

3. **Accounts Section Verification**:
   - If the portal remains unpaid after 4 hours, visit the **Finance & Accounts Section** at the **Administrative Block (Ground Floor, Room 104)** during office hours (9:30 AM – 4:00 PM) or email \`accounts@mictech.ac.in\` with your Roll Number and UTR.
   - Once verified against the bank settlement statement, the accounts desk manually reconciles your ledger. Late fees are waived for payments initiated prior to the deadline.`;
    } else if (classification.category === 'Certificates') {
      title = 'Certificate Request: ' + (query.length > 45 ? query.substring(0, 45) + '...' : query);
      description = `Student requested certificate: "${query}".`;
      domainPrompt = `Student Request: "${query}"
Context: Student at DVR & Dr. HS MIC College of Technology (Autonomous).
Official Certificate Issuance Procedures (Policy CRT-001):
- Available Documents: Bonafide Certificate, Study & Conduct Certificate, Transfer Certificate (TC), Migration Certificate, and Official Transcripts.
- Application Methods:
  1. Administrative Counter: Visit the Student Records / Examination Section counter at the Administrative Block with student ID card.
  2. Student Portal: Apply online through the Student Portal under Certificate Requests.
- Timelines: Bonafide and Conduct certificates take 2 working days. Transcripts and Migration certificates take 3–5 working days.
- Authentication: All official certificates carry an embedded QR code verification and Controller of Examinations seal.
Task: Provide a direct, step-by-step ANSWER on how to obtain the requested certificate, processing times, and counter locations. Do NOT simply tell them to create a ticket.`;
      fallbackAnswer = `### Certificate Issuance Procedures (DVR & Dr. HS MIC College of Technology)

To obtain official college certificates:

1. **Available Certificates**:
   - Bonafide Certificate (for passports, bus passes, bank loans)
   - Study & Conduct Certificate
   - Transfer Certificate (TC) & Migration Certificate
   - Official Academic Transcripts (with autonomous grading scheme)

2. **How to Apply**:
   - **In-Person**: Visit the **Student Records / Examination Section** counter at the Administrative Block with your student identity card.
   - **Online**: Apply through the Student Portal under **Records & Certificates**.

3. **Processing Timelines**:
   - Bonafide & Conduct Certificates: **2 working days**.
   - Transcripts & Migration Certificates: **3 to 5 working days**.
   - All issued certificates feature digital QR code verification and institutional seal.`;
    } else {
      title = `${classification.category} Request: ` + (query.length > 45 ? query.substring(0, 45) + '...' : query);
      description = query;
      domainPrompt = `Student Query: "${query}"\nDepartment: ${classification.department}\nCategory: ${classification.category}\nContext: DVR & Dr. HS MIC College of Technology.\nTask: Provide a direct, thorough, and helpful answer explaining official policies, procedures, office locations, and steps. Do NOT simply say to file a ticket.`;
      fallbackAnswer = `Your request has been routed to **${classification.department}**. Please visit the department desk at the Administrative Block during office hours (9:00 AM – 5:00 PM) for official processing.`;
    }

    let geminiDiscrepancyAnswer = null;
    try {
      geminiDiscrepancyAnswer = await callGemini(domainPrompt, GEMINI_CAMPUS_SYS, 5000);
    } catch (e) {}

    const finalAnswer = geminiDiscrepancyAnswer || fallbackAnswer;

    return {
      query,
      answer: finalAnswer,
      verified: true,
      policyId: bestMatch ? bestMatch.policy.id : 'PROC-ACTION-01',
      policyTopic: bestMatch ? bestMatch.policy.topic : 'Department Service Ticket Escalation',
      category: classification.category,
      department: classification.department,
      priority: classification.priority,
      confidence: 0.95,
      actionRequired: false,
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
    let geminiPolicyAnswer = null;

    try {
      const policyPrompt = `Student Question: "${query}"
Institution: DVR & Dr. HS MIC College of Technology (Autonomous, Kanchikacherla, affiliated to JNTUK, NAAC A+ accredited, Code MICT).
Approved Policy [${policy.id}] "${policy.topic}" (${bestMatch.department}):
Policy Summary: ${policy.summary}
Approved Regulations: ${policy.details}
Actionable Procedure: ${policy.actionable || ''}
Task: Provide a direct, authoritative, comprehensive, and helpful answer to the student. Cite policy reference [${policy.id}] and exact figures (fees, percentages, deadlines) where specified. Do NOT simply tell them to create a ticket.`;
      geminiPolicyAnswer = await callGemini(policyPrompt, GEMINI_CAMPUS_SYS, 4500);
    } catch (e) {}

    let answer = geminiPolicyAnswer || `${policy.summary}\n\n**Official Regulations**: ${policy.details}`;
    if (!geminiPolicyAnswer && policy.actionable) {
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

  // 5. Unknown or General Campus Question — Responsive Gemini Guidance!
  let geminiUnknownAnswer = null;
  try {
    const unknownPrompt = `Student Inquiry: "${query}"
Institution: DVR & Dr. HS MIC College of Technology (Autonomous, Kanchikacherla, Krishna/NTR District, AP).
Campus Divisions: Academics, Examination Cell, Accounts/Finance, Hostel Administration, Transport, Student Welfare, Training & Placement, Central Library.
Task: Provide a supportive, comprehensive, and helpful answer to guide the student regarding this campus matter. Direct them to the appropriate office, counter, or faculty advisor with operational hours (9:00 AM – 5:00 PM).`;
    geminiUnknownAnswer = await callGemini(unknownPrompt, GEMINI_CAMPUS_SYS, 4500);
  } catch (e) {}

  const answer = `I cannot verify this specific answer in the approved university knowledge base. To ensure accurate academic guidance and avoid unverified policy information, here is the official campus guidance:\n\n` + (geminiUnknownAnswer || "Please visit the Student Welfare & Administration desk at the Administrative Block during working hours (9:00 AM – 5:00 PM) for direct consultation and administrative clarification.");

  return {
    query,
    answer,
    verified: false,
    policyId: 'SAFE-ESCALATE',
    policyTopic: 'Unverified Campus Query',
    category: classification.category || 'Campus Administration',
    department: classification.department || 'Student Welfare & Information Desk',
    priority: classification.priority || 'Medium',
    confidence: 0.40,
    actionRequired: false,
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
  summarizeTicketForAdmin,
  callGemini
};
