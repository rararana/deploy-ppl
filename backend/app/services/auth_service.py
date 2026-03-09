# from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.account import Account
from app.schemas.account_schema import AccountCreate, LoginRequest, TokenResponse


def register_account(payload: AccountCreate, db: Session) -> Account:
    pass


def login(payload: LoginRequest, db: Session) -> TokenResponse:
    pass
