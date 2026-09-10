import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import RequestCard from '../components/RequestCard';
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
  Bell
} from 'lucide-react';

const CATEGORIES = [
  { id: 'attendance', name: 'Attendance', icon: Clock, desc: '68.5% logged & condonation', sampleQuery: 'My attendance is 68%. Can I write the semester exams?', color: 'from-blue-500 to-blue-600', badge: 'Warning' },
  { id: 'exams', name: 'Examinations', icon: GraduationCap, desc: 'Hall tickets & timetables', sampleQuery: 'When is the deadline to download hall tickets for exams?', color: 'from-indigo-500 to-indigo-600' },
  { id: 'fees', name: 'Fees & Dues', icon: CreditCard, desc: 'Reconciliation & receipts', sampleQuery: 'I paid my semester fee but the portal still shows unpaid.', color: 'from-amber-500 to-amber-600', badge: 'Urgent' },
  { id: 'hostel', name: 'Hostel & Mess', icon: Home, desc: 'Repairs, passes, warden', sampleQuery: 'My hostel room fan is not working.', color: 'from-emerald-500 to-emerald-600' },
  { id: 'certificates', name: 'Certificates', icon: FileText, desc: 'Bonafide, transcripts, ID', sampleQuery: 'I need an official bonafide certificate for my passport application.', color: 'from-rose-500 to-rose-600' },
  { id: 'scholarships', name: 'Scholarships', icon: Award, desc: 'Merit aid & state portal', sampleQuery: 'What are the eligibility criteria for merit scholarship?', color: 'from-purple-500 to-purple-600' },
  { id: 'academics', name: 'Academics', icon: Layers, desc: 'Electives, advisor, credits', sampleQuery: 'What is the last date to add or drop an elective course?', color: 'from-cyan-500 to-cyan-600' },
  { id: 'placements', name: 'Placements & NOC', icon: Briefcase, desc: 'Internship approvals & NOC', sampleQuery: 'How do I apply for an internship NOC from the Placement Cell?', color: 'from-teal-500 to-teal-600' }
];

export default function StudentDashboard({ onNavigate, onAskAssistant, onSelectTicket }) {
  const { user } = useAuth();
  const [queryInput, setQueryInput] = useState('');
  const [recentRequests, setRecentRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [reqRes, annRes] = await Promise.all([
          api.getMyRequests(),
          api.getAnnouncements()
        ]);
        if (reqRes.success) setRecentRequests(reqRes.requests.slice(0, 3));
        if (annRes.success) setAnnouncements(annRes.announcements);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    onAskAssistant(queryInput.trim());
  };

  const handleCategoryClick = (category) => {
    onAskAssistant(category.sampleQuery);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-semibold mb-1">
              <span>Apex University Student Portal</span>
              <span>&bull;</span>
              <span>Academic Year 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif">
              Welcome back, {user?.name || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
              Roll No: <span className="text-amber-300 font-mono font-semibold">{user?.studentId}</span> &bull; {user?.department} &bull; {user?.year}
            </p>
          </div>

          {/* Student Status Quick Cards */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
              <span className={`text-lg font-extrabold ${user?.attendance < 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {user?.attendance || 68.5}%
              </span>
              <span className="text-[9px] block text-amber-300 mt-0.5">Below 75% Cutoff</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">CGPA</span>
              <span className="text-lg font-extrabold text-blue-400">
                {user?.cgpa || 8.42}
              </span>
              <span className="text-[9px] block text-slate-400 mt-0.5">Top 10%</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hostel</span>
              <span className="text-xs font-bold text-white block mt-1">
                {user?.hostel ? user.hostel.split('-')[0] : 'Block B'}
              </span>
              <span className="text-[9px] block text-slate-400">Room 204</span>
            </div>
          </div>
        </div>

        {/* AI Natural-Language Question Box */}
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
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none py-2 px-1"
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
              Suggested Inquiries:
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

      {/* Quick Campus-Service Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Campus Service Desks</h2>
            <p className="text-xs text-slate-500">Select a department to view policies or initiate AI-to-Action assistance</p>
          </div>
          <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('assistant')}>
            Open Full AI Assistant &rarr;
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
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

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Explore FAQ / Request</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Requests & Official Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Tickets */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>My Recent Requests & Tickets</span>
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
              {recentRequests.map((req) => (
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
              <p className="text-xs font-bold text-slate-700">No active unresolved tickets</p>
              <p className="text-[11px] text-slate-500 mt-1">Use the AI Assistant to inquire or log a new campus grievance.</p>
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
            <span className="text-[11px] text-slate-400">Official</span>
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

    </div>
  );
}
