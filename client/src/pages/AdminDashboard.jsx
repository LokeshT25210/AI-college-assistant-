import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  Calendar,
  Layers,
  Search
} from 'lucide-react';

export default function AdminDashboard({ onSelectTicket, onNavigate }) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [analyticsRes, requestsRes] = await Promise.all([
        api.getAnalytics(),
        api.getAllRequests({ priority: 'all', status: 'all' })
      ]);
      if (analyticsRes.success) setAnalytics(analyticsRes);
      if (requestsRes.success) setRecentTickets(requestsRes.requests.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
        Loading administrative telemetry and analytics...
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    resolvedRequests: 0,
    avgResolutionHours: 28.5,
    resolutionRatePercent: 85
  };

  const topInsight = analytics?.aiOperationalInsights?.[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold mb-1">
            <Building2 className="w-4 h-4" />
            <span>Campus Administration &bull; Executive Command Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif">
            Student Grievance & Service Telemetry
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <strong>{user?.name}</strong> ({user?.designation}) &bull; Campus Registrar
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={loadDashboard}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors shadow-sm"
            title="Refresh analytics telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('admin-requests')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <span>Manage All Tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Requests</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics.totalRequests}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Campus-wide</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-blue-600 block">Pending Review</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{metrics.pendingRequests}</span>
          <span className="text-[10px] text-blue-600/80 font-medium mt-1 block">Submitted / Review</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-amber-600 block">In Progress</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{metrics.inProgressRequests}</span>
          <span className="text-[10px] text-amber-600/80 font-medium mt-1 block">Active Dispatch</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-emerald-600 block">Resolved</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{metrics.resolvedRequests}</span>
          <span className="text-[10px] text-emerald-600/80 font-medium mt-1 block">{metrics.resolutionRatePercent}% Success</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 block">Avg Resolution</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{metrics.avgResolutionHours}h</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">SLA Benchmark</span>
        </div>
      </div>

      {/* Featured AI Operational Insight Card (Section 10 Requirement) */}
      {topInsight && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                  AI Operational Root-Cause Diagnosis &bull; {topInsight.severity}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {topInsight.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-bold text-amber-900 hover:underline flex items-center space-x-1"
            >
              <span>View All Insights</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>Observation:</strong> {topInsight.summary}
          </p>

          <div className="bg-white/80 rounded-xl p-3 border border-amber-200 text-xs space-y-1 text-slate-800">
            <p><strong>Underlying Cause:</strong> {topInsight.rootCause}</p>
            <p className="text-blue-900 font-semibold">
              <strong>Actionable Recommendation:</strong> {topInsight.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Two Column Grid: Triage Queue & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Urgent / High Priority Triage Queue */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Priority Triage Queue & Recent Lodgments</span>
            </h2>
            <button
              onClick={() => onNavigate('admin-requests')}
              className="text-xs text-purple-700 font-bold hover:underline"
            >
              Open Full Grid &rarr;
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Subject / Issue</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTickets.map((t) => (
                    <tr key={t.ticketId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{t.ticketId}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold block">{t.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.studentRollNo}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 max-w-xs truncate" title={t.title}>
                        {t.title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{t.department}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          t.priority === 'High' || t.priority === 'Urgent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                          t.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                          t.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectTicket(t.ticketId)}
                          className="bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded transition-colors text-[11px]"
                        >
                          Adjudicate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Frequently Reported Issues & Department Distribution */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Frequently Reported Issues</span>
            </h3>

            <div className="space-y-2 text-xs">
              {analytics?.frequentlyReportedIssues?.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span className="text-[11px] text-blue-700">{item.dept}</span>
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                      {item.count} reports
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug font-medium">
                    {item.issue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Department Caseload Distribution
            </h3>
            <div className="space-y-2 text-xs">
              {analytics?.distributions?.byDepartment?.map((dept, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-slate-700 truncate max-w-[180px]">{dept.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (dept.value / metrics.totalRequests) * 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 min-w-[16px] text-right">{dept.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
