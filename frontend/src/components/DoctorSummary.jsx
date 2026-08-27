import React from 'react';
import { Shield, Printer, Download, UserCheck, AlertTriangle, FileText } from 'lucide-react';

export default function DoctorSummary({ data, onPrint }) {
  if (!data) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            {data.system}
          </div>
          <h2 className="text-2xl font-extrabold text-white">{data.report_title}</h2>
          <p className="text-xs text-slate-400">Standard Paramedic & Physician Handoff Protocol</p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Patient Profile Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-6 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Patient Name:</span>
          <span className="font-bold text-white text-sm">{data.patient?.name}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Age / Gender:</span>
          <span className="font-bold text-white text-sm">{data.patient?.age}Y / {data.patient?.gender}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Blood Group:</span>
          <span className="font-bold text-red-400 text-sm">{data.patient?.blood_group}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Allergies (Critical):</span>
          <span className="font-bold text-orange-400 text-sm">{data.patient?.allergies?.join(', ') || 'None'}</span>
        </div>
      </div>

      {/* Clinical Incident & Timeline */}
      <div className="space-y-4 mb-6 text-xs">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Reported Incident & AI Risk Level
          </h4>
          <p className="text-slate-300 mb-2"><span className="font-semibold text-white">Chief Complaint:</span> {data.incident?.problem}</p>
          <div className="flex gap-4">
            <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
              Risk Score: {data.incident?.risk_score}
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
              Status: {data.incident?.status}
            </span>
          </div>
        </div>

        {/* Chronic Conditions & Active Meds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-slate-300 block mb-2">Pre-existing Conditions:</span>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              {data.patient?.chronic_conditions?.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-slate-300 block mb-2">Active Medications:</span>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              {data.patient?.active_medications?.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-500 italic border-t border-slate-800 pt-4">
        {data.disclaimer}
      </p>
    </div>
  );
}
