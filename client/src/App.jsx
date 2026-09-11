import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExaminerGuideModal from './components/ExaminerGuideModal';

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

export default function App() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [isExaminerGuideOpen, setIsExaminerGuideOpen] = useState(false);

  // If user just logged in and we're on landing or login, navigate to appropriate main dashboard
  React.useEffect(() => {
    if (user && (currentPage === 'landing' || currentPage === 'login')) {
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('student-dashboard');
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
    if (page === 'home') {
      setCurrentPage(user ? (user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard') : 'landing');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setCurrentPage('request-details');
  };

  const handleAskAssistant = (query) => {
    setAssistantQuery(query);
    setCurrentPage('assistant');
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
      setCurrentPage('login');
    } else {
      setCurrentPage('assistant');
    }
  };

  // If not logged in: ALWAYS display Login unless user explicitly requested landing
  if (!user) {
    if (currentPage === 'landing') {
      return (
        <>
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
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar 
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
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

          {currentPage === 'landing' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-blue-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Logged in as {user?.name} ({user?.role === 'admin' ? 'Campus Admin' : 'Enrolled Student'})</span>
                    <span className="text-xs text-blue-200">Browsing Public Campus Information Portal & Statutory Gazettes.</span>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate(user?.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                  className="bg-white hover:bg-blue-50 text-blue-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm self-start sm:self-auto shrink-0"
                >
                  Return to Dashboard &rarr;
                </button>
              </div>
              <LandingPage 
                onNavigate={handleNavigate} 
                onOpenExaminerGuide={() => setIsExaminerGuideOpen(true)} 
              />
            </div>
          )}

          {/* Default Fallback for unmatched routes */}
          {!['student-dashboard', 'admin-dashboard', 'assistant', 'my-requests', 'admin-requests', 'request-details', 'analytics', 'profile', 'announcements', 'database', 'landing'].includes(currentPage) && (
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
