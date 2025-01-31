from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import UniqueConstraint
from pydantic import BaseModel
from uuid import uuid4, UUID
from datetime import datetime, timezone
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from models.poll import PollOption


class Vote(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("voter_email_hash",
                      "poll_id", name="unique_voter_poll"),)
    id: UUID = Field(
        default_factory=uuid4, primary_key=True, index=True)
    poll_id: UUID | None = Field(foreign_key="poll.id", index=True)
    option_id: UUID = Field(foreign_key="polloption.id",
                            ondelete="CASCADE", index=True)
    voter_email_hash: str = Field(max_length=255)
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))
    poll_option: "PollOption" = Relationship(back_populates="votes")


class VoteCreateRequest(BaseModel):
    option_id: UUID
