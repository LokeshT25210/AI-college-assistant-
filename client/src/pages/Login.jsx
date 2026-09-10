import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Campus3DScene from '../components/Campus3DScene';
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
  UserPlus,
  Eye,
  EyeOff,
  Hash,
  Phone,
  Bus,
  Home,
  RefreshCw,
  HelpCircle,
  FileText,
  KeyRound,
  Users,
  Check,
  Award
} from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Machine Learning (AI&ML)',
  'Artificial Intelligence & Data Science (AI&DS)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Master of Business Administration (MBA)',
  'Master of Computer Applications (MCA)'
];

const BUS_ROUTES = [
  'Route 01 - Vijayawada (Benz Circle & High Court)',
  'Route 05 - Guntur (Bus Stand & RTC Complex)',
  'Route 08 - Ibrahimpatnam & Kondapalli',
  'Route 12 - Nandigama Town & Bus Stand',
  'Route 18 - Jaggaiahpeta & Chillakallu',
  'Route 22 - Kodad Bypass & Bus Station',
  'Route 28 - Vissannapeta & Mylavaram',
  'Route 35 - Tiruvuru & Madhira',
  'Self-Commute / Personal Vehicle'
];

export default function Login({ onNavigate }) {
  const { login, quickSwitchUser } = useAuth();
  const [roleTab, setRoleTab] = useState('student'); // 'student', 'admin', 'exam', 'parent'
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Login Form Fields
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'roll'
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regulation, setRegulation] = useState('R23 Autonomous');
  const [rememberMe, setRememberMe] = useState(true);

  // Captcha Security Math Challenge
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [captchaInput, setCaptchaInput] = useState('');

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(2 + Math.random() * 8));
    setCaptchaNum2(Math.floor(2 + Math.random() * 8));
    setCaptchaInput('');
  };

  useEffect(() => {
    refreshCaptcha();
  }, [authMode]);

  // Extended Registration Form Fields
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [department, setDepartment] = useState('Computer Science & Engineering (CSE)');
  const [academicYear, setAcademicYear] = useState('B.Tech 1st Year (Semester 1)');
  const [section, setSection] = useState('Section A');
  const [regRegulation, setRegRegulation] = useState('R23 Autonomous');
  const [residenceType, setResidenceType] = useState('Day Scholar');
  const [busRoute, setBusRoute] = useState(BUS_ROUTES[0]);
  const [hostelBlock, setHostelBlock] = useState('Campus Boys Hostel - Block A');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToConduct, setAgreedToConduct] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEvaluationPass, setShowEvaluationPass] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleTabChange = (tab) => {
    setRoleTab(tab);
    setError(null);
    setEmail('');
    setPassword('');
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const regStrength = getPasswordStrength(regPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verify Captcha
    if (authMode === 'login') {
      const expectedCaptcha = (captchaNum1 + captchaNum2).toString();
      if (captchaInput.trim() !== expectedCaptcha) {
        setLoading(false);
        setError(`Security verification failed: ${captchaNum1} + ${captchaNum2} is not ${captchaInput || 'blank'}. Please enter the correct sum.`);
        refreshCaptcha();
        return;
      }
    }

    if (authMode === 'register') {
      if (regPassword !== confirmPassword) {
        setLoading(false);
        setError('Passwords do not match. Please re-enter your password.');
        return;
      }

      if (!agreedToConduct) {
        setLoading(false);
        setError('You must accept the Autonomous Academic Regulations and Campus Code of Conduct.');
        return;
      }

      try {
        const cleanDepartment = department.split('(')[0].trim();
        const res = await api.register({
          name,
          email,
          password: regPassword,
          studentId: studentId.trim().toUpperCase(),
          department: cleanDepartment,
          year: academicYear,
          section,
          regulation: regRegulation,
          residenceType,
          busRoute: residenceType === 'Day Scholar' ? busRoute : undefined,
          hostel: residenceType === 'Hosteler' ? hostelBlock : busRoute,
          phone,
          gender
        });
        setLoading(false);
        if (res.success) {
          await login(email, regPassword);
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

    // Resolve login identifier: If using roll number, construct institutional format or lookup
    let effectiveEmail = email.trim();
    if (loginMethod === 'roll' && rollNumber) {
      const cleanRoll = rollNumber.trim().toLowerCase();
      effectiveEmail = cleanRoll.includes('@') ? cleanRoll : `${cleanRoll}@mictech.ac.in`;
    }

    const res = await login(effectiveEmail, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin' || roleTab === 'admin' || roleTab === 'exam') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    } else {
      setError(res.message || 'Invalid institutional credentials. Please check your email/roll number and password.');
      refreshCaptcha();
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-100">
      
      {/* Enterprise Dual-Pane Card with 3D Depth */}
      <div className="w-full max-w-6xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px] transition-all duration-300">
        
        {/* Left Pane: Interactive 3D Model Stage & Campus Identity (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          
          {/* Subtle Ambient Glow Orbs */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-600/15 pointer-events-none blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-amber-500/10 pointer-events-none blur-3xl" />

          {/* Header & University Motto */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold font-serif tracking-tight text-white leading-tight">
                  DVR & Dr HS MIC College of Technology
                </h1>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/70 border border-emerald-700/60 px-2 py-0.2 rounded">
                    UGC Autonomous &bull; NAAC A+
                  </span>
                  <span className="text-[10px] text-blue-300 font-mono">CODE: MICT</span>
                </div>
              </div>
            </div>

            {/* 3D Model WebGL Canvas Container */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300 px-1">
                <span className="font-bold flex items-center space-x-1.5 text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>Interactive 3D Holographic Core</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">WebGL Three.js 360&deg;</span>
              </div>

              {/* Mounted 3D Scene Component */}
              <Campus3DScene height="290px" className="border-blue-900/60 shadow-2xl" />

              <p className="text-[11px] text-slate-400 leading-relaxed text-center px-1">
                Click and drag to rotate the 3D model in 360&deg;. Toggle between the <strong>Crest</strong>, <strong>AI Core</strong>, and <strong>Campus</strong> models.
              </p>
            </div>

            {/* Live Campus Telemetry Pill */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 text-xs backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Campus Network & Server Bus</span>
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">ALL SYSTEMS ONLINE</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
                <div>
                  <span className="block text-slate-500 uppercase font-semibold">Affiliation</span>
                  <span className="text-slate-200 font-medium">JNTUK Kakinada</span>
                </div>
                <div>
                  <span className="block text-slate-500 uppercase font-semibold">Regulations</span>
                  <span className="text-slate-200 font-medium">R20 & R23 Auto</span>
                </div>
                <div>
                  <span className="block text-slate-500 uppercase font-semibold">AI Support</span>
                  <span className="text-emerald-300 font-medium">Gemini 3.5 Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-slate-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Statutory Student Privacy (FERPA)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center space-x-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Portal Guide</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Campus IT Helpdesk: <span className="text-slate-300 font-mono">support@mictech.ac.in</span> &bull; Kanchikacherla
            </p>
          </div>

        </div>

        {/* Right Pane: Sign-In / Registration Desk (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white overflow-y-auto max-h-[880px] lg:max-h-none">
          
          <div className="space-y-5">
            
            {/* Top Bar with Back Link */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('landing')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center space-x-1.5"
              >
                <span>&larr; Return to Campus Home</span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  SSO Portal v4.5
                </span>
                <span className="text-[10px] font-mono text-slate-400">R20/R23</span>
              </div>
            </div>

            {/* Title & Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                  {authMode === 'login' ? 'Institutional Gateway' : 'New Student Registration'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {authMode === 'login' 
                    ? 'Authenticate using your verified college credentials or roll number.' 
                    : 'Create your permanent autonomous college record with department enrollment.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setError(null);
                }}
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-all shrink-0 flex items-center space-x-1"
              >
                {authMode === 'login' ? (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Student Account</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Existing Student Sign In</span>
                  </>
                )}
              </button>
            </div>

            {/* Persona Segment Tabs (Student, Faculty, Exam Cell, Parent) - Only in Login mode */}
            {authMode === 'login' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200 gap-1">
                <button
                  type="button"
                  onClick={() => handleTabChange('student')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all text-xs ${
                    roleTab === 'student'
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('admin')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all text-xs ${
                    roleTab === 'admin'
                      ? 'bg-white text-purple-700 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Faculty & Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('exam')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all text-xs ${
                    roleTab === 'exam'
                      ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Exam Cell</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('parent')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all text-xs ${
                    roleTab === 'parent'
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Parent / Ward</span>
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

            {/* FORM: LOGIN MODE */}
            {authMode === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Identifier Method Toggle: Email vs Student Roll Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Sign In Credential
                    </label>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`font-semibold ${loginMethod === 'email' ? 'text-blue-600 underline' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Institutional Email
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('roll')}
                        className={`font-semibold ${loginMethod === 'roll' ? 'text-blue-600 underline' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Roll / Hall Ticket No.
                      </button>
                    </div>
                  </div>

                  {loginMethod === 'email' ? (
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder={roleTab === 'admin' ? "principal@mictech.ac.in" : "student@mictech.ac.in"}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                        placeholder="e.g. 21H71A0501 or 22H71A05A4"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all uppercase tracking-wider"
                      />
                    </div>
                  )}
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Account Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="text-[11px] text-blue-600 font-semibold hover:underline"
                    >
                      Forgot Password / Reset PIN?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Autonomous Regulation & Captcha Security Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Academic Regulation
                    </label>
                    <select
                      value={regulation}
                      onChange={(e) => setRegulation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="R23 Autonomous">R23 Regulations (Autonomous)</option>
                      <option value="R20 Autonomous">R20 Regulations (Autonomous)</option>
                      <option value="R19 Autonomous">R19 Regulations (Affiliated)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Security Verification
                      </label>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="text-slate-400 hover:text-blue-600"
                        title="New calculation challenge"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-slate-200 text-slate-800 font-mono font-bold px-2.5 py-1.5 rounded-lg text-xs border border-slate-300 select-none">
                        {captchaNum1} + {captchaNum2} = ?
                      </div>
                      <input
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Result"
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Keep me signed in for 30 days on this device</span>
                  </label>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg ${
                    roleTab === 'admin'
                      ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-500/20'
                      : roleTab === 'exam'
                      ? 'bg-amber-700 hover:bg-amber-800 shadow-amber-500/20'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  }`}
                >
                  {loading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>
                        Enter {roleTab === 'student' ? 'Student Portal' : roleTab === 'admin' ? 'Faculty & Admin Console' : roleTab === 'exam' ? 'Examination Console' : 'Parent Gateway'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM: REGISTER MODE (EXPANDED FIELDS) */}
            {authMode === 'register' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Personal Details */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Personal & University Identity</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Full Name (as in SSC)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Rahul Varma"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Permanent Roll No / PIN
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                        placeholder="e.g. 23H71A0501"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 uppercase tracking-wider font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Institutional Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="e.g. 23h71a0501@mictech.ac.in"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Student Mobile / WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Academic Program Details */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Academic Program & Department</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Branch / Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Year & Semester
                      </label>
                      <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="B.Tech 1st Year (Semester 1)">1st Year (Sem 1)</option>
                        <option value="B.Tech 1st Year (Semester 2)">1st Year (Sem 2)</option>
                        <option value="B.Tech 2nd Year (Semester 3)">2nd Year (Sem 3)</option>
                        <option value="B.Tech 2nd Year (Semester 4)">2nd Year (Sem 4)</option>
                        <option value="B.Tech 3rd Year (Semester 5)">3rd Year (Sem 5)</option>
                        <option value="B.Tech 3rd Year (Semester 6)">3rd Year (Sem 6)</option>
                        <option value="B.Tech 4th Year (Semester 7)">4th Year (Sem 7)</option>
                        <option value="B.Tech 4th Year (Semester 8)">4th Year (Sem 8)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Section
                      </label>
                      <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="Section C">Section C</option>
                        <option value="Section D">Section D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Autonomous Regulation
                      </label>
                      <select
                        value={regRegulation}
                        onChange={(e) => setRegRegulation(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="R23 Autonomous">R23 Autonomous</option>
                        <option value="R20 Autonomous">R20 Autonomous</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Residence & Commute */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <Bus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Residence & Commute Method</span>
                    </span>

                    <div className="flex items-center space-x-1 p-0.5 bg-slate-200 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setResidenceType('Day Scholar')}
                        className={`px-2 py-0.5 rounded ${residenceType === 'Day Scholar' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'}`}
                      >
                        Day Scholar
                      </button>
                      <button
                        type="button"
                        onClick={() => setResidenceType('Hosteler')}
                        className={`px-2 py-0.5 rounded ${residenceType === 'Hosteler' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600'}`}
                      >
                        Campus Hosteler
                      </button>
                    </div>
                  </div>

                  {residenceType === 'Day Scholar' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        College Bus Route (45+ GPS Fleet)
                      </label>
                      <select
                        value={busRoute}
                        onChange={(e) => setBusRoute(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                      >
                        {BUS_ROUTES.map((route) => (
                          <option key={route} value={route}>{route}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Campus Hostel Facility
                      </label>
                      <select
                        value={hostelBlock}
                        onChange={(e) => setHostelBlock(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Campus Boys Hostel - Block A">Campus Boys Hostel - Block A</option>
                        <option value="Campus Boys Hostel - Block B">Campus Boys Hostel - Block B</option>
                        <option value="Campus Girls Hostel - Saraswati Block">Campus Girls Hostel - Saraswati Block</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 4. Credentials & Password */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    <span>Security Credentials</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Account Password
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                      />
                      {/* Password strength bar */}
                      {regPassword && (
                        <div className="mt-1 flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`h-1 flex-1 rounded-full ${
                                regStrength >= lvl
                                  ? regStrength <= 2
                                    ? 'bg-red-500'
                                    : regStrength <= 3
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                          <span className="text-[9px] text-slate-500 font-mono ml-1">
                            {regStrength <= 2 ? 'Weak' : regStrength <= 3 ? 'Medium' : 'Strong'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600 uppercase">
                          Confirm Password
                        </label>
                        {confirmPassword && (
                          <span className={`text-[10px] font-bold ${confirmPassword === regPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                            {confirmPassword === regPassword ? '✓ Matches' : '✗ Mismatch'}
                          </span>
                        )}
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:ring-2 focus:ring-blue-500 ${
                          confirmPassword && confirmPassword !== regPassword
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Undertaking Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start space-x-2 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToConduct}
                      onChange={(e) => setAgreedToConduct(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>
                      I solemnly affirm that the details provided are genuine, and I agree to abide by the <strong>Autonomous Academic Regulations (75% attendance policy, R20/R23 criteria)</strong> and student code of conduct of DVR & Dr. HS MIC College of Technology.
                    </span>
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 hover:shadow-lg"
                >
                  {loading ? (
                    <span>Registering Autonomous Identity...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Complete Registration & Open Student Portal</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Institutional Fast-Access Accounts & Evaluation Personas Accordion */}
            <div className="pt-4 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => setShowEvaluationPass(!showEvaluationPass)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
              >
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Official Quick Login & Evaluation Personas</span>
                </span>
                {showEvaluationPass ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showEvaluationPass && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs animate-in fade-in">
                  <p className="text-[11px] text-slate-500">
                    Select an official college profile or statutory evaluation persona to sign in immediately:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickPersona('student@mictech.ac.in', 'student-dashboard')}
                      className="text-left bg-white hover:bg-blue-50 border border-blue-200 p-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      <span className="font-bold text-blue-700 block text-[11px]">Official Student</span>
                      <span className="text-[10px] text-slate-500 block">DVR & Dr. HS MIC College</span>
                      <span className="text-[9px] text-emerald-600 font-semibold font-mono">84.0% Attendance &bull; R20</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPersona('principal@mictech.ac.in', 'admin-dashboard')}
                      className="text-left bg-white hover:bg-purple-50 border border-purple-200 p-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      <span className="font-bold text-purple-700 block text-[11px]">Dr. T. Vamsee Kiran</span>
                      <span className="text-[10px] text-slate-500 block">Principal / Admin Console</span>
                      <span className="text-[9px] text-purple-600 font-semibold font-mono">Full Authority</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPersona('alex.kumar@campus.edu', 'student-dashboard')}
                      className="text-left bg-white hover:bg-amber-50 border border-amber-200 p-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      <span className="font-bold text-amber-800 block text-[11px]">Evaluator Test Case</span>
                      <span className="text-[10px] text-slate-500 block">Alex Kumar (Test Persona)</span>
                      <span className="text-[9px] text-amber-600 font-semibold font-mono">68.5% Condonation Test</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          <p className="text-[11px] text-slate-400 text-center pt-5">
            DVR & Dr HS MIC College of Technology &copy; 2026 &bull; Autonomous Institution &bull; Central Authentication Authority
          </p>

        </div>

      </div>

      {/* Help & Portal Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Institutional Login Guide</h3>
                  <p className="text-[11px] text-slate-500">DVR & Dr. HS MIC College of Technology</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3">
              <p>
                <strong>Student Sign In:</strong> Use your permanent institutional email (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">student@mictech.ac.in</code>) or your 10-digit Hall Ticket PIN (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 font-mono">21H71A0501</code>).
              </p>
              <p>
                <strong>Password Reset:</strong> For security compliance, password resets require verification from the Examination Cell or the Campus IT Cell at the Administrative Block.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                <span className="font-bold text-slate-700 block">Campus IT Helpdesk:</span>
                <span className="block text-slate-600">Email: support@mictech.ac.in</span>
                <span className="block text-slate-600">Administrative Block, Ground Floor</span>
                <span className="block text-slate-600">Office Hours: 9:00 AM – 5:00 PM (Monday to Saturday)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
