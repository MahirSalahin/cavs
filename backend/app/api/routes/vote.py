from fastapi import APIRouter, HTTPException, status
from sqlmodel import select, and_

from core.security import hash_email
from api.deps import SessionDep, CurrentUser
from models.common import Message
from models.poll import Poll, PollOption
from models.vote import Vote, VoteCreateRequest
from utils.current_bst_time import current_bst_time
from utils.email_validator import is_valid_cuet_email

router = APIRouter()

@router.post("/vote", response_model=Message)
def vote(request: VoteCreateRequest, user: CurrentUser, session: SessionDep):
    if not is_valid_cuet_email(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Must vote with CUET email")

    voter_email_hash = hash_email(user.email)

    poll_option = session.exec(
        select(PollOption)
        .where(PollOption.id == request.option_id)
        .with_for_update()
    ).first()
    if not poll_option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="PollOption not found")

    poll = session.get(Poll, poll_option.poll_id)
    if (poll.is_private and poll.creator_email != user.email
            and not any(roll_range.start <= user.roll <= roll_range.end for roll_range in poll.roll_ranges)
            ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to vote in this poll")
    if poll.start_time.astimezone(current_bst_time().tzinfo) > current_bst_time():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Poll not started yet")
    if poll.end_time.astimezone(current_bst_time().tzinfo) < current_bst_time():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Poll has ended")

    if session.exec(
            select(Vote)
            .join(PollOption)
            .where(
                and_(
                    Vote.voter_email_hash == voter_email_hash,
                    PollOption.poll_id == poll.id
                )
            )
    ).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="You have already voted in this poll")

    poll_option.total_votes += 1
    vote = Vote(
        option_id=request.option_id,
        voter_email_hash=voter_email_hash
    )
    session.add(vote)
    session.commit()
    session.refresh(vote)
    return Message(message="Voted successfully")