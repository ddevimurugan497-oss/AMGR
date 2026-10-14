"""Condition AST schemas and mapping-path resolution for policy evaluation.

The dotted mapping-key path grammar and depth limit below are conservative
compatibility assumptions; the project has no authoritative path/depth spec.
"""

from __future__ import annotations

import re
from collections.abc import Mapping
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator

from backend.app.schemas.policy_enums import (
    AttributeResolutionStatus,
    ConditionOperator,
)


# Assumed cap, counting the root rule or group as depth one.
MAX_CONDITION_DEPTH = 8

# Assumed syntax: dot-separated mapping keys; no sequence indices or attributes.
_PATH_PATTERN = re.compile(
    r"^[A-Za-z_][A-Za-z0-9_-]*(?:\.[A-Za-z_][A-Za-z0-9_-]*)*$"
)


class ConditionRule(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    field: str = Field(..., min_length=1)
    operator: ConditionOperator
    value: Any = None


class ConditionGroup(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    all_of: tuple[ConditionRule | ConditionGroup, ...] | None = None
    any_of: tuple[ConditionRule | ConditionGroup, ...] | None = None
    none_of: tuple[ConditionRule | ConditionGroup, ...] | None = None

    @model_validator(mode="after")
    def validate_group(self) -> ConditionGroup:
        groups = (self.all_of, self.any_of, self.none_of)
        present = [items for items in groups if items is not None]

        if not present:
            raise ValueError(
                "A condition group must specify at least one operator."
            )
        if any(not items for items in present):
            raise ValueError(
                "Condition-group operator lists must not be empty."
            )
        if _condition_depth(self) > MAX_CONDITION_DEPTH:
            raise ValueError(
                f"Condition nesting exceeds maximum depth "
                f"{MAX_CONDITION_DEPTH}."
            )

        return self


ConditionGroup.model_rebuild()


def _condition_depth(
    condition: ConditionRule | ConditionGroup,
) -> int:
    if isinstance(condition, ConditionRule):
        return 1

    children = (
        child
        for items in (condition.all_of, condition.any_of, condition.none_of)
        if items is not None
        for child in items
    )
    child_depths = [_condition_depth(child) for child in children]
    return 1 + max(child_depths)


def resolve_attribute(
    context: Mapping[str, Any],
    field: str,
) -> tuple[AttributeResolutionStatus, Any]:
    if not isinstance(field, str) or not _PATH_PATTERN.fullmatch(field):
        return AttributeResolutionStatus.INVALID_PATH, None

    current: Any = context
    for segment in field.split("."):
        if not isinstance(current, Mapping):
            return AttributeResolutionStatus.INVALID_PATH, None
        if segment not in current:
            return AttributeResolutionStatus.MISSING, None
        current = current[segment]

    return AttributeResolutionStatus.FOUND, current
