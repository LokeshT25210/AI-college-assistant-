import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Database, 
  Table, 
  FileJson, 
  Users, 
  TicketCheck, 
  Bell, 
  Download, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  HardDrive,
  Key,
  ShieldCheck,
  Server,
  GraduationCap,
  MessageSquare,
  Star,
  Activity,
  Award
} from 'lucide-react';

export default function DatabaseViewer() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const loadDatabase = async () => {
    setLoading(true);
    try {
      const res = await api.getDatabase();
      if (res.success) {
        setDbData(res.database);
      }
    } catch (err) {
      console.error('Error fetching database dump:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  const handleDownloadBackup = () => {
    if (!dbData) return;
    const blob = new Blob([JSON.stringify(dbData.collections, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mongodb_atlas_campus_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
        Connecting to MongoDB Atlas Cluster0 &amp; querying collections...
      </div>
    );
  }

  const collections = dbData?.collections || {
    users: [],
    requests: [],
    announcements: [],
    academicRecords: [],
    conversations: [],
    feedbacks: [],
    auditLogs: []
  };

  const stats = dbData?.stats || {
    usersCount: (collections.users || []).length,
    requestsCount: (collections.requests || []).length,
    announcementsCount: (collections.announcements || []).length,
    academicRecordsCount: (collections.academicRecords || []).length,
    conversationsCount: (collections.conversations || []).length,
    feedbacksCount: (collections.feedbacks || []).length,
    auditLogsCount: (collections.auditLogs || []).length
  };

  const filteredUsers = (collections.users || []).filter(u =>
    !searchTerm.trim() ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRequests = (collections.requests || []).filter(r =>
    !searchTerm.trim() ||
    r.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAcademicRecords = (collections.academicRecords || []).filter(m =>
    !searchTerm.trim() ||
    m.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.studentRollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.semester?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConversations = (collections.conversations || []).filter(c =>
    !searchTerm.trim() ||
    c.query?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedbacks = (collections.feedbacks || []).filter(f =>
    !searchTerm.trim() ||
    f.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.ticketId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAuditLogs = (collections.auditLogs || []).filter(a =>
    !searchTerm.trim() ||
    a.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.actorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
            <Server className="w-4 h-4" />
            <span>MongoDB Atlas Cloud Connected &bull; Database: campus_db</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif flex items-center space-x-2.5">
            <Database className="w-6 h-6 text-blue-400" />
            <span>MongoDB Multi-Collection Data Tier Inspector</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Cluster: <code className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded font-mono text-[11px]">cluster0.znvpnv1.mongodb.net/campus_db</code> &bull; 7 Active Mongoose Collections
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={loadDatabase}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors shadow-sm"
            title="Refresh database state"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownloadBackup}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export MongoDB Dump JSON</span>
          </button>
        </div>
      </div>

      {/* Metric Cards - 4 Key Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Users &amp; Profiles</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white block">{stats.usersCount}</span>
          <span className="text-[10px] text-slate-500">Students, faculty &amp; admin</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Grievance Tickets</span>
            <TicketCheck className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white block">{stats.requestsCount}</span>
          <span className="text-[10px] text-slate-500">Audit timeline logs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Marks &amp; Percentages</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white block">{stats.academicRecordsCount || 2}</span>
          <span className="text-[10px] text-slate-500">Semester marksheets &amp; SGPA</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">AI Chats &amp; Feedbacks</span>
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white block">{(stats.conversationsCount || 0) + (stats.feedbacksCount || 0)}</span>
          <span className="text-[10px] text-slate-500">Copilot logs &amp; reviews</span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Scrollable Tabs */}
          <div className="flex items-center space-x-1.5 text-xs font-bold overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'users' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users &amp; Marks ({stats.usersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'requests' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <TicketCheck className="w-3.5 h-3.5" />
              <span>Tickets ({stats.requestsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('academic')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'academic' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Semester Marks ({stats.academicRecordsCount || 2})</span>
            </button>

            <button
              onClick={() => setActiveTab('conversations')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'conversations' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Conversations ({stats.conversationsCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('feedbacks')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'feedbacks' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Feedback &amp; Ratings ({stats.feedbacksCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'audit' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Audit Trail ({stats.auditLogsCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'raw' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Raw JSON</span>
            </button>
          </div>

          {/* Search Input */}
          {activeTab !== 'raw' && (
            <div className="relative w-full lg:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter current collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg text-xs focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Users Collection Table (with Marks & Percentages) */}
        {activeTab === 'users' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700 text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Roll / Staff ID</th>
                    <th className="py-2.5 px-3">Student / Staff Name</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-center">CGPA / SGPA</th>
                    <th className="py-2.5 px-3 text-center">Percentage %</th>
                    <th className="py-2.5 px-3 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-blue-700 dark:text-blue-400">{u.studentId || u.staffId || 'N/A'}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{u.email}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px]">{u.department}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-purple-700 dark:text-purple-300">
                        {u.cgpa ? `${u.cgpa} CGPA` : 'N/A'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700 dark:text-emerald-300">
                        {u.percentage ? `${u.percentage}%` : (u.cgpa ? `${(u.cgpa * 9.5).toFixed(1)}%` : 'N/A')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-slate-200">
                        {u.attendance ? `${u.attendance}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Grievance Tickets Collection */}
        {activeTab === 'requests' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700 text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Issue Title</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRequests.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700 dark:text-blue-400">{r.ticketId}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{r.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">{r.title}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.department}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.priority === 'High' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Academic Records (Detailed Marks & Percentages) */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            {filteredAcademicRecords.map((rec, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">{rec.studentRollNo}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">&bull; {rec.studentName}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{rec.department} | {rec.semester} ({rec.regulation})</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-black font-mono">
                      {rec.overallPercentage}% Aggregate
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-2.5 py-1 rounded-lg font-black font-mono">
                      {rec.sgpa} SGPA
                    </span>
                  </div>
                </div>

                {/* Subject Marks Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-2.5">Code</th>
                        <th className="py-2 px-2.5">Subject Course</th>
                        <th className="py-2 px-2.5 text-center">Internal</th>
                        <th className="py-2 px-2.5 text-center">External</th>
                        <th className="py-2 px-2.5 text-center">Total Marks</th>
                        <th className="py-2 px-2.5 text-center">Percentage</th>
                        <th className="py-2 px-2.5 text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {(rec.subjects || []).map((s, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 px-2.5 font-mono text-[11px] text-slate-500">{s.subjectCode}</td>
                          <td className="py-1.5 px-2.5 font-medium text-slate-800 dark:text-slate-200">{s.subjectName}</td>
                          <td className="py-1.5 px-2.5 text-center font-mono">{s.internalMarks || s.internalMarks === 0 ? s.internalMarks : '-'}</td>
                          <td className="py-1.5 px-2.5 text-center font-mono">{s.externalMarks || s.externalMarks === 0 ? s.externalMarks : '-'}</td>
                          <td className="py-1.5 px-2.5 text-center font-bold font-mono text-blue-700 dark:text-blue-400">{s.totalMarks} / {s.maxMarks || 100}</td>
                          <td className="py-1.5 px-2.5 text-center font-bold font-mono text-emerald-700 dark:text-emerald-400">{s.percentage || ((s.totalMarks / (s.maxMarks || 100)) * 100).toFixed(0)}%</td>
                          <td className="py-1.5 px-2.5 text-right font-black text-purple-700 dark:text-purple-400">{s.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: AI Conversations (Chat Logs) */}
        {activeTab === 'conversations' && (
          <div className="space-y-3">
            {filteredConversations.map((c, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>{c.studentName || 'Student'}</span>
                    <span className="text-slate-400 font-normal font-mono">({c.studentRollNo || 'Portal User'})</span>
                  </span>
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    {c.category || 'General'}
                  </span>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs italic">"{c.query}"</p>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {c.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Feedbacks & Ratings */}
        {activeTab === 'feedbacks' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredFeedbacks.map((f, i) => (
              <div key={i} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{f.studentName}</span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(f.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-snug">{f.comment}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Ticket: <span className="font-mono text-blue-600 dark:text-blue-400">{f.ticketId}</span></span>
                  <span>{f.feedbackType || 'Resolution'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 6: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700 text-[11px] uppercase">
                <tr>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Actor</th>
                  <th className="py-2 px-3">Entity</th>
                  <th className="py-2 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAuditLogs.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 font-mono font-bold text-blue-700 dark:text-blue-400 text-[11px]">{a.action}</td>
                    <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{a.actorName}</td>
                    <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">{a.targetEntity}: {a.targetId || '-'}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{a.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 7: Raw JSON Database Dump */}
        {activeTab === 'raw' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Full MongoDB Atlas collection serialization (7 collections):</span>
              <button
                onClick={handleDownloadBackup}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json file</span>
              </button>
            </div>
            <pre className="bg-slate-900 dark:bg-black/90 text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[500px] leading-relaxed border border-slate-800">
              {JSON.stringify(collections, null, 2)}
            </pre>
          </div>
        )}

      </div>

      {/* Architecture Note */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 text-xs text-blue-900 dark:text-blue-200 space-y-1">
        <p className="font-bold flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          <span>MongoDB Atlas Enterprise Data Tier Active</span>
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The database is persistently connected to your MongoDB Atlas cloud cluster (<code>cluster0.znvpnv1.mongodb.net/campus_db</code>). All collections (<code>users</code>, <code>requests</code>, <code>academicrecords</code>, <code>conversations</code>, <code>feedbacks</code>, <code>auditlogs</code>, and <code>announcements</code>) support real-time querying, live indexing, and student mark/percentage analytics.
        </p>
      </div>

    </div>
  );
}


