import React from 'react';
import { Shield, AlertTriangle, Activity, Heart, FileText, UserCheck, Stethoscope, Clock, ShieldAlert, Zap } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, emergencyState, onManualSOS, onApplyPreset }) {
  const isEmergency = emergencyState?.status === 'EMERGENCY_ACTIVE';
  const isVerifying = emergencyState?.status === 'VERIFYING';

  return (
    <header className="sticky top-0 z-40 bg-[#0c101a]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Demo Presets Bar */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold tracking-wide uppercase">Hackathon Demo Presets:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onApplyPreset('normal')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 transition text-[11px]"
            >
              1. Normal (Low Risk)
            </button>
            <button
              onClick={() => onApplyPreset('taking_time')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-500/30 transition text-[11px]"
            >
              2. Taking Time Flow
            </button>
            <button
              onClick={() => onApplyPreset('unresponsive')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 transition text-[11px]"
            >
              3. Unresponsive Auto-Escalate
            </button>
            <button
              onClick={() => onApplyPreset('false_alarm')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-400 border border-teal-500/30 transition text-[11px]"
            >
              4. False Alarm Resolution
            </button>
            <button
              onClick={() => onApplyPreset('manual_override')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-red-400 border border-red-500/30 transition text-[11px]"
            >
              5. Manual SOS Override
            </button>
            <button
              onClick={() => onApplyPreset('doctor_handoff')}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 transition text-[11px]"
            >
              6. Doctor Summary Handoff
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
                PROJECT M.R
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Intelligent Health Risk & Adaptive Emergency Engine
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isEmergency ? 'bg-red-400' : isVerifying ? 'bg-yellow-400' : 'bg-emerald-400'
              } opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isEmergency ? 'bg-red-500' : isVerifying ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}></span>
            </span>
            <span className="font-medium text-slate-300">
              {isEmergency ? 'EMERGENCY ACTIVE' : isVerifying ? 'SAFETY CHECK IN PROGRESS' : 'M.R MONITORING ACTIVE'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 border-l border-slate-800 pl-3">
            Patient: <span className="text-slate-200 font-semibold">John Doe (52M)</span>
          </div>
        </div>

        {/* Navigation Tabs & Persistent Emergency SOS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'report' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Report Problem
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'history' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Medical History
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'timeline' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('wellness')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'wellness' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BMI & Diet
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'insurance' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Insurance
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'doctor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Doctor Portal
            </button>
            <button
              onClick={() => setActiveTab('contact_view')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'contact_view' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Family View
            </button>
          </nav>

          {/* 🔴 One-Tap Persistent Emergency Override Button */}
          <button
            onClick={onManualSOS}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 border border-red-400/40 transform hover:scale-105 active:scale-95 transition-all"
            title="Immediate Emergency Override (Always available regardless of AI score)"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>🔴 HELP ME</span>
          </button>
        </div>
      </div>
    </header>
  );
}
