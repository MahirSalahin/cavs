from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import or_, and_
from uuid import UUID

from core.db import get_session
from models.common import AuthUser, Message
from models.poll import (
    Poll,
    PollCreate,
    PollOption,
    PollOptions,
    PollOptionCreate,
    PollPublic,
    PollsPublic,
    PollOptionResult,
    PollResult,
    RollRange,
    RollRanges,
    RollRangeCreate,
)
from utils.current_bst_time import current_bst_time
from utils.email_validator import is_valid_cuet_email
from api.deps import get_current_user


router = APIRouter()


@router.get("/", response_model=PollsPublic)
def get_polls(user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session), skip: int = 0, limit: int = 20):
    """Get all polls."""

    query = (
        select(Poll)
        .where(
            or_(
                Poll.is_private.is_(False),
                Poll.creator_email == user.email,
                Poll.roll_ranges.any(
                    and_(RollRange.start <= user.roll, RollRange.end >= user.roll))
            )
        )
        .options(
            joinedload(Poll.options),
            joinedload(Poll.roll_ranges)
        )
        .offset(skip)
        .limit(limit)
    )
    polls = session.exec(query).unique().all()
    data = [
        PollPublic(
            id=poll.id,
            title=poll.title,
            description=poll.description,
            is_private=poll.is_private,
            creator_email=poll.creator_email,
            created_at=poll.created_at,
            start_time=poll.start_time,
            end_time=poll.end_time,
            options=poll.options,
            roll_ranges=poll.roll_ranges
        )
        for poll in polls
    ]
    return PollsPublic(data=data, count=len(polls))


@router.get("/public", response_model=PollsPublic)
def get_public_polls(session: Session = Depends(get_session), skip: int = 0, limit: int = 20):
    """Get all polls."""
    query = (
        select(Poll)
        .where(Poll.is_private.is_(False))
        .options(
            joinedload(Poll.options),
            joinedload(Poll.roll_ranges)
        )
        .offset(skip)
        .limit(limit)
    )
    polls = session.exec(query).unique().all()
    data = []
    for poll in polls:
        data.append(PollPublic(
            id=poll.id,
            title=poll.title,
            description=poll.description,
            is_private=poll.is_private,
            creator_email=poll.creator_email,
            created_at=poll.created_at,
            start_time=poll.start_time,
            end_time=poll.end_time,
            options=poll.options,
            roll_ranges=poll.roll_ranges
        ))
    return PollsPublic(data=data, count=len(polls))


@router.post("/create/", response_model=Message)
def create_poll(request: PollCreate, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Create a new poll."""
    if not is_valid_cuet_email(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid CUET email address")

    poll = Poll(
        title=request.title,
        description=request.description,
        is_private=request.is_private,
        creator_email=user.email,
        start_time=request.start_time,
        end_time=request.end_time,
    )

    session.add(poll)
    session.commit()
    session.refresh(poll)

    return Message(message="Poll created successfully")


@router.get("/{poll_id}/", response_model=PollPublic)
def get_poll(poll_id: UUID, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Get a poll by its ID."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")
    options = session.exec(select(PollOption).where(
        PollOption.poll_id == poll_id)).all()

    roll_ranges = session.exec(select(RollRange).where(
        RollRange.poll_id == poll_id)).all()

    return PollPublic(
        id=poll.id,
        title=poll.title,
        description=poll.description,
        is_private=poll.is_private,
        creator_email=poll.creator_email,
        created_at=poll.created_at,
        start_time=poll.start_time,
        end_time=poll.end_time,
        options=options,
        roll_ranges=roll_ranges
    )


@router.delete("/{poll_id}/", response_model=Message)
def delete_poll(poll_id: UUID, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Delete a poll by its ID."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.creator_email != user.email:
        raise HTTPException(
            status_code=403, detail="You are not authorized to delete this poll")
    session.delete(poll)
    session.commit()
    return Message(message="Poll deleted successfully")


@router.get("/{poll_id}/options/", response_model=PollOptions)
def get_poll_options(poll_id: UUID, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Get all options of a poll by its ID."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    options = session.exec(select(PollOption).where(
        PollOption.poll_id == poll_id)).all()
    return PollOptions(data=options, count=len(options))


@router.get("/{poll_id}/roll-ranges/", response_model=RollRanges)
def get_roll_ranges(poll_id: UUID, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Get all roll ranges of a poll by its ID."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    roll_ranges = session.exec(select(RollRange).where(
        RollRange.poll_id == poll_id)).all()
    return RollRanges(data=roll_ranges, count=len(roll_ranges))


@router.post("/{poll_id}/options/", response_model=Message)
def create_poll_option(poll_id: UUID, request: PollOptionCreate, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Create a new poll option of a poll with poll_id."""
    poll = session.get(Poll, poll_id)

    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.creator_email != user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to add options to this poll")

    already_exists = session.exec(
        select(PollOption)
        .where(
            PollOption.poll_id == poll_id,
            PollOption.option_text == request.option_text
        )).first()
    if already_exists:
        raise HTTPException(
            status_code=400, detail=f"Option `{request.option_text}` already exists in the poll")

    poll_option = PollOption(
        poll_id=poll_id,
        option_text=request.option_text
    )

    session.add(poll_option)
    session.commit()
    session.refresh(poll_option)

    return Message(message="Option added successfully")


@router.post("/{poll_id}/roll-ranges", response_model=Message)
def add_allowed_voters(poll_id: UUID, request: RollRangeCreate, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    poll = session.get(Poll, poll_id)

    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")
    if poll.creator_email != user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to add roll ranges to this poll")
    if request.start > request.end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid input")

    poll_data = RollRange(
        poll_id=poll_id,
        start=request.start,
        end=request.end,
    )

    session.add(poll_data)
    session.commit()
    session.refresh(poll_data)

    return Message(message="Roll range added successfully")


@router.get("/{poll_id}/result", response_model=PollResult)
def get_poll_result(poll_id: UUID, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Get the result of a poll."""
    poll = session.exec(
        select(Poll)
        .where(Poll.id == poll_id)
        .options(joinedload(Poll.options))
    ).first()

    if not poll:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    if poll.end_time.astimezone(current_bst_time().tzinfo) > current_bst_time():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Poll has not ended yet")

    total_votes = session.exec(
        select(func.sum(PollOption.votes))
        .where(PollOption.poll_id == poll_id)
    ).one_or_none() or 0

    data = [
        PollOptionResult(option_text=option.option_text, votes=option.votes)
        for option in poll.options
    ]
    return PollResult(data=data, total_votes=total_votes)


@router.get("/{poll_id}/total-votes")
def get_total_votes(poll_id: UUID, user: AuthUser = Depends(get_current_user), session: Session = Depends(get_session)):
    """Get the total number of votes of a poll."""
    poll = session.get(Poll, poll_id)
    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    total_votes = session.exec(
        select(func.sum(PollOption.votes))
        .where(PollOption.poll_id == poll_id)
    ).one_or_none() or 0
    return {"total_votes": total_votes}
