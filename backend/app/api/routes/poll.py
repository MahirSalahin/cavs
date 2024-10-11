from fastapi import APIRouter, HTTPException, status
from sqlmodel import select, func
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import or_, and_
from uuid import UUID

from models.common import Message
from models.poll import (
    Poll,
    PollCreate,
    PollCreateResponse,
    PollOption,
    PollOptions,
    PollOptionsCreate,
    PollPublic,
    PollsPublic,
    PollOptionResult,
    PollResult,
    RollRange,
    RollRanges,
    RollRangesCreate,
)
from utils.current_bst_time import current_bst_time
from api.deps import SessionDep, CurrentUser


router = APIRouter()


def serialize_poll_public(poll):
    return PollPublic(
        id=poll.id,
        title=poll.title,
        description=poll.description,
        is_private=poll.is_private,
        creator_email=poll.creator_email,
        created_at=poll.created_at,
        start_time=poll.start_time,
        end_time=poll.end_time,
        options=poll.options,
        total_votes=sum(option.total_votes for option in poll.options),
        roll_ranges=poll.roll_ranges
    )


@router.get("/", response_model=PollsPublic)
def get_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
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
        .order_by(Poll.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    if search:
        search = f"%{search}%"
        query = query.where(or_(Poll.title.ilike(search),
                            Poll.description.ilike(search)))
    polls = session.exec(query).unique().all()
    data = [serialize_poll_public(poll) for poll in polls]
    return PollsPublic(data=data, count=len(polls))


@router.get("/public", response_model=PollsPublic)
def get_public_polls(session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all polls."""
    query = (
        select(Poll)
        .where(Poll.is_private.is_(False))
        .options(
            joinedload(Poll.options),
            joinedload(Poll.roll_ranges)
        )
        .order_by(Poll.start_time.desc())
        .offset(skip)
        .limit(limit)
    )
    if search:
        search = f"%{search}%"
        query = query.where(or_(Poll.title.ilike(search),
                            Poll.description.ilike(search)))
    polls = session.exec(query).unique().all()
    data = [serialize_poll_public(poll) for poll in polls]
    return PollsPublic(data=data, count=len(polls))


@router.get("/my-polls", response_model=PollsPublic)
def get_my_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all polls created by the user."""
    query = (
        select(Poll)
        .where(Poll.creator_email == user.email)
        .options(
            joinedload(Poll.options),
            joinedload(Poll.roll_ranges)
        )
        .order_by(Poll.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    if search:
        search = f"%{search}%"
        query = query.where(or_(Poll.title.ilike(search),
                            Poll.description.ilike(search)))
    polls = session.exec(query).unique().all()
    data = [serialize_poll_public(poll) for poll in polls]
    return PollsPublic(data=data, count=len(polls))


@router.get("/allowed-polls", response_model=PollsPublic)
def get_allowed_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all polls allowed for the user."""
    query = (
        select(Poll)
        .where(
            or_(
                Poll.creator_email == user.email,
                Poll.roll_ranges.any(
                    and_(RollRange.start <= user.roll, RollRange.end >= user.roll))
            )
        )
        .options(
            joinedload(Poll.options),
            joinedload(Poll.roll_ranges)
        )
        .order_by(Poll.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    if search:
        search = f"%{search}%"
        query = query.where(or_(Poll.title.ilike(search),
                            Poll.description.ilike(search)))
    polls = session.exec(query).unique().all()
    data = [serialize_poll_public(poll) for poll in polls]
    return PollsPublic(data=data, count=len(polls))


@router.get("/popular-polls", response_model=PollsPublic)
def get_popular_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all popular polls."""
    query = (
        select(Poll)
        .outerjoin(PollOption, PollOption.poll_id == Poll.id)
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
        .group_by(Poll.id)
        .order_by(func.sum(PollOption.total_votes).desc() if PollOption.total_votes is not None else 0)
        .offset(skip)
        .limit(limit)
    )
    if search:
        search = f"%{search}%"
        query = query.where(or_(Poll.title.ilike(search),
                            Poll.description.ilike(search)))
    polls = session.exec(query).unique().all()
    data = [serialize_poll_public(poll) for poll in polls]
    return PollsPublic(data=data, count=len(polls))


@router.get("/upcoming-polls", response_model=PollsPublic)
def get_upcoming_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all upcoming polls."""
    query = (
        select(Poll)
        .where(
            and_(
                Poll.start_time > current_bst_time(),
                or_(
                    Poll.is_private.is_(False),
                    Poll.creator_email == user.email,
                    Poll.roll_ranges.any(
                        and_(RollRange.start <= user.roll, RollRange.end >= user.roll))
                )
            )
        )
        .options(
            joinedload(Poll.options),
            joinedload(Poll.roll_ranges)
        )
        .order_by(Poll.start_time.desc())
        .offset(skip)
        .limit(limit)
    )
    if search:
        search = f"%{search}%"
        query = query.where(or_(Poll.title.ilike(search),
                            Poll.description.ilike(search)))
    polls = session.exec(query).unique().all()
    data = [serialize_poll_public(poll) for poll in polls]
    return PollsPublic(data=data, count=len(polls))


@router.get("/ended-polls", response_model=PollsPublic)
def get_ended_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all ended polls."""
    query = (
        select(Poll)
        .where(
            and_(
                Poll.end_time < current_bst_time(),
                or_(
                    Poll.is_private.is_(False),
                    Poll.creator_email == user.email,
                    Poll.roll_ranges.any(
                        and_(RollRange.start <= user.roll, RollRange.end >= user.roll))
                )
            )
        )
        .options(
            joinedload(Poll.options),
            joinedload(Poll.roll_ranges)
        )
        .order_by(Poll.end_time.desc())
        .offset(skip)
        .limit(limit)
    )
    if search:
        search = f"%{search}%"
        query = query.where(or_(Poll.title.ilike(search),
                            Poll.description.ilike(search)))
    polls = session.exec(query).unique().all()
    data = [serialize_poll_public(poll) for poll in polls]
    return PollsPublic(data=data, count=len(polls))


@router.post("/create/", response_model=PollCreateResponse)
def create_poll(request: PollCreate, user: CurrentUser, session: SessionDep):
    """Create a new poll."""
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
    return PollCreateResponse(poll_id=poll.id)


@router.get("/{poll_id}/", response_model=PollPublic)
def get_poll(poll_id: UUID, user: CurrentUser, session: SessionDep):
    """Get a poll by its ID."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    return serialize_poll_public(poll)


@router.delete("/{poll_id}/", response_model=Message)
def delete_poll(poll_id: UUID, user: CurrentUser, session: SessionDep):
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
def get_poll_options(poll_id: UUID, user: CurrentUser, session: SessionDep):
    """Get all options of a poll by its ID."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    return PollOptions(data=poll.options, count=len(poll.options))


@router.get("/{poll_id}/roll-ranges/", response_model=RollRanges)
def get_roll_ranges(poll_id: UUID, user: CurrentUser, session: SessionDep):
    """Get all roll ranges of a poll by its ID."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    return RollRanges(data=poll.roll_ranges, count=len(poll.roll_ranges))


@router.post("/{poll_id}/options/", response_model=Message)
def create_poll_option(poll_id: UUID, request: PollOptionsCreate, user: CurrentUser, session: SessionDep):
    """Create new poll options of a poll with poll_id."""
    poll = session.get(Poll, poll_id)

    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    if poll.creator_email != user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to add options to this poll")

    option_texts = request.option_texts
    if len(option_texts) == 0:
        raise HTTPException(
            status_code=400, detail="At least one option is required")
    if len(option_texts) + len(poll.options) > 20:
        raise HTTPException(
            status_code=400, detail="A poll can have at most 20 options")
    if len(option_texts) + len(poll.options) != len(set(option_texts + [option.option_text for option in poll.options])):
        raise HTTPException(
            status_code=400, detail="Options must be unique")

    options = [PollOption(poll_id=poll_id, option_text=option_text)
               for option_text in option_texts]
    session.add_all(options)
    session.commit()
    for option in options:
        session.refresh(option)
    return Message(message="Options added successfully")


@router.post("/{poll_id}/roll-ranges", response_model=Message)
def add_allowed_voters(poll_id: UUID, request: RollRangesCreate, user: CurrentUser, session: SessionDep):
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")
    if poll.creator_email != user.email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to add roll ranges to this poll")

    roll_ranges = request.roll_ranges
    if len(roll_ranges) == 0:
        raise HTTPException(
            status_code=400, detail="At least one roll range is required")
    if len(roll_ranges) + len(poll.roll_ranges) > 20:
        raise HTTPException(
            status_code=400, detail="A poll can have at most 20 roll ranges")
    if len(roll_ranges) + len(poll.roll_ranges) != len(set(roll_ranges + [(roll_range.start, roll_range.end)
                                                                          for roll_range in poll.roll_ranges])):
        raise HTTPException(
            status_code=400, detail="Roll ranges must be unique")

    roll_ranges = [RollRange(poll_id=poll_id, start=start, end=end)
                   for start, end in roll_ranges]
    session.add_all(roll_ranges)
    session.commit()
    for roll_range in roll_ranges:
        session.refresh(roll_range)

    return Message(message="Roll ranges added successfully")


@router.get("/{poll_id}/result", response_model=PollResult)
def get_poll_result(poll_id: UUID, user: CurrentUser, session: SessionDep):
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
        select(func.sum(PollOption.total_votes))
        .where(PollOption.poll_id == poll_id)
    ).one_or_none() or 0

    data = [
        PollOptionResult(option_text=option.option_text, votes=option.votes)
        for option in poll.options
    ]
    return PollResult(data=data, total_votes=total_votes)


@router.get("/{poll_id}/total-votes")
def get_total_votes(poll_id: UUID, user: CurrentUser, session: SessionDep):
    """Get the total number of votes of a poll."""
    poll = session.get(Poll, poll_id)
    if not poll:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")
    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    total_votes = session.exec(
        select(func.sum(PollOption.total_votes))
        .where(PollOption.poll_id == poll_id)
    ).one_or_none() or 0
    return {"total_votes": total_votes}
