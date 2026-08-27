import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import VerificationModal from './components/VerificationModal';
import AutoCallLadder from './components/AutoCallLadder';
import Dashboard from './pages/Dashboard';
import ReportProblem from './pages/ReportProblem';
import EmergencyScreen from './pages/EmergencyScreen';
import MedicalHistory from './pages/MedicalHistory';
import HealthTimeline from './components/HealthTimeline';
import WellnessBMI from './pages/WellnessBMI';
import Insurance from './pages/Insurance';
import DoctorPortal from './pages/DoctorPortal';
import ContactDashboard from './pages/ContactDashboard';
import PostEmergency from './pages/PostEmergency';
import { fetchApi, createEmergencyWebSocket } from './api/client';
import { Zap, AlertTriangle, Clock, Play, RotateCcw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isAutoCallLadderActive, setIsAutoCallLadderActive] = useState(false);
  const [isFastDemoMode, setIsFastDemoMode] = useState(false); // 10s demo vs 120s standard
  const [safetyCycleRemaining, setSafetyCycleRemaining] = useState(300); // 5 minutes = 300s

  const [userProfile, setUserProfile] = useState({
    id: 1,
    full_name: 'John Doe',
    age: 52,
    gender: 'Male',
    blood_group: 'A+',
    height_cm: 174.0,
    weight_kg: 78.5,
    bmi: 25.9,
    bmi_category: 'Overweight',
    monitoring_status: 'Active (🟢 M.R Online)',
    conditions: [{ name: 'Hypertension', year: '2024' }, { name: 'Suspected Stable Angina', year: '2026' }],
    allergies: [{ allergen: 'Penicillin', reaction: 'Severe Anaphylactoid Wheezing' }],
    emergency_contacts: [
      { name: 'Ramesh Doe', relationship: 'Father', phone: '+91 98765 43210', priority: 1, channel: 'SMS + Call' },
      { name: 'Anita Doe', relationship: 'Mother', phone: '+91 98765 43211', priority: 2, channel: 'SMS + Call' },
      { name: 'Vikram Doe', relationship: 'Brother', phone: '+91 98765 43212', priority: 3, channel: 'WhatsApp / SMS' },
      { name: 'Rahul Sharma', relationship: 'Close Friend', phone: '+91 98765 43213', priority: 4, channel: 'SMS' },
      { name: 'Dr. Arvind', relationship: 'Primary Physician', phone: '+91 98765 43214', priority: 5, channel: 'Emergency Line' }
    ]
  });

  const [medicalRecords, setMedicalRecords] = useState([
    { id: 1, record_date: "12 Aug 2026", problem: "Chest discomfort", category: "Cardiovascular", symptoms: "Mild tightness across mid-chest after climbing stairs", severity: "Moderate", doctor_diagnosis: "Suspected mild stable angina", treatment: "Prescribed Sorbitrate PRN and lifestyle rest", hospital_doctor: "Dr. Arvind • Manipal Hospital" },
    { id: 2, record_date: "20 Jul 2026", problem: "Elevated Blood Pressure", category: "Cardiovascular", symptoms: "Occasional morning headache", severity: "Moderate", doctor_diagnosis: "Stage-1 Essential Hypertension", treatment: "Amlodipine 5mg once daily", hospital_doctor: "Apollo Clinic" },
    { id: 3, record_date: "05 Jun 2026", problem: "Routine Annual Health Check", category: "General", symptoms: "None reported", severity: "Mild", doctor_diagnosis: "Normal baseline with borderline cholesterol (215 mg/dL)", treatment: "Dietary fiber and omega-3 supplements", hospital_doctor: "Apollo Diagnostics" }
  ]);

  const [timelineItems, setTimelineItems] = useState([
    { date: "12 Aug 2026", title: "Chest discomfort", subtitle: "Diagnosis: Suspected mild stable angina • Dr. Arvind • Manipal Hospital", tag: "Cardiovascular" },
    { date: "20 Jul 2026", title: "Elevated Blood Pressure", subtitle: "Diagnosis: Stage-1 Essential Hypertension • Apollo Clinic", tag: "Cardiovascular" },
    { date: "05 Jun 2026", title: "Routine Annual Health Check", subtitle: "Diagnosis: Normal baseline • Apollo Diagnostics", tag: "General" }
  ]);

  const [insuranceData, setInsuranceData] = useState({
    provider: "Star Health Comprehensive Care",
    policy_number: "POL-8829-MR-2026",
    coverage_type: "Family Floater Super Top-Up",
    sum_insured_inr: "₹15,00,000",
    valid_until: "31 Dec 2027"
  });

  const [doctorSummary, setDoctorSummary] = useState(null);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [emergencyState, setEmergencyState] = useState({
    status: 'IDLE',
    risk_score: 22,
    risk_level: 'Low',
    timeout_seconds: 120,
    remaining_seconds: 120,
    taking_time_active: false,
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 'Real GPS Ready',
      address: 'Koramangala 5th Block, Bengaluru'
    },
    events_timeline: []
  });

  // Background 5-Minute Safety Check Cycle Loop
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setSafetyCycleRemaining(prev => {
        if (prev <= 1) {
          // Trigger the 5-Minute Safety Check automatically!
          setEmergencyState(curr => ({
            ...curr,
            status: 'VERIFYING',
            problem: 'Periodic 5-Minute Safety Check',
            timeout_seconds: 120,
            remaining_seconds: 120
          }));
          setShowVerificationModal(true);
          return 300; // Reset 5-minute cycle
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(cycleInterval);
  }, []);

  // Format 5-min timer display
  const cycleMins = Math.floor(safetyCycleRemaining / 60);
  const cycleSecs = safetyCycleRemaining % 60;
  const cycleDisplay = `${String(cycleMins).padStart(2, '0')}:${String(cycleSecs).padStart(2, '0')}`;

  // Initial Load & WebSocket
  useEffect(() => {
    loadAllData();
    const ws = createEmergencyWebSocket((liveState) => {
      setEmergencyState(liveState);
      if (liveState.status === 'EMERGENCY_ACTIVE') {
        setActiveTab('emergency_screen');
        setShowVerificationModal(false);
      }
    });
    return () => ws.close();
  }, []);

  const loadAllData = async () => {
    try {
      const [profile, history, timeline, insurance, docSum] = await Promise.all([
        fetchApi('/profile/me'),
        fetchApi('/profile/medical-history'),
        fetchApi('/profile/health-timeline'),
        fetchApi('/profile/insurance'),
        fetchApi('/emergency/doctor-summary')
      ]);
      if (profile) setUserProfile(profile);
      if (history) setMedicalRecords(history);
      if (timeline) setTimelineItems(timeline);
      if (insurance) setInsuranceData(insurance);
      if (docSum) setDoctorSummary(docSum);
    } catch (err) {}
  };

  // Vitals Update
  const handleUpdateVitals = async ({ height_cm, weight_kg, bmi, bmi_category }) => {
    setUserProfile(prev => ({ ...prev, height_cm, weight_kg, bmi, bmi_category }));
    try {
      await fetchApi('/profile/update-vitals', { method: 'POST', body: JSON.stringify({ height_cm, weight_kg }) });
    } catch (e) {}
  };

  // Symptom Analysis
  const handleAnalyze = async (payload) => {
    try {
      const result = await fetchApi('/incidents/analyze', {
        method: 'POST',
        body: JSON.stringify({ ...payload, user_id: userProfile?.id || 1 })
      });
      setLastAnalysis(result);
      if (result.active_emergency_state) setEmergencyState(result.active_emergency_state);
      loadAllData();
    } catch (err) {
      const text = payload.problem_description.toLowerCase();
      const isChest = text.includes('chest') || text.includes('heart') || text.includes('angina');
      const score = payload.is_manual_emergency ? 100 : (isChest ? 88 : 45);
      const level = score >= 75 ? 'Critical' : (score >= 50 ? 'High' : 'Moderate');
      const mockResult = {
        incident_id: Date.now(),
        problem_description: payload.problem_description,
        related_history: {
          found: isChest,
          note: isChest ? "Related Cardiovascular history detected: Previous record for 'Chest discomfort' on 12 Aug 2026." : null
        },
        risk_assessment: {
          risk_score: score,
          risk_level: level,
          xai_reasons: isChest ? [
            { factor: "High-Risk Symptom ('Chest Discomfort')", impact: "+45%", detail: "Matches clinical red-flag angina indicator" },
            { factor: "History Correlation Match", impact: "+15%", detail: "Similar episode on 12 Aug 2026" },
            { factor: "Pre-existing Condition (Hypertension)", impact: "+10%", detail: "Increases acute risk progression" }
          ] : [
            { factor: "General Health Symptom", impact: "+15%", detail: "Mild intensity reported" }
          ],
          recommended_action: score >= 75 ? "Immediate safety verification required." : "Maintain hydration and rest.",
          escalation_timeout_sec: 120
        },
        active_emergency_state: {
          status: 'VERIFYING',
          patient_name: userProfile?.full_name || 'John Doe',
          problem: payload.problem_description,
          risk_score: score,
          risk_level: level,
          timeout_seconds: 120,
          remaining_seconds: 120
        }
      };
      setLastAnalysis(mockResult);
      setEmergencyState(mockResult.active_emergency_state);
    }
  };

  // Trigger 2-Minute No-Response Automatic Escalation
  const handleNoResponseTimeout = () => {
    setShowVerificationModal(false);
    setIsAutoCallLadderActive(true);
    setEmergencyState(prev => ({
      ...prev,
      status: 'EMERGENCY_ACTIVE',
      risk_score: 95,
      risk_level: 'Critical',
      events_timeline: [
        ...(prev.events_timeline || []),
        { time: new Date().toLocaleTimeString(), event_type: 'TIMEOUT_EXPIRED', details: '⚠️ No response received after 2 minutes safety check limit' },
        { time: new Date().toLocaleTimeString(), event_type: 'EMERGENCY_ESCALATION', details: '🚨 Automatic Emergency Package Dispatched & Auto-Call Ladder Activated' }
      ]
    }));
  };

  // 1-Tap Manual SOS Override
  const handleManualSOS = async () => {
    await handleAnalyze({
      problem_description: "🔴 Manual 1-Tap Emergency SOS Triggered by User",
      is_manual_emergency: true,
      duration_mins: 5,
      severity: "Severe"
    });
    setEmergencyState(prev => ({
      ...prev,
      status: 'EMERGENCY_ACTIVE',
      risk_score: 100,
      risk_level: 'Critical',
      events_timeline: [
        ...(prev.events_timeline || []),
        { time: new Date().toLocaleTimeString(), event_type: 'EMERGENCY_ESCALATION', details: '🚨 EMERGENCY MODE ACTIVATED (Manual SOS Override)' },
        { time: new Date().toLocaleTimeString(), event_type: 'CONTACT_NOTIFIED', details: 'Priority #1 Contact (Father: Ramesh Doe) alerted via SMS & Call' }
      ]
    }));
    setShowVerificationModal(false);
    setIsAutoCallLadderActive(true);
    setActiveTab('emergency_screen');
  };

  // Verification Modal Response
  const handleVerificationResponse = async (action) => {
    try {
      await fetchApi('/emergency/respond', { method: 'POST', body: JSON.stringify({ action }) });
    } catch (e) {}

    setShowVerificationModal(false);

    if (action === 'EMERGENCY') {
      setIsAutoCallLadderActive(true);
      setEmergencyState(prev => ({
        ...prev,
        status: 'EMERGENCY_ACTIVE',
        events_timeline: [
          ...(prev.events_timeline || []),
          { time: new Date().toLocaleTimeString(), event_type: 'EMERGENCY_ESCALATION', details: '🚨 EMERGENCY MODE ACTIVATED (User selected Emergency)' }
        ]
      }));
      setActiveTab('emergency_screen');
    } else if (action === 'TAKING_TIME') {
      setEmergencyState(prev => ({
        ...prev,
        status: 'TAKING_TIME',
        taking_time_active: true,
        events_timeline: [
          ...(prev.events_timeline || []),
          { time: new Date().toLocaleTimeString(), event_type: 'TAKING_TIME_SELECTED', details: 'User selected Taking Time to Explain — Escalation paused' }
        ]
      }));
      setActiveTab('report');
    } else if (action === 'IM_OKAY') {
      setSafetyCycleRemaining(300); // restart 5-minute cycle
      setEmergencyState(prev => ({
        ...prev,
        status: 'DISARMED',
        taking_time_active: false,
        events_timeline: [
          ...(prev.events_timeline || []),
          { time: new Date().toLocaleTimeString(), event_type: 'IM_OKAY_CONFIRMED', details: '✅ User confirmed I Am Okay — Safety confirmed, 5-minute cycle restarted' }
        ]
      }));
    }
  };

  // Demo Presets
  const handleApplyPreset = (presetKey) => {
    switch (presetKey) {
      case 'normal':
        handleAnalyze({ problem_description: "Mild tension headache for 10 minutes", severity: "Mild", duration_mins: 10 });
        setActiveTab('dashboard');
        break;
      case 'taking_time':
        handleAnalyze({ problem_description: "Chest discomfort after climbing stairs", severity: "Moderate", duration_mins: 20 });
        setShowVerificationModal(true);
        setActiveTab('report');
        break;
      case 'unresponsive':
        handleAnalyze({ problem_description: "Severe crushing chest pain radiating to left shoulder", severity: "Severe", duration_mins: 35 });
        setIsFastDemoMode(true);
        setShowVerificationModal(true);
        setActiveTab('report');
        break;
      case 'false_alarm':
        handleAnalyze({ problem_description: "Sudden sharp stitch in side while exercising", severity: "High", duration_mins: 15 });
        setShowVerificationModal(true);
        break;
      case 'manual_override':
        handleManualSOS();
        break;
      case 'doctor_handoff':
        setActiveTab('doctor');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#080b11] text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Vertical Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
        emergencyState={emergencyState}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header with 5-Minute Safety Loop, Demo Presets & SOS */}
        <header className="h-16 bg-[#0c101a]/95 border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* 5-Min Cycle Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Next Safety Check in:</span>
              <span className="font-mono font-bold text-white">{cycleDisplay}</span>
              <button
                onClick={() => {
                  setSafetyCycleRemaining(5);
                  setIsFastDemoMode(true);
                }}
                className="ml-1 px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 text-[10px] font-bold transition cursor-pointer"
                title="Fast-forward 5-minute timer to test automatic popup"
              >
                ⚡ Fast-Forward (5s)
              </button>
            </div>

            <div className="h-4 w-px bg-slate-800"></div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5" /> Presets:
            </span>
            <button onClick={() => handleApplyPreset('normal')} className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold shrink-0 cursor-pointer">
              1. Normal
            </button>
            <button onClick={() => handleApplyPreset('taking_time')} className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-yellow-400 border border-yellow-500/30 text-[11px] font-semibold shrink-0 cursor-pointer">
              2. Taking Time
            </button>
            <button onClick={() => handleApplyPreset('unresponsive')} className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-orange-400 border border-orange-500/30 text-[11px] font-semibold shrink-0 cursor-pointer">
              3. Unresponsive (Auto-Call)
            </button>
            <button onClick={() => handleApplyPreset('false_alarm')} className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-400 border border-teal-500/30 text-[11px] font-semibold shrink-0 cursor-pointer">
              4. False Alarm
            </button>
            <button onClick={() => handleApplyPreset('manual_override')} className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-red-400 border border-red-500/30 text-[11px] font-semibold shrink-0 cursor-pointer">
              5. Manual SOS
            </button>
            <button onClick={() => handleApplyPreset('doctor_handoff')} className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 border border-blue-500/30 text-[11px] font-semibold shrink-0 cursor-pointer">
              6. Doctor Summary
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              👤 Sign In / Switch Patient
            </button>

            <button
              onClick={handleManualSOS}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg shadow-red-600/40 border border-red-400/40 transition transform hover:scale-105 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>🔴 HELP ME</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* Active Auto-Call Ladder Dispatch Banner */}
          {isAutoCallLadderActive && (
            <AutoCallLadder
              emergencyPackage={{
                name: `${userProfile?.full_name} (${userProfile?.age}Y, ${userProfile?.gender})`,
                blood: userProfile?.blood_group,
                allergies: userProfile?.allergies?.map(a => `${a.allergen} (${a.reaction})`).join(', '),
                history: userProfile?.conditions?.map(c => c.name).join(', '),
                medications: 'Amlodipine (5mg), Aspirin (75mg)'
              }}
              onCancelEscalation={() => {
                setIsAutoCallLadderActive(false);
                setEmergencyState(prev => ({ ...prev, status: 'DISARMED' }));
              }}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              userProfile={userProfile}
              emergencyState={emergencyState}
              setActiveTab={setActiveTab}
              onManualSOS={handleManualSOS}
            />
          )}

          {activeTab === 'report' && (
            <ReportProblem
              onAnalyze={handleAnalyze}
              onManualSOS={handleManualSOS}
              lastAnalysisResult={lastAnalysis}
              emergencyState={emergencyState}
              onTriggerVerification={() => setShowVerificationModal(true)}
            />
          )}

          {activeTab === 'emergency_screen' && (
            <EmergencyScreen
              emergencyState={emergencyState}
              setActiveTab={setActiveTab}
              onPostFollowup={() => setActiveTab('post_emergency')}
            />
          )}

          {activeTab === 'history' && (
            <MedicalHistory
              medicalRecords={medicalRecords}
              userProfile={userProfile}
              onAddRecord={(rec) => {
                setMedicalRecords(prev => [rec, ...prev]);
                fetchApi('/profile/medical-history', { method: 'POST', body: JSON.stringify(rec) }).catch(()=>{});
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <HealthTimeline items={timelineItems} />
          )}

          {activeTab === 'wellness' && (
            <WellnessBMI 
              userProfile={userProfile} 
              onUpdateVitals={handleUpdateVitals} 
            />
          )}

          {activeTab === 'insurance' && (
            <Insurance insuranceData={insuranceData} />
          )}

          {activeTab === 'doctor' && (
            <DoctorPortal doctorSummaryData={doctorSummary} />
          )}

          {activeTab === 'contact_view' && (
            <ContactDashboard emergencyState={emergencyState} />
          )}

          {activeTab === 'post_emergency' && (
            <PostEmergency
              incidentId={emergencyState?.incident_id}
              onSubmitFollowup={() => {
                setActiveTab('dashboard');
                setIsAutoCallLadderActive(false);
                setEmergencyState(prev => ({ ...prev, status: 'IDLE', events_timeline: [] }));
              }}
            />
          )}
        </main>
      </div>

      {/* 2-Minute Verification Modal ("Are You Okay?") */}
      {(showVerificationModal || (emergencyState?.status === 'VERIFYING' && showVerificationModal)) && (
        <VerificationModal
          emergencyState={emergencyState}
          onRespond={handleVerificationResponse}
          isFastDemo={isFastDemoMode}
          onNoResponseTimeout={handleNoResponseTimeout}
        />
      )}

      {/* Auth & Patient Switcher Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={() => loadAllData()}
        onRegister={(newPatient) => {
          setUserProfile(prev => ({ ...prev, ...newPatient }));
          handleUpdateVitals({ height_cm: newPatient.height_cm, weight_kg: newPatient.weight_kg, bmi: 24.2, bmi_category: 'Normal Weight' });
        }}
        onSwitchDemoUser={(profile) => {
          setUserProfile(prev => ({
            ...prev,
            id: profile.id,
            full_name: profile.name,
            age: profile.age,
            gender: profile.gender,
            blood_group: profile.blood,
          }));
        }}
      />
    </div>
  );
}
