"""
Data seeding script for accounts.
Populates the database with default accounts for local development.
"""

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.account import Account


DEFAULT_ACCOUNTS = [
    {
        "full_name": "Admin",
        "email": "admin@itb.ac.id",
        "role": "admin",
        "password": "password",
    },
    {
        "full_name": "User",
        "email": "user@itb.ac.id",
        "role": "user",
        "password": "password",
    },
]


def seed_accounts(db: Session) -> None:
    """
    Seed default accounts if their configured emails do not exist.
    """
    inserted_count = 0
    skipped_count = 0

    for account_data in DEFAULT_ACCOUNTS:
        existing_account = db.query(Account).filter(Account.email == account_data["email"]).first()
        if existing_account:
            skipped_count += 1
            print(f"Account seed skipped: {account_data['email']} already exists")
            continue

        account = Account(
            full_name=account_data["full_name"],
            email=account_data["email"],
            password_hash=hash_password(account_data["password"]),
            role=account_data["role"],
            is_active=True,
        )
        db.add(account)
        inserted_count += 1

    db.commit()
    print(f"Account seeding complete: inserted {inserted_count}, skipped {skipped_count}")
