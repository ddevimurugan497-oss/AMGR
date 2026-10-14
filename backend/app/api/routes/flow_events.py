from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...services.event_ingestion import (
    DuplicateFlowEventError,
    EventIngestionService,
)
from ...schemas.flow_event import FlowEvent

router = APIRouter()


@router.post("", response_model=FlowEvent, status_code=status.HTTP_201_CREATED)
def ingest_flow_event(
    event: FlowEvent,
    db: Session = Depends(get_db),
) -> FlowEvent:
    try:
        return EventIngestionService(db).ingest(event)
    except DuplicateFlowEventError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Flow event '{exc}' already exists.",
        ) from exc