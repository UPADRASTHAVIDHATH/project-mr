import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional

class EmergencyStateManager:
    """
    Central server-side real-time state machine for Project M.R.
    Maintains active incidents, live countdown timers, second-by-second event timelines,
    and handles simulated contact & emergency service dispatches.
    """
    def __init__(self):
        self.active_state: Dict[str, Any] = {
            "status": "IDLE", # IDLE, VERIFYING, TAKING_TIME, EMERGENCY_ACTIVE, DISARMED, RESOLVED
            "incident_id": None,
            "user_id": None,
            "patient_name": "John Doe",
            "problem": None,
            "risk_score": 0,
            "risk_level": "Low",
            "timeout_seconds": 20,
            "remaining_seconds": 20,
            "is_timer_running": False,
            "taking_time_active": False,
            "location": {
                "latitude": 12.9716,
                "longitude": 77.5946,
                "address": "Koramangala 5th Block, Bengaluru, India",
                "accuracy": "5.2 meters (High Accuracy GPS)",
                "is_cached": False
            },
            "contacts_notified": [],
            "events_timeline": []
        }
        self._timer_task: Optional[asyncio.Task] = None
        self._listeners: List[Any] = []

    def get_current_state(self) -> Dict[str, Any]:
        return self.active_state

    def log_event(self, event_type: str, details: str, icon: str = "activity"):
        now_str = datetime.now().strftime("%H:%M:%S")
        event = {
            "time": now_str,
            "event_type": event_type,
            "details": details,
            "icon": icon
        }
        self.active_state["events_timeline"].append(event)
        return event

    async def broadcast_state(self):
        # Notify connected WebSockets
        for listener in list(self._listeners):
            try:
                await listener.send_json(self.active_state)
            except Exception:
                if listener in self._listeners:
                    self._listeners.remove(listener)

    def register_ws(self, websocket):
        self._listeners.append(websocket)

    def unregister_ws(self, websocket):
        if websocket in self._listeners:
            self._listeners.remove(websocket)

    async def start_verification(self, incident_id: int, user_name: str, problem: str, risk_score: int, risk_level: str, timeout_sec: int):
        # Cancel any previous timer
        if self._timer_task and not self._timer_task.done():
            self._timer_task.cancel()
            
        self.active_state["status"] = "VERIFYING"
        self.active_state["incident_id"] = incident_id
        self.active_state["patient_name"] = user_name
        self.active_state["problem"] = problem
        self.active_state["risk_score"] = risk_score
        self.active_state["risk_level"] = risk_level
        self.active_state["timeout_seconds"] = timeout_sec
        self.active_state["remaining_seconds"] = timeout_sec
        self.active_state["is_timer_running"] = True
        self.active_state["taking_time_active"] = False
        self.active_state["contacts_notified"] = []
        self.active_state["events_timeline"] = []
        
        # Log initial lifecycle events
        self.log_event("PROBLEM_REPORTED", f"Health problem reported: '{problem}'", "file-text")
        self.log_event("RISK_CALCULATED", f"M.R Risk Engine assessed score {risk_score}/100 ({risk_level.upper()})", "bar-chart-2")
        self.log_event("VERIFICATION_POPUP", f"'Are you okay?' safety verification popup shown. Adaptive timeout: {timeout_sec}s", "help-circle")
        
        await self.broadcast_state()
        
        # Start server-side asynchronous countdown
        self._timer_task = asyncio.create_task(self._run_countdown(timeout_sec))

    async def _run_countdown(self, seconds: int):
        try:
            for remaining in range(seconds, 0, -1):
                self.active_state["remaining_seconds"] = remaining
                await self.broadcast_state()
                await asyncio.sleep(1)
                
                # Check if state changed during sleep
                if self.active_state["status"] != "VERIFYING" or not self.active_state["is_timer_running"]:
                    return
                    
            # Timeout expired without response -> Risk-based Adaptive Escalation
            self.active_state["remaining_seconds"] = 0
            self.active_state["is_timer_running"] = False
            self.log_event("TIMEOUT_EXPIRED", f"No response received within {seconds}s adaptive window", "clock")
            await self.trigger_emergency_escalation(reason="Unresponsive safety verification timeout")
        except asyncio.CancelledError:
            pass

    async def user_taking_time(self):
        """User clicked 🟡 Taking Time to Explain. Pause escalation completely."""
        if self._timer_task and not self._timer_task.done():
            self._timer_task.cancel()
            
        self.active_state["status"] = "TAKING_TIME"
        self.active_state["is_timer_running"] = False
        self.active_state["taking_time_active"] = True
        self.log_event("TAKING_TIME_SELECTED", "User selected 'Taking Time to Explain' — Emergency escalation paused indefinitely", "pause-circle")
        await self.broadcast_state()

    async def user_im_okay(self):
        """User clicked 🟢 I'm Okay. Disarm escalation and log false-alarm resolution."""
        if self._timer_task and not self._timer_task.done():
            self._timer_task.cancel()
            
        self.active_state["status"] = "DISARMED"
        self.active_state["is_timer_running"] = False
        self.active_state["taking_time_active"] = False
        self.log_event("IM_OKAY_CONFIRMED", "User confirmed 'I'm Okay' — Emergency verification cancelled & disarmed", "check-circle-2")
        await self.broadcast_state()

    async def trigger_emergency_escalation(self, reason: str = "Manual SOS Override"):
        """Enters 🚨 EMERGENCY MODE, alerts contacts by priority, shares GPS."""
        if self._timer_task and not self._timer_task.done():
            self._timer_task.cancel()
            
        self.active_state["status"] = "EMERGENCY_ACTIVE"
        self.active_state["is_timer_running"] = False
        self.active_state["taking_time_active"] = False
        
        self.log_event("EMERGENCY_ESCALATION", f"🚨 EMERGENCY MODE ACTIVATED ({reason})", "alert-triangle")
        
        # Priority Contact Escalation
        self.log_event("CONTACT_NOTIFIED", "Priority #1 Contact (Father: Ramesh Doe • +91 98765 43210) alerted via SMS & Call", "phone-call")
        self.log_event("LOCATION_BROADCAST", f"Emergency GPS shared (Lat: {self.active_state['location']['latitude']}, Lon: {self.active_state['location']['longitude']})", "map-pin")
        self.log_event("SERVICE_SIMULATION", "Simulated Emergency Medical Services (EMS) escalation packet transmitted", "shield-alert")
        
        self.active_state["contacts_notified"] = [
            {"name": "Ramesh Doe (Father)", "priority": 1, "status": "Delivered • Link Opened", "time": datetime.now().strftime("%H:%M:%S")},
            {"name": "Anita Doe (Mother)", "priority": 2, "status": "Delivered", "time": datetime.now().strftime("%H:%M:%S")},
            {"name": "Dr. Arvind (Physician)", "priority": 3, "status": "Queued", "time": datetime.now().strftime("%H:%M:%S")}
        ]
        
        await self.broadcast_state()

    async def resolve_emergency(self, post_data: dict = None):
        """Closes out incident with post-emergency follow-up."""
        self.active_state["status"] = "RESOLVED"
        self.log_event("INCIDENT_RESOLVED", "Post-emergency follow-up recorded. Emergency protocol safely closed.", "archive")
        await self.broadcast_state()

emergency_manager = EmergencyStateManager()
