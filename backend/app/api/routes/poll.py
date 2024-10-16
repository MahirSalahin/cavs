from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select, func
from sqlalchemy.orm import subqueryload
from sqlalchemy.sql import or_, and_
from uuid import UUID

from api.deps import SessionDep, CurrentUser
from core.security import hash_email
from models.common import Message
from models.poll import (
    Poll,
    PollCreate,
    PollCreateResponse,
    PollOption,
    PollOptions,
    PollOptionsCreate,
    PollResponse,
    PollsResponse,
    PollOptionResult,
    PollResult,
    RollRange,
    RollRanges,
    RollRangesCreate,
)
from models.vote import Vote


router = APIRouter()


def _serialize_poll_public(poll, total_votes, selected_option) -> PollResponse:
    return PollResponse(
        id=poll.id,
        title=poll.title,
        description=poll.description,
        is_private=poll.is_private,
        creator_email=poll.creator_email,
        created_at=poll.created_at,
        start_time=poll.start_time,
        end_time=poll.end_time,
        options=poll.options,
        selected_option=selected_option,
        total_votes=total_votes,
        roll_ranges=poll.roll_ranges
    )


def _get_polls(user, session, skip, limit, search, where_clause, order_by_clause=None) -> PollsResponse:
    """Get polls based on query parameters."""
    vote_count_subquery = (
        select(PollOption.poll_id, func.count(Vote.id).label('total_votes'))
        .join(Vote, Vote.option_id == PollOption.id, isouter=True)
        .group_by(PollOption.poll_id)
        .subquery()
    )

    selected_option_subquery = (
        select(Vote.option_id, PollOption.poll_id)
        .join(PollOption, PollOption.id == Vote.option_id)
        .where(Vote.voter_email_hash == hash_email(user.email) if user else None)
        .subquery()
    )

    query = (
        select(Poll, vote_count_subquery.c.total_votes, selected_option_subquery.c.option_id.label('selected_option'),
               func.count().over().label('total_count'))
        .join(vote_count_subquery, vote_count_subquery.c.poll_id == Poll.id, isouter=True)
        .join(selected_option_subquery, selected_option_subquery.c.poll_id == Poll.id, isouter=True)
        .where(where_clause)
        .options(
            subqueryload(Poll.options),
            subqueryload(Poll.roll_ranges)
        )
        .order_by(func.coalesce(vote_count_subquery.c.total_votes, 0).desc() if order_by_clause is None else order_by_clause)
        .offset(skip)
        .limit(limit)
    )

    if search:
        search = f"%{search}%"
        query = query.where(
            or_(Poll.title.ilike(search), Poll.description.ilike(search))
        )

    polls = session.exec(query).unique().all()
    total_count = polls[0][3] if polls else 0

    data = [
        _serialize_poll_public(poll, total_votes or 0,
                               session.exec(
                                   select(PollOption)
                                   .where(PollOption.id == selected_option)).first()
                               )
        for poll, total_votes, selected_option, _ in polls
    ]

    return PollsResponse(data=data, count=total_count)


@ router.get("/", response_model=PollsResponse)
def get_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all polls."""
    polls = _get_polls(
        user=user,
        session=session,
        skip=skip,
        limit=limit,
        search=search,
        where_clause=or_(
            Poll.is_private.is_(False),
            Poll.creator_email == user.email,
            Poll.roll_ranges.any(
                and_(RollRange.start <= user.roll, RollRange.end >= user.roll)
            ),
        ),
        order_by_clause=Poll.created_at.desc()
    )
    return polls


@ router.get("/public", response_model=PollsResponse)
def get_public_polls(session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all public polls."""
    polls = _get_polls(
        user=None,
        session=session,
        skip=skip,
        limit=limit,
        search=search,
        where_clause=Poll.is_private.is_(False),
        order_by_clause=Poll.created_at.desc()
    )
    return polls


@ router.get("/my-polls", response_model=PollsResponse)
def get_my_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all polls created by the user."""
    polls = _get_polls(
        user=user,
        session=session,
        skip=skip,
        limit=limit,
        search=search,
        where_clause=Poll.creator_email == user.email,
        order_by_clause=Poll.created_at.desc()
    )
    return polls


@ router.get("/allowed-polls", response_model=PollsResponse)
def get_allowed_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all polls allowed for the user."""
    polls = _get_polls(
        user=user,
        session=session,
        skip=skip,
        limit=limit,
        search=search,
        where_clause=or_(
            Poll.is_private.is_(False),
            Poll.creator_email == user.email,
            Poll.roll_ranges.any(
                and_(RollRange.start <= user.roll, RollRange.end >= user.roll)
            )
        ),
        order_by_clause=Poll.created_at.desc()
    )
    return polls


@ router.get("/popular-polls", response_model=PollsResponse)
def get_popular_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all popular polls."""
    polls = _get_polls(
        user=user,
        session=session,
        skip=skip,
        limit=limit,
        search=search,
        where_clause=or_(
            Poll.is_private.is_(False),
            Poll.creator_email == user.email,
            Poll.roll_ranges.any(
                and_(RollRange.start <= user.roll, RollRange.end >= user.roll)
            ),
        ),
    )
    return polls


@ router.get("/upcoming-polls", response_model=PollsResponse)
def get_upcoming_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all upcoming polls."""
    polls = _get_polls(
        user=user,
        session=session,
        skip=skip,
        limit=limit,
        search=search,
        where_clause=and_(
            Poll.start_time > datetime.now(timezone.utc),
            or_(
                Poll.is_private.is_(False),
                Poll.creator_email == user.email,
                Poll.roll_ranges.any(
                    and_(RollRange.start <= user.roll, RollRange.end >= user.roll))
            )
        ),
        order_by_clause=Poll.start_time.asc()
    )
    return polls


@ router.get("/ended-polls", response_model=PollsResponse)
def get_ended_polls(user: CurrentUser, session: SessionDep, skip: int = 0, limit: int = 20, search: str = None):
    """Get all ended polls."""
    polls = _get_polls(
        user=user,
        session=session,
        skip=skip,
        limit=limit,
        search=search,
        where_clause=and_(
            Poll.end_time < datetime.now(timezone.utc),
            or_(
                Poll.is_private.is_(False),
                Poll.creator_email == user.email,
                Poll.roll_ranges.any(
                    and_(RollRange.start <= user.roll, RollRange.end >= user.roll))
            )
        ),
        order_by_clause=Poll.end_time.desc()
    )
    return polls


@ router.post("/create", response_model=PollCreateResponse)
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


@ router.get("/{poll_id}", response_model=PollResponse)
def get_poll(poll_id: UUID, user: CurrentUser, session: SessionDep):
    """Get a poll by its ID."""
    poll_with_votes = session.exec(
        select(Poll, func.coalesce(func.count(Vote.id), 0).label('total_votes'))
        .outerjoin(PollOption, PollOption.poll_id == Poll.id)
        .outerjoin(Vote, Vote.option_id == PollOption.id)
        .where(Poll.id == poll_id)
        .group_by(Poll.id)
    ).first()

    if not poll_with_votes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Poll not found")

    poll, total_votes = poll_with_votes

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    selected_option = session.exec(
        select(PollOption)
        .join(Vote, Vote.option_id == PollOption.id)
        .where(Vote.voter_email_hash == hash_email(user.email), PollOption.poll_id == poll_id)
    ).first()

    return _serialize_poll_public(poll, total_votes, selected_option)


@ router.delete("/{poll_id}", response_model=Message)
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


@ router.get("/{poll_id}/options", response_model=PollOptions)
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


@ router.get("/{poll_id}/roll-ranges", response_model=RollRanges)
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


@ router.post("/{poll_id}/options", response_model=Message)
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
    if len(option_texts) < 2:
        raise HTTPException(
            status_code=400, detail="At least two options is required")
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


@ router.post("/{poll_id}/roll-ranges", response_model=Message)
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


@ router.get("/{poll_id}/result", response_model=PollResult)
def get_poll_result(poll_id: UUID, user: CurrentUser, session: SessionDep):
    """Get the result of a poll."""
    poll = session.get(Poll, poll_id)

    if not poll:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Poll not found")

    if poll.is_private and poll.creator_email != user.email and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to view this poll")

    if poll.end_time > datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Poll has not ended yet")

    results = session.exec(
        select(PollOption.option_text, func.coalesce(
            func.count(Vote.id), 0).label('votes'))
        .outerjoin(Vote, Vote.option_id == PollOption.id)
        .where(PollOption.poll_id == poll_id)
        .group_by(PollOption.option_text)
    ).all()

    total_votes = sum([result.votes for result in results])
    data = [
        PollOptionResult(option_text=result.option_text, votes=result.votes)
        for result in results
    ]

    return PollResult(data=data, total_votes=total_votes)
