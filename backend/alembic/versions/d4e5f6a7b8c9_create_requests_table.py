"""create requests table

Revision ID: d4e5f6a7b8c9
Revises: e3f4g5h6i7j8
Create Date: 2026-04-23 03:10:13.327473

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, Sequence[str], None] = "e3f4g5h6i7j8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index("ix_request_logs_workflow_id", table_name="request_logs")
    op.drop_table("request_logs")

    op.execute("""
        DO $$ BEGIN
            CREATE TYPE catalog_request_type AS ENUM ('trigger', 'action');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)
    op.execute("""
        DO $$ BEGIN
            CREATE TYPE catalog_request_status AS ENUM ('pending', 'approved', 'rejected');
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
    """)

    request_type_enum = postgresql.ENUM("trigger", "action", name="catalog_request_type", create_type=False)
    request_status_enum = postgresql.ENUM("pending", "approved", "rejected", name="catalog_request_status", create_type=False)

    op.create_table(
        "requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("account_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("type", request_type_enum, nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", request_status_enum, nullable=False, server_default="pending"),
        sa.Column("admin_note", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.account_id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("requests")
    op.execute("DROP TYPE IF EXISTS catalog_request_type")
    op.execute("DROP TYPE IF EXISTS catalog_request_status")

    op.create_table(
        "request_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("workflow_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("details", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["workflow_id"], ["workflows.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_request_logs_workflow_id", "request_logs", ["workflow_id"], unique=False)
