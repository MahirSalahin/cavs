import secrets
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import Annotated, Any, Literal
from pydantic import (
    AnyUrl,
    BeforeValidator,
    computed_field,
    PostgresDsn
)
load_dotenv()


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    PROJECT_NAME: str

    @computed_field  # type: ignore[misc]
    @property
    def SQLALCHEMY_DATABASE_URL(self) -> PostgresDsn:
        return self.DATABASE_URL

    SECRET_KEY: str = secrets.token_urlsafe(32)
    AUDIENCE: str = "authenticated"
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    DOMAIN: str = "localhost"
    ENVIRONMENT: Literal["local", "development", "merge", "staging", "production"] = (
        "local"
    )
    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = (
        []
    )


settings = Settings()
