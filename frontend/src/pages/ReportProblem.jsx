import React, { useState } from 'react';
import { Heart, Activity, AlertTriangle, Send, Clock, Sparkles, CheckCircle2, ShieldAlert, Bot, MessageSquare, ChevronRight, HelpCircle, BookOpen } from 'lucide-react';
import VoiceInput from '../components/VoiceInput';
import RiskGauge from '../components/RiskGauge';
import DiseaseExplanation from '../components/DiseaseExplanation';

export default function ReportProblem({ onAnalyze, onManualSOS, lastAnalysisResult, emergencyState, onTriggerVerification }) {
  const [problemText, setProblemText] = useState('Chest discomfort with mild pain after climbing stairs');
  const [durationMins, setDurationMins] = useState(20);
  const [severity, setSeverity] = useState('Moderate');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const quickSymptoms = [
    { label: "Chest discomfort", text: "Chest discomfort with tightness after climbing stairs" },
    { label: "Shortness of breath", text: "Difficulty breathing and feeling suffocated while sitting" },
    { label: "Dizziness & spinning", text: "Severe dizziness and room is spinning when I stand up" },
    { label: "Severe headache", text: "Sudden throbbing sharp headache with vision blur" },
    { label: "Left arm numbness", text: "Tingling pain radiating down my left arm" },
    { label: "High fever & chills", text: "High fever with cold shivering and extreme body fatigue" }
  ];

  const handleQuickSelect = (text) => {
    setProblemText(text);
  };

  const handleVoiceTranscript = (transcript) => {
    setProblemText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!problemText.trim()) return;
    setLoading(true);
    try {
      await onAnalyze({
        problem_description: problemText,
        duration_mins: durationMins,
        severity: severity,
        previous_answers: answers
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isTakingTime = emergencyState?.taking_time_active || emergencyState?.status === 'TAKING_TIME';
  const risk = lastAnalysisResult?.risk_assessment || {
    risk_score: 45,
    risk_level: 'Moderate',
    recommended_action: 'M.R is ready. Enter your symptoms and click Run AI Triage to receive a personalized multi-factor risk assessment.',
    xai_reasons: [
      { factor: "Awaiting Symptom Input", impact: "0%", detail: "Type or speak symptoms to evaluate" }
    ]
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Health Problem Triage & AI Assistant</h2>
          <p className="text-xs text-slate-400">50/50 Split Screen: Interactive Symptom Intake + Real-Time AI Intelligence</p>
        </div>

        <div className="flex items-center gap-3">
          <VoiceInput onTranscript={handleVoiceTranscript} />
          <button
            onClick={onManualSOS}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>🔴 HELP ME NOW</span>
          </button>
        </div>
      </div>

      {/* Taking Time Extended Mode Notice */}
      {isTakingTime && (
        <div className="p-4 rounded-2xl bg-yellow-950/70 border border-yellow-500/60 flex items-center gap-3 animate-fade-in">
          <Clock className="w-6 h-6 text-yellow-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-yellow-200">
              🟡 Taking Time Mode Active (Escalation Paused)
            </h4>
            <p className="text-xs text-yellow-300/90">
              Emergency escalation is paused. Speak or type your symptoms freely without triggering emergency alerts.
            </p>
          </div>
        </div>
      )}

      {/* 50% / 50% Vertical Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT VERTICAL HALF: Problem Input & Dynamic Follow-Up Questions */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                1. Quick Symptom Chips:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickSymptoms.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSelect(chip.text)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-500/40 text-xs transition cursor-pointer"
                  >
                    + {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  2. Describe what is happening:
                </label>
                <textarea
                  rows={4}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="Describe your discomfort, pain location, or onset..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Modifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>Duration:</span>
                    <span className="text-blue-400 font-mono">{durationMins} mins</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Severity:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Mild', 'Moderate', 'Severe'].map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          severity === sev
                            ? sev === 'Severe'
                              ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                              : 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !problemText.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="animate-pulse">Processing M.R AI Risk Engine...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Run AI Triage & Risk Assessment</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* History-Awareness Banner */}
          {lastAnalysisResult?.related_history?.found && (
            <div className="p-4 rounded-3xl bg-indigo-950/70 border border-indigo-500/50 glow-box-blue animate-slide-in">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white">
                    📜 History-Aware Correlation Detected
                  </h4>
                  <p className="text-xs text-indigo-200 mt-1">
                    {lastAnalysisResult.related_history.note}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Follow-Up Questions */}
          {lastAnalysisResult?.followup_questions && lastAnalysisResult.followup_questions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-xs sm:text-sm">Adaptive Clinical Follow-Up</h3>
              </div>

              <div className="space-y-3">
                {lastAnalysisResult.followup_questions.map((q) => (
                  <div key={q.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-semibold text-xs text-slate-200 block">{q.question}</span>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => ({ ...prev, [q.id]: opt }));
                            handleSubmit();
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-medium border transition cursor-pointer ${
                            answers[q.id] === opt
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-blue-500/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT VERTICAL HALF: AI Assistant & Disease Causality Intelligence */}
        <div className="space-y-4">
          {/* AI Conversational Assistant Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm">M.R AI Clinical Assistant</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Triage Engine Online</span>
                </div>
              </div>

              <button
                onClick={onTriggerVerification}
                className="px-3 py-1 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Launch the 'Are You Okay?' safety verification dialog"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Verify "Are You Okay?"</span>
              </button>
            </div>

            {/* AI Assistant Chat Bubble */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 leading-relaxed">
              <p className="text-slate-200">
                <strong className="text-blue-400">M.R Assistant:</strong> I have evaluated your reported symptoms <span className="text-yellow-300 font-semibold">"{problemText}"</span> against your patient record (52M, Angina history, Penicillin allergy).
              </p>
              <p className="text-slate-300">
                {risk.risk_score >= 75
                  ? "⚠️ This matches acute cardiovascular distress criteria. An adaptive safety countdown has been scheduled. If you need immediate intervention, click 'Emergency'."
                  : risk.risk_score >= 50
                  ? "Your reported symptoms indicate elevated risk. Please rest in a seated position and monitor for radiating arm or jaw pain."
                  : "Your current profile shows low acute risk. Continue monitoring and maintain hydration."}
              </p>
            </div>
          </div>

          {/* 0–100 Risk Score Gauge */}
          <RiskGauge
            score={risk.risk_score}
            level={risk.risk_level}
            xaiReasons={risk.xai_reasons}
            recommendedAction={risk.recommended_action}
            disclaimer={risk.disclaimer}
          />

          {/* Detailed Pathology, Causes & Defective Habits Breakdown */}
          <DiseaseExplanation
            problemText={problemText}
            riskScore={risk.risk_score}
          />
        </div>
      </div>
    </div>
  );
}
