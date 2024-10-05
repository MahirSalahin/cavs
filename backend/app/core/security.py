import hashlib

def hash_email(email: str) -> str:
    """Hash the email using SHA-256."""
    return hashlib.sha256(email.encode()).hexdigest()


ALGORITHM = "HS256"
