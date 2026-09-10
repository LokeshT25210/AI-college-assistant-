import React, { useState, useEffect } from 'react';
import { api } from '../api';
import RequestCard from '../components/RequestCard';
import { 
  TicketCheck, 
  Search, 
  Filter, 
  Plus, 
  Bot, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const STATUS_TABS = ['all', 'Submitted', 'Under Review', 'In Progress', 'Resolved'];

export default function MyRequests({ onSelectTicket, onNavigate }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await api.getMyRequests();
      if (res.success) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error('Error fetching student requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter(r => {
    const matchesStatus = selectedStatus === 'all' || r.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || r.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery.trim() || (
      r.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              My Requests & Grievance Tickets
            </h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {requests.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time progress, department reviewer notes, and administrative resolution.
          </p>
        </div>

        <button
          onClick={() => onNavigate('assistant')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI or Create Ticket</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition-all ${
                selectedStatus === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'all' ? 'All Statuses' : tab}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Ticket ID, title, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white"
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

            <button
              onClick={loadRequests}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              title="Refresh requests"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Grid */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
          Loading ticket records...
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((req) => (
            <RequestCard 
              key={req.ticketId} 
              request={req} 
              onClick={onSelectTicket}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <TicketCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No tickets matching selected filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try changing the status filter or create a new request via the AI Assistant.
          </p>
          <button
            onClick={() => onNavigate('assistant')}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
          >
            <span>Launch AI Assistant</span>
          </button>
        </div>
      )}

    </div>
  );
}
