import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { 
  X, 
  CreditCard, 
  Home, 
  Clock, 
  GraduationCap, 
  FileText, 
  Bus, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  FileCheck
} from 'lucide-react';
import StudentCaptcha from './StudentCaptcha';

const CATEGORIES = [
  { id: 'fees', name: 'Fees & Accounts', icon: CreditCard, department: 'Finance & Accounts', color: 'from-amber-500 to-amber-600' },
  { id: 'hostel', name: 'Hostel & Maintenance', icon: Home, department: 'Hostel Administration', color: 'from-emerald-500 to-emerald-600' },
  { id: 'attendance', name: 'Attendance & Condonation', icon: Clock, department: 'Academics', color: 'from-blue-500 to-blue-600' },
  { id: 'exams', name: 'Examinations & Revaluation', icon: GraduationCap, department: 'Exams', color: 'from-indigo-500 to-indigo-600' },
  { id: 'certificates', name: 'Official Certificates', icon: FileText, department: 'Administration', color: 'from-rose-500 to-rose-600' },
  { id: 'transport', name: 'Campus Transport', icon: Bus, department: 'Campus Transport & Fleet Management', color: 'from-teal-500 to-teal-600' }
];

export default function CreateTicketModal({ isOpen, onClose, initialCategory = 'fees', onTicketCreated }) {
  const { user } = useAuth();
  const [category, setCategory] = useState(initialCategory);
  const [priority, setPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successTicket, setSuccessTicket] = useState(null);

  // Student Human Verification CAPTCHA state
  const [captchaInput, setCaptchaInput] = useState('');
  const [currentCaptchaCode, setCurrentCaptchaCode] = useState('');
  const [captchaSubmitted, setCaptchaSubmitted] = useState(false);

  // Specifications state by category
  // 1. Fees
  const [feeType, setFeeType] = useState('Tuition Fee');
  const [utrNumber, setUtrNumber] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountPaid, setAmountPaid] = useState('45000');
  const [paymentMode, setPaymentMode] = useState('NetBanking');

  // 2. Hostel
  const [hostelBlock, setHostelBlock] = useState('Boys Hostel Block B');
  const [roomNumber, setRoomNumber] = useState(user?.hostel?.includes('Room') ? user.hostel.split('Room ')[1] : '204');
  const [maintenanceType, setMaintenanceType] = useState('Electrical (Fan / Light / Switch)');
  const [preferredSlot, setPreferredSlot] = useState('Morning (9:00 AM - 12:00 PM)');
  const [hostelIssueDesc, setHostelIssueDesc] = useState('Ceiling fan making screeching noise and regulator is non-responsive.');

  // 3. Attendance
  const [currentAttendance, setCurrentAttendance] = useState(user?.attendance ? `${user.attendance}%` : '68.5%');
  const [condonationReason, setCondonationReason] = useState('Medical Illness / Hospitalization');
  const [absenceFrom, setAbsenceFrom] = useState('2026-08-20');
  const [absenceTo, setAbsenceTo] = useState('2026-08-28');
  const [daysMissed, setDaysMissed] = useState('8');
  const [medicalProofRef, setMedicalProofRef] = useState('Apollo Hospitals Clinic Ref: MED-2026-9912');
  const [undertakingAgreed, setUndertakingAgreed] = useState(true);

  // 4. Exams
  const [examCategory, setExamCategory] = useState('Revaluation / Recounting');
  const [regulation, setRegulation] = useState(user?.regulation || 'R23 Autonomous');
  const [semester, setSemester] = useState('B.Tech 3rd Year (Semester 5)');
  const [subjectCode, setSubjectCode] = useState('23CS501');
  const [subjectName, setSubjectName] = useState('Machine Learning & Neural Networks');
  const [examChallanUtr, setExamChallanUtr] = useState('REV-CHALLAN-2026-8812');

  // 5. Certificates
  const [certificateType, setCertificateType] = useState('Bonafide Certificate');
  const [certificatePurpose, setCertificatePurpose] = useState('Passport Application');
  const [copiesCount, setCopiesCount] = useState('1');
  const [deliveryMode, setDeliveryMode] = useState('Digital Signed PDF (Instant Download)');

  // 6. Transport
  const [routeNumber, setRouteNumber] = useState('Route 01 - Vijayawada Benz Circle');
  const [boardingStage, setBoardingStage] = useState('Benz Circle Junction / NTR Circle');
  const [transportIssue, setTransportIssue] = useState('Bus Pass Renewal');

  // General notes/rationale
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Verify Human Student CAPTCHA
    setCaptchaSubmitted(true);
    if (!captchaInput || captchaInput.trim().toUpperCase() !== (currentCaptchaCode || '').toUpperCase()) {
      setErrorMsg('Student Human Verification Required: Please enter the exact security CAPTCHA code shown to verify this request is filed by a student, not automated AI.');
      return;
    }

    const activeCatObj = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
    let generatedTitle = '';
    let generatedDescription = '';
    let specifications = {};
    let urgencyReason = '';

    if (category === 'fees') {
      if (!utrNumber.trim()) {
        setErrorMsg('Please provide a valid UTR / Bank Reference Number.');
        return;
      }
      generatedTitle = `${feeType} Reconciliation - ₹${amountPaid} (${bankName})`;
      generatedDescription = `Payment of ₹${amountPaid} for ${feeType} was deducted from student bank account on ${paymentDate} via ${paymentMode}. UTR reference: ${utrNumber}. Portal status shows UNPAID. Requesting ledger reconciliation.`;
      specifications = {
        feeType,
        utrNumber: utrNumber.trim().toUpperCase(),
        bankName,
        paymentDate,
        amountPaid: `₹${amountPaid}`,
        paymentMode
      };
      urgencyReason = 'Late penalty fine will be triggered if not reconciled before due date.';
    } else if (category === 'hostel') {
      if (!roomNumber.trim()) {
        setErrorMsg('Please specify your hostel room number.');
        return;
      }
      generatedTitle = `Hostel Maintenance: ${maintenanceType} in ${hostelBlock}, Room ${roomNumber}`;
      generatedDescription = `Maintenance request lodged for ${hostelBlock}, Room ${roomNumber}. Issue: ${hostelIssueDesc}. Preferred visit slot: ${preferredSlot}.`;
      specifications = {
        hostelBlock,
        roomNumber: roomNumber.trim(),
        maintenanceType,
        preferredSlot,
        issueDetails: hostelIssueDesc
      };
      urgencyReason = 'Resident comfort, safety, and campus hostel infrastructure standard.';
    } else if (category === 'attendance') {
      if (!undertakingAgreed) {
        setErrorMsg('Please confirm the mandatory undertaking regarding official attendance condonation.');
        return;
      }
      generatedTitle = `Condonation Application: ${condonationReason} (${currentAttendance} logged)`;
      generatedDescription = `Student attendance is currently logged at ${currentAttendance}. Applying for academic condonation under regulation clause 4.2 for ${daysMissed} working days missed from ${absenceFrom} to ${absenceTo} due to ${condonationReason}. Medical reference/OD documentation: ${medicalProofRef}.`;
      specifications = {
        currentAttendance,
        condonationReason,
        absenceFrom,
        absenceTo,
        daysMissed: `${daysMissed} Days`,
        medicalProofRef,
        regulationClause: 'UGC Autonomous Section 4.2 (65% - 74% Condonation Range)'
      };
      urgencyReason = 'Semester end examination hall ticket eligibility cutoff.';
    } else if (category === 'exams') {
      if (!subjectCode.trim() || !subjectName.trim()) {
        setErrorMsg('Please provide both subject code and subject name.');
        return;
      }
      generatedTitle = `${examCategory}: ${subjectCode} - ${subjectName} (${semester})`;
      generatedDescription = `Official examination request filed for ${semester} (${regulation}). Service requested: ${examCategory}. Subject: ${subjectCode} - ${subjectName}. Fee payment / Challan reference: ${examChallanUtr}.`;
      specifications = {
        examCategory,
        regulation,
        semester,
        subjectCode: subjectCode.trim().toUpperCase(),
        subjectName: subjectName.trim(),
        examChallanUtr
      };
      urgencyReason = 'Controller of Examinations (CoE) deadline compliance.';
    } else if (category === 'certificates') {
      generatedTitle = `Official ${certificateType} for ${certificatePurpose}`;
      generatedDescription = `Requesting official issued ${certificateType} for purpose: ${certificatePurpose}. Copies required: ${copiesCount}. Delivery mode: ${deliveryMode}.`;
      specifications = {
        certificateType,
        purpose: certificatePurpose,
        copiesCount,
        deliveryMode
      };
      urgencyReason = `Verification timeline for ${certificatePurpose}.`;
    } else if (category === 'transport') {
      generatedTitle = `Campus Bus Service: ${transportIssue} - ${routeNumber}`;
      generatedDescription = `Transport request for ${routeNumber}, boarding stage: ${boardingStage}. Service type: ${transportIssue}. ${additionalNotes ? 'Additional note: ' + additionalNotes : ''}`;
      specifications = {
        routeNumber,
        boardingStage,
        serviceType: transportIssue,
        notes: additionalNotes || 'Standard request'
      };
      urgencyReason = 'Daily campus transit pass validity.';
    }

    if (additionalNotes.trim() && category !== 'transport') {
      generatedDescription += ` Note: ${additionalNotes.trim()}`;
    }

    setSubmitting(true);
    try {
      const ticketPayload = {
        title: generatedTitle,
        description: generatedDescription,
        category: activeCatObj.name.split(' ')[0],
        department: activeCatObj.department,
        priority,
        urgencyReason,
        specifications
      };

      const res = await api.createRequest(ticketPayload);
      if (res.success && res.ticket) {
        setSuccessTicket(res.ticket);
        if (onTicketCreated) onTicketCreated(res.ticket);
      } else {
        setErrorMsg(res.message || 'Failed to submit ticket');
      }
    } catch (err) {
      console.error('Error submitting structured ticket:', err);
      setErrorMsg('Network error submitting ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setSuccessTicket(null);
    setErrorMsg('');
    setCaptchaInput('');
    setCaptchaSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-fadeIn my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 sm:p-6 relative">
          <button
            onClick={handleCloseAndReset}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-1.5 text-blue-300 text-[11px] sm:text-xs font-semibold mb-1 pr-8">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Autonomous Grievance System</span>
            <span>&bull;</span>
            <span className="font-mono text-amber-300">{user?.studentId || 'CS-2023-0489'}</span>
          </div>

          <h2 className="text-lg sm:text-2xl font-bold font-serif">
            Raise Structured Administrative Ticket
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Select your campus service desk and provide verified domain specifications for direct dispatch to departmental officers.
          </p>
        </div>

        {successTicket ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200 inline-block mb-2">
                {successTicket.ticketId}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Official Campus Ticket Successfully Lodged!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                Your ticket has been dispatched to <strong>{successTicket.department}</strong> with <strong>{successTicket.priority} Priority</strong>. Full structured specifications have been attached to the official campus ledger.
              </p>
            </div>

            {/* Spec Recap */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-lg mx-auto text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5 font-bold text-slate-700">
                <span>Subject</span>
                <span className="text-slate-900 truncate max-w-[280px]">{successTicket.title}</span>
              </div>
              {successTicket.specifications && Object.entries(successTicket.specifications).slice(0, 4).map(([k, v]) => (
                <div key={k} className="flex justify-between text-slate-600">
                  <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-semibold text-slate-800 font-mono text-[11px]">{String(v)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={handleCloseAndReset}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
              >
                Done & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Structured Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Category Tab Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                1. Select Campus Service Domain
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.color} text-white shrink-0 shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {cat.department}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Dynamic Domain Specification Fields */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold uppercase text-slate-700 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>2. Domain Specifications ({CATEGORIES.find(c => c.id === category)?.name})</span>
                </h3>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                  Mandatory for Department Review
                </span>
              </div>

              {/* DOMAIN 1: FEES & ACCOUNTS */}
              {category === 'fees' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fee Head / Category</label>
                    <select
                      value={feeType}
                      onChange={(e) => setFeeType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Tuition Fee">Tuition Fee (Semester)</option>
                      <option value="Hostel & Mess Fee">Hostel & Mess Fee</option>
                      <option value="Campus Bus Transport Fee">Campus Bus Transport Fee</option>
                      <option value="Semester Examination Fee">Semester Examination Fee</option>
                      <option value="Revaluation / Recounting Fee">Revaluation / Recounting Fee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bank Transaction UTR / Ref Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. HDFC009823101 or UPI/423189"
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800 uppercase focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bank Name / UPI App</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="Union Bank of India">Union Bank of India</option>
                      <option value="PhonePe / GooglePay (UPI)">PhonePe / GooglePay (UPI)</option>
                      <option value="Other Commercial Bank">Other Commercial Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Amount Deducted (₹)</label>
                    <input
                      type="number"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="NetBanking">NetBanking</option>
                      <option value="UPI / QR Code">UPI / QR Code</option>
                      <option value="Debit / Credit Card">Debit / Credit Card</option>
                      <option value="Bank Challan / NEFT">Bank Challan / NEFT</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DOMAIN 2: HOSTEL & MAINTENANCE */}
              {category === 'hostel' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hostel Block</label>
                    <select
                      value={hostelBlock}
                      onChange={(e) => setHostelBlock(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Boys Hostel Block A">Boys Hostel Block A</option>
                      <option value="Boys Hostel Block B">Boys Hostel Block B</option>
                      <option value="Boys Hostel Block C">Boys Hostel Block C</option>
                      <option value="Girls Hostel Saraswati">Girls Hostel Saraswati</option>
                      <option value="Girls Hostel Kaveri">Girls Hostel Kaveri</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Room Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. 204 or 312"
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                    <select
                      value={maintenanceType}
                      onChange={(e) => setMaintenanceType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Electrical (Fan / Light / Switch)">Electrical (Fan / Light / Switch)</option>
                      <option value="Plumbing (Tap / Washroom / Geyser)">Plumbing (Tap / Washroom / Geyser)</option>
                      <option value="LAN / Wi-Fi Internet Connectivity">LAN / Wi-Fi Internet Connectivity</option>
                      <option value="Carpentry / Bed / Study Table">Carpentry / Bed / Study Table</option>
                      <option value="Hostel Mess / Food Feedback">Hostel Mess / Food Feedback</option>
                      <option value="Pest Control / Cleanliness">Pest Control / Cleanliness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Technician Visit Slot</label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                      <option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Maintenance Fault Details</label>
                    <input
                      type="text"
                      value={hostelIssueDesc}
                      onChange={(e) => setHostelIssueDesc(e.target.value)}
                      placeholder="e.g. Ceiling fan speed regulator broken and switch sparking"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* DOMAIN 3: ATTENDANCE & CONDONATION */}
              {category === 'attendance' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Current Logged Attendance %</label>
                    <input
                      type="text"
                      value={currentAttendance}
                      onChange={(e) => setCurrentAttendance(e.target.value)}
                      placeholder="e.g. 68.5%"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Condonation Grounds</label>
                    <select
                      value={condonationReason}
                      onChange={(e) => setCondonationReason(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Medical Illness / Hospitalization">Medical Illness / Hospitalization</option>
                      <option value="University Approved Sports / NSS / NCC Duty">University Approved Sports / NSS / NCC Duty</option>
                      <option value="Academic Workshop / Conference / Hackathon">Academic Workshop / Conference / Hackathon</option>
                      <option value="Family Bereavement / Emergency">Family Bereavement / Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Absence Date Range (From - To)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={absenceFrom}
                        onChange={(e) => setAbsenceFrom(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800"
                      />
                      <input
                        type="date"
                        value={absenceTo}
                        onChange={(e) => setAbsenceTo(e.target.value)}
                        className="bg-white border border-slate-300 rounded-lg p-1.5 font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Working Days Missed</label>
                    <input
                      type="number"
                      value={daysMissed}
                      onChange={(e) => setDaysMissed(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Doctor / Clinic Reference & Reg No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medicalProofRef}
                      onChange={(e) => setMedicalProofRef(e.target.value)}
                      placeholder="e.g. Dr. K. Rao (MBBS Reg 48190) Apollo Clinic Certificate #MED-8812"
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <label className="flex items-start space-x-2 text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={undertakingAgreed}
                        onChange={(e) => setUndertakingAgreed(e.target.checked)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-[11px] leading-relaxed">
                        <strong>Student Undertaking:</strong> I affirm that my aggregate attendance is within the condonable bracket (65% to 74%) as per Academic Regulations Section 4.2 and that official attested medical/OD documentation has been submitted to the HOD within 7 working days.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* DOMAIN 4: EXAMINATIONS & REVALUATION */}
              {category === 'exams' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Examination Service</label>
                    <select
                      value={examCategory}
                      onChange={(e) => setExamCategory(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Revaluation / Recounting">Revaluation / Recounting (₹750/subject)</option>
                      <option value="Hall Ticket Correction / Download Issue">Hall Ticket Correction / Download Issue</option>
                      <option value="End-Semester Exam Registration">End-Semester Exam Registration</option>
                      <option value="Supplementary Exam Enrollment">Supplementary Exam Enrollment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Academic Regulation</label>
                    <select
                      value={regulation}
                      onChange={(e) => setRegulation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="R23 Autonomous">R23 Autonomous</option>
                      <option value="R20 Autonomous">R20 Autonomous</option>
                      <option value="R19 Autonomous">R19 Autonomous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="B.Tech 1st Year (Semester 1)">B.Tech 1st Year (Semester 1)</option>
                      <option value="B.Tech 1st Year (Semester 2)">B.Tech 1st Year (Semester 2)</option>
                      <option value="B.Tech 2nd Year (Semester 3)">B.Tech 2nd Year (Semester 3)</option>
                      <option value="B.Tech 2nd Year (Semester 4)">B.Tech 2nd Year (Semester 4)</option>
                      <option value="B.Tech 3rd Year (Semester 5)">B.Tech 3rd Year (Semester 5)</option>
                      <option value="B.Tech 3rd Year (Semester 6)">B.Tech 3rd Year (Semester 6)</option>
                      <option value="B.Tech 4th Year (Semester 7)">B.Tech 4th Year (Semester 7)</option>
                      <option value="B.Tech 4th Year (Semester 8)">B.Tech 4th Year (Semester 8)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Subject Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                      placeholder="e.g. 23CS501 or CS302"
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono uppercase text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Subject Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Machine Learning & Neural Networks"
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exam Fee / Challan UTR</label>
                    <input
                      type="text"
                      value={examChallanUtr}
                      onChange={(e) => setExamChallanUtr(e.target.value)}
                      placeholder="e.g. REV-CHALLAN-2026-8812"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* DOMAIN 5: CERTIFICATES */}
              {category === 'certificates' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Certificate Required</label>
                    <select
                      value={certificateType}
                      onChange={(e) => setCertificateType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Bonafide Certificate">Bonafide Certificate</option>
                      <option value="Custodian Certificate">Custodian Certificate</option>
                      <option value="Study & Conduct Certificate">Study & Conduct Certificate</option>
                      <option value="Medium of Instruction Certificate (English)">Medium of Instruction Certificate (English)</option>
                      <option value="No Objection Certificate (NOC) for Internship">No Objection Certificate (NOC) for Internship</option>
                      <option value="Course Completion Certificate">Course Completion Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Purpose of Certificate</label>
                    <select
                      value={certificatePurpose}
                      onChange={(e) => setCertificatePurpose(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Passport Application">Passport Application</option>
                      <option value="Education Loan / Bank Verification">Education Loan / Bank Verification</option>
                      <option value="Higher Studies & GRE / TOEFL / Visa">Higher Studies & GRE / TOEFL / Visa</option>
                      <option value="Company Summer Internship">Company Summer Internship</option>
                      <option value="State Govt Jnanabhumi Scholarship">State Govt Jnanabhumi Scholarship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Number of Signed Copies</label>
                    <select
                      value={copiesCount}
                      onChange={(e) => setCopiesCount(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="1">1 Copy</option>
                      <option value="2">2 Copies</option>
                      <option value="3">3 Copies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Delivery Preference</label>
                    <select
                      value={deliveryMode}
                      onChange={(e) => setDeliveryMode(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Digital Signed PDF (Instant Download)">Digital Signed PDF (Instant Download)</option>
                      <option value="Physical Hardcopy with Official Seal (Counter 2)">Physical Hardcopy with Official Seal (Counter 2)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DOMAIN 6: TRANSPORT */}
              {category === 'transport' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">College Bus Route</label>
                    <select
                      value={routeNumber}
                      onChange={(e) => setRouteNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Route 01 - Vijayawada Benz Circle">Route 01 - Vijayawada Benz Circle</option>
                      <option value="Route 02 - Vijayawada PNBS / One Town">Route 02 - Vijayawada PNBS / One Town</option>
                      <option value="Route 05 - Guntur Bus Stand / Collectorate">Route 05 - Guntur Bus Stand / Collectorate</option>
                      <option value="Route 12 - Nandigama Town">Route 12 - Nandigama Town</option>
                      <option value="Route 18 - Jaggaiahpeta RTC Complex">Route 18 - Jaggaiahpeta RTC Complex</option>
                      <option value="Route 22 - Ibrahimpatnam Ring">Route 22 - Ibrahimpatnam Ring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Boarding Stage / Landmark</label>
                    <input
                      type="text"
                      value={boardingStage}
                      onChange={(e) => setBoardingStage(e.target.value)}
                      placeholder="e.g. Benz Circle Junction or Gollapudi Centre"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Transport Service Required</label>
                    <select
                      value={transportIssue}
                      onChange={(e) => setTransportIssue(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Bus Pass Renewal">Semester Bus Pass Renewal</option>
                      <option value="Lost RFID Bus Card Duplicate">Lost RFID Bus Card Duplicate</option>
                      <option value="Route / Boarding Stage Change Request">Route / Boarding Stage Change Request</option>
                      <option value="Bus Timing / Punctuality Notice">Bus Timing / Punctuality Notice</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Priority & Triage Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  3. Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPriority(lvl)}
                      className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition-all ${
                        priority === lvl
                          ? lvl === 'High' 
                            ? 'bg-red-500 text-white border-red-600 shadow-sm' 
                            : 'bg-blue-600 text-white border-blue-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any extra context for the desk officer..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Student Human Verification (Anti-AI) CAPTCHA */}
            <StudentCaptcha
              userValue={captchaInput}
              onChange={setCaptchaInput}
              onCodeGenerated={setCurrentCaptchaCode}
              isSubmitted={captchaSubmitted}
            />

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Ledger...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
