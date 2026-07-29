import hashlib
from jwt import PyJWKClient
from core.config import settings


def hash_email(email: str) -> str:
    """Hash the email using SHA-256."""
    return hashlib.sha256(email.encode()).hexdigest()


ALGORITHM = "ES256"

# Fetch Supabase's public signing key via JWKS
JWKS_URL = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
jwks_client = PyJWKClient(JWKS_URL)
