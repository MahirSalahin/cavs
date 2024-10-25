from pydantic import EmailStr, BaseModel


class Message(BaseModel):
    message: str


class AuthUser(BaseModel):
    email: EmailStr
    full_name: str
    roll: int
    avatar_url: str = None
