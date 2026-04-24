"""update executions table for runtime errors

Revision ID: f5a6b7c8d9e0
Revises: d4e5f6a7b8c9
Create Date: 2026-04-24 15:30:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "f5a6b7c8d9e0"
down_revision: Union[str, Sequence[str], None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("executions", "workflow_id", existing_type=sa.UUID(), nullable=True)
    op.alter_column("executions", "status", existing_type=sa.String(length=32), type_=sa.String(), nullable=False)
    op.add_column("executions", sa.Column("error_details", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("executions", "error_details")
    op.alter_column("executions", "status", existing_type=sa.String(), type_=sa.String(length=32), nullable=False)
    op.alter_column("executions", "workflow_id", existing_type=sa.UUID(), nullable=False)
