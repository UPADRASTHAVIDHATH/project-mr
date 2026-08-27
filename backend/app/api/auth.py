from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.models.schemas import User, Consent

router = APIRouter(prefix="/auth", tags=["Authentication and Consent"])

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    age: int
    gender: str
    date_of_birth: Optional[str] = "1974-05-12"
    phone: str
    address: Optional[str] = "Koramangala, Bengaluru"
    blood_group: str = "A+"
    height_cm: float = 172.0
    weight_kg: float = 74.0
    store_health_data: bool = True
    analyze_health_data: bool = True
    share_location_emergency: bool = True
    contact_emergency_contacts: bool = True
    share_relevant_medical_info: bool = True

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already registered.")
        
    new_user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        age=payload.age,
        gender=payload.gender,
        date_of_birth=payload.date_of_birth,
        phone=payload.phone,
        address=payload.address,
        blood_group=payload.blood_group,
        height_cm=payload.height_cm,
        weight_kg=payload.weight_kg
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    consent = Consent(
        user_id=new_user.id,
        store_health_data=payload.store_health_data,
        analyze_health_data=payload.analyze_health_data,
        share_location_emergency=payload.share_location_emergency,
        contact_emergency_contacts=payload.contact_emergency_contacts,
        share_relevant_medical_info=payload.share_relevant_medical_info
    )
    db.add(consent)
    db.commit()
    
    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "name": new_user.full_name})
    return {"status": "success", "token": token, "user": {"id": new_user.id, "email": new_user.email, "full_name": new_user.full_name}}

@router.post("/login")
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    token = create_access_token({"sub": str(user.id), "email": user.email, "name": user.full_name})
    return {
        "status": "success",
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "age": user.age,
            "blood_group": user.blood_group,
            "phone": user.phone
        }
    }
