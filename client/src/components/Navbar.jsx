import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  Bell, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';

export default function Navbar({ onOpenExaminerGuide, onNavigate }) {
  const { user, quickSwitchUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (email) => {
    setSwitching(true);
    setDropdownOpen(false);
    await quickSwitchUser(email);
    setSwitching(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Crest */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard') : 'landing')}>
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white font-serif">Apex University</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Official Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 -mt-0.5">Smart Campus AI Assistant & Ticketing</p>
          </div>
        </div>

        {/* Action Center */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Examiner Evaluation Tool Button */}
          <button
            onClick={onOpenExaminerGuide}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Open Examiner Evaluation Rubric & Demo Scenarios"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">Examiner Guide & Scoring (100 pts)</span>
            <span className="sm:hidden">Examiner Demo</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg border border-slate-700 text-left transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center space-x-1.5">
                    <span>{user.name}</span>
                    {user.role === 'admin' ? (
                      <span className="bg-purple-900/80 text-purple-300 border border-purple-700 text-[10px] px-1.5 py-0.2 rounded font-medium">Admin</span>
                    ) : (
                      <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-medium">Student</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user.role === 'admin' ? user.designation : user.studentId}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher & Account Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Profile</p>
                    <p className="text-sm font-bold text-white mt-0.5">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <p className="text-[11px] text-blue-400 mt-0.5">{user.department}</p>
                  </div>

                  {/* 1-Click Role Switcher for Examiner */}
                  <div className="px-3 py-2 border-b border-slate-800 bg-slate-800/40">
                    <p className="text-[11px] font-semibold text-amber-300 flex items-center space-x-1 mb-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                      <span>Examiner 1-Click Persona Switcher:</span>
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleSwitch('alex.kumar@campus.edu')}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          user.email === 'alex.kumar@campus.edu' ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Alex Kumar (Student)</span>
                        </div>
                        <span className="text-[10px] text-slate-400">68% Attn</span>
                      </button>

                      <button
                        onClick={() => handleSwitch('admin@campus.edu')}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          user.email === 'admin@campus.edu' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>Dr. S. Raman (Registrar)</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Admin</span>
                      </button>

                      <button
                        onClick={() => handleSwitch('finance@campus.edu')}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          user.email === 'finance@campus.edu' ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Prof. V. Mehta (Finance Head)</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Finance</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-slate-800 text-slate-300 flex items-center space-x-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>View My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        onNavigate('landing');
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-red-950/40 text-red-400 flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Sign In to Portal
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
