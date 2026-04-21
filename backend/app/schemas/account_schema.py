from uuid import UUID

from pydantic import BaseModel, EmailStr


class AccountBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str = "user"


class AccountCreate(AccountBase):
    password: str


class AccountResponse(AccountBase):
    account_id: UUID
    is_active: bool

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
