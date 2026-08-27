# 🚨 PROJECT M.R — Intelligent Health Risk & Emergency Response System

> **SIH 2026 Hackathon Edition**  
> An intelligent, history-aware health monitoring, Explainable AI (XAI) risk assessment, and adaptive emergency verification system.

---

## 🌟 Core Innovation: Adaptive Safety Verification
Unlike traditional binary emergency apps that assume silence means death or immediately cause panic by dispatching ambulances, **Project M.R** performs **Adaptive Safety Verification**:

1. **"Are you okay?" Protocol**:
   - 🔴 **Emergency**: Immediate emergency escalation, priority contact notification, and live GPS broadcast.
   - 🟡 **Taking Time to Explain**: **Pauses escalation completely**, disarms countdown timer, and lets the user speak or type their symptoms calmly without panic.
   - 🟢 **I'm Okay**: Instantly disarms escalation and logs safety confirmation.
2. **Risk-Weighted Unresponsive Escalation**:
   - 🔴 **Critical Risk (75–100)**: 10s demo countdown
   - 🟠 **High Risk (50–74)**: 20s demo countdown
   - 🟡 **Moderate Risk (25–49)**: 40s demo countdown
   - 🟢 **Low Risk (0–24)**: 60s demo countdown
3. **Safety Guarantees & Protections**:
   - **Persistent 1-Tap Manual Emergency Override**: Pressing `🔴 I NEED HELP NOW` always overrides any low AI risk score (False-Negative Protection).
   - **Explainable AI (XAI)**: Numerical score (0-100) with transparent contributory factor chips (+45% Chest symptom, +15% History correlation).
   - **History-Aware Correlation**: Detects previous records (e.g. Aug 12 chest discomfort matching current complaint).
   - **Strict Insurance Isolation**: Insurance metadata is strictly administrative and 100% decoupled from clinical emergency risk.
   - **System Failure Resilience**: Deterministic safety fallbacks if AI is unavailable; cached location if GPS is unavailable.

---

## 🚀 One-Click Startup (Windows)

Simply double-click:
```bat
start.bat
```
Or start manually:

### 1. Backend (FastAPI + WebSockets + DB)
```bash
cd "C:\PROJECT MRackend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* **API Docs (Swagger UI)**: `http://localhost:8000/docs`
* **WebSocket Endpoint**: `ws://localhost:8000/api/v1/ws/emergency`

### 2. Frontend (React + Vite + Tailwind + Leaflet)
```bash
cd "C:\PROJECT MRrontend"
npm.cmd run dev
```
* **Web Application**: `http://localhost:5173`

---

## 🎯 6 Hackathon Judging Demo Presets (Top Navigation Bar)

1. **Preset 1: Normal (Low Risk)**: Minor tension headache $ightarrow$ Score: 18/100 $ightarrow$ General hydration guidance.
2. **Preset 2: Taking Time Flow**: Chest discomfort $ightarrow$ Modal appears $ightarrow$ Click *🟡 Taking Time* $ightarrow$ Countdown halts, user continues typing/speaking freely.
3. **Preset 3: Unresponsive Auto-Escalation**: Severe crushing chest pain $ightarrow$ Score: 82/100 $ightarrow$ 20s countdown expires $ightarrow$ Priority #1 Contact (Father) alerted $ightarrow$ Live event timeline logs each step.
4. **Preset 4: False Alarm Resolution**: Sudden stitch $ightarrow$ User clicks *🟢 I'm Okay* $ightarrow$ Disarmed and safety confirmation recorded.
5. **Preset 5: Manual Emergency Override**: Low risk case $ightarrow$ User clicks *🔴 HELP ME* $ightarrow$ AI overridden, Emergency Mode engaged instantly.
6. **Preset 6: Doctor Summary Handoff**: View & Print/Export the complete Clinical Emergency Summary for paramedics/doctors.
