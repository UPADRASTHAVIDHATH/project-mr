import React, { useState } from 'react';
import { Calendar, Stethoscope, Plus, Pill, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function MedicalHistory({ medicalRecords, userProfile, onAddRecord }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [problem, setProblem] = useState('');
  const [category, setCategory] = useState('Cardiovascular');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!problem.trim()) return;
    onAddRecord({
      record_date: 'Today, 2026',
      problem,
      category,
      severity: 'Moderate',
      doctor_diagnosis: diagnosis,
      treatment
    });
    setProblem('');
    setDiagnosis('');
    setTreatment('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Medical History & Clinical Records</h2>
            <p className="text-xs text-slate-400">History-aware database linking past records with active symptom complaints</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medical Record</span>
          </button>
        </div>

        {/* Existing Records List */}
        <div className="space-y-4">
          {medicalRecords?.map((rec) => (
            <div key={rec.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                    {rec.record_date}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold">
                    {rec.category}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{rec.hospital_doctor || 'Clinical Center'}</span>
              </div>

              <h3 className="text-base font-extrabold text-white mb-1">{rec.problem}</h3>
              <p className="text-xs text-slate-300 mb-3"><span className="text-slate-400 font-semibold">Symptoms:</span> {rec.symptoms || 'N/A'}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block text-[11px]">Doctor Diagnosis:</span>
                  <span className="font-bold text-slate-200">{rec.doctor_diagnosis || 'Outpatient Triage'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Treatment / Prescription:</span>
                  <span className="font-bold text-slate-200">{rec.treatment || 'Observation & Follow-up'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
