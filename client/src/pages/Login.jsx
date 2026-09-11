import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import Campus3DScene from '../components/Campus3DScene';
import StudentCaptcha from '../components/StudentCaptcha';
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

  // Student Human Verification CAPTCHA state
  const [loginCaptcha, setLoginCaptcha] = useState('');
  const [loginCaptchaCode, setLoginCaptchaCode] = useState('');
  const [loginCaptchaSubmitted, setLoginCaptchaSubmitted] = useState(false);

  const [regCaptcha, setRegCaptcha] = useState('');
  const [regCaptchaCode, setRegCaptchaCode] = useState('');
  const [regCaptchaSubmitted, setRegCaptchaSubmitted] = useState(false);

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

  // Standard Email Syntax & Domain Detection
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email.trim());
  const isGmail = email.trim().toLowerCase().endsWith('@gmail.com');
  const isInstitutional = email.trim().toLowerCase().includes('@mictech.ac.in') || email.trim().toLowerCase().includes('@campus.edu');

  // Comprehensive 5-Criteria Password Security Rules
  const pwdRules = {
    hasLength8: regPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(regPassword),
    hasLowercase: /[a-z]/.test(regPassword),
    hasNumber: /[0-9]/.test(regPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(regPassword)
  };

  const satisfiedRulesCount = Object.values(pwdRules).filter(Boolean).length;
  const isPasswordCompliant = satisfiedRulesCount === 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Verify Student Human CAPTCHA for Login
    if (authMode === 'login') {
      setLoginCaptchaSubmitted(true);
      if (!loginCaptcha || loginCaptcha.trim().toUpperCase() !== (loginCaptchaCode || '').toUpperCase()) {
        setLoading(false);
        setError('Student Human Verification Required: Please enter the exact security code shown to prove human student identity.');
        return;
      }
    }

    // Verify Student Human CAPTCHA for Registration
    if (authMode === 'register') {
      setRegCaptchaSubmitted(true);
      if (!regCaptcha || regCaptcha.trim().toUpperCase() !== (regCaptchaCode || '').toUpperCase()) {
        setLoading(false);
        setError('Student Human Verification Required: Please enter the exact security code shown to prove human student identity.');
        return;
      }

      // Enforce valid Email / Gmail format
      if (!isEmailValid) {
        setLoading(false);
        setError('Valid Email Required: Please provide a proper email address (e.g. student@gmail.com or 23h71a0501@mictech.ac.in).');
        return;
      }

      // Enforce 5-criteria password security
      if (!isPasswordCompliant) {
        setLoading(false);
        setError('Security Criteria Incomplete: Password must satisfy all 5 requirements (8+ chars, uppercase, lowercase, number, special symbol).');
        return;
      }

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-950 transition-colors">
      
      {/* Enterprise Dual-Pane Card with 3D Depth */}
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px] transition-all duration-300">
        
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
                  Autonomous Engineering College
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
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-slate-900 overflow-y-auto max-h-[880px] lg:max-h-none transition-colors">
          
          <div className="space-y-5">
            
            {/* Top Bar with Back Link */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate('landing')}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1.5"
              >
                <span>&larr; Return to Campus Home</span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  SSO Portal v4.5
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">R20/R23</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                {authMode === 'login' ? 'Institutional Gateway' : 'New Student Registration'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {authMode === 'login' 
                  ? 'Authenticate using your verified college credentials or roll number.' 
                  : 'Create your permanent autonomous college record with department enrollment.'}
              </p>
            </div>

            {/* Prominent Mode Switcher: Official Sign In / Login vs New Registration / Sign Up */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 gap-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError(null);
                }}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Official Sign In / Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError(null);
                }}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Student Sign Up / Register</span>
              </button>
            </div>

            {/* Persona Segment Tabs (Student, Faculty, Exam Cell, Parent) - Only in Login mode */}
            {authMode === 'login' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 gap-1">
                <button
                  type="button"
                  onClick={() => handleTabChange('student')}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all text-xs ${
                    roleTab === 'student'
                      ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
                      ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
                      ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
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
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Sign In Credential
                    </label>
                    <div className="flex items-center space-x-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('email')}
                        className={`font-semibold ${loginMethod === 'email' ? 'text-blue-600 dark:text-blue-400 underline' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                      >
                        Institutional Email
                      </button>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('roll')}
                        className={`font-semibold ${loginMethod === 'roll' ? 'text-blue-600 dark:text-blue-400 underline' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                      >
                        Roll / Hall Ticket No.
                      </button>
                    </div>
                  </div>

                  {loginMethod === 'email' ? (
                    <div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder={roleTab === 'admin' ? "principal@mictech.ac.in" : "student@gmail.com or 23h71a0501@mictech.ac.in"}
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                        />
                      </div>
                      {email && (
                        <div className="mt-1 flex items-center justify-between text-[10px] px-1">
                          {isGmail ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>Google Gmail recognized</span>
                            </span>
                          ) : isInstitutional ? (
                            <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center space-x-1">
                              <Check className="w-3 h-3 text-blue-500" />
                              <span>Institutional college domain recognized</span>
                            </span>
                          ) : isEmailValid ? (
                            <span className="text-teal-600 dark:text-teal-400 font-semibold flex items-center space-x-1">
                              <Check className="w-3 h-3 text-teal-500" />
                              <span>Valid email syntax</span>
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              Format: student@gmail.com or roll@mictech.ac.in
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                        placeholder="e.g. 21H71A0501 or 22H71A05A4"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all uppercase tracking-wider"
                      />
                    </div>
                  )}
                </div>

                {/* Password Field with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Account Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      Forgot Password / Reset PIN?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Academic Regulation Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Academic Regulation
                  </label>
                  <select
                    value={regulation}
                    onChange={(e) => setRegulation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="R23 Autonomous">R23 Regulations (Autonomous)</option>
                    <option value="R20 Autonomous">R20 Regulations (Autonomous)</option>
                    <option value="R19 Autonomous">R19 Regulations (Affiliated)</option>
                  </select>
                </div>

                {/* Student Human Verification CAPTCHA */}
                <div className="pt-1">
                  <StudentCaptcha
                    userValue={loginCaptcha}
                    onChange={setLoginCaptcha}
                    onCodeGenerated={setLoginCaptchaCode}
                    isSubmitted={loginCaptchaSubmitted}
                  />
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
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
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 pb-1 border-b border-slate-200 dark:border-slate-700">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Personal & University Identity</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Full Name (as in SSC)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. Rahul Varma"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Permanent Roll No / PIN
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                        placeholder="e.g. 23H71A0501"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 uppercase tracking-wider font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                          Email Address (Gmail / College)
                        </label>
                        {email && (
                          <div>
                            {isGmail ? (
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Google Gmail Verified</span>
                              </span>
                            ) : isInstitutional ? (
                              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                                <Check className="w-3 h-3 text-blue-500" />
                                <span>College Domain Verified</span>
                              </span>
                            ) : isEmailValid ? (
                              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                                <Check className="w-3 h-3 text-teal-500" />
                                <span>Valid Email Syntax</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                Needs valid email format
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="e.g. rahul.varma@gmail.com or 23h71a0501@mictech.ac.in"
                          className={`w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-sans transition-colors ${
                            email && !isEmailValid ? 'border-amber-300 dark:border-amber-600' : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                      Student Mobile / WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Academic Program Details */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 pb-1 border-b border-slate-200 dark:border-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Academic Program & Department</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                      Branch / Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Year & Semester
                      </label>
                      <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Section
                      </label>
                      <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="Section C">Section C</option>
                        <option value="Section D">Section D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Autonomous Regulation
                      </label>
                      <select
                        value={regRegulation}
                        onChange={(e) => setRegRegulation(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="R23 Autonomous">R23 Autonomous</option>
                        <option value="R20 Autonomous">R20 Autonomous</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Residence & Commute */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
                      <Bus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Residence & Commute Method</span>
                    </span>

                    <div className="flex items-center space-x-1 p-0.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setResidenceType('Day Scholar')}
                        className={`px-2 py-0.5 rounded transition-colors ${residenceType === 'Day Scholar' ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        Day Scholar
                      </button>
                      <button
                        type="button"
                        onClick={() => setResidenceType('Hosteler')}
                        className={`px-2 py-0.5 rounded transition-colors ${residenceType === 'Hosteler' ? 'bg-white dark:bg-slate-800 text-blue-800 dark:text-blue-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        Campus Hosteler
                      </button>
                    </div>
                  </div>

                  {residenceType === 'Day Scholar' ? (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        College Bus Route (45+ GPS Fleet)
                      </label>
                      <select
                        value={busRoute}
                        onChange={(e) => setBusRoute(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                      >
                        {BUS_ROUTES.map((route) => (
                          <option key={route} value={route}>{route}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase mb-1">
                        Campus Hostel Facility
                      </label>
                      <select
                        value={hostelBlock}
                        onChange={(e) => setHostelBlock(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Campus Boys Hostel - Block A">Campus Boys Hostel - Block A</option>
                        <option value="Campus Boys Hostel - Block B">Campus Boys Hostel - Block B</option>
                        <option value="Campus Girls Hostel - Saraswati Block">Campus Girls Hostel - Saraswati Block</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 4. Credentials & Password */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 pb-1 border-b border-slate-200 dark:border-slate-700">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Security Credentials</span>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                            Account Password
                          </label>
                          {regPassword && (
                            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                              isPasswordCompliant
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                : satisfiedRulesCount >= 3
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                  : 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                            }`}>
                              {satisfiedRulesCount}/5 Met {isPasswordCompliant ? '• Strong' : satisfiedRulesCount >= 3 ? '• Moderate' : '• Weak'}
                            </span>
                          )}
                        </div>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          placeholder="••••••••••••"
                          className={`w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-sans transition-colors ${
                            regPassword && !isPasswordCompliant
                              ? 'border-amber-300 dark:border-amber-600'
                              : regPassword && isPasswordCompliant
                                ? 'border-emerald-400 dark:border-emerald-600'
                                : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                            Confirm Password
                          </label>
                          {confirmPassword && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              confirmPassword === regPassword 
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                                : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700'
                            }`}>
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
                          className={`w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-sans transition-colors ${
                            confirmPassword && confirmPassword !== regPassword
                              ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                              : confirmPassword && confirmPassword === regPassword
                                ? 'border-emerald-400 dark:border-emerald-600'
                                : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Interactive 5-Criteria Password Security Checklist Card */}
                    <div className="p-3 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
                          <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Password Security Specifications (5 Rules)</span>
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {isPasswordCompliant ? '100% Satisfied' : 'All 5 Required'}
                        </span>
                      </div>

                      {/* Dynamic Multi-segment Progress Bar */}
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              satisfiedRulesCount >= lvl
                                ? satisfiedRulesCount <= 2
                                  ? 'bg-red-500'
                                  : satisfiedRulesCount <= 4
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                : 'bg-slate-200 dark:bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Real-time 5 Criteria Live Pills Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5 text-[11px]">
                        <div className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                          pwdRules.hasLength8 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/70'
                        }`}>
                          {pwdRules.hasLength8 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                          <span>8+ Characters Minimum</span>
                        </div>

                        <div className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                          pwdRules.hasUppercase 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/70'
                        }`}>
                          {pwdRules.hasUppercase ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                          <span>Uppercase Letter (A-Z)</span>
                        </div>

                        <div className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                          pwdRules.hasLowercase 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/70'
                        }`}>
                          {pwdRules.hasLowercase ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                          <span>Lowercase Letter (a-z)</span>
                        </div>

                        <div className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                          pwdRules.hasNumber 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/70'
                        }`}>
                          {pwdRules.hasNumber ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                          <span>Numeric Digit (0-9)</span>
                        </div>

                        <div className={`sm:col-span-2 flex items-center space-x-1.5 px-2 py-1.5 rounded-lg border transition-all ${
                          pwdRules.hasSpecial 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/70'
                        }`}>
                          {pwdRules.hasSpecial ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                          )}
                          <span>Special Symbol (!@#$%^&*(),.?":{}|&lt;&gt;)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Human Verification CAPTCHA for Registration */}
                <div className="pt-2">
                  <StudentCaptcha
                    userValue={regCaptcha}
                    onChange={setRegCaptcha}
                    onCodeGenerated={setRegCaptchaCode}
                    isSubmitted={regCaptchaSubmitted}
                  />
                </div>

                {/* Undertaking Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start space-x-2 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToConduct}
                      onChange={(e) => setAgreedToConduct(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>
                      I solemnly affirm that the details provided are genuine, and I agree to abide by the <strong>Autonomous Academic Regulations (75% attendance policy, R20/R23 criteria)</strong> and student code of conduct of the Autonomous Engineering College.
                    </span>
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg ${
                    isPasswordCompliant && isEmailValid
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30 ring-2 ring-blue-400/20'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  {loading ? (
                    <span>Registering Autonomous Identity...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Complete Registration & Open Student Portal</span>
                      {isPasswordCompliant && isEmailValid && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1" />
                      )}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Institutional Fast-Access Accounts & Evaluation Personas Accordion */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowEvaluationPass(!showEvaluationPass)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 py-1"
              >
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Official Quick Login & Evaluation Personas</span>
                </span>
                {showEvaluationPass ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showEvaluationPass && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-in fade-in">
                  
                  {/* Students Section */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                      1-Click Student Personas (Evaluator Scenarios & Attendance Tiers):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickPersona('student@mictech.ac.in', 'student-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-blue-700 dark:text-blue-400 block text-[11px]">Priya Sharma (Std)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">3rd Yr CSE &bull; Regular</span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">84.0% Attendance &bull; R20</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPersona('alex.kumar@campus.edu', 'student-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-amber-800 dark:text-amber-300 block text-[11px]">Alex Kumar (Condonation)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">3rd Yr CSE &bull; 65-75% Tier</span>
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold font-mono">68.5% Condonation Test</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPersona('21h71a0501@mictech.ac.in', 'student-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 block text-[11px]">K. Sai Rahul (Scholar)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">4th Yr CSE &bull; Exam Topper</span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">91.5% Attendance &bull; R20</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPersona('22h71a0408@mictech.ac.in', 'student-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-red-700 dark:text-red-400 block text-[11px]">M. Karthik (Detention Alert)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">3rd Yr ECE &bull; &lt;65% Critical</span>
                        <span className="text-[9px] text-red-600 dark:text-red-400 font-semibold font-mono">58.0% Detention Warning</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPersona('23h71a1205@mictech.ac.in', 'student-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-purple-700 dark:text-purple-400 block text-[11px]">Ananya Reddy (Medical)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">2nd Yr IT &bull; Exemption Case</span>
                        <span className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold font-mono">72.0% Medical Condonation</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPersona('sneha.patel@campus.edu', 'student-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-cyan-700 dark:text-cyan-400 block text-[11px]">Sneha Patel (Placements)</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">4th Yr IT &bull; Placement Lead</span>
                        <span className="text-[9px] text-cyan-600 dark:text-cyan-400 font-semibold font-mono">86.5% Attendance &bull; R20</span>
                      </button>
                    </div>
                  </div>

                  {/* Faculty & Campus Leadership Section */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                      1-Click Administrative & Faculty Consoles:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickPersona('principal@mictech.ac.in', 'admin-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-purple-700 dark:text-purple-400 block text-[11px]">Dr. T. Vamsee Kiran</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Principal / Executive Head</span>
                        <span className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold font-mono">Full Campus Governance</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPersona('coe@mictech.ac.in', 'admin-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-amber-700 dark:text-amber-400 block text-[11px]">Dr. K. Srinivas</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Controller of Examinations</span>
                        <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold font-mono">Hall Tickets & Condonations</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickPersona('hod.cse@mictech.ac.in', 'admin-dashboard')}
                        className="text-left bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 p-2.5 rounded-lg transition-colors shadow-sm"
                      >
                        <span className="font-bold text-blue-700 dark:text-blue-400 block text-[11px]">Dr. P. Sunitha</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Professor & HOD, CSE</span>
                        <span className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold font-mono">Department Grievances</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-5">
            Autonomous Engineering College &copy; 2026 &bull; Autonomous Institution &bull; Central Authentication Authority
          </p>

        </div>

      </div>

      {/* Help & Portal Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Login Guide</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Autonomous Engineering College of Technology</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
              <p>
                <strong>Student Sign In:</strong> Use your permanent institutional email (e.g., <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono">student@mictech.ac.in</code>) or your 10-digit Hall Ticket PIN (e.g., <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono">21H71A0501</code>).
              </p>
              <p>
                <strong>Password Reset:</strong> For security compliance, password resets require verification from the Examination Cell or the Campus IT Cell at the Administrative Block.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-[11px]">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">Campus IT Helpdesk:</span>
                <span className="block text-slate-600 dark:text-slate-300">Email: support@mictech.ac.in</span>
                <span className="block text-slate-600 dark:text-slate-300">Administrative Block, Ground Floor</span>
                <span className="block text-slate-600 dark:text-slate-300">Office Hours: 9:00 AM – 5:00 PM (Monday to Saturday)</span>
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
