from datetime import datetime, timezone
from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ComponentRef(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    component_id: str
    component_type: str
    name: str | None = None

    @field_validator("component_id", "component_type")
    @classmethod
    def validate_required_identity(cls, value: str) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError("Component identity fields must be non-empty strings.")
        return value.strip()


class FlowEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    event_id: UUID = Field(default_factory=uuid4)
    flow_id: UUID
    correlation_id: UUID | None = None
    parent_event_id: UUID | None = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    source: ComponentRef
    destination: ComponentRef
    action: str
    data_labels: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    status: str = "observed"
    duration_ms: float | None = Field(default=None, ge=0)

    @field_validator("action")
    @classmethod
    def validate_action(cls, value: str) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError("action must be a non-empty string.")
        return value.strip()

    @field_validator("timestamp")
    @classmethod
    def normalize_timestamp(cls, value: datetime) -> datetime:
        if value.utcoffset() is None:
            raise ValueError("timestamp must include a timezone")
        return value.astimezone(timezone.utc)