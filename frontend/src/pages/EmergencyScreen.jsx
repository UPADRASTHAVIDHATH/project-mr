import React from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, MapPin, CheckCircle2, FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import EventTimeline from '../components/EventTimeline';
import MapLocation from '../components/MapLocation';

export default function EmergencyScreen({ emergencyState, setActiveTab, onPostFollowup }) {
  const isEmergency = emergencyState?.status === 'EMERGENCY_ACTIVE';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* High Contrast Emergency Command Header */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 border-2 border-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl glow-box-red">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50 animate-bounce">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-black text-xs uppercase tracking-wider animate-pulse">
                  🚨 ACTIVE EMERGENCY
                </span>
                <span className="text-xs text-red-300 font-mono">Incident #INC-9942</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Emergency Response Command
              </h1>
              <p className="text-xs sm:text-sm text-red-200 mt-0.5">
                Help is actively being coordinated for <span className="font-bold text-white">{emergencyState?.patient_name || 'John Doe'}</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('doctor')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Doctor Summary
            </button>
            <button
              onClick={() => onPostFollowup()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              I Am Safe Now (Resolve)
            </button>
          </div>
        </div>
      </div>

      {/* Main Emergency Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Real-Time Event Audit Timeline & Contact Escalation */}
        <div className="space-y-6">
          <EventTimeline events={emergencyState?.events_timeline || []} />

          {/* Notified Contacts Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Emergency Contact Dispatch</h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Priority Escalation</span>
            </div>

            <div className="space-y-3">
              {(emergencyState?.contacts_notified?.length ? emergencyState.contacts_notified : [
                { name: "Ramesh Doe (Father)", priority: 1, status: "Alert Delivered • SMS + Ringing", time: "18:32:41" },
                { name: "Anita Doe (Mother)", priority: 2, status: "Alert Delivered • SMS Sent", time: "18:32:42" },
                { name: "Vikram Doe (Brother)", priority: 3, status: "Standby Queue", time: "18:32:43" }
              ]).map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-white block">#{c.priority} {c.name}</span>
                    <span className="text-[11px] text-slate-400">Dispatched: {c.time}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                    ✓ {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live GPS Location & Emergency Service Simulator */}
        <div className="space-y-6">
          <MapLocation location={emergencyState?.location} />

          {/* Emergency Service Simulation Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">Emergency Medical Services (EMS) Simulation</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                API Mock
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In production, M.R transmits the FHIR/HL7 compliant Emergency Medical Information Package to authorized 112/911 dispatch networks.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
              <div className="text-emerald-400">✓ EMS Protocol: 112 Dispatch Simulation Acknowledged</div>
              <div className="text-slate-400">✓ Medical Package: Blood A+ • Penicillin Allergy • Angina History</div>
              <div className="text-slate-400">✓ Real-time Location Stream: Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
