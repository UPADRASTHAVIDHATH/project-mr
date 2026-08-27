import React from 'react';
import { Activity, Info, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'Low', xaiReasons = [], recommendedAction, disclaimer }) {
  const getColors = () => {
    if (score >= 75) return { stroke: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/40', label: 'CRITICAL' };
    if (score >= 50) return { stroke: '#f97316', text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40', label: 'HIGH' };
    if (score >= 25) return { stroke: '#eab308', text: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40', label: 'MODERATE' };
    return { stroke: '#22c55e', text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', label: 'LOW' };
  };

  const c = getColors();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="font-extrabold text-white text-sm sm:text-base">M.R Risk Score & XAI</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${c.bg} ${c.text} ${c.border} border`}>
          {c.label} RISK
        </span>
      </div>

      {/* Score & Recommended Protocol (Clean Stacked Layout, Zero Overlap) */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950 p-4 rounded-2xl border border-slate-800/90">
        {/* Gauge SVG */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke={c.stroke}
              strokeWidth="8"
              strokeDasharray="238.7"
              strokeDashoffset={238.7 - (238.7 * score) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-white font-mono">{score}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">/ 100</span>
          </div>
        </div>

        {/* Recommended Protocol Text */}
        <div className="flex-1 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wide text-[11px]">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Recommended Protocol:</span>
          </div>
          <p className="text-slate-200 font-medium leading-relaxed text-xs">
            {recommendedAction || 'Normal health monitoring active. Maintain routine hydration and prescribed medications.'}
          </p>
        </div>
      </div>

      {/* Explainable AI (XAI) Contributory Factors */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Explainable AI (Why is my risk {level}?):
        </h4>
        <div className="space-y-2">
          {(!xaiReasons || xaiReasons.length === 0) ? (
            <p className="text-xs text-slate-500">No elevated risk factors detected.</p>
          ) : (
            xaiReasons.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 pr-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                  <div>
                    <span className="font-semibold text-slate-200 block">{r.factor}</span>
                    <span className="text-slate-400 text-[11px] block">{r.detail}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">
                  {r.impact}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2 italic">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
        <span>{disclaimer || "This is a risk assessment, not a medical diagnosis. Your reported symptoms may require urgent medical attention."}</span>
      </div>
    </div>
  );
}
