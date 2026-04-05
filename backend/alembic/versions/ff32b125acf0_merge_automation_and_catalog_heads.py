"""merge automation and catalog heads

Revision ID: ff32b125acf0
Revises: a1b2c3d4e5f7, c1d2e3f4g5h6
Create Date: 2026-04-05 14:25:41.105456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ff32b125acf0'
down_revision: Union[str, Sequence[str], None] = ('a1b2c3d4e5f7', 'c1d2e3f4g5h6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
