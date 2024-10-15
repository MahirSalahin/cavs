import uuid
from uuid import UUID
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from models.vote import Vote


class RollRange(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    start: int = Field(default=10 ** 6)
    end: int = Field(default=10 ** 7)
    poll_id: UUID = Field(foreign_key="poll.id", ondelete="CASCADE")
    poll: "Poll" = Relationship(back_populates="roll_ranges")


class RollRanges(BaseModel):
    data: list[RollRange]
    count: int


class RollRangesCreate(BaseModel):
    roll_ranges: list[tuple[int, int]]


class Poll(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    description: str = Field(max_length=1024)
    is_private: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    creator_email: str = Field(max_length=255)
    start_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    end_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=1)
    )
    options: list["PollOption"] = Relationship(
        back_populates="poll", cascade_delete=True)
    roll_ranges: list["RollRange"] = Relationship(
        back_populates="poll", cascade_delete=True)


class PollCreate(BaseModel):
    title: str = Field(max_length=255)
    description: str | None = Field(max_length=1024)
    is_private: bool = Field(default=False)
    start_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))
    end_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=1)
    )


class PollCreateResponse(BaseModel):
    poll_id: UUID


class PollResponse(BaseModel):
    id: UUID
    title: str
    description: str
    is_private: bool
    creator_email: str
    created_at: datetime
    start_time: datetime
    end_time: datetime
    roll_ranges: list[RollRange]
    options: list["PollOption"]
    selected_option: Optional["PollOption"]
    total_votes: int


class PollsResponse(BaseModel):
    data: list[PollResponse]
    count: int


class PollOption(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    poll_id: UUID = Field(foreign_key="poll.id", ondelete="CASCADE")
    option_text: str = Field(max_length=255)
    poll: Poll = Relationship(back_populates="options")
    votes: list["Vote"] = Relationship(
        back_populates="poll_option", cascade_delete=True)


class PollOptions(BaseModel):
    data: list[PollOption]
    count: int


class PollOptionsCreate(BaseModel):
    option_texts: list[str]


class PollOptionResult(BaseModel):
    option_text: str
    votes: int


class PollResult(BaseModel):
    data: list[PollOptionResult]
    total_votes: int
