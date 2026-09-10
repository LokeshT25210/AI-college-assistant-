import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  PhoneCall,
  CheckCircle2,
  KeyRound,
  Fingerprint,
  Info,
  Clock
} from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login, quickSwitchUser } = useAuth();
  const [roleTab, setRoleTab] = useState('student');
  const [email, setEmail] = useState('alex.kumar@campus.edu');
  const [password, setPassword] = useState('campus123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (tab) => {
    setRoleTab(tab);
    setError(null);
    if (tab === 'student') {
      setEmail('alex.kumar@campus.edu');
    } else {
      setEmail('admin@campus.edu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    } else {
      setError(res.message || 'Authentication failed. Please verify credentials.');
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
      <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Pane: Institutional Branding & Campus Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          
          {/* Subtle decorative background pattern */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-blue-600/10 pointer-events-none blur-2xl" />
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-amber-500/10 pointer-events-none blur-2xl" />

          {/* Header & University Motto */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif tracking-tight text-white">Apex University</h1>
                <p className="text-[11px] text-blue-300 font-sans tracking-wide uppercase font-semibold">Central Identity Service</p>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-blue-900/70 text-blue-200 border border-blue-700/60 mb-3">
                CAS &bull; Single Sign-On
              </span>
              <h2 className="text-2xl font-bold font-serif leading-snug text-white">
                One Credential. <br />Every Campus Service.
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                Access verified academic policies, track grievance tickets in real time, and connect directly with campus administrative divisions.
              </p>
            </div>

            {/* Live Campus Telemetry Pill */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Campus Service Bus Status</span>
                </span>
                <span className="text-emerald-400 font-mono">ALL OPERATIONAL</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                <div>
                  <span className="block text-[10px] uppercase text-slate-500">Current Term</span>
                  <span className="text-slate-200 font-medium">Fall 2026 &bull; Wk 6</span>
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
              <span>FERPA & Statutory Privacy Enforced</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Need immediate technical assistance? Contact IT Helpdesk at <span className="text-slate-300 font-mono">support@campus.edu</span> or Ext. 4400.
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
              <span className="text-[11px] text-slate-400">Identity v4.2</span>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-2xl font-bold font-serif text-slate-900">
                Account Sign In
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your institutional credentials to enter your customized portal.
              </p>
            </div>

            {/* Persona Segment Tabs */}
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

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="username@campus.edu"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
                <span className="text-[11px] text-slate-400">Pass: campus123</span>
              </div>

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
                  <span>Authenticating Identity...</span>
                ) : (
                  <>
                    <span>Enter {roleTab === 'student' ? 'Student Portal' : 'Faculty & Admin Desk'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Examiner 1-Click Persona Pass */}
            <div className="pt-5 border-t border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Examiner Fast-Access Personas</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Bypass Manual Typing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPersona('alex.kumar@campus.edu', 'student-dashboard')}
                  className="text-left bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 rounded-xl p-3 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-blue-900 text-xs flex items-center space-x-1">
                      <span>Alex Kumar</span>
                      <span className="text-[9px] bg-blue-200 text-blue-900 px-1 py-0.2 rounded">Student</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">CS-2023-0489 &bull; 68.5% Attn</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('admin@campus.edu', 'admin-dashboard')}
                  className="text-left bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200 rounded-xl p-3 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-purple-900 text-xs flex items-center space-x-1">
                      <span>Dr. S. Raman</span>
                      <span className="text-[9px] bg-purple-200 text-purple-900 px-1 py-0.2 rounded">Registrar</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Grievance Adjudication</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 text-center pt-6">
            Apex University &copy; 2026 &bull; Information Security Office &bull; All Rights Reserved
          </p>

        </div>

      </div>

    </div>
  );
}
