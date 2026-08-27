import React from 'react';
import { Shield, Activity, Heart, AlertTriangle, Clock, ArrowRight, UserCheck, Calendar, Zap, Stethoscope, ChevronRight } from 'lucide-react';
import RiskGauge from '../components/RiskGauge';

export default function Dashboard({ userProfile, emergencyState, setActiveTab, onManualSOS }) {
  const isEmergency = emergencyState?.status === 'EMERGENCY_ACTIVE';
  const isVerifying = emergencyState?.status === 'VERIFYING';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner & Health Status */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {userProfile?.monitoring_status || 'Active (🟢 M.R Online)'}
              </span>
              <span className="text-xs text-slate-400">| Patient ID: PT-882941</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Good evening, {userProfile?.full_name || 'John Doe'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              M.R is actively monitoring your health indicators. Your personalized health risk profile is currently evaluated and up to date.
            </p>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 block font-medium">BMI Score</span>
              <span className="text-xl font-black text-white font-mono">{userProfile?.bmi || '25.9'}</span>
              <span className="text-[10px] text-yellow-400 block font-semibold">{userProfile?.bmi_category || 'Overweight'}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center min-w-[100px]">
              <span className="text-[11px] text-slate-400 block font-medium">Blood Group</span>
              <span className="text-xl font-black text-red-400 font-mono">{userProfile?.blood_group || 'A+'}</span>
              <span className="text-[10px] text-slate-400 block">Age: {userProfile?.age || 52}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-center min-w-[100px] col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 block font-medium">Contacts</span>
              <span className="text-xl font-black text-emerald-400 font-mono">5</span>
              <span className="text-[10px] text-emerald-400 block">All Approved ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Emergency Alert Banner if Active */}
      {isEmergency && (
        <div className="p-5 rounded-3xl bg-red-950/80 border-2 border-red-500 glow-box-red flex flex-wrap items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide">
                🚨 Emergency Protocol Active
              </h3>
              <p className="text-xs text-red-200">
                Help is being coordinated. Emergency contacts and GPS location are being shared.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('emergency_screen')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center gap-2"
          >
            Open Emergency Command Center <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Problem Reporter Launcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-white text-base">How are you feeling right now?</h3>
              </div>
              <span className="text-xs text-blue-400 font-medium">Multi-Modal Triage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => setActiveTab('report')}
                className="group flex items-start gap-3 p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 transition text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-0.5">Describe Symptoms</h4>
                  <p className="text-xs text-slate-400">Type or select from common symptom chips</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className="group flex items-start gap-3 p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 transition text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-0.5">Voice Speech Intake</h4>
                  <p className="text-xs text-slate-400">Speak directly to M.R voice engine</p>
                </div>
              </button>
            </div>

            {/* Red 1-Tap SOS */}
            <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-red-200 block">Need Urgent Assistance?</span>
                <span className="text-[11px] text-red-300/80">Persistent override activates emergency mode regardless of AI score.</span>
              </div>
              <button
                onClick={onManualSOS}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition shadow-lg shadow-red-600/30 shrink-0 cursor-pointer"
              >
                🔴 I NEED HELP NOW
              </button>
            </div>
          </div>

          {/* Chronic Profile & Allergy Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
                Chronic Medical Conditions:
              </h4>
              <div className="flex flex-wrap gap-2">
                {userProfile?.conditions?.map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                    {c.name} ({c.year})
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
                Critical Allergies (Guardrail):
              </h4>
              <div className="flex flex-wrap gap-2">
                {userProfile?.allergies?.map((a, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
                    ⚠️ {a.allergen} ({a.reaction})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Risk Gauge & 5 Emergency Contacts */}
        <div className="space-y-6">
          <RiskGauge
            score={emergencyState?.risk_score || 22}
            level={emergencyState?.risk_level || 'Low'}
            xaiReasons={emergencyState?.xai_reasons || [
              { factor: "Baseline Cardiovascular Health", impact: "+12%", detail: "History of stable angina under daily medication" },
              { factor: "Routine Vital Signs", impact: "+10%", detail: "Normal rhythm observed in recent monitoring" }
            ]}
            recommendedAction="Normal health monitoring active. Maintain daily Amlodipine medication and routine hydration."
          />

          {/* 5 Emergency Contacts Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                Emergency Contacts:
              </h4>
              <span className="text-[11px] text-blue-400 font-semibold">5 Active</span>
            </div>

            <div className="space-y-2">
              {userProfile?.emergency_contacts?.map((ec, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white block">#{ec.priority} {ec.name}</span>
                    <span className="text-slate-400 text-[11px]">{ec.relationship} • {ec.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                    {ec.channel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
