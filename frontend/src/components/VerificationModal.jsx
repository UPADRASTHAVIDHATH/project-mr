import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle2, PauseCircle, ShieldAlert, HeartHandshake, Zap } from 'lucide-react';

export default function VerificationModal({ emergencyState, onRespond, isFastDemo = false, onNoResponseTimeout }) {
  if (!emergencyState || emergencyState.status !== 'VERIFYING') return null;

  // 120 seconds standard (2 minutes) or 10s fast demo
  const initialSeconds = isFastDemo ? 10 : 120;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [isFastDemo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onNoResponseTimeout) onNoResponseTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onNoResponseTimeout]);

  const progressPercent = Math.max(0, (secondsLeft / initialSeconds) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-yellow-500/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-yellow-500/20 text-center overflow-hidden">
        {/* Glow Header */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* 2-Minute Circular Countdown SVG */}
        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#1e293b" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="#eab308"
              strokeWidth="8"
              strokeDasharray="264"
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-white font-mono">{formattedTime}</span>
            <span className="text-[10px] text-yellow-400 uppercase tracking-widest font-bold">2-Min Limit</span>
          </div>
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 font-extrabold text-xs mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>M.R AUTOMATIC SAFETY CHECK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Are you okay right now?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-md mx-auto">
          M.R is verifying your safety status for <span className="font-semibold text-yellow-400">{emergencyState.problem || 'active health monitoring'}</span>.
        </p>

        {/* 3 Explicit Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* 🔴 EMERGENCY */}
          <button
            onClick={() => onRespond('EMERGENCY')}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-red-950/50 hover:bg-red-900/70 border-2 border-red-500 text-red-200 transition-all transform hover:-translate-y-1 shadow-lg shadow-red-950/60 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-red-600/30 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <span className="font-black text-sm text-red-100 mb-1">🔴 EMERGENCY</span>
            <span className="text-[10px] text-red-300 text-center leading-tight">
              I need immediate help
            </span>
          </button>

          {/* 🟡 TAKING TIME */}
          <button
            onClick={() => onRespond('TAKING_TIME')}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-yellow-950/50 hover:bg-yellow-900/70 border-2 border-yellow-500 text-yellow-200 transition-all transform hover:-translate-y-1 shadow-lg shadow-yellow-950/60 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-yellow-600/30 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <PauseCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="font-black text-sm text-yellow-100 mb-1">🟡 TAKING TIME</span>
            <span className="text-[10px] text-yellow-300 text-center leading-tight">
              Taking time to explain
            </span>
          </button>

          {/* 🟢 I'M OKAY */}
          <button
            onClick={() => onRespond('IM_OKAY')}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/70 border-2 border-emerald-500 text-emerald-200 transition-all transform hover:-translate-y-1 shadow-lg shadow-emerald-950/60 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600/30 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="font-black text-sm text-emerald-100 mb-1">🟢 I'M OKAY</span>
            <span className="text-[10px] text-emerald-300 text-center leading-tight">
              I am fine, cancel check
            </span>
          </button>
        </div>

        {/* 2-Minute No Response Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950/80 py-2.5 px-4 rounded-xl border border-slate-800">
          <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>
            If no response within <span className="font-mono text-yellow-400 font-bold">{formattedTime}</span>, M.R will automatically dispatch the <strong>Emergency Information Package</strong> and begin the <strong>Auto-Call Escalation</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}
