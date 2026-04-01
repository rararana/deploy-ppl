from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, revoke_token, verify_password
from app.models.account import Account
from app.schemas.account_schema import AccountCreate, LoginRequest, TokenResponse


def register_account(payload: AccountCreate, db: Session) -> Account:
    """
    Register a new account.
    
    Args:
        payload: Account data (email, password, full_name, role)
        db: Database session
        
    Returns:
        Account object
        
    Raises:
        HTTPException 409: If email already exists
    """

    # exist = account with the same email as the payload email
    exist = db.query(Account).filter(Account.email == payload.email).first()
    
    if exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered."
        )
    
    # Hash password
    hashed_password = hash_password(payload.password)
    
    # Return value
    new_account = Account(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hashed_password,
        role=payload.role,
        is_active=True
    )
    
    # Save to database
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    
    return new_account


def login(payload: LoginRequest, db: Session) -> TokenResponse:
    """
    Authenticate user and return JWT access token.
    
    Args:
        payload: email and password
        db: Database session
        
    Returns:
        TokenResponse with access_token and token_type
        
    Raises:
        HTTPException 401:  credentials invalid or account inactive
    """

    # Find account by email
    account = db.query(Account).filter(Account.email == payload.email).first()
    
    # Validate account exists
    if not account:
        # add dummy verif pw for timing attack prevention (valid bcrypt hash)
        verify_password(payload.password, "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4beSmWX3x.YrP5lq")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    
    # Verify password and check if active
    if not account.is_active or not verify_password(payload.password, account.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Generate JWT token with account_id as subject
    access_token = create_access_token(data={"sub": str(account.account_id), "role": account.role})
    
    return TokenResponse(access_token=access_token, token_type="bearer")


def logout(token: str) -> dict[str, str]:
    revoke_token(token)
    return {"detail": "Logged out successfully."}
