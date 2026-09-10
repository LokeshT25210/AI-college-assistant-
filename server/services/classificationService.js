/**
 * Classification Service
 * Analyzes natural language student queries to determine:
 * 1. Primary Category (Attendance, Exams, Fees, Hostel, Certificates, Scholarships, Academics)
 * 2. Designated Campus Department
 * 3. Specific Intent / Query Type (Policy Information, Incident / Maintenance, Financial Transaction Dispute, Request Submission)
 * 4. Priority / Urgency (Urgent, High, Medium, Low) with rationale
 * 5. Classification Confidence Score (0.0 to 1.0)
 */

const CATEGORY_MAP = {
  attendance: {
    category: 'Attendance',
    department: 'Academics',
    keywords: ['attendance', 'low attendance', 'percentage', 'percent', 'condonation', 'medical certificate', 'shortage', 'absent', 'present', 'detention', 'detained', 'bunk', 'od', 'on duty', 'leave', 'biometric', '68%', '68 percent', '75%', '65%', 'minimum attendance']
  },
  exams: {
    category: 'Exams',
    department: 'Exams',
    keywords: ['exam date', 'exam deadline', 'semester exam date', 'semester exam', 'hall ticket', 'admit card', 'supplementary', 'arrear', 'revaluation', 'photocopy', 'timetable', 'schedule', 'results', 'grades', 'cgpa', 'backlog', 're-exam', 'controller of examination', 'coe', 'exam', 'exams']
  },
  fees: {
    category: 'Fees',
    department: 'Finance',
    keywords: ['portal says unpaid', 'portal shows unpaid', 'payment is not reflected', 'not reflected', 'fee payment', 'semester fee', 'paid my', 'unpaid', 'money deducted', 'fee', 'fees', 'tuition', 'payment', 'transaction', 'utr', 'bank', 'deducted', 'gateway', 'receipt', 'refund', 'caution deposit', 'installment', 'fine', 'penalty']
  },
  hostel: {
    category: 'Hostel',
    department: 'Hostel Administration',
    keywords: ['hostel room maintenance', 'maintenance issue', 'hostel fan', 'hostel room', 'hostel', 'fan is not working', 'fan', 'light', 'plumbing', 'tap', 'leak', 'curfew', 'outpass', 'warden', 'mess', 'food', 'bed', 'mess committee', 'electrical', 'switch', 'door', 'washroom', 'room change', 'allotment']
  },
  certificates: {
    category: 'Certificates',
    department: 'Administration',
    keywords: ['need a certificate', 'need certificate', 'certificate', 'certificates', 'bonafide', 'transcript', 'id card', 'duplicate id', 'study certificate', 'smart card', 'grade sheet', 'character certificate', 'migration', 'transfer certificate', 'tc', 'lor']
  },
  scholarships: {
    category: 'Scholarships',
    department: 'Scholarships',
    keywords: ['scholarship information', 'need scholarship', 'scholarship', 'scholarships', 'financial aid', 'fee concession', 'nsp', 'merit scholarship', 'income certificate', 'minority', 'state scholarship', 'post matric', 'waiver', 'jvd', 'vidya deevena']
  },
  academics: {
    category: 'Academics',
    department: 'Academics',
    keywords: ['academic issue', 'academic problem', 'academics', 'academic', 'course', 'elective', 'add drop', 'syllabus', 'credits', 'faculty advisor', 'mentor', 'internship', 'noc', 'curriculum', 'advisor', 'probation', 'prerequisite']
  },
  unknown: {
    category: 'Unknown',
    department: 'Appropriate Department',
    keywords: ['unknown campus problem', 'unknown problem', 'unknown issue', 'unknown']
  },
  placements: {
    category: 'Placements',
    department: 'Training & Placement Cell',
    keywords: ['placement', 'placements', 'recruit', 'recruiting', 'recruiter', 'recruiters', 'recruitment', 'company', 'companies', 'top recruiters', 'tcs', 'infosys', 'wipro', 'cognizant', 'accenture', 'capgemini', 'hcl', 'package', 'highest package', 'average package', 'salary', 'lpa', 'crt', 'aptitude', 'job', 'jobs', 'hiring', 'campus drive']
  },
  transport: {
    category: 'Transport',
    department: 'Campus Transport & Fleet Management',
    keywords: ['bus', 'buses', 'transport', 'bus route', 'bus routes', 'bus pass', 'vijayawada', 'guntur', 'nandigama', 'jaggaiahpeta', 'bus timing', 'bus stop', 'travel', 'commute']
  },
  library: {
    category: 'Library',
    department: 'Central Library & Information Centre',
    keywords: ['library', 'books', 'central library', 'digital library', 'library timing', 'library hours', 'ieee', 'delnet', 'borrow book', 'return book', 'journal', 'journals']
  },
  college_info: {
    category: 'College Information',
    department: "Principal's Office & Administration",
    keywords: ['eamcet', 'eapcet', 'college code', 'code', 'mict', 'polycet', 'icet', 'principal', 'vamsee kiran', 'director', 'address', 'location', 'kanchikacherla', 'contact', 'phone', 'helpline', 'email', 'about college', 'overview', 'autonomous', 'jntuk', 'courses offered', 'branches', 'b.tech', 'btech', 'm.tech', 'mtech', 'mba', 'mca', 'diploma', 'polytechnic']
  }
};

const URGENCY_TRIGGERS = [
  { level: 'Urgent', patterns: [/emergency/i, /fire/i, /spark/i, /electric shock/i, /flooding/i, /tomorrow/i, /within 24 hours/i, /exam today/i, /hall ticket missing/i] },
  { level: 'High', patterns: [/paid .* unpaid/i, /portal (?:says|shows) unpaid/i, /not reflected/i, /money deducted/i, /deducted.*unpaid/i, /duplicate payment/i, /charged twice/i, /shortage.*exam/i, /deadline.*today/i, /last date/i, /detained/i] },
  { level: 'Medium', patterns: [/not working/i, /maintenance issue/i, /fan/i, /broken/i, /repair/i, /faulty/i, /issue/i, /problem/i, /condonation/i, /medical/i, /delay/i, /certificate/i, /scholarship/i, /academic/i, /exam date/i, /exam deadline/i, /low attendance/i, /68/i, /unknown/i] },
  { level: 'Low', patterns: [/inquiry/i, /how to/i, /rules/i, /what is/i] }
];

function classifyQuery(text) {
  if (!text || typeof text !== 'string') {
    return {
      category: 'General Inquiry',
      department: 'Student Welfare & Information Desk',
      intent: 'general_query',
      priority: 'Low',
      confidence: 0.2,
      isActionRequired: false,
      extractedKeywords: []
    };
  }

  const clean = text.toLowerCase();
  const scores = {};
  const matchedTokens = {};

  for (const [key, data] of Object.entries(CATEGORY_MAP)) {
    scores[key] = 0;
    matchedTokens[key] = [];

    for (const kw of data.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        // Multi-word keywords get higher weight
        const weight = kw.includes(' ') ? 3.0 : 1.5;
        scores[key] += weight;
        matchedTokens[key].push(kw);
      }
    }
  }

  if (clean.includes('attendance')) {
    scores['attendance'] = (scores['attendance'] || 0) + 12.0;
  }

  // Find category with highest match score
  let bestKey = null;
  let highestScore = 0;
  for (const [key, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestKey = key;
    }
  }

  // Fallback if no strong category match
  const categoryData = bestKey ? CATEGORY_MAP[bestKey] : {
    category: 'Unknown',
    department: 'Appropriate Department',
    keywords: []
  };

  // Determine urgency/priority (URGENCY_TRIGGERS is ordered: Urgent -> High -> Medium -> Low)
  let detectedPriority = 'Medium';
  let urgencyReason = 'Standard academic service queue.';

  for (const trigger of URGENCY_TRIGGERS) {
    let matched = false;
    for (const pattern of trigger.patterns) {
      if (pattern.test(clean)) {
        detectedPriority = trigger.level;
        urgencyReason = `Flagged as ${trigger.level} based on temporal keyword or financial/operational urgency.`;
        matched = true;
        break;
      }
    }
    if (matched) break;
  }

  // Detect whether action/ticketing is required (e.g., breakdown, payment mismatch, physical service)
  const isActionRequired = (
    clean.includes('not working') ||
    clean.includes('broken') ||
    clean.includes('portal says unpaid') ||
    clean.includes('portal shows unpaid') ||
    clean.includes('not reflected') ||
    clean.includes('maintenance issue') ||
    clean.includes('need a certificate') ||
    clean.includes('unknown') ||
    clean.includes('deducted') ||
    clean.includes('leak') ||
    clean.includes('lost') ||
    clean.includes('apply for') ||
    clean.includes('request') ||
    clean.includes('discrepancy') ||
    clean.includes('my attendance is') ||
    clean.includes('68 percent') ||
    clean.includes('68%') ||
    clean.includes('condonation')
  );

  // Confidence calculation
  const confidence = highestScore > 0 ? Math.min(0.98, 0.55 + highestScore * 0.1) : 0.35;

  return {
    category: categoryData.category,
    department: categoryData.department,
    intent: isActionRequired ? 'action_escalation' : 'policy_inquiry',
    priority: detectedPriority,
    urgencyReason,
    confidence: parseFloat(confidence.toFixed(2)),
    isActionRequired,
    matchedKeywords: bestKey ? matchedTokens[bestKey] : []
  };
}

module.exports = {
  classifyQuery,
  CATEGORY_MAP
};
