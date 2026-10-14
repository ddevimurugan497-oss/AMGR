import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

const dashboardSections = [
  {
    title: "Flow Graph",
    href: "/graph",
    description: "Planned view of runtime component relationships; graph persistence and visualization are not implemented yet.",
  },
  {
    title: "Policies",
    href: "/policies",
    description: "Policy lifecycle and deterministic evaluation are not implemented yet.",
  },
  {
    title: "Decisions",
    href: "/decisions",
    description: "Authorization decision history is not implemented yet.",
  },
  {
    title: "Approvals",
    href: "/approvals",
    description: "Approval workflows are not implemented yet.",
  },
  {
    title: "AI Security Operator",
    href: "/operator",
    description: "The operator UI and provider integration are not implemented yet.",
  },
];

export default function OverviewPage() {
  return (
    <div className="page-content">
      <PageHeader
        title="Overview"
        subtitle="AMGR runtime governance workspace."
      />

      <EmptyState
        eyebrow="Live data unavailable"
        title="Overview data is not connected"
        description="The backend does not currently expose an aggregate overview endpoint. Graph, policy, authorization, and approval data routes are not yet implemented."
      />

      <section className="overview-sections" aria-labelledby="overview-sections-title">
        <div className="overview-sections-heading">
          <h2 id="overview-sections-title">Dashboard areas</h2>
          <p>Choose an area to explore its current implementation status.</p>
        </div>
        <nav className="overview-grid" aria-label="Dashboard areas">
          {dashboardSections.map((section) => (
            <Link className="overview-card" href={section.href} key={section.href}>
              <span className="overview-card-title">{section.title}</span>
              <span className="overview-card-description">{section.description}</span>
              <span className="overview-card-link" aria-hidden="true">Open area <span>-&gt;</span></span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}