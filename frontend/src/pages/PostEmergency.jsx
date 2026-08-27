import React, { useState } from 'react';
import { CheckCircle2, Shield, ArrowRight } from 'lucide-react';

export default function PostEmergency({ incidentId, onSubmitFollowup }) {
  const [safe, setSafe] = useState(true);
  const [medicalReceived, setMedicalReceived] = useState(true);
  const [persisting, setPersisting] = useState(false);
  const [genuine, setGenuine] = useState(true);
  const [notes, setNotes] = useState('Paramedic unit evaluated on scene. Patient stable.');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitFollowup({
      incident_id: incidentId || 1,
      is_safe_now: safe,
      medical_help_received: medicalReceived,
      symptoms_persisting: persisting,
      was_genuine_emergency: genuine,
      doctor_notes: notes
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        <div>
          <h2 className="text-2xl font-extrabold text-white">Post-Emergency Safety Follow-Up</h2>
          <p className="text-xs text-slate-400">Incident closure audit & record keeper</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-200 font-semibold">Are you safe now?</span>
            <input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-200 font-semibold">Was medical help received?</span>
            <input type="checkbox" checked={medicalReceived} onChange={(e) => setMedicalReceived(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-200 font-semibold">Are symptoms persisting?</span>
            <input type="checkbox" checked={persisting} onChange={(e) => setPersisting(e.target.checked)} className="w-4 h-4 accent-red-500" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-200 font-semibold">Was this a genuine emergency?</span>
            <input type="checkbox" checked={genuine} onChange={(e) => setGenuine(e.target.checked)} className="w-4 h-4 accent-blue-500" />
          </div>
        </div>

        <div>
          <label className="text-slate-300 font-bold block mb-1">Clinical / Incident Closure Notes:</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/30"
        >
          Confirm & Safely Close Incident Record
        </button>
      </form>
    </div>
  );
}
