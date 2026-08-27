from typing import List, Dict

def generate_dynamic_questions(symptom_text: str, previous_answers: Dict[str, str] = None) -> List[Dict[str, Any]]:
    """
    Generates dynamic, non-repetitive clinical triage follow-up questions based on reported problem.
    """
    previous_answers = previous_answers or {}
    text_lower = (symptom_text or "").lower()
    questions = []
    
    # Chest / Cardiac Questions
    if "chest" in text_lower or "heart" in text_lower or "angina" in text_lower:
        if "radiation" not in previous_answers:
            questions.append({
                "id": "radiation",
                "question": "Does the discomfort radiate or spread to your left arm, jaw, neck, or back?",
                "options": ["Yes, spreads to left arm/jaw", "Yes, to back/shoulder", "No, localized to chest only"],
                "risk_impact": "high"
            })
        if "breathing" not in previous_answers:
            questions.append({
                "id": "breathing",
                "question": "Are you experiencing shortness of breath or cold sweating alongside the chest discomfort?",
                "options": ["Yes, heavy sweating and breathlessness", "Mild breathlessness only", "No sweating or breathlessness"],
                "risk_impact": "critical"
            })
            
    # Breathing / Respiratory Questions
    elif "breath" in text_lower or "suffocat" in text_lower or "asthma" in text_lower:
        if "onset" not in previous_answers:
            questions.append({
                "id": "onset",
                "question": "Did this difficulty breathing start suddenly or gradually over several hours?",
                "options": ["Sudden onset (< 15 mins)", "Gradual worsening over today", "Chronic recurrent"],
                "risk_impact": "high"
            })
        if "rest_vs_exertion" not in previous_answers:
            questions.append({
                "id": "rest_vs_exertion",
                "question": "Is the breathing difficulty occurring while you are resting completely?",
                "options": ["Yes, struggling even while sitting still", "Only when moving or walking", "No, improving with rest"],
                "risk_impact": "high"
            })
            
    # Dizziness / Neuro Questions
    elif "dizz" in text_lower or "headache" in text_lower or "faint" in text_lower:
        if "balance" not in previous_answers:
            questions.append({
                "id": "balance",
                "question": "Are you having trouble standing up or speaking clearly?",
                "options": ["Yes, unsteadiness or speech slurring", "Lightheaded but can walk", "No difficulty speaking or walking"],
                "risk_impact": "high"
            })
            
    # General Fallback Triage
    if not questions:
        questions.append({
            "id": "progression",
            "question": "Compared to when it first started, how is the sensation changing?",
            "options": ["Rapidly worsening", "Staying constant", "Slowly easing"],
            "risk_impact": "moderate"
        })
        
    return questions
