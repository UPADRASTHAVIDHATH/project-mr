from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.schemas import (
    User, Consent, MedicalRecord, Condition, Allergy, 
    Medication, Surgery, EmergencyContact, InsurancePolicy
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    if db.query(User).filter(User.email == "john.doe@example.com").first():
        db.close()
        return

    print("Seeding Project M.R demo data...")
    
    john = User(
        email="john.doe@example.com",
        password_hash=hash_password("password123"),
        full_name="John Doe",
        age=52,
        gender="Male",
        date_of_birth="1974-05-12",
        phone="+91 98765 00001",
        address="Flat 402, Green Glen Heights, Bengaluru",
        blood_group="A+",
        height_cm=174.0,
        weight_kg=78.5
    )
    db.add(john)
    db.commit()
    db.refresh(john)
    
    consent = Consent(
        user_id=john.id,
        store_health_data=True,
        analyze_health_data=True,
        share_location_emergency=True,
        contact_emergency_contacts=True,
        share_relevant_medical_info=True
    )
    db.add(consent)
    
    rec1 = MedicalRecord(
        user_id=john.id,
        record_date="12 Aug 2026",
        problem="Chest discomfort",
        category="Cardiovascular",
        symptoms="Mild tightness across mid-chest after climbing stairs",
        severity="Moderate",
        doctor_diagnosis="Suspected mild stable angina",
        treatment="Prescribed Sorbitrate PRN and lifestyle rest",
        hospital_doctor="Dr. Arvind • Manipal Hospital",
        notes="Patient advised to monitor any recurring chest discomfort or radiation to left shoulder."
    )
    rec2 = MedicalRecord(
        user_id=john.id,
        record_date="20 Jul 2026",
        problem="Elevated Blood Pressure",
        category="Cardiovascular",
        symptoms="Occasional morning headache",
        severity="Moderate",
        doctor_diagnosis="Stage-1 Essential Hypertension",
        treatment="Amlodipine 5mg once daily",
        hospital_doctor="Apollo Clinic",
        notes="Blood pressure measured 148/92 mmHg."
    )
    rec3 = MedicalRecord(
        user_id=john.id,
        record_date="05 Jun 2026",
        problem="Routine Annual Health Check",
        category="General",
        symptoms="None reported",
        severity="Mild",
        doctor_diagnosis="Normal baseline with borderline cholesterol (215 mg/dL)",
        treatment="Dietary fiber and omega-3 supplements",
        hospital_doctor="Apollo Diagnostics",
        notes="ECG normal sinus rhythm."
    )
    db.add_all([rec1, rec2, rec3])
    
    c1 = Condition(user_id=john.id, name="Hypertension", diagnosed_year="2024", status="Active")
    c2 = Condition(user_id=john.id, name="Suspected Stable Angina", diagnosed_year="2026", status="Active")
    db.add_all([c1, c2])
    
    a1 = Allergy(user_id=john.id, allergen="Penicillin", reaction="Severe Skin Hives and Anaphylactoid Wheezing", severity="High")
    db.add(a1)
    
    m1 = Medication(user_id=john.id, name="Amlodipine", dosage="5mg", frequency="Once daily morning")
    m2 = Medication(user_id=john.id, name="Aspirin (Cardioprotective)", dosage="75mg", frequency="Once daily after food")
    db.add_all([m1, m2])
    
    s1 = Surgery(user_id=john.id, procedure="Appendectomy (Laparoscopic)", year="2018", hospital="Fortis Hospital")
    db.add(s1)
    
    ec1 = EmergencyContact(user_id=john.id, name="Ramesh Doe", relationship_type="Father", phone="+91 98765 43210", priority=1, channel="SMS + Call")
    ec2 = EmergencyContact(user_id=john.id, name="Anita Doe", relationship_type="Mother", phone="+91 98765 43211", priority=2, channel="SMS + Call")
    ec3 = EmergencyContact(user_id=john.id, name="Vikram Doe", relationship_type="Brother", phone="+91 98765 43212", priority=3, channel="WhatsApp / SMS")
    ec4 = EmergencyContact(user_id=john.id, name="Rahul Sharma", relationship_type="Close Friend", phone="+91 98765 43213", priority=4, channel="SMS")
    ec5 = EmergencyContact(user_id=john.id, name="Dr. Arvind", relationship_type="Primary Physician", phone="+91 98765 43214", priority=5, channel="Emergency Line")
    db.add_all([ec1, ec2, ec3, ec4, ec5])
    
    ins = InsurancePolicy(
        user_id=john.id,
        provider="Star Health Comprehensive Care",
        policy_number="POL-8829-MR-2026",
        coverage_type="Family Floater Super Top-Up",
        sum_insured_inr=1500000,
        valid_until="31 Dec 2027"
    )
    db.add(ins)
    
    db.commit()
    db.close()
    print("Seeding complete! John Doe initialized with full history.")
