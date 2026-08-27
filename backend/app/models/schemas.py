from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=True)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=True)
    blood_group = Column(String, nullable=False)
    height_cm = Column(Float, nullable=False, default=172.0)
    weight_kg = Column(Float, nullable=False, default=74.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    consents = relationship("Consent", back_populates="user", uselist=False, cascade="all, delete-orphan")
    medical_records = relationship("MedicalRecord", back_populates="user", cascade="all, delete-orphan")
    conditions = relationship("Condition", back_populates="user", cascade="all, delete-orphan")
    allergies = relationship("Allergy", back_populates="user", cascade="all, delete-orphan")
    medications = relationship("Medication", back_populates="user", cascade="all, delete-orphan")
    surgeries = relationship("Surgery", back_populates="user", cascade="all, delete-orphan")
    emergency_contacts = relationship("EmergencyContact", back_populates="user", cascade="all, delete-orphan")
    incidents = relationship("HealthIncident", back_populates="user", cascade="all, delete-orphan")
    insurance_policy = relationship("InsurancePolicy", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Consent(Base):
    __tablename__ = "consents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    store_health_data = Column(Boolean, default=True)
    analyze_health_data = Column(Boolean, default=True)
    share_location_emergency = Column(Boolean, default=True)
    contact_emergency_contacts = Column(Boolean, default=True)
    share_relevant_medical_info = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="consents")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    record_date = Column(String, nullable=False) # e.g. "12 Aug 2026"
    problem = Column(String, nullable=False)     # e.g. "Chest discomfort"
    category = Column(String, default="Cardiovascular") # Cardiovascular, Respiratory, etc.
    symptoms = Column(String, nullable=True)
    severity = Column(String, default="Moderate") # Mild, Moderate, Severe
    doctor_diagnosis = Column(String, nullable=True)
    treatment = Column(String, nullable=True)
    hospital_doctor = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="medical_records")

class Condition(Base):
    __tablename__ = "conditions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False) # e.g. "Hypertension", "Type 2 Diabetes"
    diagnosed_year = Column(String, nullable=True)
    status = Column(String, default="Active")
    
    user = relationship("User", back_populates="conditions")

class Allergy(Base):
    __tablename__ = "allergies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    allergen = Column(String, nullable=False) # e.g. "Penicillin", "Peanuts"
    reaction = Column(String, nullable=True)  # e.g. "Anaphylaxis", "Skin Rash"
    severity = Column(String, default="High")
    
    user = relationship("User", back_populates="allergies")

class Medication(Base):
    __tablename__ = "medications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)    # e.g. "Amlodipine"
    dosage = Column(String, nullable=True)   # e.g. "5mg"
    frequency = Column(String, nullable=True)# e.g. "Once daily"
    
    user = relationship("User", back_populates="medications")

class Surgery(Base):
    __tablename__ = "surgeries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    procedure = Column(String, nullable=False)
    year = Column(String, nullable=True)
    hospital = Column(String, nullable=True)
    
    user = relationship("User", back_populates="surgeries")

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    relationship_type = Column(String, nullable=False) # Father, Mother, Friend, etc.
    phone = Column(String, nullable=False)
    priority = Column(Integer, nullable=False) # 1 (highest) to 5
    channel = Column(String, default="SMS + Call")
    is_approved = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="emergency_contacts")

class HealthIncident(Base):
    __tablename__ = "health_incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reported_at = Column(DateTime, default=datetime.utcnow)
    problem_description = Column(Text, nullable=False)
    extracted_symptoms = Column(String, nullable=True)
    duration_mins = Column(Integer, default=15)
    severity_input = Column(String, default="Moderate")
    
    # History awareness
    related_history_found = Column(Boolean, default=False)
    related_history_note = Column(String, nullable=True)
    
    # Risk calculation
    risk_score = Column(Integer, default=0) # 0 - 100
    risk_level = Column(String, default="Low") # Low, Moderate, High, Critical
    xai_reasons_json = Column(Text, default="[]") # JSON list of explanation reasons
    recommended_action = Column(Text, nullable=True)
    
    # Status & State
    status = Column(String, default="LOGGED") # LOGGED, VERIFYING, TAKING_TIME, EMERGENCY_ACTIVE, DISARMED, RESOLVED
    is_manual_override = Column(Boolean, default=False)
    escalation_timeout_sec = Column(Integer, default=20)
    
    user = relationship("User", back_populates="incidents")
    events = relationship("IncidentEvent", back_populates="incident", cascade="all, delete-orphan")
    location = relationship("EmergencyLocation", back_populates="incident", uselist=False, cascade="all, delete-orphan")
    followup = relationship("PostEmergencyFollowup", back_populates="incident", uselist=False, cascade="all, delete-orphan")

class IncidentEvent(Base):
    __tablename__ = "incident_events"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("health_incidents.id"), nullable=False)
    timestamp_str = Column(String, nullable=False) # e.g. "18:32:04"
    event_type = Column(String, nullable=False)   # PROBLEM_REPORTED, RISK_CALCULATED, VERIFICATION_SHOWN, etc.
    details = Column(Text, nullable=False)
    icon = Column(String, default="activity")
    
    incident = relationship("HealthIncident", back_populates="events")

class EmergencyLocation(Base):
    __tablename__ = "emergency_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("health_incidents.id"), nullable=False)
    latitude = Column(Float, default=12.9716)
    longitude = Column(Float, default=77.5946)
    accuracy_m = Column(Float, default=5.0)
    is_cached = Column(Boolean, default=False)
    address_str = Column(String, default="Koramangala 5th Block, Bengaluru, India")
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    incident = relationship("HealthIncident", back_populates="location")

class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"
    
    # Note: Strictly administrative & financial metadata. Decoupled from medical risk.
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider = Column(String, default="Star Health Comprehensive Care")
    policy_number = Column(String, default="POL-8829-MR-2026")
    coverage_type = Column(String, default="Family Floater Super Top-up")
    sum_insured_inr = Column(Integer, default=1500000)
    valid_until = Column(String, default="31 Dec 2027")
    claims_json = Column(Text, default='[{"claim_id": "CLM-101", "date": "14 Aug 2026", "hospital": "Manipal Hospital", "amount": "₹45,000", "status": "Approved"}]')
    
    user = relationship("User", back_populates="insurance_policy")

class PostEmergencyFollowup(Base):
    __tablename__ = "post_emergency_followups"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("health_incidents.id"), nullable=False)
    is_safe_now = Column(Boolean, default=True)
    medical_help_received = Column(Boolean, default=True)
    symptoms_persisting = Column(Boolean, default=False)
    was_genuine_emergency = Column(Boolean, default=True)
    doctor_notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    incident = relationship("HealthIncident", back_populates="followup")
