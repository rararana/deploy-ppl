"""bridge_missing_revision

Revision ID: b2c3d4e5f6a1
Revises: 98a5c6c1c14e
Create Date: 2026-04-01 09:50:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a1'
down_revision: Union[str, Sequence[str], None] = '98a5c6c1c14e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Placeholder migration to bridge missing revision."""
    pass


def downgrade() -> None:
    """Placeholder migration to bridge missing revision."""
    pass
