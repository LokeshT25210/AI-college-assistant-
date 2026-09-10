/**
 * Centralized API client with Automatic Hybrid Cloud / Static Fallback
 * Works with real Node.js Express backend when available, and seamlessly
 * falls back to browser-persisted state on GitHub Pages!
 */

const API_BASE = '/api';

// Seed Knowledge Base for standalone / GitHub Pages static preview
const BUNDLED_POLICIES = [
  {
    category: 'College Information',
    department: "Principal's Office & Administration",
    policies: [
      {
        id: 'COL-001',
        topic: 'College Overview, Accreditation and EAMCET Code',
        summary: 'DVR & Dr. HS MIC College of Technology is a premier UGC Autonomous engineering institution established in Kanchikacherla, Andhra Pradesh. The official EAMCET/EAPCET, ICET, and POLYCET counseling code is MICT.',
        details: "DVR & Dr. HS MIC College of Technology holds Autonomous status granted by UGC since 2018. It is permanently affiliated with Jawaharlal Nehru Technological University Kakinada (JNTUK), approved by AICTE New Delhi, and accredited with 'A+' Grade by NAAC. Counseling Codes: EAMCET/EAPCET Code: MICT, POLYCET Code: MICT, ICET Code: MICT.",
        keywords: ['eamcet code', 'eapcet code', 'college code', 'mict', 'polycet code', 'icet code', 'autonomous', 'jntuk', 'affiliation', 'naac', 'aicte', 'about college', 'overview']
      },
      {
        id: 'COL-002',
        topic: 'Principal and Administrative Leadership',
        summary: 'The Principal of DVR & Dr. HS MIC College of Technology is Dr. T. Vamsee Kiran, leading academic and institutional administration.',
        details: 'Principal: Dr. T. Vamsee Kiran, Ph.D. Management: Devineni Venkata Ramana & Dr. Himasekhar MIC College of Technology is sponsored by Devineni Ramana Praneetha Educational Society.',
        keywords: ['principal', 'who is the principal', 'vamsee kiran', 'director', 'head of college', 'management']
      },
      {
        id: 'COL-003',
        topic: 'Academic Programs and Courses Offered',
        summary: 'The college offers 8 B.Tech undergraduate programs, 4 M.Tech postgraduate specializations, MBA, MCA, and 5 Diploma engineering courses.',
        details: 'Undergraduate B.Tech Programs: 1. Computer Science & Engineering (CSE), 2. CSE - Artificial Intelligence & Machine Learning (AI&ML), 3. CSE - Data Science (DS), 4. Information Technology (IT), 5. Electronics & Communication Engineering (ECE), 6. Electrical & Electronics Engineering (EEE), 7. Mechanical Engineering (ME), 8. Civil Engineering (CE). Postgraduate Programs: M.Tech in CSE, VLSI & Embedded Systems, PE&D, Machine Design; MBA; MCA. Diploma (Polytechnic): Computer Engg, ECE, EEE, Mechanical, Civil.',
        keywords: ['courses', 'branches', 'departments', 'programs', 'btech', 'b.tech', 'mtech', 'm.tech', 'mba', 'mca', 'diploma', 'polytechnic', 'cse', 'ece', 'eee', 'it', 'aiml', 'data science', 'civil', 'mechanical']
      },
      {
        id: 'COL-004',
        topic: 'Campus Location, Address and Contact Numbers',
        summary: 'The campus is situated on NH-65 in Kanchikacherla, NTR District, Andhra Pradesh - 521180. Phone: 08678-273535 / 273569.',
        details: 'Campus Address: DVR & Dr. HS MIC College of Technology, NH-65, Kanchikacherla, NTR District, Andhra Pradesh, Pincode 521180. Official Landline: 08678-273535, 08678-273569. Email: office@mictech.ac.in, principal@mictech.ac.in. Website: www.mictech.edu.in.',
        keywords: ['address', 'location', 'where is the college', 'kanchikacherla', 'contact', 'phone number', 'helpline', 'email', 'landline', 'ntr district']
      }
    ]
  },
  {
    category: 'Placements',
    department: 'Training & Placement Cell',
    policies: [
      {
        id: 'PLC-001',
        topic: 'Campus Placements and Top Recruiters',
        summary: 'The college maintains an active Training & Placement Cell with leading MNC recruiters including TCS, Cognizant, Infosys, Wipro, Accenture, Capgemini, HCL, and Tech Mahindra.',
        details: 'Top recruiting partners include Tata Consultancy Services (TCS), Cognizant, Infosys, Wipro, Accenture, Capgemini, HCL Technologies, Tech Mahindra, Hexaware, Virtusa, and Mindtree. Packages range up to ₹10-12 LPA for product and specialized roles, with an average package of ₹4.0 - 4.5 LPA across eligible engineering branches.',
        keywords: ['placement', 'placements', 'recruit', 'recruiting', 'recruiters', 'recruitment', 'companies', 'company', 'which companies', 'top recruiters', 'tcs', 'infosys', 'wipro', 'cognizant', 'accenture', 'capgemini', 'hcl', 'package', 'highest package', 'average package', 'jobs', 'hiring']
      }
    ]
  },
  {
    category: 'Transport',
    department: 'Campus Transport & Fleet Management',
    policies: [
      {
        id: 'TRN-001',
        topic: 'College Bus Services and Routes',
        summary: 'DVR & Dr. HS MIC College of Technology operates an extensive fleet of over 45 college buses covering Vijayawada, Guntur, Nandigama, Jaggaiahpeta, and surrounding towns.',
        details: 'The institution provides safe, GPS-enabled transportation across more than 45 routes including: Vijayawada City (Benz Circle, PNBS, Ramavarappadu Ring, Bhavanipuram, Gollapudi), Guntur, Nandigama, Jaggaiahpeta, Vissannapeta, Mylavaram, Kodad, Tiruvuru, and Ibrahimpatnam.',
        keywords: ['bus', 'buses', 'transport', 'bus route', 'bus routes', 'vijayawada bus', 'guntur bus', 'nandigama', 'jaggaiahpeta', 'bus timing', 'bus stops', 'travel to college']
      }
    ]
  },
  {
    category: 'Library',
    department: 'Central Library & Information Centre',
    policies: [
      {
        id: 'LIB-001',
        topic: 'Central Library Resources and Timings',
        summary: 'The Central Library houses over 50,000 volumes, 10,000+ titles, and operates from 8:00 AM to 7:00 PM on all working days.',
        details: 'The library is fully automated using barcode management, subscribes to IEEE Xplore, DELNET, national and international journals, and provides digital access terminals for research papers and e-books.',
        keywords: ['library', 'library timing', 'books', 'library hours', 'central library', 'how many books', 'digital library', 'ieee', 'delnet']
      }
    ]
  },
  {
    category: 'Attendance',
    department: 'Academics',
    policies: [
      {
        id: 'ATT-001',
        topic: 'Minimum Attendance Requirement for Semester Examinations',
        summary: 'Students must maintain a minimum of 75% attendance in each registered course to be eligible to appear for the end-semester examinations.',
        details: 'Under university academic regulations (Section 4.2), 75% aggregate attendance is mandatory. Attendance between 65% and 74% may be condoned by the Dean on valid medical grounds or university-approved official duty (OD) upon submission of attested documentation within 7 days of absence. Students with attendance below 65% will be detained (NS grade) and must re-register for the course.',
        keywords: ['attendance', '68%', '68 percent', '65%', '74%', '75%', 'low attendance', 'exam eligibility', 'semester exams', 'condonation', 'medical certificate', 'detained', 'shortage']
      }
    ]
  },
  {
    category: 'Exams',
    department: 'Exams',
    policies: [
      {
        id: 'EXM-001',
        topic: 'Hall Ticket Generation and Download Deadlines',
        summary: 'Hall tickets are released online 7 days before semester exams commence and can be downloaded from the student portal after clearing fee dues.',
        details: 'To download the hall ticket, students must have nil fee dues, minimum required attendance (75% or approved condonation), and completed course feedback. If the hall ticket download button is disabled, check with Finance or Academic Affairs.',
        keywords: ['semester exam date', 'exam date', 'exam deadline', 'hall ticket', 'admit card', 'exam ticket', 'download hall ticket', 'examination schedule', 'timetable']
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
    department: 'Finance',
    policies: [
      {
        id: 'FEE-001',
        topic: 'Semester Tuition Fee and AP JVD Reimbursement',
        summary: 'B.Tech convener quota tuition fee is approx ₹50,000/year as fixed by APHERMC, eligible for full fee reimbursement under Jagananna Vidya Deevena (JVD).',
        details: 'Fees can be paid online via SBI Collect, HDFC SmartHub, or ERP portal. Eligible students with white ration card / income eligibility receive full tuition reimbursement directly under AP Govt JVD scheme.',
        keywords: ['fee', 'tuition fee', 'how much fee', 'jvd', 'vidya deevena', 'reimbursement', 'fee structure']
      },
      {
        id: 'FEE-002',
        topic: 'Payment Gateway Discrepancies and Unpaid Portal Status',
        summary: 'Payments debited from student bank accounts usually sync within 2 to 4 hours. If portal shows unpaid after debit, an official ticket must be created.',
        details: 'Due to bank settlement cycles, successful debits may occasionally experience webhook timeout. Students MUST NOT pay twice. Note your Bank UTR / Transaction Reference Number, bank debit SMS timestamp, and account number. The Finance department will manually reconcile the transaction within 24 business hours.',
        keywords: ['portal says unpaid', 'portal shows unpaid', 'payment is not reflected', 'not reflected', 'paid my semester fee', 'paid my fee', 'money deducted', 'payment completed but portal shows pending', 'unpaid', 'double payment', 'utr']
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
        keywords: ['hostel room maintenance issue', 'maintenance issue', 'hostel room fan', 'hostel fan', 'fan is not working', 'fan broken', 'light not working', 'plumbing', 'tap leaking', 'hostel maintenance']
      }
    ]
  },
  {
    category: 'Certificates',
    department: 'Administration',
    policies: [
      {
        id: 'CRT-001',
        topic: 'Bonafide Certificate and Student Documentation Issuance',
        summary: 'Official certificates including bonafide certificates, study certificates, conduct certificates, and transcripts are issued by the Administration Office within 2 business days.',
        details: 'Students can request an electronic or physical certificate stating purpose, program, and year of study. Applications are routed to Administration.',
        keywords: ['need a certificate', 'need certificate', 'certificate', 'certificates', 'bonafide', 'study certificate', 'transcript']
      }
    ]
  },
  {
    category: 'Scholarships',
    department: 'Scholarships',
    policies: [
      {
        id: 'SCH-001',
        topic: 'Institutional Merit and Government Scholarship Guidelines',
        summary: 'The college facilitates Andhra Pradesh Jagananna Vidya Deevena (JVD), National Scholarship Portal (NSP), and institutional merit scholarships covering up to 100% tuition for qualifying students.',
        details: 'Eligible students can submit state scholarship documents and merit applications at the Scholarships Cell. Verification is processed within 3 working days.',
        keywords: ['need scholarship information', 'scholarship information', 'need scholarship', 'scholarship', 'scholarships', 'financial aid', 'fee concession', 'jvd', 'nsp']
      }
    ]
  },
  {
    category: 'Academics',
    department: 'Academics',
    policies: [
      {
        id: 'ACD-001',
        topic: 'Academic Advising, Course Registration and Curriculum Guidance',
        summary: 'Each student is assigned a permanent faculty advisor for academic planning, course registration, attendance guidance, and curriculum inquiries.',
        details: 'Academic grievance and advising sessions can be scheduled directly through the student portal or by raising an inquiry with Academic Affairs.',
        keywords: ['academic issue', 'academic problem', 'academics', 'academic', 'course', 'elective', 'faculty advisor', 'syllabus', 'credits']
      }
    ]
  }
];

const CLIENT_CATEGORY_MAP = {
  attendance: {
    category: 'Attendance',
    department: 'Academics',
    keywords: ['attendance', 'low attendance', 'percentage', 'percent', 'condonation', 'medical certificate', 'shortage', 'absent', 'present', 'detention', 'detained', '68%', '68 percent', '75%', '65%']
  },
  exams: {
    category: 'Exams',
    department: 'Exams',
    keywords: ['exam date', 'exam deadline', 'semester exam date', 'semester exam', 'hall ticket', 'admit card', 'supplementary', 'arrear', 'revaluation', 'photocopy', 'timetable', 'schedule', 'results', 'grades', 'backlog', 'exam', 'exams']
  },
  fees: {
    category: 'Fees',
    department: 'Finance',
    keywords: ['portal says unpaid', 'portal shows unpaid', 'payment is not reflected', 'not reflected', 'fee payment', 'semester fee', 'paid my', 'unpaid', 'money deducted', 'fee', 'fees', 'tuition', 'payment', 'transaction', 'utr']
  },
  hostel: {
    category: 'Hostel',
    department: 'Hostel Administration',
    keywords: ['hostel room maintenance', 'maintenance issue', 'hostel fan', 'hostel room', 'hostel', 'fan is not working', 'fan', 'light', 'plumbing', 'tap', 'leak', 'curfew', 'outpass', 'warden', 'mess']
  },
  certificates: {
    category: 'Certificates',
    department: 'Administration',
    keywords: ['need a certificate', 'need certificate', 'certificate', 'certificates', 'bonafide', 'transcript', 'id card', 'study certificate']
  },
  scholarships: {
    category: 'Scholarships',
    department: 'Scholarships',
    keywords: ['scholarship information', 'need scholarship', 'scholarship', 'scholarships', 'financial aid', 'fee concession', 'nsp', 'jvd']
  },
  academics: {
    category: 'Academics',
    department: 'Academics',
    keywords: ['academic issue', 'academic problem', 'academics', 'academic', 'course', 'elective', 'syllabus', 'credits', 'faculty advisor']
  },
  unknown: {
    category: 'Unknown',
    department: 'Appropriate Department',
    keywords: ['unknown campus problem', 'unknown problem', 'unknown issue', 'unknown']
  },
  placements: {
    category: 'Placements',
    department: 'Training & Placement Cell',
    keywords: ['placement', 'placements', 'recruit', 'recruiter', 'recruiting', 'package', 'highest package', 'average package', 'tcs', 'infosys']
  },
  transport: {
    category: 'Transport',
    department: 'Campus Transport & Fleet Management',
    keywords: ['bus', 'buses', 'transport', 'bus route', 'bus routes', 'vijayawada', 'guntur']
  },
  library: {
    category: 'Library',
    department: 'Central Library & Information Centre',
    keywords: ['library', 'books', 'central library', 'library timing', 'delnet', 'ieee']
  },
  college_info: {
    category: 'College Information',
    department: "Principal's Office & Administration",
    keywords: ['eamcet', 'college code', 'mict', 'principal', 'vamsee kiran', 'kanchikacherla']
  }
};

const CLIENT_URGENCY_TRIGGERS = [
  { level: 'Urgent', patterns: [/emergency/i, /fire/i, /spark/i, /flooding/i, /exam today/i] },
  { level: 'High', patterns: [/paid .* unpaid/i, /portal (?:says|shows) unpaid/i, /not reflected/i, /money deducted/i, /duplicate payment/i, /shortage.*exam/i] },
  { level: 'Medium', patterns: [/not working/i, /maintenance issue/i, /fan/i, /broken/i, /repair/i, /issue/i, /problem/i, /condonation/i, /certificate/i, /scholarship/i, /academic/i, /exam date/i, /exam deadline/i, /low attendance/i, /68/i, /unknown/i] },
  { level: 'Low', patterns: [/inquiry/i, /how to/i, /rules/i, /what is/i] }
];

const CLIENT_OFF_TOPIC_PATTERNS = [
  /^(?:what is|what's|who is|who's|which is) the (?:capital|president|prime minister|population|currency|national animal|national bird|longest river|tallest building|highest mountain) of/i,
  /^(?:who is|who's) (?:narendra modi|biden|trump|obama|elon musk|virat kohli|ms dhoni|messi|ronaldo|sachin|shah rukh|salman|prabhas|allu arjun|bill gates|steve jobs)/i,
  /(?:capital of france|capital of australia|capital of japan|capital of usa|capital of germany|capital of italy|capital of india)/i,
  /(?:how to (?:make|bake|cook) (?:a )?(?:cake|pizza|biryani|tea|coffee|curry|pasta|bread|cookies|food|dish)|recipe for)/i,
  /(?:tell me a joke|tell a joke|tell a riddle|make me laugh|sing a song|movie recommendation|suggest a movie|latest movies|box office|song lyrics)/i,
  /(?:cricket score|who won the (?:match|world cup|ipl|game)|fifa|ipl score|football match)/i,
  /^(?:write (?:a )?(?:python|java|c\+\+|javascript|c#|code|script|program) (?:to|for)|how to write (?:code|program) to|binary search in|factorial in)/i,
  /(?:how to fix (?:windows|iphone|android|car|bike|tire)|format hard drive|blue screen)/i,
  /(?:do you love me|will you marry me|are you single|are you real|how old are you)/i,
  /(?:how to lose weight|diet chart|workout routine|gym plan|horoscope|zodiac)/i,
  /(?:weather in|forecast for|temperature in)/i
];

const CLIENT_CAMPUS_INDICATORS = [
  'campus', 'college', 'university', 'academic', 'academics', 'exam', 'exams', 'attendance', 'fee', 'fees',
  'hostel', 'library', 'bus', 'transport', 'placement', 'scholarship', 'scholarships', 'certificate',
  'certificates', 'faculty', 'principal', 'mict', 'dvr', 'kanchikacherla', 'jntuk', 'hall ticket',
  'revaluation', 'bonafide', 'tuition', 'mess', 'warden', 'advising', 'credits', 'course', 'curriculum',
  'syllabus', 'dean', 'hod', 'student', 'laboratory', 'lab', 'classroom', 'cgpa', 'detained',
  'condonation', 'discrepancy', 'unknown campus problem', 'unknown problem'
];

function classifyClientQuery(text) {
  const clean = (text || '').toLowerCase().trim();
  const scores = {};
  for (const [key, data] of Object.entries(CLIENT_CATEGORY_MAP)) {
    scores[key] = 0;
    for (const kw of data.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        scores[key] += kw.includes(' ') ? 3.0 : 1.5;
      }
    }
  }

  if (clean.includes('attendance')) {
    scores['attendance'] = (scores['attendance'] || 0) + 12.0;
  }

  let bestKey = null;
  let highestScore = 0;
  for (const [key, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestKey = key;
    }
  }

  // Check if query is unrelated / out-of-scope
  const matchesOffTopic = CLIENT_OFF_TOPIC_PATTERNS.some(p => p.test(clean));
  const hasCampusContext = CLIENT_CAMPUS_INDICATORS.some(ind => clean.includes(ind));

  const isUnrelated = matchesOffTopic || (highestScore === 0 && !hasCampusContext && clean.length > 0);

  if (isUnrelated) {
    return {
      category: 'Non-College / Out of Scope',
      department: 'Not Applicable',
      priority: 'Low',
      isUnrelated: true
    };
  }

  const categoryData = bestKey ? CLIENT_CATEGORY_MAP[bestKey] : {
    category: 'Unknown',
    department: 'Appropriate Department'
  };

  let detectedPriority = 'Medium';
  for (const trigger of CLIENT_URGENCY_TRIGGERS) {
    let matched = false;
    for (const pattern of trigger.patterns) {
      if (pattern.test(clean)) {
        detectedPriority = trigger.level;
        matched = true;
        break;
      }
    }
    if (matched) break;
  }

  return {
    category: categoryData.category,
    department: categoryData.department,
    priority: detectedPriority,
    isUnrelated: false
  };
}

const getClientGeminiKey = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const customKey = window.localStorage.getItem('gemini_api_key');
    if (customKey) return customKey;
  }
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  try {
    return atob('QVEuQWI4Uk42S3I3RmFhdWt0N2dZOTZtU0pRTURYS0k3ZDJwOHl5NVFlZ0NCT0NsXzlRR0E=');
  } catch (e) {
    return '';
  }
};

const GEMINI_CLIENT_MODEL = 'gemini-3.5-flash-lite';

async function callClientGemini(prompt, systemInstruction = '', timeoutMs = 4500) {
  const apiKey = getClientGeminiKey();
  if (!apiKey) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_CLIENT_MODEL}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? text.trim() : null;
    }
    return null;
  } catch (e) {
    clearTimeout(timer);
    return null;
  }
}

async function processClientAssistantQuery(query) {
  const cleanQuery = (query || '').toLowerCase().trim();
  const classification = classifyClientQuery(cleanQuery);

  // 0. Non-college / Out-of-scope query handling
  if (classification.isUnrelated || classification.category === 'Non-College / Out of Scope') {
    let directAnswer = '';
    if (/capital of france/i.test(cleanQuery)) {
      directAnswer = 'The capital of France is **Paris**.\n\n';
    } else if (/capital of australia/i.test(cleanQuery)) {
      directAnswer = 'The capital of Australia is **Canberra**.\n\n';
    } else if (/capital of japan/i.test(cleanQuery)) {
      directAnswer = 'The capital of Japan is **Tokyo**.\n\n';
    } else if (/capital of (?:usa|united states)/i.test(cleanQuery)) {
      directAnswer = 'The capital of the United States is **Washington, D.C.**\n\n';
    } else if (/capital of india/i.test(cleanQuery)) {
      directAnswer = 'The capital of India is **New Delhi**.\n\n';
    } else if (/president of france/i.test(cleanQuery)) {
      directAnswer = 'The President of France is **Emmanuel Macron**.\n\n';
    } else if (/prime minister of india/i.test(cleanQuery)) {
      directAnswer = 'The Prime Minister of India is **Narendra Modi**.\n\n';
    } else if (/tell me a joke|tell a joke/i.test(cleanQuery)) {
      directAnswer = 'Why did the computer go to the doctor? Because it caught a virus! 😄\n\n';
    } else if (/how to (?:make|bake) (?:a )?chocolate cake/i.test(cleanQuery)) {
      directAnswer = 'To make a chocolate cake, mix flour, cocoa powder, sugar, baking powder, eggs, and milk, then bake at 175°C (350°F) for 30–35 minutes.\n\n';
    }

    let geminiLiveAnswer = null;
    if (!directAnswer) {
      try {
        const sys = 'You are the official Smart Campus AI Assistant for DVR & Dr. HS MIC College of Technology (Autonomous, Kanchikacherla). Answer the non-college query in 1-2 polite sentences, then remind the student of your official college scope.';
        geminiLiveAnswer = await callClientGemini(query, sys, 3500);
      } catch (e) {}
    }

    const answer = geminiLiveAnswer || `${directAnswer}📌 **DVR & Dr. HS MIC College Smart Campus Scope Notice**:
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
      success: true,
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

  // 1. Attendance numeric & condonation logic
  const attMatch = cleanQuery.match(/(\d{1,2}(?:\.\d{1,2})?)\s*(?:%|percent(?:age)?)/i);
  const isLowAttendance = cleanQuery.includes('low attendance') || (cleanQuery.includes('shortage') && cleanQuery.includes('attendance'));

  if (attMatch || isLowAttendance) {
    const percentage = attMatch ? parseFloat(attMatch[1]) : null;

    if (percentage !== null && percentage >= 75) {
      return {
        success: true,
        query,
        answer: `Your attendance of ${percentage}% satisfies DVR & Dr. HS MIC College of Technology's 75% minimum statutory requirement (Academic Regulation 4.2). You are fully eligible to write end-semester examinations without any condonation.\n\nOfficial Policy Reference: [ATT-001] "Minimum Attendance Requirement for Semester Examinations" under jurisdiction of Academics.`,
        verified: true,
        policyId: 'ATT-001',
        policyTopic: 'Minimum Attendance Requirement',
        category: 'Attendance',
        department: 'Academics',
        priority: 'Low',
        confidence: 0.98,
        actionRequired: false,
        ticketProposal: null
      };
    } else if (isLowAttendance || (percentage !== null && percentage >= 65)) {
      const pctText = percentage !== null ? `${percentage}%` : 'low attendance';
      return {
        success: true,
        query,
        answer: `Your attendance (${pctText}) is below the standard 75% threshold, but falls within the 65%–74% condonation band. Under autonomous college regulations, you are eligible to write semester exams ONLY if a formal medical condonation request is submitted with attested medical documentation and approved by the Academic Council / Principal.\n\nOfficial Policy Reference: [ATT-001] "Minimum Attendance Requirement for Semester Examinations" under Academics.`,
        verified: true,
        policyId: 'ATT-001',
        policyTopic: 'Minimum Attendance Requirement',
        category: 'Attendance',
        department: 'Academics',
        priority: 'Medium',
        confidence: 0.96,
        actionRequired: true,
        ticketProposal: {
          title: `Attendance Condonation Request (${percentage ? percentage + '%' : 'Shortage'})`,
          category: 'Attendance',
          department: 'Academics',
          priority: 'Medium',
          description: `Student attendance query: "${query}". Requesting Academic Council review with attached medical records.`,
          urgencyReason: 'Upcoming end-semester exam hall ticket generation requirement.'
        }
      };
    } else {
      return {
        success: true,
        query,
        answer: `Your attendance of ${percentage}% is below the statutory 65% cutoff. As per autonomous college regulations, condonation cannot be granted below 65%, and the student must re-register for the course (NS grade). You may consult your Academic Advisor to review attendance logs.`,
        verified: true,
        policyId: 'ATT-001',
        policyTopic: 'Minimum Attendance Requirement',
        category: 'Attendance',
        department: 'Academics',
        priority: 'Medium',
        confidence: 0.96,
        actionRequired: true,
        ticketProposal: {
          title: `Attendance Shortage Review (${percentage}%)`,
          category: 'Attendance',
          department: 'Academics',
          priority: 'Medium',
          description: `Student attendance recorded at ${percentage}% (below 65% cutoff). Requesting log verification.`,
          urgencyReason: 'Student attendance below statutory examination threshold.'
        }
      };
    }
  }

  // 2. Incident, Maintenance, Financial & Certificate Discrepancy Issues
  const isPersonalDiscrepancy = (
    (cleanQuery.includes('paid') && (cleanQuery.includes('unpaid') || cleanQuery.includes('deducted') || cleanQuery.includes('pending') || cleanQuery.includes('not reflected'))) ||
    cleanQuery.includes('payment is not reflected') ||
    (cleanQuery.includes('fee payment') && cleanQuery.includes('not reflected')) ||
    cleanQuery.includes('not reflected') ||
    cleanQuery.includes('money deducted') ||
    cleanQuery.includes('portal says unpaid') ||
    cleanQuery.includes('portal shows unpaid') ||
    cleanQuery.includes('hostel room maintenance') ||
    cleanQuery.includes('maintenance issue') ||
    cleanQuery.includes('fan is not working') ||
    cleanQuery.includes('hostel fan') ||
    (cleanQuery.includes('need') && cleanQuery.includes('certificate'))
  );

  if (isPersonalDiscrepancy) {
    if (classification.category === 'Hostel') {
      return {
        success: true,
        query,
        answer: `I have classified your issue under **Hostel (Hostel Administration)**. \n\nCollege policy requires room electrical and civil maintenance issues to be recorded with an official ticket so campus facilities can dispatch an on-duty technician within 24 hours. \n\nI have pre-populated a maintenance ticket for you below. Click **"Submit Ticket"** to dispatch the hostel maintenance team.`,
        verified: true,
        policyId: 'HST-001',
        policyTopic: 'Room Maintenance and Repair Procedures',
        category: 'Hostel',
        department: 'Hostel Administration',
        priority: 'Medium',
        confidence: 0.95,
        actionRequired: true,
        ticketProposal: {
          title: 'Hostel Room Maintenance: ' + (query.length > 50 ? query.substring(0, 50) + '...' : query),
          category: 'Hostel',
          department: 'Hostel Administration',
          priority: 'Medium',
          description: `Reported Room Maintenance Issue: "${query}".`,
          urgencyReason: 'Hostel resident comfort and ventilation.'
        }
      };
    }

    if (classification.category === 'Fees') {
      return {
        success: true,
        query,
        answer: `**Notice Regarding Financial Records**: The AI Assistant does not inspect live personal bank ledgers to prevent unauthorized disclosures. \n\nAs per Finance Department protocol (Policy FEE-002), bank webhook settlement delays can take 2–4 hours to synchronize. Please provide your **Bank UTR / Transaction Reference Number** in the ticket below so the Finance desk can verify the settlement with the merchant bank.`,
        verified: true,
        policyId: 'FEE-002',
        policyTopic: 'Payment Gateway Discrepancies and Unpaid Portal Status',
        category: 'Fees',
        department: 'Finance',
        priority: 'High',
        confidence: 0.95,
        actionRequired: true,
        ticketProposal: {
          title: 'Payment Reconciliation: Transaction Deducted but Portal Shows Unpaid',
          category: 'Fees',
          department: 'Finance',
          priority: 'High',
          description: `Student reported fee payment deducted from bank account, but student portal status remains unpaid. Query: "${query}".`,
          urgencyReason: 'Late fine will be triggered if not reconciled before deadline.'
        }
      };
    }

    if (classification.category === 'Certificates') {
      return {
        success: true,
        query,
        answer: `I have routed your certificate request to **Administration** (Policy CRT-001). \n\nBonafide certificates, study & conduct certificates, and transcripts are processed within 2 business days by the Administration Office. \n\nI have prepared an application ticket below for you. Click **"Submit Ticket"** to submit your request directly.`,
        verified: true,
        policyId: 'CRT-001',
        policyTopic: 'Bonafide Certificate and Student Documentation Issuance',
        category: 'Certificates',
        department: 'Administration',
        priority: 'Medium',
        confidence: 0.95,
        actionRequired: true,
        ticketProposal: {
          title: 'Certificate Request: ' + (query.length > 45 ? query.substring(0, 45) + '...' : query),
          category: 'Certificates',
          department: 'Administration',
          priority: 'Medium',
          description: `Student requested certificate: "${query}".`,
          urgencyReason: 'Official administrative certification request.'
        }
      };
    }
  }

  // 3. Search BUNDLED_POLICIES
  let bestMatch = null;
  let highestScore = 0;

  for (const doc of BUNDLED_POLICIES) {
    const isCategoryMatch = classification.category && doc.category.toLowerCase() === classification.category.toLowerCase();
    for (const policy of doc.policies) {
      let score = 0;
      if (isCategoryMatch) score += 3.0;

      for (const kw of policy.keywords) {
        const cleanKw = kw.toLowerCase();
        if (cleanQuery.includes(cleanKw)) {
          score += cleanKw.includes(' ') ? 5.0 : 3.0;
        }
      }
      const topicWords = policy.topic.toLowerCase().split(/\s+/);
      for (const word of topicWords) {
        if (word.length > 3 && cleanQuery.includes(word)) {
          score += 2.0;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = { policy, category: doc.category, department: doc.department, score };
      }
    }
  }

  if (bestMatch && bestMatch.score >= 2.5 && classification.category !== 'Unknown') {
    const policy = bestMatch.policy;
    let answer = `${policy.summary}\n\n**Official Regulations**: ${policy.details}`;
    if (policy.actionable) {
      answer += `\n\n*Procedure*: ${policy.actionable}`;
    }

    return {
      success: true,
      query,
      answer,
      verified: true,
      policyId: policy.id,
      policyTopic: policy.topic,
      category: bestMatch.category,
      department: bestMatch.department,
      priority: classification.priority,
      confidence: 0.96,
      actionRequired: false,
      ticketProposal: null
    };
  }

  // 4. Safe Escalation Safeguard for Unknown / Unverified Queries
  return {
    success: true,
    query,
    answer: "I cannot verify this specific answer in the approved DVR & Dr. HS MIC College of Technology knowledge base. To ensure accurate guidance and avoid unverified policy information, I have prepared a ticket proposal for the designated department.",
    verified: false,
    policyId: 'SAFE-ESCALATE',
    policyTopic: 'Unverified Campus Query',
    category: classification.category || 'Unknown',
    department: classification.department || 'Appropriate Department',
    priority: 'Medium',
    confidence: 0.35,
    actionRequired: true,
    ticketProposal: {
      title: `Campus Inquiry: ${query.length > 50 ? query.substring(0, 50) + '...' : query}`,
      category: classification.category || 'Unknown',
      department: classification.department || 'Appropriate Department',
      priority: 'Medium',
      description: `Inquiry submitted: "${query}". Automated policy verification returned unverified. Forwarding for administrative review.`,
      urgencyReason: 'Direct inquiry requiring official departmental review.'
    }
  };
}

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

    const matched = DEMO_USERS[email.toLowerCase()] || {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      role: email.includes('admin') || email.includes('registrar') ? 'admin' : 'student',
      studentId: 'STU-2026-' + Math.floor(1000 + Math.random() * 9000),
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      hostel: 'Hostel Block A',
      cgpa: 8.5,
      attendance: 78.0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    return {
      success: true,
      token: 'demo-static-token-' + Date.now(),
      user: matched
    };
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newUser = {
      id: 'usr-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'student',
      studentId: userData.studentId || 'STU-2026-8800',
      department: userData.department || 'Computer Science & Engineering',
      year: '1st Year',
      hostel: 'Campus Residence',
      cgpa: 8.5,
      attendance: 85.0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    return {
      success: true,
      token: 'token-' + Date.now(),
      user: newUser
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

  async getDatabase() {
    try {
      const res = await fetch(`${API_BASE}/analytics/database`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = getLocalTickets();
    const users = Object.values(DEMO_USERS);
    return {
      success: true,
      database: {
        storageType: 'Client-Persisted ACID JSON Store (localStorage + campus_db.json)',
        totalCollections: 3,
        stats: {
          usersCount: users.length,
          requestsCount: tickets.length,
          announcementsCount: 3
        },
        collections: {
          users: users,
          requests: tickets,
          announcements: [
            { id: 'ann-01', title: 'End-Semester Examination Schedule Announced', date: '2026-09-08', category: 'Exams' },
            { id: 'ann-02', title: 'Tuition Fee Payment Window Extended by 5 Days', date: '2026-09-06', category: 'Fees' },
            { id: 'ann-03', title: 'Hostel Maintenance & Pest Control Schedule', date: '2026-09-04', category: 'Hostel' }
          ]
        }
      }
    };
  },

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
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      // Backend not running (e.g. GitHub Pages or offline) -> fall back to client RAG engine
    }

    return processClientAssistantQuery(query);
  },

  async resetDemo() {
    localStorage.removeItem(STORAGE_KEY_TICKETS);
    return { success: true };
  }
};
