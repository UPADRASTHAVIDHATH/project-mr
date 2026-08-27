import React from 'react';
import { Stethoscope, AlertOctagon, Flame, ShieldAlert, HeartPulse, CheckCircle2, BookOpen } from 'lucide-react';

export default function DiseaseExplanation({ problemText, riskScore = 40 }) {
  const text = (problemText || '').toLowerCase();
  
  // Dynamic pathology & causality generator based on symptoms
  let conditionTitle = "Suspected Angina Pectoris / Acute Coronary Syndrome";
  let whatHappensPoints = [
    "Myocardial Blood Supply Deficit: The heart muscle is temporarily receiving insufficient oxygenated blood due to narrowed coronary arteries.",
    "Ischemic Nerve Stimulation: Lack of oxygen triggers lactic acid accumulation, stimulating thoracic nerve endings that register as a heavy squeezing sensation across the chest.",
    "Stress & Exertion Flare-up: Physical exertion (like climbing stairs) increases cardiac workload, exacerbating the supply-demand mismatch."
  ];
  let rootCauses = [
    "Coronary Artery Atherosclerosis: Gradual accumulation of lipid plaques along coronary arterial walls.",
    "Arterial Stiffening & Hypertension: Chronic elevated blood pressure (Stage-1) damages vascular endothelium over time.",
    "Elevated LDL / Borderline Cholesterol: High circulating low-density lipoproteins promote plaque calcification."
  ];
  let defectiveHabits = [
    "Sedentary Periods with Sudden Acute Exertion: Straining without cardiovascular conditioning triggers acute demand spikes.",
    "High Dietary Sodium & Saturated Fats: Excess salt intake sustains elevated arterial tension and fluid retention.",
    "Missed / Irregular Medication Timing: Inconsistent daily Amlodipine/Aspirin dosing leads to rebound vasoconstriction.",
    "Chronic Unmanaged Stress & Poor Sleep: Sustained elevated cortisol and adrenaline maintain continuous coronary vascular constriction."
  ];
  let correctivePlan = [
    "Immediate Rest in a Seated Upright Position to reduce venous return and lower myocardial oxygen demand.",
    "Sublingual Sorbitrate / Nitroglycerin as prescribed if discomfort persists past 5 minutes.",
    "Schedule an elective Coronary Angiogram / TMT stress test with Dr. Arvind to evaluate exact stenosis percentage."
  ];

  if (text.includes('breath') || text.includes('suffocat') || text.includes('asthma')) {
    conditionTitle = "Acute Bronchial Spasm & Respiratory Insufficiency";
    whatHappensPoints = [
      "Bronchoconstriction: Smooth muscles surrounding the bronchial airways constrict involuntarily.",
      "Mucosal Edema & Hypersecretion: Airway linings swell and produce excess mucus, dramatically reducing lumen diameter.",
      "Air Trapping & Hypoxemia: Inability to fully exhale traps stale air, leading to decreased oxygen saturation."
    ];
    rootCauses = [
      "Airway Hyper-responsiveness: Chronic inflammatory allergic airway disease triggered by environmental antigens.",
      "Bronchial Micro-inflammation: Persistent baseline eosinophilic infiltration.",
      "Seasonal Weather Transitions: Sudden inhalation of cold, dry air triggering mast-cell degranulation."
    ];
    defectiveHabits = [
      "Exposure to Known Airborne Allergens (Dust, mold, aerosol sprays without mask filtration).",
      "Delaying Maintenance Inhaler Usage until acute severe distress occurs.",
      "Inadequate Daily Hydration leading to thick, un-cleared bronchial secretions."
    ];
    correctivePlan = [
      "Use Short-Acting Beta-Agonist (Salbutamol) inhaler with spacer (2 puffs).",
      "Sit leaning forward in a 'tripod position' to maximize diaphragmatic excursion.",
      "Monitor peak expiratory flow (PEFR) and seek ER if lips or fingernails turn dusky."
    ];
  } else if (text.includes('dizz') || text.includes('faint') || text.includes('spinning')) {
    conditionTitle = "Orthostatic Hypotension / Transient Cerebral Hypoperfusion";
    whatHappensPoints = [
      "Transient Brain Perfusion Drop: Sudden drop in systemic blood pressure upon standing temporarily reduces blood flow to the brainstem and cortex.",
      "Baroreceptor Delay: Autonomic nerve sensors fail to constrict lower-body blood vessels quickly enough.",
      "Loss of Postural Stability: Vestibular disorientation and visual gray-out occur."
    ];
    rootCauses = [
      "Autonomic Vascular Dysregulation: Reduced vascular tone response.",
      "Mild Systemic Dehydration: Low blood volume compounding blood pooling in lower extremities.",
      "Vasodilator Medication Effect: Calcium channel blockers (Amlodipine) relaxing vascular walls."
    ];
    defectiveHabits = [
      "Rapidly Standing Up from Bed without a 30-second seated pause.",
      "Insufficient Daily Fluid Intake (< 1.5 Liters/day) leading to reduced intravascular volume.",
      "Prolonged Standing in Warm Environments without moving calf muscles."
    ];
    correctivePlan = [
      "Lie down flat with legs elevated 30 cm to restore cerebral venous return.",
      "Drink 300ml of water with light electrolyte balance immediately.",
      "Review antihypertensive medication dosage with your doctor if symptoms recur."
    ];
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm">Pathophysiology & Disease Causality Engine</h3>
            <span className="text-[10px] text-indigo-300 font-mono">Detailed Clinical Breakdown</span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
          {conditionTitle.split('/')[0]}
        </span>
      </div>

      {/* 1. What Happens in Points */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-400 uppercase tracking-wider">
          <HeartPulse className="w-4 h-4" />
          <span>1. What is Happening Inside the Body (In Points):</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-200">
          {whatHappensPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Biological Causes */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-400 uppercase tracking-wider">
          <AlertOctagon className="w-4 h-4" />
          <span>2. Underlying Causes & Medical Etiology:</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-200">
          {rootCauses.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Defective Habits / Mistakes That Contributed */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-red-500/30 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-red-400 uppercase tracking-wider">
          <Flame className="w-4 h-4" />
          <span>3. Defective Habits & Lifestyle Triggers (What Went Wrong):</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-200">
          {defectiveHabits.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Corrective Action Plan */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>4. Corrective Clinical Action Plan:</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-200">
          {correctivePlan.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
