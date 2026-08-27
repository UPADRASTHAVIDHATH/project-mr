import json
from typing import Dict, List, Any
from app.core.config import settings

def calculate_mr_risk(
    symptom_text: str,
    severity: str = "Moderate",
    duration_mins: int = 15,
    user_age: int = 45,
    user_conditions: List[str] = None,
    user_allergies: List[str] = None,
    has_related_history: bool = False,
    related_history_note: str = None,
    is_manual_emergency: bool = False
) -> Dict[str, Any]:
    """
    Deterministic & Clinical Multi-Factor Risk Assessment Engine.
    Produces a numerical score (0-100), risk tier, and human-readable XAI factor weights.
    
    Safety Guarantee: If is_manual_emergency is True, AI score is overridden to 100 CRITICAL.
    """
    user_conditions = user_conditions or []
    user_allergies = user_allergies or []
    
    # 1. Immediate Manual Emergency Override (False-Negative Protection)
    if is_manual_emergency:
        return {
            "risk_score": 100,
            "risk_level": "Critical",
            "xai_reasons": [
                {"factor": "Manual Emergency Override", "impact": "+100%", "type": "override", "detail": "User activated persistent one-tap emergency SOS."}
            ],
            "recommended_action": "Emergency protocol activated immediately by user override.",
            "escalation_timeout_sec": settings.DEMO_TIMEOUTS["CRITICAL"],
            "disclaimer": settings.DISCLAIMER
        }
        
    symptom_lower = (symptom_text or "").lower()
    
    base_score = 10
    xai_reasons = []
    
    # Check Red-Flag High-Risk Symptoms
    critical_symptoms = ["chest pain", "chest discomfort", "crushing chest", "heart attack", "can't breathe", "difficulty breathing", "suffocating", "stroke", "face drooping", "speech slurred", "severe bleeding", "unconscious", "anaphylaxis"]
    moderate_symptoms = ["dizziness", "severe headache", "palpitations", "fainting", "high fever", "numbness", "vomiting blood", "chest burning", "weakness"]
    
    is_critical_sym = any(s in symptom_lower for s in critical_symptoms)
    is_moderate_sym = any(s in symptom_lower for s in moderate_symptoms)
    
    if is_critical_sym:
        base_score += 45
        matched = [s for s in critical_symptoms if s in symptom_lower][0]
        xai_reasons.append({"factor": f"High-Risk Symptom ('{matched.title()}')", "impact": "+45%", "type": "critical", "detail": "Reported symptoms match clinical red-flag indicator."})
    elif is_moderate_sym:
        base_score += 25
        matched = [s for s in moderate_symptoms if s in symptom_lower][0]
        xai_reasons.append({"factor": f"Elevated Symptom ('{matched.title()}')", "impact": "+25%", "type": "moderate", "detail": "Symptom warrants focused observation."})
    else:
        base_score += 10
        xai_reasons.append({"factor": "General Health Complaint", "impact": "+10%", "type": "low", "detail": "No immediate acute red-flag keywords detected."})

    # Severity Modifier
    sev_upper = severity.upper()
    if sev_upper in ["SEVERE", "HIGH", "CRITICAL"]:
        base_score += 20
        xai_reasons.append({"factor": "High Subjective Severity", "impact": "+20%", "type": "warning", "detail": "User reported high symptom intensity."})
    elif sev_upper == "MODERATE":
        base_score += 10
        xai_reasons.append({"factor": "Moderate Severity", "impact": "+10%", "type": "info", "detail": "Reported moderate symptom discomfort."})

    # Duration Modifier
    if duration_mins >= 30:
        base_score += 10
        xai_reasons.append({"factor": f"Prolonged Duration ({duration_mins} mins)", "impact": "+10%", "type": "warning", "detail": "Symptoms persisting over 30 minutes without resolution."})
    elif duration_mins >= 15:
        base_score += 5

    # Age Modifier
    if user_age >= 60 and (is_critical_sym or is_moderate_sym):
        base_score += 12
        xai_reasons.append({"factor": f"Age Modifier (Age {user_age})", "impact": "+12%", "type": "risk", "detail": "Increased vulnerability profile for acute conditions."})
    elif user_age >= 50 and is_critical_sym:
        base_score += 8
        xai_reasons.append({"factor": f"Age Factor (Age {user_age})", "impact": "+8%", "type": "risk", "detail": "Cardiovascular risk weighting applied."})

    # Related Medical History Match
    if has_related_history:
        base_score += 15
        xai_reasons.append({"factor": "History Correlation Match", "impact": "+15%", "type": "history", "detail": related_history_note or "Similar episode previously recorded in medical history."})

    # Chronic Conditions Match
    if any(c.lower() in ["hypertension", "angina", "diabetes", "asthma", "heart disease"] for c in user_conditions):
        if is_critical_sym or is_moderate_sym:
            base_score += 10
            xai_reasons.append({"factor": f"Pre-existing Conditions ({', '.join(user_conditions)})", "impact": "+10%", "type": "history", "detail": "Existing chronic diagnosis increases risk progression."})

    # Clamp Score 0 - 100
    final_score = max(0, min(100, base_score))
    
    # Categorize Risk Level & Map Configurable Demo Timeout
    if final_score >= 75:
        risk_level = "Critical"
        timeout_sec = settings.DEMO_TIMEOUTS["CRITICAL"]
        action = "Immediate safety verification required. Prepare emergency escalation if unresponsive."
    elif final_score >= 50:
        risk_level = "High"
        timeout_sec = settings.DEMO_TIMEOUTS["HIGH"]
        action = "Prompt medical evaluation strongly recommended. Active monitoring engaged."
    elif final_score >= 25:
        risk_level = "Moderate"
        timeout_sec = settings.DEMO_TIMEOUTS["MODERATE"]
        action = "Rest and monitor symptoms closely. Consult your doctor if symptoms worsen."
    else:
        risk_level = "Low"
        timeout_sec = settings.DEMO_TIMEOUTS["LOW"]
        action = "Maintain regular hydration and rest. Standard health monitoring active."

    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "xai_reasons": xai_reasons,
        "recommended_action": action,
        "escalation_timeout_sec": timeout_sec,
        "disclaimer": settings.DISCLAIMER
    }
