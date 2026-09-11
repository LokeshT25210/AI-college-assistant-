import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExaminerGuideModal from './components/ExaminerGuideModal';
import { 
  LayoutDashboard, 
  Bot, 
  TicketCheck, 
  ClipboardList, 
  BarChart3, 
  Bell, 
  Menu, 
  Sparkles 
} from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import Assistant from './pages/Assistant';
import MyRequests from './pages/MyRequests';
import RequestDetails from './pages/RequestDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminRequests from './pages/AdminRequests';
import AnalyticsInsights from './pages/AnalyticsInsights';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import DatabaseViewer from './pages/DatabaseViewer';

const VALID_PAGES = [
  'landing',
  'login',
  'student-dashboard',
  'admin-dashboard',
  'assistant',
  'my-requests',
  'admin-requests',
  'request-details',
  'analytics',
  'profile',
  'announcements',
  'database'
];

function getHashRoute() {
  if (typeof window === 'undefined') return null;
  const hash = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
  if (VALID_PAGES.includes(hash)) return hash;
  const stored = sessionStorage.getItem('campus_current_page');
  if (stored && VALID_PAGES.includes(stored)) return stored;
  return null;
}

export default function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = getHashRoute();
    if (hash) return hash;
    return user ? (user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard') : 'login';
  });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [isExaminerGuideOpen, setIsExaminerGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state whenever URL hash changes (browser Back/Forward or manual hash change)
  useEffect(() => {
    const syncRouteFromHash = () => {
      const hash = (window.location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
      if (VALID_PAGES.includes(hash) && hash !== currentPage) {
        if (hash === 'login' && user) {
          const dest = user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
          setCurrentPage(dest);
          window.location.hash = dest;
          sessionStorage.setItem('campus_current_page', dest);
        } else {
          setCurrentPage(hash);
          sessionStorage.setItem('campus_current_page', hash);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', syncRouteFromHash);
    window.addEventListener('popstate', syncRouteFromHash);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromHash);
      window.removeEventListener('popstate', syncRouteFromHash);
    };
  }, [currentPage, user]);

  // Handle user authentication transitions
  useEffect(() => {
    if (user) {
      if (currentPage === 'login') {
        const dest = user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
        handleNavigate(dest);
      }
    } else {
      const protectedPages = ['student-dashboard', 'admin-dashboard', 'my-requests', 'admin-requests', 'analytics', 'profile'];
      if (protectedPages.includes(currentPage)) {
        handleNavigate('login');
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Autonomous Smart Campus Portal Initializing...</span>
        </div>
      </div>
    );
  }

  const handleNavigate = (page) => {
    let target = page;
    if (page === 'home' || page === 'campus-home') {
      target = 'landing';
    } else if (page === 'dashboard') {
      target = user ? (user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard') : 'login';
    } else if (page === 'login' && user) {
      target = user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard';
    }

    setCurrentPage(target);
    sessionStorage.setItem('campus_current_page', target);
    setMobileMenuOpen(false);

    try {
      if ((window.location.hash || '').replace(/^#\/?/, '') !== target) {
        window.location.hash = target;
      }
    } catch (e) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    handleNavigate('request-details');
  };

  const handleAskAssistant = (query) => {
    setAssistantQuery(query);
    handleNavigate('assistant');
  };

  const handleSelectDemoScenario = (scenarioType) => {
    let query = '';
    switch (scenarioType) {
      case 'attendance':
        query = 'My attendance is 68 percent can I write exams';
        break;
      case 'hostel':
        query = 'My hostel fan is not working';
        break;
      case 'fee':
        query = 'I paid my semester fee but portal says unpaid';
        break;
      case 'hallucination':
        query = 'Can I bring a live elephant into the physics laboratory?';
        break;
      default:
        if (typeof scenarioType === 'string' && scenarioType.trim()) {
          query = scenarioType;
        }
        break;
    }
    if (query) {
      setAssistantQuery(query);
    }
    if (!user) {
      handleNavigate('login');
    } else {
      handleNavigate('assistant');
    }
  };

  // 1. Landing Page: Rendered full-screen cleanly whether user is logged in or not
  if (currentPage === 'landing') {
    return (
      <>
        {user && (
          <div className="bg-slate-900 text-white px-4 py-2.5 text-xs flex items-center justify-between border-b border-slate-800 sticky top-0 z-50 shadow-md">
            <span className="font-semibold text-blue-200">
              ✓ Logged in as {user.name} ({user.role === 'admin' ? 'Campus Admin' : 'Enrolled Student'})
            </span>
            <button
              type="button"
              onClick={() => handleNavigate(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-sm cursor-pointer"
            >
              Return to Active Dashboard &rarr;
            </button>
          </div>
        )}
        <LandingPage 
          onNavigate={handleNavigate} 
          onOpenExaminerGuide={() => setIsExaminerGuideOpen(true)} 
        />
        <ExaminerGuideModal 
          isOpen={isExaminerGuideOpen} 
          onClose={() => setIsExaminerGuideOpen(false)}
          onSelectDemoScenario={handleSelectDemoScenario}
          onNavigate={handleNavigate}
        />
      </>
    );
  }

  // 2. Unauthenticated Login Gateway
  if (!user) {
    return (
      <>
        <Navbar 
          onOpenExaminerGuide={() => setIsExaminerGuideOpen(true)}
          onNavigate={handleNavigate}
        />
        <Login onNavigate={handleNavigate} />
        <ExaminerGuideModal 
          isOpen={isExaminerGuideOpen} 
          onClose={() => setIsExaminerGuideOpen(false)}
          onSelectDemoScenario={handleSelectDemoScenario}
          onNavigate={handleNavigate}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-700">
      
      {/* High-Tech Dynamic Ambient Aura & Engineering Grid Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Institutional Top Navbar */}
      <Navbar 
        onOpenExaminerGuide={() => setIsExaminerGuideOpen(true)}
        onNavigate={handleNavigate}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop Static + Mobile Drawer) */}
        <Sidebar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 overflow-y-auto pb-24 md:pb-8">
          {currentPage === 'student-dashboard' && (
            <StudentDashboard 
              onNavigate={handleNavigate}
              onAskAssistant={handleAskAssistant}
              onSelectTicket={handleSelectTicket}
            />
          )}

          {currentPage === 'admin-dashboard' && (
            <AdminDashboard 
              onSelectTicket={handleSelectTicket}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'assistant' && (
            <Assistant 
              initialQuery={assistantQuery}
              onSelectTicket={handleSelectTicket}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'my-requests' && (
            <MyRequests 
              onSelectTicket={handleSelectTicket}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'admin-requests' && (
            <AdminRequests 
              onSelectTicket={handleSelectTicket}
            />
          )}

          {currentPage === 'request-details' && (
            <RequestDetails 
              ticketId={selectedTicketId}
              onBack={() => handleNavigate(user?.role === 'admin' ? 'admin-requests' : 'my-requests')}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsInsights 
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'profile' && (
            <Profile />
          )}

          {currentPage === 'announcements' && (
            <Announcements />
          )}

          {currentPage === 'database' && (
            <DatabaseViewer />
          )}

          {/* Default Fallback for unmatched routes */}
          {!['student-dashboard', 'admin-dashboard', 'assistant', 'my-requests', 'admin-requests', 'request-details', 'analytics', 'profile', 'announcements', 'database'].includes(currentPage) && (
            user?.role === 'admin' ? (
              <AdminDashboard 
                onSelectTicket={handleSelectTicket}
                onNavigate={handleNavigate}
              />
            ) : (
              <StudentDashboard 
                onNavigate={handleNavigate}
                onAskAssistant={handleAskAssistant}
                onSelectTicket={handleSelectTicket}
              />
            )
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Native App Feel on Phones) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden flex items-center justify-around px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.5)]">
        {user.role === 'admin' ? (
          <>
            <button
              type="button"
              onClick={() => handleNavigate('admin-dashboard')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                currentPage === 'admin-dashboard'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-0.5" />
              <span>Command</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('admin-requests')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                currentPage === 'admin-requests'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ClipboardList className="w-5 h-5 mb-0.5" />
              <span>Tickets</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('analytics')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                currentPage === 'analytics'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5 mb-0.5" />
              <span>Analytics</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('assistant')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                currentPage === 'assistant'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-5 h-5 mb-0.5" />
              <span>Copilot</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 mb-0.5" />
              <span>Menu</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleNavigate('student-dashboard')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                currentPage === 'student-dashboard'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-0.5" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('assistant')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors relative cursor-pointer ${
                currentPage === 'assistant'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Bot className="w-5 h-5 mb-0.5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <span>AI Copilot</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('my-requests')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                currentPage === 'my-requests'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TicketCheck className="w-5 h-5 mb-0.5" />
              <span>Tickets</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('announcements')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-colors cursor-pointer ${
                currentPage === 'announcements'
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bell className="w-5 h-5 mb-0.5" />
              <span>Notices</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 mb-0.5" />
              <span>Menu</span>
            </button>
          </>
        )}
      </nav>

      {/* Examiner Rubric & Scoring Companion Modal */}
      <ExaminerGuideModal 
        isOpen={isExaminerGuideOpen} 
        onClose={() => setIsExaminerGuideOpen(false)}
        onSelectDemoScenario={handleSelectDemoScenario}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
