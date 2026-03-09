from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.account import Account

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_account(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Account:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        account_id: str = payload.get("sub")
        if account_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    account = db.query(Account).filter(Account.account_id == account_id).first()
    if account is None or not account.is_active:
        raise credentials_exception
    return account


def require_admin(current_account: Account = Depends(get_current_account)) -> Account:
    if current_account.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required.")
    return current_account
