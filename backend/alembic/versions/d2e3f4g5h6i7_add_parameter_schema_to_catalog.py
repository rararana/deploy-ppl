"""add_parameter_schema_to_catalog

Revision ID: d2e3f4g5h6i7
Revises: ff32b125acf0
Create Date: 2026-04-22 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = 'd2e3f4g5h6i7'
down_revision: Union[str, Sequence[str], None] = 'ff32b125acf0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('catalog_items',
        sa.Column('action_key', sa.String(length=100), nullable=True)
    )
    op.add_column('catalog_items',
        sa.Column('parameter_schema', postgresql.JSON(astext_type=sa.Text()), nullable=False, server_default='{}')
    )


def downgrade() -> None:
    op.drop_column('catalog_items', 'parameter_schema')
    op.drop_column('catalog_items', 'action_key')
