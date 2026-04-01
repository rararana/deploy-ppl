"""add_automation_placeholder_schema

Revision ID: a1b2c3d4e5f7
Revises: 001a2b3c4d5e
Create Date: 2026-04-01 17:30:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f7"
down_revision: Union[str, Sequence[str], None] = "001a2b3c4d5e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "workflows",
        sa.Column("webhook_token", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "workflows",
        sa.Column(
            "workflow_schema",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
    )
    op.add_column(
        "workflows",
        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )

    op.create_index("ix_workflows_webhook_token", "workflows", ["webhook_token"], unique=True)

    op.create_table(
        "executions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("workflow_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("initial_payload", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("current_state", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("started_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        sa.Column("finished_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["workflow_id"], ["workflows.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_executions_workflow_id", "executions", ["workflow_id"], unique=False)

    op.create_table(
        "task_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("execution_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("node_id", sa.Text(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False),
        sa.Column("result_output", sa.Text(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["execution_id"], ["executions.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_task_logs_execution_id", "task_logs", ["execution_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_task_logs_execution_id", table_name="task_logs")
    op.drop_table("task_logs")

    op.drop_index("ix_executions_workflow_id", table_name="executions")
    op.drop_table("executions")

    op.drop_index("ix_workflows_webhook_token", table_name="workflows")
    op.drop_column("workflows", "created_at")
    op.drop_column("workflows", "workflow_schema")
    op.drop_column("workflows", "webhook_token")
