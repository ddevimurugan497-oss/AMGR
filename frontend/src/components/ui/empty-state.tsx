import type { ReactNode } from "react";
import { useId } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  eyebrow?: string;
  marker?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, eyebrow, marker, action }: EmptyStateProps) {
  const titleId = useId();

  return (
    <section className="empty-state" aria-labelledby={titleId}>
      {marker && <div className="empty-state-mark" aria-hidden="true">{marker}</div>}
      <div className="empty-state-content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={titleId}>{title}</h2>
        <p className="empty-state-description">{description}</p>
        {action && <div className="empty-state-action">{action}</div>}
      </div>
    </section>
  );
}
