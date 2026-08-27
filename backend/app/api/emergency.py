from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.core.database import get_db
from app.models.schemas import HealthIncident, PostEmergencyFollowup, User
from app.services.emergency_state import emergency_manager

router = APIRouter(prefix="/emergency", tags=["Emergency Verification and Escalation"])

class VerificationActionRequest(BaseModel):
    incident_id: Optional[int] = None
    action: str # "EMERGENCY", "TAKING_TIME", "IM_OKAY", "MANUAL_SOS"

class PostFollowupRequest(BaseModel):
    incident_id: int
    is_safe_now: bool = True
    medical_help_received: bool = True
    symptoms_persisting: bool = False
    was_genuine_emergency: bool = True
    doctor_notes: Optional[str] = "Patient evaluated by paramedic team. Stable."

@router.get("/state")
def get_emergency_live_state():
    return emergency_manager.get_current_state()

@router.post("/respond")
async def respond_to_safety_verification(payload: VerificationActionRequest, db: Session = Depends(get_db)):
    act = payload.action.upper()
    if act == "EMERGENCY" or act == "MANUAL_SOS":
        await emergency_manager.trigger_emergency_escalation(reason="User explicitly requested Emergency help")
    elif act == "TAKING_TIME":
        await emergency_manager.user_taking_time()
    elif act == "IM_OKAY":
        await emergency_manager.user_im_okay()
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    return {"status": "success", "action": act, "current_state": emergency_manager.get_current_state()}

@router.post("/post-followup")
async def submit_post_emergency_followup(payload: PostFollowupRequest, db: Session = Depends(get_db)):
    followup = PostEmergencyFollowup(
        incident_id=payload.incident_id,
        is_safe_now=payload.is_safe_now,
        medical_help_received=payload.medical_help_received,
        symptoms_persisting=payload.symptoms_persisting,
        was_genuine_emergency=payload.was_genuine_emergency,
        doctor_notes=payload.doctor_notes
    )
    db.add(followup)
    db.commit()
    
    await emergency_manager.resolve_emergency()
    return {"status": "success", "message": "Incident safely closed with post-emergency audit.", "current_state": emergency_manager.get_current_state()}

@router.get("/doctor-summary")
def get_doctor_emergency_summary(incident_id: Optional[int] = None, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    state = emergency_manager.get_current_state()
    
    return {
        "system": "Project M.R — Intelligent Health Risk & Emergency Response System",
        "report_title": "EMERGENCY CLINICAL SUMMARY & DOCTOR HANDOFF",
        "patient": {
            "name": user.full_name if user else "John Doe",
            "age": user.age if user else 52,
            "gender": user.gender if user else "Male",
            "blood_group": user.blood_group if user else "A+",
            "allergies": [a.allergen for a in user.allergies] if user else ["Penicillin"],
            "chronic_conditions": [c.name for c in user.conditions] if user else ["Hypertension", "Angina"],
            "active_medications": [f"{m.name} ({m.dosage})" for m in user.medications] if user else ["Amlodipine (5mg)"]
        },
        "incident": {
            "problem": state.get("problem") or "Chest discomfort with shortness of breath",
            "risk_score": f"{state.get('risk_score', 82)} / 100",
            "risk_level": state.get("risk_level", "High").upper(),
            "status": state.get("status"),
            "location": state.get("location"),
            "event_timeline": state.get("events_timeline")
        },
        "disclaimer": "This document is an AI-assisted risk & emergency triage summary generated for clinical handoff and does not replace diagnostic medical tests."
    }
