"""
Data seeding script for accounts.
Populates the database with a default account that can be customized by editing
the email string below.
"""

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.account import Account


SEED_ACCOUNT_EMAIL = "bertha.soliany@gmail.com"
SEED_ACCOUNT_FULL_NAME = "Seeded User"
SEED_ACCOUNT_PASSWORD = "Password123!"
SEED_ACCOUNT_ROLE = "user"


def seed_accounts(db: Session) -> None:
    """
    Seed a default account if the configured email does not exist.

    Update `SEED_ACCOUNT_EMAIL` to any email address you want to seed.
    """
    existing_account = db.query(Account).filter(Account.email == SEED_ACCOUNT_EMAIL).first()
    if existing_account:
        print(f"Account seed skipped: {SEED_ACCOUNT_EMAIL} already exists")
        return

    account = Account(
        full_name=SEED_ACCOUNT_FULL_NAME,
        email=SEED_ACCOUNT_EMAIL,
        password_hash=hash_password(SEED_ACCOUNT_PASSWORD),
        role=SEED_ACCOUNT_ROLE,
        is_active=True,
    )
    db.add(account)
    db.commit()
    print(f"Seeded account: {SEED_ACCOUNT_EMAIL}")
