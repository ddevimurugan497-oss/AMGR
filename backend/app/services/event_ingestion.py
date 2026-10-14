"""Persistence service for validated runtime flow events."""

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.app.models.flow_event import FlowEventModel
from backend.app.schemas.flow_event import FlowEvent


class DuplicateFlowEventError(Exception):
    """Raised when an event with the same event ID has already been stored."""


class EventIngestionService:
    """Store validated flow events without synthesizing event data."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def ingest(self, event: FlowEvent) -> FlowEvent:
        record = FlowEventModel(
            event_id=str(event.event_id),
            flow_id=str(event.flow_id),
            timestamp=event.timestamp,
            event_data=event.model_dump(mode="json"),
        )
        self._db.add(record)

        try:
            self._db.commit()
        except IntegrityError as exc:
            self._db.rollback()
            raise DuplicateFlowEventError(str(event.event_id)) from exc

        return event
