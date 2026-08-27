import hashlib
import hmac
import base64
import json
import time
from app.core.config import settings

def hash_password(password: str) -> str:
    salt = "mr_salt_2026"
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return pwd_hash.hex()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: int = None) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = data.copy()
    expire_time = time.time() + (expires_delta or settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    payload["exp"] = expire_time
    
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    
    signature = hmac.new(
        settings.SECRET_KEY.encode(),
        f"{header_b64}.{payload_b64}".encode(),
        hashlib.sha256
    ).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> dict:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        expected_sig = hmac.new(
            settings.SECRET_KEY.encode(),
            f"{header_b64}.{payload_b64}".encode(),
            hashlib.sha256
        ).digest()
        
        pad = len(sig_b64) % 4
        actual_sig = base64.urlsafe_b64decode(sig_b64 + "=" * ((4 - pad) % 4))
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        pad_p = len(payload_b64) % 4
        payload_bytes = base64.urlsafe_b64decode(payload_b64 + "=" * ((4 - pad_p) % 4))
        payload = json.loads(payload_bytes.decode())
        
        if payload.get("exp", 0) < time.time():
            return None
            
        return payload
    except Exception:
        return None
