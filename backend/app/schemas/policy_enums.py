"""Policy-engine enums required by the current schema and evaluator consumers.

Uppercase string values follow existing member references and examples; their
complete API serialization contract has not been independently confirmed.
"""

from enum import Enum


class PolicyEffect(str, Enum):
    ALLOW = "ALLOW"
    BLOCK = "BLOCK"
    REQUIRE_APPROVAL = "REQUIRE_APPROVAL"


class RuleResolutionAlgorithm(str, Enum):
    FIRST_APPLICABLE = "FIRST_APPLICABLE"
    BLOCK_OVERRIDES = "BLOCK_OVERRIDES"
    ALLOW_OVERRIDES = "ALLOW_OVERRIDES"


class ConditionOperator(str, Enum):
    EXISTS = "EXISTS"
    NOT_EXISTS = "NOT_EXISTS"
    EQ = "EQ"
    NOT_EQ = "NOT_EQ"
    IN = "IN"
    NOT_IN = "NOT_IN"
    CONTAINS = "CONTAINS"
    STARTS_WITH = "STARTS_WITH"
    ENDS_WITH = "ENDS_WITH"
    GT = "GT"
    GTE = "GTE"
    LT = "LT"
    LTE = "LTE"


class AttributeResolutionStatus(str, Enum):
    FOUND = "FOUND"
    MISSING = "MISSING"
    INVALID_PATH = "INVALID_PATH"


class PolicyChangeType(str, Enum):
    pass
