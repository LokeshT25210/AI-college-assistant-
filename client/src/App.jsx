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
  const { user, loading, quickSwitchUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [isExaminerGuideOpen, setIsExaminerGuideOpen] = useState(false);

  // If user just logged in and we're on landing or login, navigate to appropriate dashboard
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
          <span>Apex Smart Campus System Initializing...</span>
        </div>
      </div>
    );
  }

  const handleNavigate = (page) => {
    setCurrentPage(page);
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

  const handleSelectDemoScenario = async (scenarioType) => {
    switch (scenarioType) {
      case 'attendance':
        await quickSwitchUser('alex.kumar@campus.edu');
        setAssistantQuery('My attendance is 68%. Can I write the semester exams?');
        setCurrentPage('assistant');
        break;
      case 'hostel':
        await quickSwitchUser('alex.kumar@campus.edu');
        setAssistantQuery('My hostel room fan is not working.');
        setCurrentPage('assistant');
        break;
      case 'fee':
        await quickSwitchUser('alex.kumar@campus.edu');
        setAssistantQuery('I paid my semester fee but the portal still shows unpaid.');
        setCurrentPage('assistant');
        break;
      case 'hallucination':
        await quickSwitchUser('alex.kumar@campus.edu');
        setAssistantQuery('Can I bring a live elephant into the physics laboratory?');
        setCurrentPage('assistant');
        break;
      default:
        break;
    }
  };

  // If not logged in and on landing or login
  if (!user && currentPage === 'landing') {
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

  if (!user && currentPage === 'login') {
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
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
