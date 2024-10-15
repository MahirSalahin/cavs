from collections.abc import Generator
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlmodel import Session

from core.db import engine
from core.config import settings
from core import security
from models.common import AuthUser
from utils.email_validator import is_valid_cuet_email


httpBearer = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(httpBearer)]


def get_current_user(session: SessionDep, token: TokenDep):
    try:
        payload = jwt.decode(
            token.credentials,
            settings.SECRET_KEY,
            algorithms=[security.ALGORITHM],
            audience=settings.AUDIENCE,
        )

        if not is_valid_cuet_email(payload.get("email")):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Must be a CUET-student email")

        return AuthUser(
            email=payload.get("email"),
            full_name=" ".join(payload.get(
                "user_metadata").get("full_name").split()[:2]),
            roll=payload.get("email")[1:8],
            avatar_url=payload.get("user_metadata").get("avatar_url")
        )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid authentication credentials. {e}")


CurrentUser = Annotated[AuthUser, Depends(get_current_user)]
