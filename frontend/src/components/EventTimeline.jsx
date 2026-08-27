import React from 'react';
import { Clock, Activity, AlertTriangle, ShieldCheck, MapPin, PhoneCall, CheckCircle, FileText, ShieldAlert } from 'lucide-react';

export default function EventTimeline({ events = [] }) {
  const getIcon = (eventType) => {
    switch (eventType) {
      case 'PROBLEM_REPORTED': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'RISK_CALCULATED': return <Activity className="w-4 h-4 text-orange-400" />;
      case 'VERIFICATION_POPUP': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'TIMEOUT_EXPIRED': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'EMERGENCY_ESCALATION': return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'CONTACT_NOTIFIED': return <PhoneCall className="w-4 h-4 text-emerald-400" />;
      case 'LOCATION_BROADCAST': return <MapPin className="w-4 h-4 text-purple-400" />;
      case 'TAKING_TIME_SELECTED': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'IM_OKAY_CONFIRMED': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-white text-base">Live Emergency Event Timeline</h3>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
          Real-Time Audit
        </span>
      </div>

      {(!events || events.length === 0) ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No incident events recorded yet. Ready for health problem intake.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {events.map((evt, idx) => (
            <div key={idx} className="relative flex items-start gap-3 group animate-slide-in">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
                {getIcon(evt.event_type)}
              </div>
              <div className="flex-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-200">
                    {evt.event_type.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-semibold">
                    {evt.time}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{evt.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
