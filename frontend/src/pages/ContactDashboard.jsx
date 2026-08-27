import React, { useState } from 'react';
import { Shield, AlertTriangle, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';
import MapLocation from '../components/MapLocation';

export default function ContactDashboard({ emergencyState }) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
              EMERGENCY CONTACT RECEIVER VIEW (SIMULATED SMS LINK)
            </span>
            <h1 className="text-2xl font-black text-white">
              Emergency Alert for John Doe (52M)
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 block font-semibold">Incident Details:</span>
              <p className="text-sm font-bold text-white">{emergencyState?.problem || 'Severe chest discomfort and breathing difficulty'}</p>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                  Risk Level: HIGH ({emergencyState?.risk_score || 82}/100)
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                  Blood Group: A+
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">Critical Allergy:</span>
              <span className="font-bold text-red-400">⚠️ Penicillin (Severe Anaphylactoid Risk)</span>
            </div>

            <button
              onClick={() => setAcknowledged(true)}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs transition flex items-center justify-center gap-2 ${
                acknowledged
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{acknowledged ? '✓ You Acknowledged: "I am checking on John now"' : 'Acknowledge & Confirm: "I am checking on John"'}</span>
            </button>
          </div>

          <div>
            <MapLocation location={emergencyState?.location} />
          </div>
        </div>
      </div>
    </div>
  );
}
