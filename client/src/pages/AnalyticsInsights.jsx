import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  RefreshCw,
  Building2,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';

const COLORS = ['#2563eb', '#7c3aed', '#d97706', '#059669', '#dc2626', '#0891b2', '#4f46e5'];

export default function AnalyticsInsights({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Error fetching analytics insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
        Computing institutional telemetry and AI recurring issue models...
      </div>
    );
  }

  const categoryData = data?.distributions?.byCategory || [];
  const departmentData = data?.distributions?.byDepartment || [];
  const priorityData = data?.distributions?.byPriority || [];
  const patterns = data?.aiOperationalInsights || [];
  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>Campus Analytics & AI Operational Insights</span>
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              Automated Diagnosis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Machine intelligence discovering root causes, operational bottlenecks, and recommended university policy adjustments.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-analyze Telemetry</span>
        </button>
      </div>

      {/* AI-Generated Recurring Issue Patterns (Section 10 & 15 Core Highlight) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>AI-Detected Recurring Bottlenecks & Operational Prescriptions</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Clustered by Root Cause</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patterns.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    {item.department}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {item.count} Active Cases
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.summary}
                </p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] space-y-1 text-slate-700">
                  <p><strong>Root Cause:</strong> {item.rootCause}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="bg-blue-50/80 rounded-xl p-2.5 border border-blue-200 text-[11px] text-blue-900 space-y-1">
                  <p className="font-bold flex items-center space-x-1">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Recommendation:</span>
                  </p>
                  <p className="leading-snug">{item.recommendation}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold pt-1">
                    Impact: {item.impactMetric}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Analytics Charts Powered by Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Requests by Category
            </h3>
            <span className="text-[11px] text-slate-400">Total: {metrics.totalRequests}</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  interval={0} 
                  angle={-20} 
                  textAnchor="end" 
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} 
                />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Triage Priority Breakdown
            </h3>
            <span className="text-[11px] text-slate-400">Response SLA Queue</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => {
                    const color = entry.name === 'Urgent' ? '#dc2626' :
                                  entry.name === 'High' ? '#ea580c' :
                                  entry.name === 'Medium' ? '#2563eb' : '#64748b';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
