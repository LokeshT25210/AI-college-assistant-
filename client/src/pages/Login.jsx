import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  Sparkles,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  UserPlus
} from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login, quickSwitchUser } = useAuth();
  const [roleTab, setRoleTab] = useState('student');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Clean, empty fields by default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');

  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEvaluationPass, setShowEvaluationPass] = useState(false);

  const handleTabChange = (tab) => {
    setRoleTab(tab);
    setError(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (authMode === 'register') {
      try {
        const res = await api.register({
          name,
          email,
          password,
          studentId,
          department
        });
        setLoading(false);
        if (res.success) {
          await login(email, password);
          onNavigate('student-dashboard');
        } else {
          setError(res.message || 'Registration failed.');
        }
      } catch (err) {
        setLoading(false);
        setError('Error creating official student account.');
      }
      return;
    }

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    } else {
      setError(res.message || 'Invalid institutional credentials. Please try again.');
    }
  };

  const handleQuickPersona = async (userEmail, targetPage) => {
    setLoading(true);
    setError(null);
    const res = await quickSwitchUser(userEmail);
    setLoading(false);
    if (res.success) {
      onNavigate(targetPage);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-slate-100">
      
      {/* Enterprise Dual-Pane Card */}
      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        
        {/* Left Pane: Institutional Identity & Campus Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none blur-2xl" />
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-amber-500/10 pointer-events-none blur-2xl" />

          {/* Header & University Motto */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif tracking-tight text-white">DVR & Dr HS MIC College of Technology</h1>
                <p className="text-[11px] text-blue-300 font-sans tracking-wide uppercase font-semibold">Central Identity Service</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-blue-900/70 text-blue-200 border border-blue-700/60 mb-3">
                CAS &bull; Single Sign-On
              </span>
              <h2 className="text-2xl font-bold font-serif leading-snug text-white">
                Official Campus Gateway
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                Sign in with your verified institutional account to access academic services, examination hall tickets, fee records, and the AI campus grievance desk.
              </p>
            </div>

            {/* Live Campus Telemetry Pill */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Campus Service Bus Status</span>
                </span>
                <span className="text-emerald-400 font-mono">ALL SYSTEMS NOMINAL</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Current Term</span>
                  <span className="text-slate-200 font-medium">Fall 2026 Session</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">SLA Resolution</span>
                  <span className="text-slate-200 font-medium">99.4% On-Time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>FERPA & Statutory Student Privacy Enforced</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Need technical support? Contact Campus IT at <span className="text-slate-300 font-mono">helpdesk@campus.edu</span>.
            </p>
          </div>

        </div>

        {/* Right Pane: Sign-In Desk (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
          
          <div className="space-y-6">
            
            {/* Top Bar with Back Link */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('landing')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
              >
                <span>&larr; Return to Campus Home</span>
              </button>
              <span className="text-[11px] text-slate-400">CAS v4.2</span>
            </div>

            {/* Title & Mode Switcher */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold font-serif text-slate-900">
                  {authMode === 'login' ? 'Institutional Sign In' : 'Register Student Account'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {authMode === 'login' ? 'Enter your institutional email address and password.' : 'Create an official university student identity record.'}
                </p>
              </div>

              {roleTab === 'student' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setError(null);
                  }}
                  className="text-xs font-bold text-blue-700 hover:underline shrink-0"
                >
                  {authMode === 'login' ? '+ New Student?' : 'Existing Student?'}
                </button>
              )}
            </div>

            {/* Persona Segment Tabs (Student vs Faculty/Staff) */}
            {authMode === 'login' && (
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleTabChange('student')}
                  className={`py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    roleTab === 'student'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Student Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('admin')}
                  className={`py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    roleTab === 'admin'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Faculty & Admin</span>
                </button>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Student Roll / ID Number
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                      placeholder="e.g. CS-2024-1105"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={roleTab === 'admin' ? "admin@campus.edu" : "student.id@campus.edu"}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <span className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                  />
                </div>
              </div>

              {authMode === 'login' && (
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember this browser for 30 days</span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg ${
                  roleTab === 'student'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    : 'bg-purple-700 hover:bg-purple-800 shadow-purple-500/20'
                }`}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : authMode === 'register' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Official Student Account</span>
                  </>
                ) : (
                  <>
                    <span>Enter {roleTab === 'student' ? 'Student Portal' : 'Faculty & Admin Console'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Subtle, Professional Institutional Evaluation Pass Accordion */}
            <div className="pt-4 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => setShowEvaluationPass(!showEvaluationPass)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
              >
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Institutional Evaluation & Audit Credentials</span>
                </span>
                {showEvaluationPass ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showEvaluationPass && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in">
                  <p className="text-[11px] text-slate-500">
                    For examiners conducting statutory evaluations, click below to authenticate test personas:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickPersona('alex.kumar@campus.edu', 'student-dashboard')}
                      className="text-left bg-white hover:bg-blue-50 border border-slate-200 p-2.5 rounded-lg transition-colors"
                    >
                      <span className="font-bold text-slate-800 block text-[11px]">Alex Kumar (Student)</span>
                      <span className="text-[10px] text-slate-500">Roll: CS-2023-0489</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPersona('admin@campus.edu', 'admin-dashboard')}
                      className="text-left bg-white hover:bg-purple-50 border border-slate-200 p-2.5 rounded-lg transition-colors"
                    >
                      <span className="font-bold text-slate-800 block text-[11px]">Dr. S. Raman (Admin)</span>
                      <span className="text-[10px] text-slate-500">Chief Registrar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          <p className="text-[11px] text-slate-400 text-center pt-6">
            DVR & Dr HS MIC College of Technology &copy; 2026 &bull; Central Authentication Authority &bull; All Rights Reserved
          </p>

        </div>

      </div>

    </div>
  );
}
