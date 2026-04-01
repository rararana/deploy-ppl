"""update_schema_to_current_models

Revision ID: 001a2b3c4d5e
Revises: 98a5c6c1c14e
Create Date: 2026-04-01 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '001a2b3c4d5e'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to match current models."""
    # Drop old tables
    op.drop_table('execution_history')
    op.drop_table('workflows')
    op.drop_table('requests')
    
    # Create new workflows table with updated schema
    op.create_table('workflows',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Create new execution_logs table
    op.create_table('execution_logs',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('workflow_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('details', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['workflow_id'], ['workflows.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_execution_logs_workflow_id'), 'execution_logs', ['workflow_id'], unique=False)
    
    # Create new request_logs table
    op.create_table('request_logs',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('workflow_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('details', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['workflow_id'], ['workflows.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_request_logs_workflow_id'), 'request_logs', ['workflow_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_request_logs_workflow_id'), table_name='request_logs')
    op.drop_table('request_logs')
    op.drop_index(op.f('ix_execution_logs_workflow_id'), table_name='execution_logs')
    op.drop_table('execution_logs')
    op.drop_table('workflows')
    
    # Recreate old tables for rollback
    op.create_table('requests',
    sa.Column('request_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('account_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('request_type', sa.Enum('trigger', 'approval', 'other', name='request_type'), nullable=False),
    sa.Column('request_detail', sa.Text(), nullable=True),
    sa.Column('request_status', sa.Enum('pending', 'approved', 'rejected', name='request_status'), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['accounts.account_id'], ),
    sa.PrimaryKeyConstraint('request_id')
    )
    op.create_table('workflows',
    sa.Column('workflow_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('account_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('n8n_workflow_id', sa.String(length=255), nullable=True),
    sa.Column('workflow_name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['accounts.account_id'], ),
    sa.PrimaryKeyConstraint('workflow_id')
    )
    op.create_table('execution_history',
    sa.Column('execution_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('workflow_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('n8n_execution_id', sa.String(length=255), nullable=True),
    sa.Column('execution_status', sa.Enum('running', 'success', 'error', 'unknown', name='execution_status'), nullable=False),
    sa.Column('error_message', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['workflow_id'], ['workflows.workflow_id'], ),
    sa.PrimaryKeyConstraint('execution_id')
    )
