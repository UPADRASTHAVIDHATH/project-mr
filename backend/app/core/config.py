import os

class Settings:
    PROJECT_NAME: str = "Project M.R — Intelligent Health Risk & Emergency Response System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mr-super-secret-key-for-jwt-2026-hackathon")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Configurable Demo Timeouts (Clearly labeled as testing/demo intervals)
    DEMO_TIMEOUTS = {
        "CRITICAL": 10,  # 10s countdown
        "HIGH": 20,      # 20s countdown
        "MODERATE": 40,  # 40s countdown
        "LOW": 60        # 60s countdown
    }
    
    # Non-diagnostic standard clinical disclaimer
    DISCLAIMER: str = "This is a risk assessment, not a medical diagnosis. Your reported symptoms may require urgent medical attention."

settings = Settings()
