from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from uuid import uuid4, UUID
from datetime import datetime

from utils.current_bst_time import current_bst_time


class Vote(SQLModel, table=True):
    id: UUID = Field(
        default_factory=uuid4, primary_key=True, index=True)
    option_id: UUID = Field(foreign_key="polloption.id", ondelete="CASCADE")
    voter_email_hash: str = Field(max_length=255)
    timestamp: datetime = Field(default_factory=current_bst_time)


class VoteCreateRequest(BaseModel):
    option_id: UUID