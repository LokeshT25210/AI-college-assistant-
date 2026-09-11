import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Bot, 
  TicketCheck, 
  FileText, 
  BarChart3, 
  Bell, 
  UserCircle2, 
  ShieldAlert, 
  HelpCircle,
  Sparkles,
  ClipboardList,
  Home
} from 'lucide-react';

export default function Sidebar({ currentPage, onNavigate }) {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  const studentLinks = [
    { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Campus Assistant', icon: Bot, highlight: true },
    { id: 'my-requests', label: 'My Requests & Tickets', icon: TicketCheck },
    { id: 'announcements', label: 'Official Circulars', icon: Bell },
    { id: 'database', label: 'Campus Database', icon: ClipboardList },
    { id: 'profile', label: 'Academic Profile', icon: UserCircle2 },
    { id: 'landing', label: 'Return to Campus Home', icon: Home },
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Admin Command Center', icon: LayoutDashboard },
    { id: 'admin-requests', label: 'Ticket Management', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics & AI Insights', icon: BarChart3, highlight: true },
    { id: 'database', label: 'Database & Records', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'announcements', label: 'Campus Notices', icon: Bell },
    { id: 'profile', label: 'Admin Profile', icon: UserCircle2 },
    { id: 'landing', label: 'Return to Campus Home', icon: Home },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-5 px-4 shadow-sm transition-colors duration-200">
      <div className="space-y-6">
        
        {/* Portal Type Indicator */}
        <div className="px-2">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-600 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isAdmin ? 'Administrative Portal' : 'Student Service Desk'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            {isAdmin ? 'Registrar & Operations Division' : `${user.department || 'Enrolled Student'}`}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-0.5 border border-blue-200 dark:border-blue-800">
                    <Sparkles className="w-2.5 h-2.5 mr-0.5 text-blue-500 dark:text-blue-400" />
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 text-xs font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>AI Verification Status</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Strictly grounded in official university regulations. Hallucination safeguards active.
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>KB Version: 2026.1</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● 100% Policy Bound</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Autonomous Engineering College &copy; 2026
          </p>
        </div>
      </div>
    </aside>
  );
}
