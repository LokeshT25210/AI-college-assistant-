import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import StatusTimeline from '../components/StatusTimeline';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Printer, 
  ShieldCheck, 
  FileText, 
  Send,
  Sparkles
} from 'lucide-react';

export default function RequestDetails({ ticketId, onBack, onNavigate }) {
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Admin action controls
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRequestDetails(ticketId);
      if (res.success && res.ticket) {
        setTicket(res.ticket);
        setNewStatus(res.ticket.status);
      } else {
        setError(res.message || 'Unable to retrieve ticket details.');
      }
    } catch (err) {
      setError('Network error retrieving ticket record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) loadTicket();
  }, [ticketId]);

  const handleCopyId = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    if (!ticket || updating) return;

    setUpdating(true);
    try {
      const res = await api.updateRequestStatus(ticket.ticketId, {
        status: newStatus,
        responseNote: adminNote.trim() || `Status updated to ${newStatus} by ${user.name}`
      });
      if (res.success && res.ticket) {
        setTicket(res.ticket);
        setAdminNote('');
        alert(`Ticket ${ticket.ticketId} successfully updated to ${newStatus}.`);
      } else {
        alert(res.message || 'Failed to update ticket');
      }
    } catch (err) {
      alert('Error saving status update.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
        Loading ticket record {ticketId}...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Access Restricted or Ticket Not Found</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">{error}</p>
        <button
          onClick={onBack}
          className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
        >
          Return to My Requests
        </button>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Navigation & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg shadow-sm transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Requests</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyId}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Ticket ID'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Ticket Overview Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-mono text-base font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                {ticket.ticketId}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Official Campus Grievance
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 font-serif">
              {ticket.title}
            </h1>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              ticket.status === 'Under Review' ? 'bg-purple-50 text-purple-700 border-purple-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {ticket.status}
            </span>

            <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
              ticket.priority === 'High' || ticket.priority === 'Urgent'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {ticket.priority} Priority
            </span>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Student</span>
            <span className="font-semibold text-slate-800">{ticket.studentName}</span>
            <span className="text-[11px] text-slate-500 block font-mono">{ticket.studentRollNo}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Jurisdiction</span>
            <span className="font-semibold text-slate-800">{ticket.department}</span>
            <span className="text-[11px] text-slate-500 block">{ticket.category}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Date Lodged</span>
            <span className="font-semibold text-slate-800">{new Date(ticket.createdAt).toLocaleDateString()}</span>
            <span className="text-[11px] text-slate-500 block">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Last Updated</span>
            <span className="font-semibold text-slate-800">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
            <span className="text-[11px] text-slate-500 block">{new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans">
          <p className="font-bold text-slate-800 mb-1">Issue Narrative:</p>
          <p className="whitespace-pre-line">{ticket.description}</p>
          {ticket.urgencyReason && (
            <p className="mt-2 text-[11px] text-slate-500 italic">
              <strong>Triage Justification:</strong> {ticket.urgencyReason}
            </p>
          )}
        </div>
      </div>

      {/* 4-Stage Status Timeline Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 font-serif">
          Grievance Resolution Lifecycle & Audit Trail
        </h3>
        <StatusTimeline 
          currentStatus={ticket.status} 
          timeline={ticket.timeline} 
        />
      </div>

      {/* Administrator Action Desk (Only visible to Admin role) */}
      {isAdmin && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold">Administrator Adjudication Desk</h3>
            </div>
            <span className="text-xs bg-purple-900/60 text-purple-300 border border-purple-700/50 px-2.5 py-0.5 rounded font-semibold">
              Authorized: {user.name} ({user.designation})
            </span>
          </div>

          <form onSubmit={handleAdminUpdate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                  Advance Ticket Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                  Assigned Department Desk
                </label>
                <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-2 text-slate-300 font-medium">
                  {ticket.department}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1.5">
                Official Department Response Note / Resolution Remark
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Enter official departmental action (e.g., 'Payment reconciled with bank reference UTR. Fee ledger updated.' or 'Electrician dispatched to Room 204.')..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="submit"
                disabled={updating}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-all"
              >
                {updating ? (
                  <span>Recording Update...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Official Status Update</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
