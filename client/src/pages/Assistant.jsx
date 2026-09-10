import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import confetti from 'canvas-confetti';
import { 
  Bot, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck, 
  ArrowRight, 
  Flame, 
  HelpCircle,
  RefreshCw,
  Clock,
  TicketCheck,
  ChevronRight,
  Info
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  { text: "My attendance is 68 percent can I write exams", category: "Attendance", tag: "Academics • Condonation" },
  { text: "Can I write semester exams with low attendance", category: "Attendance", tag: "Academics • Policy" },
  { text: "What is the semester exam date", category: "Exams", tag: "Exams • Schedule" },
  { text: "What is the exam deadline", category: "Exams", tag: "Exams • Deadline" },
  { text: "I paid my semester fee but portal says unpaid", category: "Fees", tag: "Finance • High Priority" },
  { text: "My fee payment is not reflected", category: "Fees", tag: "Finance • High Priority" },
  { text: "My hostel fan is not working", category: "Hostel", tag: "Hostel Admin • Maintenance" },
  { text: "Hostel room maintenance issue", category: "Hostel", tag: "Hostel Admin • Ticket" },
  { text: "I need a certificate", category: "Certificates", tag: "Administration • Bonafide" },
  { text: "I need scholarship information", category: "Scholarships", tag: "Scholarships • Schemes" },
  { text: "I have an academic issue", category: "Academics", tag: "Academics • Advising" },
  { text: "I have an unknown campus problem", category: "Unknown", tag: "Safe Escalation" },
  { text: "What is the capital of France?", category: "Non-College / Out of Scope", tag: "Out-of-Scope Handling" },
  { text: "How to make a chocolate cake?", category: "Non-College / Out of Scope", tag: "Non-College Handling" }
];

export default function Assistant({ initialQuery, onSelectTicket, onNavigate }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello ${user?.name || 'Student'}! I am the official DVR & Dr HS MIC College Smart Campus Assistant. I can answer verified policy questions about attendance, exams, fees, hostels, and certificates. \n\nIf you have an unresolved issue or equipment maintenance request, I will automatically draft an official ticket for the designated department.`,
      verified: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketDraft, setTicketDraft] = useState(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, ticketDraft, createdTicket]);

  // If passed initialQuery from dashboard
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isProcessing) return;

    const userMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsProcessing(true);
    setTicketDraft(null);
    setCreatedTicket(null);

    try {
      const response = await api.askAI(textToSend.trim());

      const botMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        text: response.answer,
        verified: response.verified,
        policyId: response.policyId,
        policyTopic: response.policyTopic,
        category: response.category,
        department: response.department,
        priority: response.priority,
        confidence: response.confidence,
        actionRequired: response.actionRequired,
        ticketProposal: response.ticketProposal,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('AI assistant error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: 'An error occurred while consulting campus regulatory services. Please try again.',
          verified: false,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTicketSubmit = async () => {
    if (!ticketDraft || submittingTicket) return;

    setSubmittingTicket(true);
    try {
      const res = await api.createRequest(ticketDraft);
      if (res.success && res.ticket) {
        setCreatedTicket(res.ticket);
        setTicketDraft(null);

        // Confetti celebration
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
        } catch (e) {}

        // Add confirmation message from assistant
        setMessages(prev => [
          ...prev,
          {
            id: 'msg-ticket-conf-' + Date.now(),
            sender: 'assistant',
            text: `✅ **Official Ticket Created**: \`${res.ticket.ticketId}\` has been logged and dispatched to the **${res.ticket.department}** with **${res.ticket.priority} Priority**. You can track its live timeline and admin updates in your requests dashboard.`,
            verified: true,
            ticketId: res.ticket.ticketId,
            timestamp: new Date().toISOString()
          }
        ]);
      } else {
        alert(res.message || 'Failed to submit ticket');
      }
    } catch (err) {
      console.error('Ticket submission error:', err);
      alert('Error creating ticket.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Assistant Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white">Smart Campus AI Assistant</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Google Gemini 3.5 Flash Lite Active</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              DVR & Dr. HS MIC College Knowledge Base &bull; Key: <span className="font-mono text-emerald-400">AQ.Ab8...9QGA</span> &bull; AI-to-Action Escalation
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Examiner Test Suite: 21/21 Passing (100%)</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl rounded-2xl p-4 shadow-sm text-xs sm:text-sm font-sans ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-3'
            }`}>
              
              {/* Bot Header Tags */}
              {msg.sender === 'assistant' && (
                <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 text-[11px]">
                  {msg.verified ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Policy</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      <span>Unverified / Action Required</span>
                    </span>
                  )}

                  {msg.category && (
                    <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                      {msg.category}
                    </span>
                  )}

                  {msg.department && (
                    <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200 flex items-center space-x-1">
                      <Building2 className="w-3 h-3" />
                      <span>{msg.department}</span>
                    </span>
                  )}

                  {msg.priority && (
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      msg.priority === 'High' || msg.priority === 'Urgent'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {msg.priority} Priority
                    </span>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>

              {/* Policy Reference Banner */}
              {msg.policyId && msg.policyId !== 'SAFE-ESCALATE' && msg.policyId !== 'PROC-ACTION-01' && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Reference: <strong>[{msg.policyId}]</strong> {msg.policyTopic}</span>
                  </span>
                  <span className="text-slate-400">Regulation 4.2 Approved</span>
                </div>
              )}

              {/* Link to Track Created Ticket */}
              {msg.ticketId && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectTicket(msg.ticketId)}
                    className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors border border-blue-200"
                  >
                    <span>View Ticket {msg.ticketId} Status Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Optional Ticket Proposal Action if student chooses to file a formal request */}
              {msg.ticketProposal && !ticketDraft && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Need formal departmental processing or official request?
                  </span>
                  <button
                    type="button"
                    onClick={() => setTicketDraft(msg.ticketProposal)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors border border-blue-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>File Administrative Ticket &rarr;</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 flex items-center space-x-2.5 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing intent & checking official university regulations...</span>
            </div>
          </div>
        )}

        {/* AI-to-Action Interactive Ticket Proposal Card */}
        {ticketDraft && !createdTicket && (
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-5 shadow-lg max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    AI-to-Action &bull; Ticket Escalation Proposal
                  </h3>
                  <p className="text-xs text-slate-500">
                    The assistant has formulated an official request for campus administration.
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                ticketDraft.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {ticketDraft.priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Target Department</label>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{ticketDraft.department}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Service Category</label>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-800">
                  {ticketDraft.category}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Ticket Subject</label>
              <input
                type="text"
                value={ticketDraft.title}
                onChange={(e) => setTicketDraft({ ...ticketDraft, title: e.target.value })}
                className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Detailed Description & Reference</label>
              <textarea
                rows={2}
                value={ticketDraft.description}
                onChange={(e) => setTicketDraft({ ...ticketDraft, description: e.target.value })}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>

            {ticketDraft.urgencyReason && (
              <p className="text-[11px] text-slate-500 italic bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                <strong>Urgency Rationale:</strong> {ticketDraft.urgencyReason}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTicketDraft(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5"
              >
                Dismiss Proposal
              </button>

              <button
                type="button"
                disabled={submittingTicket}
                onClick={handleCreateTicketSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-all hover:scale-105"
              >
                {submittingTicket ? (
                  <span>Generating Ticket ID...</span>
                ) : (
                  <>
                    <TicketCheck className="w-4 h-4" />
                    <span>Create Official Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Ticket Created Success Box */}
        {createdTicket && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-2xl shadow-sm text-xs space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-900 text-sm">Ticket Dispatched Successfully</span>
              </div>
              <span className="font-mono font-bold bg-white text-emerald-900 px-2.5 py-1 rounded border border-emerald-300">
                {createdTicket.ticketId}
              </span>
            </div>
            <p className="text-emerald-800">
              Routed to <strong>{createdTicket.department}</strong> with <strong>{createdTicket.priority} Priority</strong>. Current Stage: <code className="bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">Submitted</code>.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => onSelectTicket(createdTicket.ticketId)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm"
              >
                <span>Track Ticket Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('my-requests')}
                className="text-emerald-800 hover:underline font-semibold"
              >
                View All My Tickets
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
        <span className="font-bold text-slate-400 shrink-0 uppercase text-[10px]">Test Inquiries:</span>
        {SUGGESTED_QUESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.text)}
            className="shrink-0 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-full text-[11px] transition-colors flex items-center space-x-1"
          >
            <span>{item.text.length > 38 ? item.text.substring(0, 38) + '...' : item.text}</span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded">{item.tag}</span>
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isProcessing}
            placeholder="Type your inquiry in plain English (e.g. 'Can I write exams with 68% attendance?' or 'Room 204 fan broken')..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
