import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  GraduationCap, 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Clock, 
  Award, 
  Home, 
  Calendar,
  Lock
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const isStudent = user.role === 'student';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {user.name}
            </h1>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isStudent ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-purple-50 text-purple-800 border-purple-200'
            }`}>
              {isStudent ? 'Active Undergraduate Student' : 'Senior Institutional Staff'}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            {isStudent ? `Student ID: ${user.studentId}` : `Employee Code: ${user.staffId}`} &bull; {user.department}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
            <span className="flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.phone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Academic / Staff Credential Breakdown */}
      {isStudent ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Cumulative Attendance</span>
            </div>
            <div className="text-3xl font-black text-amber-600">
              {user.attendance}%
            </div>
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
              Eligible for semester exams only under Medical Condonation (Academic Rule 4.2).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Academic Performance</span>
            </div>
            <div className="text-3xl font-black text-blue-600">
              {user.cgpa} <span className="text-xs font-medium text-slate-400">/ 10.0</span>
            </div>
            <p className="text-[11px] text-slate-500">
              First Class with Distinction track. Dean's Merit Honor Roll candidate.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase">
              <Home className="w-4 h-4 text-blue-600" />
              <span>Campus Residency</span>
            </div>
            <div className="text-xl font-bold text-slate-800">
              {user.hostel}
            </div>
            <p className="text-[11px] text-slate-500">
              Resident Scholar &bull; Mess Diet: South Indian Veg/Non-Veg
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Administrative Jurisdictional Authority</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 uppercase block text-[10px]">Institutional Rank</span>
              <span className="text-sm font-bold text-slate-800">{user.designation}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-500 uppercase block text-[10px]">Division</span>
              <span className="text-sm font-bold text-slate-800">{user.department}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
              <span className="font-bold text-slate-500 uppercase block text-[10px]">Security Permissions</span>
              <span className="text-xs text-slate-700 font-medium">
                Full Grievance Adjudication, SLA Timeline Override, Category Reassignment, Cross-Departmental Triage, AI Analytics Model Access.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
