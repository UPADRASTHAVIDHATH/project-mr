import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from app.core.database import get_db
from app.models.schemas import User, MedicalRecord, HealthIncident, IncidentEvent
from app.services.history_matcher import detect_related_history
from app.services.risk_engine import calculate_mr_risk
from app.services.conversational import generate_dynamic_questions
from app.services.emergency_state import emergency_manager

router = APIRouter(prefix="/incidents", tags=["Health Incidents and AI Triage"])

class ReportProblemRequest(BaseModel):
    user_id: int = 1
    problem_description: str
    duration_mins: int = 15
    severity: str = "Moderate"
    previous_answers: Optional[Dict[str, str]] = None
    is_manual_emergency: bool = False

@router.post("/analyze")
async def analyze_health_problem(payload: ReportProblemRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    past_records = db.query(MedicalRecord).filter(MedicalRecord.user_id == user.id).all()
    has_related, related_note, matched_rec = detect_related_history(payload.problem_description, past_records)
    
    user_conds = [c.name for c in user.conditions]
    user_allgs = [a.allergen for a in user.allergies]
    
    risk_assessment = calculate_mr_risk(
        symptom_text=payload.problem_description,
        severity=payload.severity,
        duration_mins=payload.duration_mins,
        user_age=user.age,
        user_conditions=user_conds,
        user_allergies=user_allgs,
        has_related_history=has_related,
        related_history_note=related_note,
        is_manual_emergency=payload.is_manual_emergency
    )
    
    followup_questions = generate_dynamic_questions(payload.problem_description, payload.previous_answers or {})
    
    incident = HealthIncident(
        user_id=user.id,
        problem_description=payload.problem_description,
        duration_mins=payload.duration_mins,
        severity_input=payload.severity,
        related_history_found=has_related,
        related_history_note=related_note,
        risk_score=risk_assessment["risk_score"],
        risk_level=risk_assessment["risk_level"],
        xai_reasons_json=json.dumps(risk_assessment["xai_reasons"]),
        recommended_action=risk_assessment["recommended_action"],
        status="VERIFYING" if risk_assessment["risk_score"] >= 25 else "LOGGED",
        is_manual_override=payload.is_manual_emergency,
        escalation_timeout_sec=risk_assessment["escalation_timeout_sec"]
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    await emergency_manager.start_verification(
        incident_id=incident.id,
        user_name=user.full_name,
        problem=payload.problem_description,
        risk_score=risk_assessment["risk_score"],
        risk_level=risk_assessment["risk_level"],
        timeout_sec=risk_assessment["escalation_timeout_sec"]
    )
    
    if payload.is_manual_emergency:
        await emergency_manager.trigger_emergency_escalation(reason="User 1-Tap Emergency SOS Override")
    
    return {
        "incident_id": incident.id,
        "problem_description": payload.problem_description,
        "related_history": {
            "found": has_related,
            "note": related_note
        },
        "risk_assessment": risk_assessment,
        "followup_questions": followup_questions,
        "active_emergency_state": emergency_manager.get_current_state()
    }

@router.get("/history")
def get_incident_history(user_id: int = 1, db: Session = Depends(get_db)):
    incidents = db.query(HealthIncident).filter(HealthIncident.user_id == user_id).order_by(HealthIncident.id.desc()).all()
    return [
        {
            "id": inc.id,
            "date": inc.reported_at.strftime("%d %b %Y, %H:%M"),
            "problem": inc.problem_description,
            "risk_score": inc.risk_score,
            "risk_level": inc.risk_level,
            "status": inc.status,
            "related_history_found": inc.related_history_found,
            "is_manual_override": inc.is_manual_override
        }
        for inc in incidents
    ]
