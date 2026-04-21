from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.api.deps import get_current_account
from app.core.database import get_db
from app.models.account import Account
from app.schemas.account_schema import (
    AccountCreate,
    AccountResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    ResetPasswordRequest,
    TokenResponse,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


@router.post("/register", response_model=AccountResponse, status_code=201)
def register(payload: AccountCreate, db: Session = Depends(get_db)):
    return auth_service.register_account(payload, db)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(payload, db)


@router.post("/logout")
def logout(
    token: str = Depends(oauth2_scheme),
    _: Account = Depends(get_current_account),
):
    return auth_service.logout(token)


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.request_password_reset(payload, db)


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_service.reset_password(payload, db)


@router.get("/me", response_model=AccountResponse)
def get_current_user(
    current_account: Account = Depends(get_current_account),
):
    """Get current authenticated user's profile."""
    return current_account
