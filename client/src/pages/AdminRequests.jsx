import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Wrench, 
  Flame, 
  ArrowUpDown,
  Building2,
  Send,
  X
} from 'lucide-react';

export default function AdminRequests({ onSelectTicket }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Quick Action Modal state
  const [activeTicket, setActiveTicket] = useState(null);
  const [quickStatus, setQuickStatus] = useState('');
  const [responseNote, setResponseNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getAllRequests();
      if (res.success) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error('Error fetching admin tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleOpenQuickModal = (ticket, e) => {
    e.stopPropagation();
    setActiveTicket(ticket);
    setQuickStatus(ticket.status);
    setResponseNote('');
  };

  const handleSaveQuickUpdate = async (e) => {
    e.preventDefault();
    if (!activeTicket || updating) return;

    setUpdating(true);
    try {
      const res = await api.updateRequestStatus(activeTicket.ticketId, {
        status: quickStatus,
        responseNote: responseNote.trim() || `Status changed to ${quickStatus}`
      });
      if (res.success && res.ticket) {
        setRequests(prev => prev.map(r => r.ticketId === res.ticket.ticketId ? res.ticket : r));
        setActiveTicket(null);
      } else {
        alert(res.message || 'Update failed');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = requests.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || r.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesPriority = priorityFilter === 'all' || r.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesSearch = !searchTerm.trim() || (
      r.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentRollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif flex items-center space-x-2">
            <ClipboardList className="w-6 h-6 text-purple-600" />
            <span>Campus Request & Grievance Grid</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-departmental management, triage routing, status transitions, and audit records.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Table</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="sm:col-span-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, student, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white font-sans"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under review">Under Review</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="attendance">Attendance</option>
              <option value="exams">Exams</option>
              <option value="fees">Fees</option>
              <option value="hostel">Hostel</option>
              <option value="certificates">Certificates</option>
              <option value="scholarships">Scholarships</option>
              <option value="academics">Academics</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Enterprise Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading requests repository...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Subject Narrative</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ticket) => (
                  <tr 
                    key={ticket.ticketId}
                    onClick={() => onSelectTicket(ticket.ticketId)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {ticket.ticketId}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{ticket.studentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ticket.studentRollNo}</span>
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <p className="font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {ticket.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {ticket.description}
                      </p>
                      {ticket.specifications && Object.keys(ticket.specifications).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ticket.specifications.utrNumber && (
                            <span className="text-[9px] font-mono bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                              UTR: {ticket.specifications.utrNumber}
                            </span>
                          )}
                          {ticket.specifications.roomNumber && (
                            <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                              Room: {ticket.specifications.roomNumber} ({ticket.specifications.hostelBlock?.split(' ')[0] || 'Hostel'})
                            </span>
                          )}
                          {ticket.specifications.subjectCode && (
                            <span className="text-[9px] font-mono bg-indigo-50 text-indigo-800 px-1.5 py-0.2 rounded border border-indigo-200">
                              Subject: {ticket.specifications.subjectCode}
                            </span>
                          )}
                          {ticket.specifications.medicalProofRef && (
                            <span className="text-[9px] bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                              Medical Doc Attached
                            </span>
                          )}
                          {ticket.specifications.certificateType && (
                            <span className="text-[9px] bg-rose-50 text-rose-800 px-1.5 py-0.2 rounded border border-rose-200">
                              {ticket.specifications.certificateType}
                            </span>
                          )}
                          {ticket.specifications.routeNumber && (
                            <span className="text-[9px] bg-teal-50 text-teal-800 px-1.5 py-0.2 rounded border border-teal-200">
                              Bus: {ticket.specifications.routeNumber.split(' - ')[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <span className="font-medium">{ticket.department}</span>
                      <span className="text-[10px] text-slate-400 block">{ticket.category}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        ticket.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        ticket.priority === 'Medium' ? 'bg-blue-50 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                        ticket.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={(e) => handleOpenQuickModal(ticket, e)}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded text-[11px] transition-colors"
                      >
                        Quick Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            No tickets match your filters.
          </div>
        )}
      </div>

      {/* Quick Status Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {activeTicket.ticketId}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  Update Ticket Status
                </h3>
              </div>
              <button 
                onClick={() => setActiveTicket(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium line-clamp-2">
              <strong>{activeTicket.studentName}:</strong> "{activeTicket.title}"
            </p>

            {activeTicket.specifications && Object.keys(activeTicket.specifications).length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[9px] tracking-wide">Student Specifications</span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] text-slate-700">
                  {Object.entries(activeTicket.specifications).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                      <span className="font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSaveQuickUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status State</label>
                <select
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg font-semibold focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Remark / Note for Timeline</label>
                <textarea
                  rows={3}
                  value={responseNote}
                  onChange={(e) => setResponseNote(e.target.value)}
                  placeholder="e.g. 'Bank transaction reconciled. Ledger marked as cleared.' or 'Technician dispatched.'"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-1.5 rounded-lg flex items-center space-x-1.5"
                >
                  {updating ? <span>Saving...</span> : <span>Apply & Append Timeline</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
