import re

CUET_EMAIL_PATTERN = r"^u\d{2}\d{2}\d{3}@student\.cuet\.ac\.bd$"


def is_valid_cuet_email(email: str) -> bool:
    """Validate if the provided email is a valid CUET student email."""
    return bool(re.match(CUET_EMAIL_PATTERN, email))
