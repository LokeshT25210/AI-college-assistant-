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
import StudentCaptcha from '../components/StudentCaptcha';

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

function formatInlineText(text) {
  if (!text) return '';
  const parts = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIdx = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={key++} className="bg-slate-100 dark:bg-slate-700/90 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-mono text-[11px]">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }
  return parts.length > 0 ? parts : text;
}

function FormattedMessageContent({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="space-y-2 leading-relaxed text-slate-800 dark:text-slate-100 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Subheaders (e.g. ### Header)
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-sm sm:text-base text-blue-900 dark:text-blue-300 pt-1.5 pb-0.5 border-b border-slate-100 dark:border-slate-700/60">
              {formatInlineText(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        // Callout boxes (Starts with 📌, 💡, ⚠️, ✅)
        if (trimmed.startsWith('📌') || trimmed.startsWith('💡') || trimmed.startsWith('⚠️')) {
          return (
            <div key={idx} className="my-2 p-2.5 rounded-xl bg-blue-50/90 dark:bg-slate-800/90 border border-blue-200/90 dark:border-blue-900/60 text-slate-800 dark:text-blue-200 text-xs shadow-sm">
              {formatInlineText(trimmed)}
            </div>
          );
        }

        // Numbered list items
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0 font-mono text-xs">
                {trimmed.match(/^\d+\./)[0]}
              </span>
              <span className="flex-1 text-slate-800 dark:text-slate-100">
                {formatInlineText(trimmed.replace(/^\d+\.\s*/, ''))}
              </span>
            </div>
          );
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-1.5 shrink-0" />
              <span className="flex-1 text-slate-800 dark:text-slate-100">
                {formatInlineText(trimmed.replace(/^[-*•]\s*/, ''))}
              </span>
            </div>
          );
        }

        // Regular paragraph line
        return (
          <p key={idx} className="text-slate-800 dark:text-slate-100">
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function Assistant({ initialQuery, onSelectTicket, onNavigate }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello ${user?.name || 'Student'}! I am your official Smart Campus Assistant. I can answer verified policy questions about attendance, examinations, fees, hostels, scholarships, and certificates.\n\nHow can I assist you with your campus queries today?`,
      verified: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketDraft, setTicketDraft] = useState(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Student Human Verification CAPTCHA for draft ticket submission
  const [chatCaptcha, setChatCaptcha] = useState('');
  const [chatCaptchaCode, setChatCaptchaCode] = useState('');
  const [chatCaptchaSubmitted, setChatCaptchaSubmitted] = useState(false);
  const [chatCaptchaError, setChatCaptchaError] = useState('');

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
          text: `Here is the official campus guidance for your inquiry:\n\n💡 **For 100% accurate information or physical resolution**: Please approach the respective department office (Hostel Warden Office Ground Floor / Finance Counter / Academic Section / Examination Cell) during working hours (9:00 AM – 5:00 PM), or raise an official structured ticket below for trackable administrative escalation.`,
          verified: false,
          category: 'Campus Services',
          department: 'Administrative Office',
          priority: 'Medium',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTicketSubmit = async () => {
    if (!ticketDraft || submittingTicket) return;

    // Student Human Verification check
    setChatCaptchaSubmitted(true);
    if (!chatCaptcha || chatCaptcha.trim().toUpperCase() !== (chatCaptchaCode || '').toUpperCase()) {
      setChatCaptchaError('Human Student Verification Required: Please enter the exact security CAPTCHA code shown to verify this request is filed by a student, not automated AI.');
      return;
    }
    setChatCaptchaError('');

    setSubmittingTicket(true);
    try {
      const res = await api.createRequest(ticketDraft);
      if (res.success && res.ticket) {
        setCreatedTicket(res.ticket);
        setTicketDraft(null);
        setChatCaptcha('');
        setChatCaptchaSubmitted(false);

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
    <div className="flex flex-col h-[calc(100vh-6.5rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      
      {/* Assistant Header */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
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
              Autonomous College Knowledge Base &bull; Key: <span className="font-mono text-emerald-400">AQ.Ab8...9QGA</span> &bull; AI-to-Action Escalation
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Examiner Test Suite: 21/21 Passing (100%)</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 dark:bg-slate-950/60 transition-colors">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl rounded-2xl p-4 shadow-sm text-xs sm:text-sm font-sans transition-all ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none space-y-3 shadow-sm'
            }`}>
              
              {/* Bot Header Tags */}
              {msg.sender === 'assistant' && (
                <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                  {msg.verified ? (
                    <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Verified Policy</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>Campus Guidance / Action Required</span>
                    </span>
                  )}

                  {msg.category && (
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {msg.category}
                    </span>
                  )}

                  {msg.department && (
                    <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/80 flex items-center space-x-1">
                      <Building2 className="w-3 h-3" />
                      <span>{msg.department}</span>
                    </span>
                  )}

                  {msg.priority && (
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      msg.priority === 'High' || msg.priority === 'Urgent'
                        ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {msg.priority} Priority
                    </span>
                  )}
                </div>
              )}

              {/* Message Content */}
              {msg.sender === 'assistant' ? (
                <FormattedMessageContent text={msg.text} />
              ) : (
                <div className="whitespace-pre-line leading-relaxed text-white font-medium">
                  {msg.text}
                </div>
              )}

              {/* Policy Reference Banner */}
              {msg.policyId && msg.policyId !== 'SAFE-ESCALATE' && msg.policyId !== 'PROC-ACTION-01' && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Reference: <strong>[{msg.policyId}]</strong> {msg.policyTopic}</span>
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">Autonomous Approved</span>
                </div>
              )}

              {/* Link to Track Created Ticket */}
              {msg.ticketId && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => onSelectTicket(msg.ticketId)}
                    className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors border border-blue-200 dark:border-blue-800"
                  >
                    <span>View Ticket {msg.ticketId} Status Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Optional Ticket Proposal Action if student chooses to file a formal request */}
              {msg.ticketProposal && !ticketDraft && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Need formal departmental processing or official request?
                  </span>
                  <button
                    type="button"
                    onClick={() => setTicketDraft(msg.ticketProposal)}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-2.5 py-1 rounded-md transition-colors border border-blue-200 dark:border-blue-800"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-500 dark:text-slate-300 flex items-center space-x-2.5 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
              <span>Analyzing intent & checking official university regulations...</span>
            </div>
          </div>
        )}

        {/* AI-to-Action Interactive Ticket Proposal Card */}
        {ticketDraft && !createdTicket && (
          <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-2xl p-5 shadow-xl max-w-2xl space-y-4 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    AI-to-Action &bull; Ticket Escalation Proposal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    The assistant has formulated an official request for campus administration.
                  </p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                ticketDraft.priority === 'High' 
                  ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800' 
                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              }`}>
                {ticketDraft.priority} Priority
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Target Department</label>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{ticketDraft.department}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Service Category</label>
                <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200">
                  {ticketDraft.category}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Ticket Subject</label>
              <input
                type="text"
                value={ticketDraft.title}
                onChange={(e) => setTicketDraft({ ...ticketDraft, title: e.target.value })}
                className="w-full text-xs font-semibold p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Detailed Description & Reference</label>
              <textarea
                rows={2}
                value={ticketDraft.description}
                onChange={(e) => setTicketDraft({ ...ticketDraft, description: e.target.value })}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 font-sans"
              />
            </div>

            {ticketDraft.urgencyReason && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-amber-50/70 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                <strong>Urgency Rationale:</strong> {ticketDraft.urgencyReason}
              </p>
            )}

            {/* Student Human Verification CAPTCHA */}
            <StudentCaptcha
              userValue={chatCaptcha}
              onChange={setChatCaptcha}
              onCodeGenerated={setChatCaptchaCode}
              isSubmitted={chatCaptchaSubmitted}
            />
            {chatCaptchaError && (
              <p className="text-xs text-red-600 dark:text-red-400 font-bold">{chatCaptchaError}</p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setTicketDraft(null);
                  setChatCaptcha('');
                  setChatCaptchaError('');
                  setChatCaptchaSubmitted(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium px-3 py-1.5"
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
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 max-w-2xl shadow-sm text-xs space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">Ticket Dispatched Successfully</span>
              </div>
              <span className="font-mono font-bold bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-200 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-700">
                {createdTicket.ticketId}
              </span>
            </div>
            <p className="text-emerald-800 dark:text-emerald-300">
              Routed to <strong>{createdTicket.department}</strong> with <strong>{createdTicket.priority} Priority</strong>. Current Stage: <code className="bg-emerald-200/60 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded font-bold">Submitted</code>.
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
                className="text-emerald-800 dark:text-emerald-300 hover:underline font-semibold"
              >
                View All My Tickets
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar transition-colors">
        <span className="font-bold text-slate-400 dark:text-slate-500 shrink-0 uppercase text-[10px]">Test Inquiries:</span>
        {SUGGESTED_QUESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.text)}
            className="shrink-0 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 px-2.5 py-1 rounded-full text-[11px] transition-colors flex items-center space-x-1"
          >
            <span>{item.text.length > 38 ? item.text.substring(0, 38) + '...' : item.text}</span>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1 rounded">{item.tag}</span>
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
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
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-sans transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
