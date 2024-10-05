import uuid
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Relationship

from utils.current_bst_time import current_bst_time


class RollRange(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    start: int = Field(default=10 ** 6)
    end: int = Field(default=10 ** 7)
    poll_id: UUID = Field(foreign_key="poll.id", ondelete="CASCADE")
    poll: "Poll" = Relationship(back_populates="roll_ranges")


class RollRanges(BaseModel):
    data: list[RollRange]
    count: int


class RollRangeCreate(BaseModel):
    start: int | None = Field(default=1901001)
    end: int | None = Field(default=2313180)


class Poll(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    description: str = Field(max_length=1024)
    is_private: bool = Field(default=False)
    created_at: datetime = Field(default_factory=current_bst_time)
    creator_email: str = Field(max_length=255)
    start_time: datetime = Field(default_factory=current_bst_time)
    end_time: datetime
    options: list["PollOption"] = Relationship(
        back_populates="poll", cascade_delete=True)
    roll_ranges: list["RollRange"] = Relationship(
        back_populates="poll", cascade_delete=True)


class PollCreate(BaseModel):
    title: str = Field(max_length=255)
    description: str | None = Field(max_length=1024)
    is_private: bool = Field(default=False)
    start_time: datetime = Field(default_factory=current_bst_time)
    end_time: datetime


class PollPublic(BaseModel):
    id: UUID
    title: str
    description: str
    is_private: bool
    creator_email: str
    created_at: datetime
    start_time: datetime
    end_time: datetime
    options: list["PollOption"]
    roll_ranges: list[RollRange]


class PollsPublic(BaseModel):
    data: list[PollPublic]
    count: int


class PollOption(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    poll_id: UUID = Field(foreign_key="poll.id", ondelete="CASCADE")
    option_text: str = Field(max_length=255)
    poll: Poll = Relationship(back_populates="options")
    votes: int = Field(default=0)


class PollOptions(BaseModel):
    data: list[PollOption]
    count: int


class PollOptionCreate(BaseModel):
    option_text: str


class PollOptionResult(BaseModel):
    option_text: str
    votes: int


class PollResult(BaseModel):
    data: list[PollOptionResult]
    total_votes: int
