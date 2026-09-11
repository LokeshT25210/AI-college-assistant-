import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous 0, O, 1, I

export function generateCaptchaCode(length = 5) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return result;
}

export default function StudentCaptcha({ 
  userValue, 
  onChange, 
  onCodeGenerated,
  isValid,
  isSubmitted,
  className = "" 
}) {
  const [captchaCode, setCaptchaCode] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  const refreshCaptcha = () => {
    setIsRotating(true);
    const newCode = generateCaptchaCode(5);
    setCaptchaCode(newCode);
    if (onCodeGenerated) onCodeGenerated(newCode);
    setTimeout(() => setIsRotating(false), 400);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const isMatched = userValue && userValue.trim().toUpperCase() === captchaCode;
  const showError = isSubmitted && !isMatched;

  const handleQuickFill = () => {
    if (onChange && captchaCode) {
      onChange(captchaCode);
    }
  };

  return (
    <div className={`p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 transition-colors ${className}`}>
      
      {/* Verification Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Student Human Verification
          </span>
        </div>
        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">
          Anti-AI / Anti-Bot Check
        </span>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        To verify this submission is initiated by a genuine student (not an automated script or bot), enter the security code shown:
      </p>

      {/* CAPTCHA Challenge & Input Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        
        {/* Security Visual Box */}
        <div className="flex items-center space-x-2 shrink-0">
          <div 
            onClick={handleQuickFill}
            title="Click box to auto-fill code (Testing Convenience)"
            className="select-none cursor-pointer relative px-4 py-2 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden shadow-inner flex items-center justify-center tracking-widest font-mono font-black text-lg text-slate-800 dark:text-amber-300 space-x-2 hover:border-blue-400 transition-all group"
            style={{
              textDecoration: 'line-through',
              textDecorationThickness: '1.5px',
              textDecorationColor: 'rgba(59, 130, 246, 0.5)'
            }}
          >
            {captchaCode.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block transform"
                style={{
                  transform: `rotate(${((index % 2 === 0 ? 1 : -1) * (index + 2) * 2.5)}deg) translateY(${((index % 2 === 0 ? -1 : 1) * 1.5)}px)`
                }}
              >
                {char}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={refreshCaptcha}
            title="Generate new verification code"
            className="p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Input Box */}
        <div className="flex-1 relative">
          <input
            type="text"
            maxLength={6}
            value={userValue}
            onChange={(e) => onChange(e.target.value.toUpperCase().replace(/\s/g, ''))}
            placeholder="Type verification code..."
            className={`w-full text-xs font-mono font-bold tracking-wider uppercase px-3 py-2 pr-12 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
              showError 
                ? 'border-red-400 dark:border-red-500 bg-red-50/50 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:ring-red-400' 
                : isMatched
                  ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 focus:ring-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500'
            }`}
          />
          {isMatched ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-2.5 top-2.5" />
          ) : (
            <button
              type="button"
              onClick={handleQuickFill}
              title="Click to fill code"
              className="absolute right-2 top-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 border border-blue-200/60 dark:border-blue-800/60"
            >
              Fill
            </button>
          )}
        </div>

      </div>

      {showError && (
        <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold flex items-center space-x-1 animate-in fade-in duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Security verification failed: Please enter the exact code shown above.</span>
        </p>
      )}

      {isMatched && (
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 animate-in fade-in duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>Human student verification confirmed. Authenticated submission enabled.</span>
        </p>
      )}

    </div>
  );
}
