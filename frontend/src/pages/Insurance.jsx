import React from 'react';
import { Shield, FileCheck, AlertCircle } from 'lucide-react';

export default function Insurance({ insuranceData }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="border-b border-slate-800 pb-6 mb-6">
          <h2 className="text-2xl font-extrabold text-white">Insurance & Policy Management</h2>
          <p className="text-xs text-slate-400">Administrative healthcare coverage metadata</p>
        </div>

        {/* Strict Medical Isolation Guardrail Notice */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/40 mb-6 flex items-start gap-3 text-xs text-slate-300">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Clinical Architecture Guarantee:</strong> Insurance policy information is strictly administrative metadata. Insurance status <strong>never</strong> influences the clinical risk score or emergency response protocol.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Provider</span>
            <span className="font-extrabold text-white text-base">{insuranceData?.provider || 'Star Health'}</span>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Policy Number</span>
            <span className="font-extrabold text-blue-400 text-base font-mono">{insuranceData?.policy_number || 'POL-8829-MR-2026'}</span>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-xs block mb-1">Sum Insured</span>
            <span className="font-extrabold text-emerald-400 text-base font-mono">{insuranceData?.sum_insured_inr || '₹15,00,000'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
