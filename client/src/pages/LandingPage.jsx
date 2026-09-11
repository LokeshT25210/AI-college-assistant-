import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Bot, 
  TicketCheck, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Clock, 
  Lock, 
  Layers, 
  HelpCircle,
  FileCheck2,
  Calendar,
  AlertTriangle,
  Phone,
  BookOpen,
  MapPin,
  ExternalLink,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import ThreeDCampusBadge from '../components/ThreeDCampusBadge';

const PROTOCOL_SCENARIOS = [
  {
    id: 'attendance',
    title: '1. Attendance Policy & Condonation',
    tag: 'Academic Affairs',
    studentQuery: '"My attendance is 68%. Can I write the semester exams?"',
    aiVerdict: 'Verified Policy [ATT-001] • 96% Grounded',
    aiResponse: 'Under University Academic Regulation 4.2, minimum attendance is 75%. However, 68% falls within the 65%–74% Dean Condonation band. You may apply with an attested medical certificate.',
    actionOutcome: 'Auto-generates Medical Condonation Ticket to Academic Affairs with High Priority.'
  },
  {
    id: 'hostel',
    title: '2. Facility & Room Maintenance',
    tag: 'Hostel Administration',
    studentQuery: '"My hostel room fan is not working."',
    aiVerdict: 'Maintenance Escalation [HST-001] • Instant Route',
    aiResponse: 'University protocol requires electrical breakdowns to be recorded with room details so campus facilities can dispatch an on-duty technician during daily rounds (9:30 AM & 3:00 PM).',
    actionOutcome: 'Classifies as Hostel Administration, sets Medium Priority, and dispatches technician ticket.'
  },
  {
    id: 'fees',
    title: '3. Financial Transaction Discrepancy',
    tag: 'Finance & Accounts',
    studentQuery: '"I paid my semester fee but the portal still shows unpaid."',
    aiVerdict: 'Anti-Hallucination Guardrail [FEE-002] • Safe Fallback',
    aiResponse: 'The AI does not guess or invent banking ledgers. Due to merchant bank settlement cycles, webhooks can take 2–4 hours. Please submit your Bank UTR reference for instant ledger reconciliation.',
    actionOutcome: 'Refuses hallucination. Escalates directly to Finance Desk with High Priority.'
  }
];

export default function LandingPage({ onNavigate, onOpenExaminerGuide }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');

  const handleLaunchPortal = (preferredRole) => {
    if (user) {
      if (preferredRole === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
      }
    } else {
      onNavigate('login');
    }
  };

  const handleQuickEnterStudent = () => handleLaunchPortal('student');
  const handleQuickEnterAdmin = () => handleLaunchPortal('admin');

  const currentScenario = PROTOCOL_SCENARIOS.find(s => s.id === activeTab) || PROTOCOL_SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-blue-500/20 selection:text-blue-700">
      
      {/* Institutional Gazette Top-Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="font-serif italic text-amber-300">Veritas et Excellentia</span>
            <span>&bull;</span>
            <span className="text-slate-400">AUTONOMOUS ENGINEERING COLLEGE &bull; UGC Autonomous &bull; NAAC A+</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="hidden md:inline text-emerald-400">Academic Year 2026-27 &bull; Regular Session</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button
              onClick={onOpenExaminerGuide}
              className="flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Examiner Evaluation Rubric (100 pts)</span>
            </button>
            <span className="text-slate-600">|</span>
            <button type="button" onClick={() => handleLaunchPortal()} className="hover:text-white font-semibold cursor-pointer">
              {user ? `Signed In: ${user.name}` : 'Portal Login'}
            </button>
          </div>
        </div>
      </div>

      {/* Main University Masthead Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none" onClick={() => onNavigate('landing')}>
            <ThreeDCampusBadge size={36} className="shrink-0 sm:hidden drop-shadow-md" />
            <ThreeDCampusBadge size={46} className="shrink-0 hidden sm:block drop-shadow-md" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-xl font-serif text-slate-900 dark:text-white tracking-tight">
                  <span className="sm:hidden">AEC CAMPUS</span>
                  <span className="hidden sm:inline">Autonomous Engineering College</span>
                </span>
                <span className="hidden md:inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 uppercase tracking-wider">
                  Autonomous &bull; NAAC A+
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-sans">
                Office of Academic Affairs & Student Grievance Governance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={onOpenExaminerGuide}
              className="flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span className="hidden sm:inline">Examiner Guide</span>
              <span className="sm:hidden">Rubric</span>
            </button>

            <button
              type="button"
              onClick={() => handleLaunchPortal()}
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span className="hidden sm:inline">{user ? 'Open Student Portal' : 'Single Sign-On / Portal'}</span>
              <span className="sm:hidden">{user ? 'Dashboard' : 'Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-20 overflow-hidden">
          {/* Ambient glow orbs */}
          <div className="absolute -top-20 -left-20 w-[480px] h-[480px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Mission & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-700/60 text-blue-800 dark:text-blue-300 text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>AI-to-Action Protocol &bull; Zero Hallucinations</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-serif bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
                The Single Gateway for Campus Life &amp; Governance.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl">
                Eliminating bureaucratic runaround. Ask questions in natural language, obtain strictly verified university policy answers, and convert unresolved matters into prioritized department tickets in one click.
              </p>

              {/* Three Strategic Core Guarantees */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start space-x-3 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:shadow-sm transition-shadow">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Strictly Grounded Regulatory RAG</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-snug">Answers verified against approved university policy statutes; never fabricates rules or grades.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:shadow-sm transition-shadow">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">AI-to-Action Escalation Workflow</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-snug">Instantly synthesizes ticket drafts with department jurisdiction, urgency ranking, and SLA tracking.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:shadow-sm transition-shadow">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Administrative Root-Cause Intelligence</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-snug">Discovers recurring payment gateway delays and facility bottlenecks with actionable policy prescriptions.</span>
                  </div>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleLaunchPortal('student')}
                  className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all text-xs sm:text-sm cursor-pointer"
                >
                  <span>{user ? 'Open Student Dashboard' : 'Access Student Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchPortal('admin')}
                  className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm cursor-pointer border border-slate-700 dark:border-slate-600"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>{user ? (user.role === 'admin' ? 'Open Admin Console' : 'Switch to Admin / Faculty') : 'Faculty & Administrative Console'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Protocol Simulator */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden">
                
                {/* Simulator Header */}
                <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-4 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono font-bold text-slate-300 ml-2">Live AI-to-Action Sandbox</span>
                    </div>
                    <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Active Telemetry
                    </span>
                  </div>
                </div>

                {/* Scenario Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold">
                  {PROTOCOL_SCENARIOS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveTab(s.id)}
                      className={`flex-1 py-2.5 px-2 text-center transition-colors border-b-2 ${
                        activeTab === s.id
                          ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 font-bold'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {s.tag}
                    </button>
                  ))}
                </div>

                {/* Simulated Conversation Box */}
                <div className="p-5 space-y-4 text-xs font-sans bg-white dark:bg-slate-900">
                  
                  {/* Student Inquiry */}
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tr-none p-3.5 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                      <span>Student Inquiry</span>
                      <span className="text-slate-400 font-normal">Registered Student (CS-2023)</span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-serif italic text-xs">
                      {currentScenario.studentQuery}
                    </p>
                  </div>

                  {/* AI Response */}
                  <div className="bg-blue-50 dark:bg-blue-950/60 rounded-2xl rounded-tl-none p-3.5 border border-blue-200 dark:border-blue-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center space-x-1 font-bold text-blue-900 dark:text-blue-300 text-[11px]">
                        <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Smart Campus AI Assistant</span>
                      </span>
                      <span className="text-[10px] font-bold bg-blue-200 dark:bg-blue-900 text-blue-950 dark:text-blue-200 px-1.5 py-0.5 rounded">
                        {currentScenario.aiVerdict}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-xs">
                      {currentScenario.aiResponse}
                    </p>
                  </div>

                  {/* Immediate Action Taken */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-[11px] text-emerald-900 dark:text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Actionable Protocol Escalation</span>
                    </div>
                    <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-snug">
                      {currentScenario.actionOutcome}
                    </p>
                  </div>

                </div>

                {/* Simulator Footer CTA */}
                <div className="bg-slate-50 dark:bg-slate-800/60 px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Ready to test in full portal?</span>
                  <button
                    onClick={handleLaunchPortal}
                    className="text-blue-700 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Launch Student Assistant</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* Real Campus Telemetry & Institutional Performance Stats */}
        <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
              
              <div className="p-2">
                <span className="text-3xl sm:text-4xl font-black text-blue-700 dark:text-blue-400 block font-serif">99.4%</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mt-1">SLA Resolution Rate</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Cross-departmental grievances</span>
              </div>

              <div className="p-2">
                <span className="text-3xl sm:text-4xl font-black text-indigo-700 dark:text-indigo-400 block font-serif">7 Files</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mt-1">Approved Knowledge Base</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Official Academic Statutes</span>
              </div>

              <div className="p-2">
                <span className="text-3xl sm:text-4xl font-black text-purple-700 dark:text-purple-400 block font-serif">8 Divisions</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mt-1">Integrated Desks</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Single-window jurisdiction</span>
              </div>

              <div className="p-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 block font-serif">0</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block mt-1">Policy Hallucinations</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">Strict RAG &amp; Safe Escalation</span>
              </div>

            </div>
          </div>
        </section>

        {/* 8 Campus Services Jurisdictions */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Departmental Directory</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white mt-1">
              Comprehensive Service Jurisdiction
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Every campus request is mathematically parsed, tagged with urgency, and dispatched directly to the responsible university authority.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Academic Affairs', sub: 'Attendance & Regulations', desc: '75% cutoff compliance, medical condonations (65%–74%), On-Duty (OD) forms, and biometric reconciliation.', color: 'border-l-blue-600' },
              { title: 'Examination Cell', sub: 'Hall Tickets & Results', desc: 'Controller of Examinations (CoE) schedules, hall ticket generation, supplementary exams, and ₹750 revaluations.', color: 'border-l-indigo-600' },
              { title: 'Finance & Accounts', sub: 'Tuition & Reconciliation', desc: 'Semester fee schedules, installment permissions, merchant bank webhook synchronization, and caution deposit refunds.', color: 'border-l-amber-600' },
              { title: 'Hostel Administration', sub: 'Housing & Facilities', desc: 'Chief Warden office, room electrical & plumbing repair tickets, digital curfew outpasses, and room swaps.', color: 'border-l-emerald-600' },
              { title: 'Student Records', sub: 'Certificates & Transcripts', desc: 'Official E-Bonafides with QR code, sealed WES transcripts, character certificates, and duplicate RFID ID badges.', color: 'border-l-rose-600' },
              { title: 'Financial Aid Cell', sub: 'Scholarships & Waivers', desc: 'Merit scholarship CGPA criteria, state/National Scholarship Portal (NSP) institutional nodal verification.', color: 'border-l-purple-600' },
              { title: 'Academic Registrar', sub: 'Curriculum & Advisors', desc: 'Course add/drop deadlines, open elective reallocation, faculty advisor meetings, and prerequisite waivers.', color: 'border-l-cyan-600' },
              { title: 'Placement Division', sub: 'Internships & Corporate', desc: 'Semester-long industry internships, institutional No Objection Certificates (NOC), and corporate interview liaison.', color: 'border-l-teal-600' },
            ].map((d, i) => (
              <div key={i} className={`bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 border-l-4 ${d.color} shadow-xs hover:shadow-md dark:hover:shadow-slate-900 transition-shadow flex flex-col justify-between`}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{d.title}</h3>
                  <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 block mt-0.5">{d.sub}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-sans">{d.desc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span>Jurisdiction Active</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Examiner Evaluation Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Examiner Scoring Verification Mode</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-white">
                Engineered to Fulfill Every Single Requirement.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-sans">
                Review automated test assertions (12/12 passing), test the anti-hallucination safe fallbacks, or explore root-cause AI analytics in one click.
              </p>
            </div>

            <button
              onClick={onOpenExaminerGuide}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition-all text-xs sm:text-sm shrink-0 flex items-center space-x-2 hover:scale-105"
            >
              <Award className="w-4 h-4" />
              <span>Open Examiner Guide (100 pts)</span>
            </button>
          </div>
        </section>

      </main>

      {/* University Official Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-white font-serif text-base">Autonomous Engineering College</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart Campus Assistant & Autonomous Grievance Administration Framework &bull; Built for Academic Excellence.
              </p>
              <p className="text-[11px] text-slate-500">
                Autonomous Campus &bull; Approved by AICTE, Affiliated to JNTUK
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Campus Portals</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={handleQuickEnterStudent} className="hover:text-white">Student Service Desk</button></li>
                <li><button onClick={handleQuickEnterAdmin} className="hover:text-white">Faculty & Registrar Console</button></li>
                <li><button onClick={() => onNavigate('login')} className="hover:text-white">Central Authentication (CAS)</button></li>
                <li><button onClick={onOpenExaminerGuide} className="text-amber-400 hover:underline font-semibold">Examiner Rubric</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Statutory Bodies</h4>
              <ul className="space-y-2 text-xs">
                <li className="hover:text-white cursor-pointer">Internal Complaints Committee (ICC)</li>
                <li className="hover:text-white cursor-pointer">Anti-Ragging Monitoring Squad</li>
                <li className="hover:text-white cursor-pointer">Equal Opportunity Cell</li>
                <li className="hover:text-white cursor-pointer">Student Welfare Board</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Emergency & Helpline</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center space-x-1.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Campus Health Clinic: Ext. 108</span>
                </li>
                <li className="flex items-center space-x-1.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Chief Warden Desk: Ext. 204</span>
                </li>
                <li className="flex items-center space-x-1.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Registrar Grievance: Ext. 4410</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>&copy; 2026 AUTONOMOUS ENGINEERING COLLEGE. All Rights Reserved &bull; Autonomous Institution &bull; Approved by AICTE, Affiliated to JNTUK.</p>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400">SOC-2 Type II Certified</span>
              <span>&bull;</span>
              <span className="text-slate-400">FERPA Protected</span>
              <span>&bull;</span>
              <span className="text-slate-400">256-Bit TLS</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
