import React, { useState, useEffect } from 'react';
import { PhoneCall, PhoneForwarded, PhoneOff, CheckCircle2, ShieldAlert, Radio, Clock, AlertTriangle, FileText, User } from 'lucide-react';

export default function AutoCallLadder({ emergencyPackage, onCancelEscalation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  const contactsLadder = [
    { name: "Ramesh Doe", relation: "Father", phone: "+91 98765 43210", priority: 1, delay: 5 },
    { name: "Anita Doe", relation: "Mother", phone: "+91 98765 43211", priority: 2, delay: 5 },
    { name: "Vikram Doe", relation: "Brother", phone: "+91 98765 43212", priority: 3, delay: 5 },
    { name: "Emergency Services (112)", relation: "EMS Dispatch", phone: "112 / 911", priority: 4, delay: 5 }
  ];

  useEffect(() => {
    let timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    let ladderTimer = setTimeout(() => {
      if (currentStep < contactsLadder.length - 1) {
        setCurrentStep(prev => prev + 1);
        setCallDuration(0);
      }
    }, 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(ladderTimer);
    };
  }, [currentStep]);

  const activeContact = contactsLadder[currentStep];

  return (
    <div className="bg-gradient-to-br from-red-950/90 via-slate-900 to-rose-950/90 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-6 glow-box-red animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-500/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center animate-bounce shadow-lg shadow-red-600/50">
            <PhoneCall className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-black text-xs uppercase tracking-wider animate-pulse">
              🚨 AUTO-CALL ESCALATION ACTIVE
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              Sequential Contact Dialing System
            </h2>
          </div>
        </div>

        <button
          onClick={onCancelEscalation}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs transition flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Am Safe (Disarm Escalation)</span>
        </button>
      </div>

      {/* Active Call Status Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/50 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
          <Radio className="w-4 h-4 animate-ping" />
          <span>Simulated Dialer Engine • Step #{currentStep + 1} of {contactsLadder.length}</span>
        </div>
        <div className="text-2xl font-black text-white">
          📞 Calling: <span className="text-red-400">{activeContact.name}</span> ({activeContact.relation})
        </div>
        <div className="font-mono text-sm text-slate-300">
          Phone: {activeContact.phone} • Ringing: <span className="text-yellow-400 font-bold">{callDuration}s</span>
        </div>
        <p className="text-xs text-slate-400">
          If no voice pickup occurs within 6 seconds, M.R automatically advances to Contact #{currentStep + 2}.
        </p>
      </div>

      {/* Sequential Contact Ladder Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {contactsLadder.map((c, i) => (
          <div
            key={i}
            className={`p-3.5 rounded-2xl border text-xs transition-all ${
              i === currentStep
                ? 'bg-red-900/40 border-red-500 text-white ring-2 ring-red-500/50'
                : i < currentStep
                ? 'bg-slate-950/80 border-slate-800 text-slate-400 opacity-60'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold">Priority #{c.priority}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                i === currentStep ? 'bg-red-500 text-white animate-pulse' : i < currentStep ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-slate-400'
              }`}>
                {i === currentStep ? 'Dialing...' : i < currentStep ? 'Advanced' : 'Queued'}
              </span>
            </div>
            <span className="font-extrabold text-sm block truncate">{c.name}</span>
            <span className="text-[11px] text-slate-400 block">{c.relation}</span>
          </div>
        ))}
      </div>

      {/* Privacy-Limited Emergency Information Package (Requirement #5) */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <FileText className="w-4 h-4 text-purple-400" />
          <h4 className="font-bold text-white text-xs sm:text-sm">
            Dispatched Privacy-Limited Emergency Information Package:
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Patient Name:</span>
            <span className="font-bold text-white">{emergencyPackage?.name || 'John Doe (PT-882941)'}</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Blood Group:</span>
            <span className="font-bold text-red-400">{emergencyPackage?.blood || 'A+'}</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Critical Allergies:</span>
            <span className="font-bold text-orange-400">{emergencyPackage?.allergies || 'Penicillin (Anaphylactoid Risk)'}</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Known History:</span>
            <span className="font-bold text-slate-200">{emergencyPackage?.history || 'Angina, Stage-1 Hypertension'}</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Active Medications:</span>
            <span className="font-bold text-slate-200">{emergencyPackage?.medications || 'Amlodipine (5mg), Aspirin (75mg)'}</span>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">Trigger Reason:</span>
            <span className="font-bold text-yellow-300">"User has not responded to M.R safety check for 2 minutes."</span>
          </div>
        </div>
      </div>
    </div>
  );
}
