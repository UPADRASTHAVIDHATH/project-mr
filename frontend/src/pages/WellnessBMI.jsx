import React, { useState } from 'react';
import { Activity, Apple, Dumbbell, ShieldCheck, CheckCircle2, Save } from 'lucide-react';

export default function WellnessBMI({ userProfile, onUpdateVitals }) {
  const [height, setHeight] = useState(userProfile?.height_cm || 174);
  const [weight, setWeight] = useState(userProfile?.weight_kg || 78.5);
  const [savedToast, setSavedToast] = useState(false);

  const heightM = height / 100.0;
  const bmi = round(weight / (heightM * heightM), 1);

  function round(val, dec) {
    return Number(Math.round(val + 'e' + dec) + 'e-' + dec);
  }

  const getCategory = (val) => {
    if (val < 18.5) return 'Underweight';
    if (val < 25.0) return 'Normal Weight';
    if (val < 30.0) return 'Overweight';
    return 'Obese';
  };

  const category = getCategory(bmi);

  const handleSave = () => {
    if (onUpdateVitals) {
      onUpdateVitals({ height_cm: height, weight_kg: weight, bmi, bmi_category: category });
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">BMI & Lifestyle Wellness Engine</h2>
            <p className="text-xs text-slate-400">Interactive health tracker — Automatically updates patient Dashboard</p>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition transform hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Sync Vitals to Dashboard</span>
          </button>
        </div>

        {/* Live Saved Toast Notification */}
        {savedToast && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 mb-6 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>✓ Vitals saved! BMI updated to <strong>{bmi} ({category})</strong> and synchronized to your Dashboard.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-8">
          {/* Sliders */}
          <div className="lg:col-span-2 space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Height:</span>
                <span className="text-blue-400 font-mono text-sm">{height} cm</span>
              </div>
              <input
                type="range"
                min="130"
                max="210"
                value={height}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHeight(val);
                  if (onUpdateVitals) onUpdateVitals({ height_cm: val, weight_kg: weight, bmi: round(weight / ((val/100)*(val/100)), 1), bmi_category: getCategory(round(weight / ((val/100)*(val/100)), 1)) });
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Weight:</span>
                <span className="text-blue-400 font-mono text-sm">{weight} kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                step="0.5"
                value={weight}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWeight(val);
                  if (onUpdateVitals) onUpdateVitals({ height_cm: height, weight_kg: val, bmi: round(val / ((height/100)*(height/100)), 1), bmi_category: getCategory(round(val / ((height/100)*(height/100)), 1)) });
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* BMI Result Badge */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block font-semibold mb-1">Live Calculated BMI</span>
            <span className="text-4xl font-black text-white font-mono">{bmi}</span>
            <span className={`text-xs font-bold block mt-1 ${
              bmi < 18.5 ? 'text-blue-400' : bmi < 25 ? 'text-emerald-400' : bmi < 30 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {category}
            </span>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Apple className="w-5 h-5" />
              <span>Tailored Nutrition Guidance</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {bmi >= 25 
                ? 'Prioritize whole grains, high-fiber leafy greens, and lean protein while reducing ultra-processed carbohydrates and high sodium.' 
                : 'Maintain balanced daily nutrition with whole grains, fruit antioxidants, and lean protein sources.'}
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Dumbbell className="w-5 h-5" />
              <span>Safe Physical Activity Advice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {userProfile?.conditions?.some(c => c.name.toLowerCase().includes('angina'))
                ? 'Engage in light-to-moderate walking (20 mins daily). Strictly avoid strenuous weightlifting or sprinting during any active chest tightness.'
                : 'Aim for 150 minutes of moderate aerobic activity (brisk walking, swimming) per week.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
