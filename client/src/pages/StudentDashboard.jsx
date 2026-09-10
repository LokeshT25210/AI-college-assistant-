import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import RequestCard from '../components/RequestCard';
import CreateTicketModal from '../components/CreateTicketModal';
import { 
  Bot, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  GraduationCap, 
  Building2, 
  CreditCard, 
  Home, 
  Award, 
  Briefcase, 
  Layers, 
  Bell,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';

const CATEGORIES = [
  { id: 'attendance', name: 'Attendance', icon: Clock, desc: '68.5% logged & condonation', sampleQuery: 'My attendance is 68%. Can I write the semester exams?', color: 'from-blue-500 to-blue-600', badge: 'Action Req.' },
  { id: 'exams', name: 'Examinations', icon: GraduationCap, desc: 'Hall tickets & timetables', sampleQuery: 'When is the deadline to download hall tickets for exams?', color: 'from-indigo-500 to-indigo-600' },
  { id: 'fees', name: 'Fees & Dues', icon: CreditCard, desc: 'Reconciliation & receipts', sampleQuery: 'I paid my semester fee but the portal still shows unpaid.', color: 'from-amber-500 to-amber-600', badge: 'Finance' },
  { id: 'hostel', name: 'Hostel & Mess', icon: Home, desc: 'Repairs, passes, warden', sampleQuery: 'My hostel room fan is not working.', color: 'from-emerald-500 to-emerald-600' },
  { id: 'certificates', name: 'Certificates', icon: FileText, desc: 'Bonafide, transcripts, ID', sampleQuery: 'I need an official bonafide certificate for my passport application.', color: 'from-rose-500 to-rose-600' },
  { id: 'scholarships', name: 'Scholarships', icon: Award, desc: 'Merit aid & state portal', sampleQuery: 'What are the eligibility criteria for merit scholarship?', color: 'from-purple-500 to-purple-600' },
  { id: 'academics', name: 'Academics', icon: Layers, desc: 'Electives, advisor, credits', sampleQuery: 'What is the last date to add or drop an elective course?', color: 'from-cyan-500 to-cyan-600' },
  { id: 'placements', name: 'Placements & NOC', icon: Briefcase, desc: 'Internship approvals & NOC', sampleQuery: 'How do I apply for an internship NOC from the Placement Cell?', color: 'from-teal-500 to-teal-600' }
];

const STAGES = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

export default function StudentDashboard({ onNavigate, onAskAssistant, onSelectTicket }) {
  const { user } = useAuth();
  const [queryInput, setQueryInput] = useState('');
  const [recentRequests, setRecentRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Structured Ticket Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState('fees');

  const loadData = async () => {
    try {
      const [reqRes, annRes] = await Promise.all([
        api.getMyRequests(),
        api.getAnnouncements()
      ]);
      if (reqRes.success) setRecentRequests(reqRes.requests);
      if (annRes.success) setAnnouncements(annRes.announcements);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    onAskAssistant(queryInput.trim());
  };

  const handleOpenCreateModal = (catId = 'fees') => {
    setModalCategory(catId);
    setIsCreateModalOpen(true);
  };

  const handleTicketCreated = (newTicket) => {
    loadData();
    if (onSelectTicket) onSelectTicket(newTicket.ticketId);
  };

  const attendanceVal = user?.attendance || 68.5;
  const isCondonationReq = attendanceVal >= 65 && attendanceVal < 75;
  const isDetained = attendanceVal < 65;

  // Find active in-progress or most recent ticket for the live stepper
  const activeTicket = recentRequests.find(r => r.status !== 'Resolved') || recentRequests[0];

  const getStageIndex = (status) => {
    const idx = STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Student Command Masthead */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-blue-300 text-xs font-semibold mb-2">
              <span className="flex items-center space-x-1 bg-blue-900/60 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Autonomous Engineering College Student Portal</span>
              </span>
              <span>&bull;</span>
              <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 font-mono text-[11px]">
                {user?.regulation || 'R23 Autonomous'}
              </span>
              <span>&bull;</span>
              <span className="text-slate-300">Academic Year 2026-27</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
              Welcome back, {user?.name || 'Student'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans">
              <span>Roll No:</span>
              <span className="text-amber-300 font-mono font-bold">{user?.studentId || 'CS-2023-0489'}</span>
              <span>&bull;</span>
              <span>{user?.department || 'Computer Science & Engineering'}</span>
              <span>&bull;</span>
              <span className="text-slate-300">{user?.year || 'B.Tech 3rd Year (Sem 5)'}</span>
            </p>
          </div>

          {/* Primary Quick CTA: Raise Structured Ticket */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenCreateModal('fees')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 border border-blue-400/30"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Raise Structured Ticket</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('assistant')}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs px-4 py-3 rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Campus AI Copilot</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Academic Health & KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          
          {/* KPI 1: Attendance Health Gauge */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance Standing</span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className={`text-xl font-extrabold ${isCondonationReq ? 'text-amber-400' : isDetained ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {attendanceVal}%
                  </span>
                  <span className="text-[10px] text-slate-400">/ 100%</span>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                isCondonationReq ? 'bg-amber-950 text-amber-300 border border-amber-700/50' : 
                isDetained ? 'bg-rose-950 text-rose-300 border border-rose-700/50' : 
                'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
              }`}>
                {isCondonationReq ? 'Condonation Req.' : isDetained ? 'Detention Risk' : 'Eligible'}
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Section 4.2 Rules</span>
              {isCondonationReq && (
                <button
                  onClick={() => handleOpenCreateModal('attendance')}
                  className="text-[10px] font-bold text-amber-300 hover:text-amber-200 underline"
                >
                  Apply Condonation &rarr;
                </button>
              )}
            </div>
          </div>

          {/* KPI 2: Academic CGPA Tracker */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative CGPA</span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-blue-400">
                    {user?.cgpa || 8.42}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 10.0</span>
                </div>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/50">
                Top 10%
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
              <span>Credits: 112 / 160</span>
              <span className="text-emerald-400 font-semibold">Distinction</span>
            </div>
          </div>

          {/* KPI 3: Fee Clearance Status */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee Clearance</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-base font-extrabold text-emerald-400">
                    Reconciled
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                ₹0 Dues
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Sem 5 Ledger</span>
              <button
                onClick={() => handleOpenCreateModal('fees')}
                className="text-[10px] font-bold text-blue-300 hover:text-blue-200 underline"
              >
                UTR Issue? &rarr;
              </button>
            </div>
          </div>

          {/* KPI 4: Active Grievances Tracker */}
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-600 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Tickets</span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className="text-xl font-extrabold text-white">
                    {recentRequests.filter(r => r.status !== 'Resolved').length}
                  </span>
                  <span className="text-[10px] text-slate-400">in progression</span>
                </div>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/50">
                {recentRequests.length} Total
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Department SLA</span>
              <button
                onClick={() => onNavigate('my-requests')}
                className="text-[10px] font-bold text-purple-300 hover:text-purple-200 underline"
              >
                Track All &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* 3. Natural Language Inquiries Box */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-white rounded-xl shadow-xl overflow-hidden p-1.5 border border-slate-200">
              <div className="pl-3 pr-2 text-slate-400">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask anything in natural language (e.g. 'My attendance is 68%. Can I write exams?' or 'Hostel fan broken')..."
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-2 px-1 font-sans"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 sm:px-6 py-2.5 rounded-lg flex items-center space-x-1.5 shrink-0 transition-colors shadow-sm"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400 flex items-center">
              <Sparkles className="w-3 h-3 text-amber-400 mr-1" />
              Quick Inquiries:
            </span>
            {[
              "My attendance is 68%. Can I write exams?",
              "My hostel room fan is not working",
              "I paid my semester fee but portal shows unpaid",
              "Need bonafide certificate for passport"
            ].map((query, i) => (
              <button
                key={i}
                onClick={() => onAskAssistant(query)}
                className="bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 px-2.5 py-1 rounded-full border border-slate-700 hover:border-slate-500 transition-colors text-left"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Live Active Ticket Stepper Banner (Examiner & Student Focus) */}
      {activeTicket && (
        <div className="bg-white border border-blue-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {activeTicket.ticketId}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Active Ticket Progress Tracking
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {activeTicket.department}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                {activeTicket.title}
              </h3>
            </div>

            <button
              onClick={() => onSelectTicket(activeTicket.ticketId)}
              className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 self-start sm:self-auto transition-colors"
            >
              <span>View Full Ticket Specifications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-Stage Visual Progress Bar */}
          <div className="relative pt-2 pb-2">
            <div className="grid grid-cols-4 gap-2 text-center relative z-10">
              {STAGES.map((stageName, idx) => {
                const currentStageIdx = getStageIndex(activeTicket.status);
                const isCompleted = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div key={stageName} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                      isCompleted ? 'bg-emerald-500 text-white' :
                      isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                      'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>

                    <span className={`text-[11px] font-bold mt-2 ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                    }`}>
                      {stageName}
                    </span>

                    {isCurrent && (
                      <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded font-semibold mt-0.5">
                        Current Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Connecting Bar behind dots */}
            <div className="absolute top-6 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-0">
              <div 
                className="h-full bg-blue-600 transition-all duration-500" 
                style={{ width: `${(getStageIndex(activeTicket.status) / (STAGES.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Latest Timeline Note */}
          {activeTicket.timeline && activeTicket.timeline.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 rounded-xl p-3 text-xs text-slate-600 flex items-start space-x-2">
              <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">
                  Latest Update ({activeTicket.timeline[activeTicket.timeline.length - 1].stage}):
                </span>{' '}
                <span>{activeTicket.timeline[activeTicket.timeline.length - 1].note}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Actor: {activeTicket.timeline[activeTicket.timeline.length - 1].actor} &bull; {new Date(activeTicket.timeline[activeTicket.timeline.length - 1].timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Campus Service Desks Quick Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Campus Department Desks & Policies</h2>
            <p className="text-xs text-slate-500">Raise verified departmental tickets or inquire policy rules</p>
          </div>
          <button 
            onClick={() => handleOpenCreateModal('fees')}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Raise Formal Ticket &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-sm`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {cat.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => handleOpenCreateModal(cat.id)}
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Raise Ticket
                  </button>
                  <button
                    onClick={() => onAskAssistant(cat.sampleQuery)}
                    className="text-slate-400 hover:text-slate-700 flex items-center"
                  >
                    <span>Ask AI</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Two Column Section: Recent Requests & Official Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Tickets */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>My Recent Grievances & Tickets</span>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {recentRequests.length}
              </span>
            </h2>
            <button
              onClick={() => onNavigate('my-requests')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All ({recentRequests.length}) &rarr;
            </button>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
              Loading recent tickets...
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.slice(0, 3).map((req) => (
                <RequestCard 
                  key={req.ticketId} 
                  request={req} 
                  onClick={onSelectTicket}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No unresolved tickets</p>
              <p className="text-[11px] text-slate-500 mt-1">Use the "Raise Structured Ticket" button or AI Copilot to log an issue.</p>
            </div>
          )}
        </div>

        {/* Right: Official Circulars & Notices */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Campus Circulars & Notices</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">Official Autonomous Board</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-sm">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200/60">
                    {ann.category}
                  </span>
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{ann.date}</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">
                  {ann.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {ann.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Structured Ticket Creation Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialCategory={modalCategory}
        onTicketCreated={handleTicketCreated}
      />

    </div>
  );
}
