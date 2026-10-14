"""SQLAlchemy model for persisted runtime flow events."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.session import Base


class FlowEventModel(Base):
    """Persist a validated flow event and indexed graph-query fields."""

    __tablename__ = "flow_events"

    event_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    flow_id: Mapped[str] = mapped_column(String(36), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    event_data: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
