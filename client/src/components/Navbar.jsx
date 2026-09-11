import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  Bell, 
  HelpCircle,
  Sun, 
  Moon
} from 'lucide-react';

import ThreeDCampusBadge from './ThreeDCampusBadge';

export default function Navbar({ onOpenExaminerGuide, onNavigate, onToggleMobileMenu, mobileMenuOpen }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {user && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="p-2 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none" 
            onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard') : 'landing')}
          >
            <div className="relative flex items-center justify-center">
              <ThreeDCampusBadge size={36} className="shrink-0 sm:hidden" />
              <ThreeDCampusBadge size={42} className="shrink-0 hidden sm:block" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-xs sm:text-base tracking-tight text-white font-serif">
                  <span className="sm:hidden">AEC CAMPUS</span>
                  <span className="hidden sm:inline">AUTONOMOUS ENGINEERING COLLEGE</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50 shrink-0">
                  {user?.role === 'admin' ? 'Admin' : 'Portal'}
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-400 -mt-0.5">Smart Campus AI Assistant & Ticketing</p>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="flex items-center space-x-1.5 sm:space-x-4">
          
          {/* Examiner Evaluation Tool Button */}
          <button
            onClick={onOpenExaminerGuide}
            className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Open Examiner Evaluation Rubric & Demo Scenarios"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span className="hidden sm:inline">Examiner Guide & Scoring (100 pts)</span>
            <span className="sm:hidden font-extrabold">Rubric</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center justify-center shadow-sm cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-300" />
            )}
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
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Profile</p>
                    <p className="text-sm font-bold text-white mt-0.5">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <p className="text-[11px] text-blue-400 mt-0.5">{user.department}</p>
                  </div>

                  {/* Account Security Badge */}
                  <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/40 text-[11px] text-slate-400 flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Secure Authenticated Session</span>
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
