import type {
  ApprovalStatus,
  OperatorResponseType,
  PolicyChangeType,
  PolicyEffect,
} from "@/lib/types";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export type SupportedStatus =
  | ApprovalStatus
  | OperatorResponseType
  | PolicyChangeType
  | PolicyEffect;

const statusTones: Record<string, StatusTone> = {
  ALLOW: "success",
  APPROVED: "success",
  BLOCK: "danger",
  CREATED: "info",
  UPDATED: "info",
  ACTIVATED: "info",
  DEACTIVATED: "neutral",
  EXPIRED: "neutral",
  PENDING: "warning",
  REJECTED: "danger",
  REQUIRE_APPROVAL: "warning",
  answer: "neutral",
  clarification: "warning",
  error: "danger",
  proposal: "info",
};

interface StatusBadgeProps {
  status: SupportedStatus | (string & {});
  label?: string;
  tone?: StatusTone;
}

export function StatusBadge({ status, label = status, tone }: StatusBadgeProps) {
  const resolvedTone = tone ?? statusTones[status] ?? "neutral";

  return (
    <span className="status-badge" data-tone={resolvedTone}>
      {label}
    </span>
  );
}
