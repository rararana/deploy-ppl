"""add_catalog_items_table

Revision ID: c1d2e3f4g5h6
Revises: 001a2b3c4d5e
Create Date: 2026-04-03 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c1d2e3f4g5h6'
down_revision: Union[str, Sequence[str], None] = '001a2b3c4d5e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create catalog_items table for automation triggers and actions."""
    op.create_table('catalog_items',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('icon_key', sa.String(length=50), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('category', sa.String(length=50), nullable=False),
    sa.Column('item_type', sa.String(length=50), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_catalog_items_category'), 'catalog_items', ['category'], unique=False)


def downgrade() -> None:
    """Drop catalog_items table."""
    op.drop_index(op.f('ix_catalog_items_category'), table_name='catalog_items')
    op.drop_table('catalog_items')