import re
from typing import List, Tuple, Optional
from app.models.schemas import MedicalRecord

# Anatomical / System keyword clusters
SYSTEM_CLUSTERS = {
    "cardiac": ["chest", "heart", "angina", "palpitation", "left arm", "tightness", "cardiac", "coronary", "bp", "hypertension"],
    "respiratory": ["breath", "breathing", "shortness", "dyspnea", "asthma", "wheezing", "cough", "lung", "suffocation"],
    "neurological": ["headache", "dizziness", "stroke", "numbness", "weakness", "fainting", "syncope", "vision", "speech", "paralysis"],
    "gastrointestinal": ["stomach", "abdomen", "abdominal", "vomiting", "nausea", "gastric", "ulcer", "burning"],
    "allergic": ["rash", "swelling", "anaphylaxis", "throat tightness", "itching", "allergy"]
}

def detect_related_history(current_text: str, past_records: List[MedicalRecord]) -> Tuple[bool, Optional[str], Optional[MedicalRecord]]:
    """
    Analyzes current symptom description against the user's past medical records.
    Returns: (has_match, match_explanation, matched_record)
    """
    if not current_text or not past_records:
        return False, None, None
        
    current_lower = current_text.lower()
    
    # Identify which systems the current complaint triggers
    matched_systems = set()
    for sys_name, keywords in SYSTEM_CLUSTERS.items():
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', current_lower):
                matched_systems.add(sys_name)
                break
                
    # Compare with past medical records
    for record in past_records:
        record_text = f"{record.problem} {record.symptoms or ''} {record.doctor_diagnosis or ''}".lower()
        
        # Check direct keyword match
        for kw in current_lower.split():
            if len(kw) > 3 and kw in record_text:
                note = f"Related problem found: You previously reported '{record.problem}' on {record.record_date} ({record.doctor_diagnosis or 'Consultation'})."
                return True, note, record
                
        # Check system cluster match
        for sys_name in matched_systems:
            for kw in SYSTEM_CLUSTERS[sys_name]:
                if kw in record_text:
                    note = f"Related {sys_name.capitalize()} history detected: Previous record for '{record.problem}' on {record.record_date}."
                    return True, note, record
                    
    return False, None, None
