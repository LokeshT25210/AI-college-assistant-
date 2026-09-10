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
  Server
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
    a.download = `apex_campus_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
        Querying database persistence layer...
      </div>
    );
  }

  const collections = dbData?.collections || { users: [], requests: [], announcements: [] };
  const stats = dbData?.stats || { usersCount: 0, requestsCount: 0, announcementsCount: 0 };

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

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
            <Server className="w-4 h-4" />
            <span>Campus Data Tier &bull; File & Document Store</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif flex items-center space-x-2.5">
            <Database className="w-6 h-6 text-blue-400" />
            <span>Database & Storage Engine Inspector</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Active Store: <code className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono text-[11px]">server/data/campus_db.json</code> (ACID Transactional Persistence)
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
            <span>Export Database JSON</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Users Collection</span>
            <span className="text-xl font-extrabold text-slate-900 block">{stats.usersCount} Registered</span>
            <span className="text-[10px] text-slate-500">Students, Faculty & Staff</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <TicketCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Requests Collection</span>
            <span className="text-xl font-extrabold text-slate-900 block">{stats.requestsCount} Grievances</span>
            <span className="text-[10px] text-slate-500">Audit Timelines & Statuses</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Architecture</span>
            <span className="text-sm font-extrabold text-slate-900 block">Document Store</span>
            <span className="text-[10px] text-emerald-700 font-semibold">MongoDB / JSON Mirror</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center space-x-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'users' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users Table ({stats.usersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'requests' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <TicketCheck className="w-3.5 h-3.5" />
              <span>Grievance Tickets ({stats.requestsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'raw' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Raw JSON Database Dump</span>
            </button>
          </div>

          {/* Search Input */}
          {activeTab !== 'raw' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search collection records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Users Collection Table */}
        {activeTab === 'users' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Identifier / Roll No</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{u.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3 text-blue-700 font-mono text-[11px]">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{u.studentId || u.staffId || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-slate-600">{u.department}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      {u.attendance ? `${u.attendance}%` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Grievance Tickets Collection */}
        {activeTab === 'requests' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Subject / Issue</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Audit Steps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{r.ticketId}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium max-w-xs truncate">{r.title}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.department}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-600">
                      {r.timeline?.length || 1} logs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Raw JSON Database Dump */}
        {activeTab === 'raw' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Direct JSON serialization of the persistent university data file:</span>
              <button
                onClick={handleDownloadBackup}
                className="text-blue-600 font-bold hover:underline flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json file</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-[500px] leading-relaxed border border-slate-800">
              {JSON.stringify(collections, null, 2)}
            </pre>
          </div>
        )}

      </div>

      {/* Architecture Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-1">
        <p className="font-bold flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Persistence & Storage Architecture Note</span>
        </p>
        <p className="text-slate-600 leading-relaxed">
          The database is stored locally as a transactional JSON file in <code>server/data/campus_db.json</code> with atomic write locks, preventing data corruption and requiring zero third-party cloud subscription. The schema follows document-oriented MongoDB conventions (collections for <code>users</code>, <code>requests</code>, and <code>announcements</code>), making it 100% compatible with MongoDB Atlas or SQLite when configured.
        </p>
      </div>

    </div>
  );
}
