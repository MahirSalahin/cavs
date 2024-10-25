from fastapi import APIRouter
from api.deps import CurrentUser
from models.common import AuthUser
router = APIRouter()

@router.get("/current", response_model=AuthUser)
def get_current_user(current_user: CurrentUser):
    """
    Get current user.
    """
    return current_user