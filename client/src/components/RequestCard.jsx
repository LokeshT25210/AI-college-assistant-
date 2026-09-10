import React from 'react';
import { 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Tag,
  Flame,
  Calendar
} from 'lucide-react';

const STATUS_CONFIG = {
  'Submitted': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-600' },
  'Under Review': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-600' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-600' },
  'Resolved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-600' }
};

const PRIORITY_CONFIG = {
  'Urgent': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: Flame },
  'High': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  'Medium': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Low': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' }
};

export default function RequestCard({ request, onClick }) {
  const statusCfg = STATUS_CONFIG[request.status] || STATUS_CONFIG['Submitted'];
  const priorityCfg = PRIORITY_CONFIG[request.priority] || PRIORITY_CONFIG['Medium'];

  return (
    <div 
      onClick={() => onClick(request.ticketId)}
      className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {request.ticketId}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            <span>{request.status}</span>
          </span>
        </div>

        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityCfg.bg} ${priorityCfg.text} ${priorityCfg.border}`}>
          {request.priority} Priority
        </span>
      </div>

      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
        {request.title}
      </h3>

      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
        {request.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 font-medium text-slate-600">
            <Building2 className="w-3 h-3 text-slate-400" />
            <span>{request.department}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          </span>
        </div>

        <div className="flex items-center text-blue-600 font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
          <span>Track</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </div>
      </div>
    </div>
  );
}
