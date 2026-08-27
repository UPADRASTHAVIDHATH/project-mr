from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.models.schemas import User, MedicalRecord, Condition, Allergy, Medication, Surgery, EmergencyContact, InsurancePolicy, Consent

router = APIRouter(prefix="/profile", tags=["Profile and Health Records"])

class VitalsUpdate(BaseModel):
    height_cm: float
    weight_kg: float

class MedicalRecordCreate(BaseModel):
    record_date: str
    problem: str
    category: str = "Cardiovascular"
    symptoms: Optional[str] = None
    severity: str = "Moderate"
    doctor_diagnosis: Optional[str] = None
    treatment: Optional[str] = None
    hospital_doctor: Optional[str] = None
    notes: Optional[str] = None

class ContactCreate(BaseModel):
    name: str
    relationship_type: str
    phone: str
    priority: int
    channel: str = "SMS + Call"

@router.get("/me")
def get_user_profile(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    height_m = user.height_cm / 100.0
    bmi = round(user.weight_kg / (height_m * height_m), 1) if height_m > 0 else 22.0
    
    if bmi < 18.5:
        bmi_category = "Underweight"
        diet_advice = "Focus on nutrient-dense meals with balanced healthy fats and lean proteins."
        exercise_advice = "Engage in moderate resistance training to build healthy muscle mass."
    elif bmi < 25.0:
        bmi_category = "Normal Weight"
        diet_advice = "Maintain balanced nutrition with daily whole grains, vegetables, and lean proteins."
        exercise_advice = "Aim for 150 minutes of moderate aerobic activity (brisk walking) per week."
    elif bmi < 30.0:
        bmi_category = "Overweight"
        diet_advice = "Prioritize high-fiber complex carbohydrates and reduce ultra-processed sodium-rich snacks."
        exercise_advice = "Gradually incorporate daily 30-minute cardio and light interval training."
    else:
        bmi_category = "Obese"
        diet_advice = "Consider consulting a certified clinical dietitian for structured caloric management."
        exercise_advice = "Low-impact exercises such as swimming or stationery cycling to protect joints."

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "age": user.age,
        "gender": user.gender,
        "date_of_birth": user.date_of_birth,
        "phone": user.phone,
        "address": user.address,
        "blood_group": user.blood_group,
        "height_cm": user.height_cm,
        "weight_kg": user.weight_kg,
        "bmi": bmi,
        "bmi_category": bmi_category,
        "diet_advice": diet_advice,
        "exercise_advice": exercise_advice,
        "monitoring_status": "Active (🟢 M.R Online)",
        "conditions": [{"id": c.id, "name": c.name, "year": c.diagnosed_year, "status": c.status} for c in user.conditions],
        "allergies": [{"id": a.id, "allergen": a.allergen, "reaction": a.reaction, "severity": a.severity} for a in user.allergies],
        "medications": [{"id": m.id, "name": m.name, "dosage": m.dosage, "frequency": m.frequency} for m in user.medications],
        "surgeries": [{"id": s.id, "procedure": s.procedure, "year": s.year, "hospital": s.hospital} for s in user.surgeries],
        "emergency_contacts": [
            {"id": ec.id, "name": ec.name, "relationship": ec.relationship_type, "phone": ec.phone, "priority": ec.priority, "channel": ec.channel}
            for ec in sorted(user.emergency_contacts, key=lambda x: x.priority)
        ],
        "consents": {
            "store_health_data": user.consents.store_health_data if user.consents else True,
            "analyze_health_data": user.consents.analyze_health_data if user.consents else True,
            "share_location_emergency": user.consents.share_location_emergency if user.consents else True,
            "contact_emergency_contacts": user.consents.contact_emergency_contacts if user.consents else True,
            "share_relevant_medical_info": user.consents.share_relevant_medical_info if user.consents else True
        }
    }

@router.post("/update-vitals")
def update_vitals(payload: VitalsUpdate, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.height_cm = payload.height_cm
    user.weight_kg = payload.weight_kg
    db.commit()
    return {"status": "success", "height_cm": user.height_cm, "weight_kg": user.weight_kg}

@router.get("/medical-history")
def get_medical_history(user_id: int = 1, db: Session = Depends(get_db)):
    records = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).all()
    return [
        {
            "id": r.id,
            "record_date": r.record_date,
            "problem": r.problem,
            "category": r.category,
            "symptoms": r.symptoms,
            "severity": r.severity,
            "doctor_diagnosis": r.doctor_diagnosis,
            "treatment": r.treatment,
            "hospital_doctor": r.hospital_doctor,
            "notes": r.notes
        }
        for r in records
    ]

@router.post("/medical-history")
def add_medical_record(payload: MedicalRecordCreate, user_id: int = 1, db: Session = Depends(get_db)):
    rec = MedicalRecord(
        user_id=user_id,
        record_date=payload.record_date,
        problem=payload.problem,
        category=payload.category,
        symptoms=payload.symptoms,
        severity=payload.severity,
        doctor_diagnosis=payload.doctor_diagnosis,
        treatment=payload.treatment,
        hospital_doctor=payload.hospital_doctor,
        notes=payload.notes
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return {"status": "success", "id": rec.id}

@router.get("/health-timeline")
def get_health_timeline(user_id: int = 1, db: Session = Depends(get_db)):
    records = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).all()
    timeline = []
    for r in records:
        timeline.append({
            "date": r.record_date,
            "type": "MEDICAL_RECORD",
            "title": r.problem,
            "subtitle": f"Diagnosis: {r.doctor_diagnosis or 'Outpatient evaluation'} • {r.hospital_doctor or 'Clinic'}",
            "severity": r.severity,
            "tag": r.category
        })
    return timeline

@router.get("/insurance")
def get_insurance_info(user_id: int = 1, db: Session = Depends(get_db)):
    policy = db.query(InsurancePolicy).filter(InsurancePolicy.user_id == user_id).first()
    if not policy:
        return {"has_policy": False}
    import json
    return {
        "has_policy": True,
        "provider": policy.provider,
        "policy_number": policy.policy_number,
        "coverage_type": policy.coverage_type,
        "sum_insured_inr": f"₹{policy.sum_insured_inr:,}",
        "valid_until": policy.valid_until,
        "claims": json.loads(policy.claims_json or "[]"),
        "note": "Administrative metadata only. Decoupled from medical risk calculation."
    }
