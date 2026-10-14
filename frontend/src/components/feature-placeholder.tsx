import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

interface FeaturePlaceholderProps {
  title: string;
  purpose: string;
  availability: string;
}

export function FeaturePlaceholder({
  title,
  purpose,
  availability,
}: FeaturePlaceholderProps) {
  return (
    <div className="page-content">
      <PageHeader
        title={title}
        subtitle={purpose}
        breadcrumbs={[{ label: "Workspace", href: "/" }, { label: title }]}
        actions={<StatusBadge status="Dashboard UI not implemented" />}
      />
      <div className="placeholder-rule" aria-hidden="true" />
      <EmptyState
        eyebrow="Feature unavailable"
        title="This dashboard area is not implemented"
        description={availability}
        action={<Link className="ui-state-link" href="/">Back to Overview</Link>}
      />
    </div>
  );
}