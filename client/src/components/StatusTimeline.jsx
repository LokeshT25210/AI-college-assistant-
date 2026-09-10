import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Eye, 
  Wrench, 
  AlertCircle,
  FileCheck2,
  Calendar,
  User
} from 'lucide-react';

const STAGES = [
  { id: 'Submitted', label: 'Submitted', icon: Clock, desc: 'Logged & auto-routed' },
  { id: 'Under Review', label: 'Under Review', icon: Eye, desc: 'Department evaluation' },
  { id: 'In Progress', label: 'In Progress', icon: Wrench, desc: 'Action & investigation' },
  { id: 'Resolved', label: 'Resolved', icon: CheckCircle2, desc: 'Official closure' }
];

export default function StatusTimeline({ currentStatus, timeline = [] }) {
  const currentIndex = STAGES.findIndex(s => s.id.toLowerCase() === (currentStatus || '').toLowerCase());

  return (
    <div className="py-2">
      {/* Visual Stepper Bar */}
      <div className="relative mb-8">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block"
          style={{ width: `${Math.max(0, (currentIndex / (STAGES.length - 1)) * 100)}%` }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;

            return (
              <div key={stage.id} className="flex flex-col items-center text-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-sm ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-xs font-bold mt-2 ${isCurrent ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {stage.label}
                </p>
                <p className="text-[10px] text-slate-400 hidden sm:block">{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Chronological Audit Log */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
          <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Official Processing History</span>
        </h4>

        <div className="border border-slate-200 rounded-xl bg-slate-50/50 divide-y divide-slate-200 overflow-hidden">
          {timeline && timeline.length > 0 ? (
            timeline.map((entry, index) => (
              <div key={index} className="p-3.5 sm:p-4 hover:bg-white transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      entry.stage === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      entry.stage === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                      entry.stage === 'Under Review' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {entry.stage}
                    </span>
                    <span className="font-semibold text-slate-700 flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{entry.actor}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 pl-2 border-l-2 border-slate-300 leading-relaxed font-sans">
                  {entry.note}
                </p>
              </div>
            ))
          ) : (
            <div className="p-4 text-xs text-slate-500 text-center">
              No processing steps recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
