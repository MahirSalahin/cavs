from fastapi import APIRouter
from api.routes import poll, vote, user

api_router = APIRouter()
api_router.include_router(poll.router, prefix="/polls", tags=["polls"])
api_router.include_router(vote.router, prefix="/votes", tags=["votes"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
