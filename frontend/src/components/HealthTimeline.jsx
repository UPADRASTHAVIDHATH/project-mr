import React from 'react';
import { Calendar, GitCommit, Stethoscope, AlertCircle } from 'lucide-react';

export default function HealthTimeline({ items = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <Calendar className="w-5 h-5 text-blue-400" />
        <h3 className="font-bold text-white text-lg">Interactive Medical History Tree (2026)</h3>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-600/40">
        {items.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center group-hover:scale-125 transition">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-blue-400">{item.date}</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.tag || 'Clinical'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
