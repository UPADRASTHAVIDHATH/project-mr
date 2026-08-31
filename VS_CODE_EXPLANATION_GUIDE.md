# 🎯 Project M.R — VS Code Demonstration & Architecture Master Guide

Welcome to your complete **cheat-sheet for presenting and defending Project M.R** in VS Code during your hackathon evaluation or viva!

---

## 🗂️ 1. Quick File Map — "Which File Does What?"

When a judge asks about a specific feature, use this quick map to jump directly to the exact file:

| Feature / Question | Open This File | Key Function / Component |
| :--- | :--- | :--- |
| **5-Minute Background Safety Loop** | `frontend/src/App.jsx` (Lines ~88-112) | `useEffect(() => setInterval(...), [])` managing `safetyCycleRemaining` |
| **"Are you okay?" 2-Min Countdown Dialog** | `frontend/src/components/VerificationModal.jsx` | Circular SVG progress ring & 3 response handlers |
| **2-Minute No-Response Auto-Escalation** | `frontend/src/App.jsx` & `backend/app/services/emergency_state.py` | `handleNoResponseTimeout()` & `_run_countdown()` |
| **Sequential Auto-Call Ladder (Contacts #1→#4)** | `frontend/src/components/AutoCallLadder.jsx` | `contactsLadder` array & simulated step-by-step dialer |
| **Explainable AI (XAI) Risk Engine (0-100)** | `backend/app/services/risk_engine.py` | `calculate_mr_risk()` with factor weight additions |
| **History-Aware Correlation Matcher** | `backend/app/services/history_matcher.py` | `detect_related_history()` with `SYSTEM_CLUSTERS` |
| **50/50 Split-Screen Triage & AI Chat** | `frontend/src/pages/ReportProblem.jsx` | Left (Intake) / Right (AI Assistant & Causality) |
| **Pathophysiology & Disease Causality** | `frontend/src/components/DiseaseExplanation.jsx` | 4-Part breakdown: Points, Causes, Habits, Corrective Plan |
| **Real Browser GPS Geolocation** | `frontend/src/components/MapLocation.jsx` | `navigator.geolocation.getCurrentPosition()` |
| **Real-time WebSockets & Timeline** | `backend/app/services/emergency_state.py` | `EmergencyStateManager` & `broadcast_state()` |
| **BMI Live Calculation & Dashboard Sync** | `frontend/src/pages/WellnessBMI.jsx` | Height/Weight sliders & `handleUpdateVitals()` |
| **Doctor / Paramedic HL7 Summary** | `frontend/src/components/DoctorSummary.jsx` | Structured clinical handoff card & PDF simulator |
| **Authentication & Medical Consent Guardrails** | `frontend/src/components/AuthModal.jsx` | Explicit GDPR/HIPAA-style consent checkboxes & Persona Switcher |

---

## 🔍 2. Step-by-Step Code Walkthrough in VS Code

### 📍 Scene 1: The Multi-Factor Risk Engine & XAI (Explainable AI)
* **File to Open**: `backend/app/services/risk_engine.py`
* **What to Show the Judge**:
  1. **Lines 25–36 (`Manual SOS Override`)**:
     Show how hitting `🔴 HELP ME` immediately sets `risk_score = 100` and `risk_level = Critical`, bypassing AI scores.
     > *"Judge, our first clinical rule is safety: an AI model should never prevent a dying patient from getting help."*
  2. **Lines 43–61 (`Red-Flag Symptom Weighting`)**:
     Show `critical_symptoms` list (`"chest pain"`, `"can't breathe"`, `"stroke"`).
     If detected, it adds **+45%** to the score and appends an explainable reason to `xai_reasons`.
  3. **Lines 86–96 (`History & Chronic Condition Multipliers`)**:
     Show how past medical history adds **+15%** and pre-existing conditions like hypertension add **+10%**.
  4. **Lines 101–117 (`Deterministic Risk Tiers`)**:
     Show how scores are bucketed into `Critical` (≥75), `High` (≥50), `Moderate` (≥25), `Low` (<25).

---

### 📍 Scene 2: History-Aware Correlation Matcher
* **File to Open**: `backend/app/services/history_matcher.py`
* **What to Show the Judge**:
  1. **Lines 6–12 (`SYSTEM_CLUSTERS`)**:
     Explain how symptoms are grouped into anatomical clusters (`cardiac`, `respiratory`, `neurological`, `gastrointestinal`, `allergic`).
  2. **Lines 14–49 (`detect_related_history`)**:
     Show how the current complaint is matched against past electronic health records:
     > *"When John reports chest tightness, M.R scans his past records and discovers his 12 Aug 2026 record for 'Chest discomfort (Suspected angina)'. It links this context automatically."*

---

### 📍 Scene 3: The Exact 5-Minute Safety Loop & 2-Minute No-Response Protocol
* **Files to Open**: 
  * `frontend/src/App.jsx` (Lines 88–112)
  * `frontend/src/components/VerificationModal.jsx`
  * `backend/app/services/emergency_state.py` (Lines 95–113)
* **What to Show the Judge**:
  1. **The 5-Minute Background Interval**:
     Show the `setInterval` in `App.jsx` that counts down from `300s` (`05:00`). Every 5 minutes, it automatically launches the Safety Check. Show the `⚡ Fast-Forward (5s)` button in the header that lets judges test it instantly.
  2. **The 3 Signature Options in `VerificationModal.jsx`**:
     * `🟢 I'M OKAY`: Confirms safety and restarts the 5-minute cycle.
     * `🟡 TAKING TIME`: Pauses emergency timers and opens text/voice triage so the user can describe without false alerts.
     * `🔴 EMERGENCY`: Triggers immediate escalation.
  3. **The 2-Minute No-Response Timeout (`handleNoResponseTimeout`)**:
     If the user does not touch any button for 120 seconds, M.R detects `⚠️ No response detected` and automatically launches the **Auto-Call Ladder**.

---

### 📍 Scene 4: Sequential Auto-Call Ladder & Privacy Emergency Package
* **File to Open**: `frontend/src/components/AutoCallLadder.jsx`
* **What to Show the Judge**:
  1. **Lines 8–13 (`contactsLadder`)**:
     Show the priority ladder: `Priority #1 Father (Ramesh)` $ightarrow$ `Priority #2 Mother (Anita)` $ightarrow$ `Priority #3 Brother (Vikram)` $ightarrow$ `Priority #4 EMS (112)`.
  2. **Lines 77–110 (`Privacy-Limited Emergency Information Package`)**:
     Show that M.R does *not* leak the user's entire private medical diary, but sends a strictly curated emergency bundle:
     * Patient Name, Age, Blood Group
     * Critical Allergies (Penicillin guardrail)
     * Known History & Active Medications
     * Real-time GPS coordinates
     * Trigger Reason: *"User has not responded to M.R safety check for 2 minutes."*

---

### 📍 Scene 5: Disease Causality Engine & 50/50 Split Screen
* **Files to Open**:
  * `frontend/src/pages/ReportProblem.jsx`
  * `frontend/src/components/DiseaseExplanation.jsx`
* **What to Show the Judge**:
  1. **50/50 Split Layout**:
     Show the 2-column grid in `ReportProblem.jsx`: Left side is for input (Voice speech-to-text, chips, duration); Right side is for the live AI Assistant, 0-100 Risk Gauge, and Pathology breakdown.
  2. **4-Part Clinical Explanation in `DiseaseExplanation.jsx`**:
     * **1. What is Happening Inside the Body (In Points)**
     * **2. Underlying Causes & Medical Etiology**
     * **3. Defective Habits & Lifestyle Triggers (What Went Wrong)**
     * **4. Corrective Clinical Action Plan**

---

### 📍 Scene 6: Real-Time Browser GPS Geolocation
* **File to Open**: `frontend/src/components/MapLocation.jsx`
* **What to Show the Judge**:
  1. **Lines 18–44 (`fetchRealLocation`)**:
     Show `navigator.geolocation.getCurrentPosition(...)` with `enableHighAccuracy: true`.
     > *"Judges, we don't hardcode fake locations. When emergency mode triggers, M.R queries the real device GPS hardware and renders an interactive OpenStreetMap marker centered on the user's exact coordinates."*

---

## 🏆 3. Quick Hackathon Pitch Script (2-Minute Demo)

1. **The Hook (15s)**:
   > *"Existing health apps are passive and dangerous—if you are dying, they ask you to fill out 20 vital fields. Binary emergency apps panic and call 911 on false alarms. We built **Project M.R**—the first intelligent health risk & adaptive emergency response system."*

2. **The Innovation (30s)**:
   > *"M.R runs an active 5-minute safety monitoring cycle. When a check triggers, it asks 'Are you okay?' with three options: 🔴 Emergency, 🟡 Taking Time to Explain, and 🟢 I'm Okay. If a user clicks 'Taking Time', it pauses escalation completely and lets them speak or type without fear."*

3. **The Unresponsive Safety Net (30s)**:
   > *"If an elderly or high-risk cardiac patient experiences sudden incapacitation and cannot respond within 2 minutes, M.R detects the silence. It packages their blood group, allergies, and real-time GPS, and initiates a sequential auto-call escalation across prioritized family contacts and EMS."*

4. **The XAI & Clinical Intelligence (30s)**:
   > *"Everything is transparent: our Explainable AI (XAI) engine correlates current complaints with past health records, details the exact physiological causes and defective lifestyle habits, and provides a 1-tap manual SOS override that always guarantees immediate help."*
