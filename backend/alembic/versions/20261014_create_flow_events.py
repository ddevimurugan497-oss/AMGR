"""Create persisted flow events table."""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20261014_flow_events"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "flow_events",
        sa.Column("event_id", sa.String(length=36), nullable=False),
        sa.Column("flow_id", sa.String(length=36), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("event_data", sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint("event_id"),
    )
    op.create_index(
        "ix_flow_events_flow_id", "flow_events", ["flow_id"], unique=False
    )
    op.create_index(
        "ix_flow_events_timestamp", "flow_events", ["timestamp"], unique=False
    )


def downgrade() -> None:
    op.drop_index("ix_flow_events_timestamp", table_name="flow_events")
    op.drop_index("ix_flow_events_flow_id", table_name="flow_events")
    op.drop_table("flow_events")
