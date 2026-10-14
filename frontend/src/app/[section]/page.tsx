import { notFound } from "next/navigation";

import { FeaturePlaceholder } from "@/components/feature-placeholder";

const sections: Record<string, { title: string; purpose: string; availability: string }> = {
  graph: {
    title: "Flow Graph",
    purpose: "View relationships and information flows between runtime components.",
    availability: "The backend graph query handler currently returns HTTP 501. Graph data is not available in this dashboard.",
  },
  "flow-graph": {
    title: "Flow Graph",
    purpose: "View relationships and information flows between runtime components.",
    availability: "The backend graph query handler currently returns HTTP 501. Graph data is not available in this dashboard.",
  },
  policies: {
    title: "Policies",
    purpose: "Review governance policy definitions and enforcement rules.",
    availability: "The backend policy listing handler currently returns HTTP 501. Policy records are not available in this dashboard.",
  },
  decisions: {
    title: "Decisions",
    purpose: "Review authorization outcomes and their evaluation reasons.",
    availability: "The backend authorization decision handler currently returns HTTP 501. Decision records are not available in this dashboard.",
  },
  approvals: {
    title: "Approvals",
    purpose: "Review requests requiring human governance decisions.",
    availability: "The backend approval listing handler currently returns HTTP 501. Approval requests are not available in this dashboard.",
  },
  operator: {
    title: "AI Security Operator",
    purpose: "Ask security questions and review proposed governance actions.",
    availability: "The backend chat route requires an authenticated identity and an authorized scope. The dashboard chat interface is not implemented.",
  },
  "security-operator": {
    title: "AI Security Operator",
    purpose: "Ask security questions and review proposed governance actions.",
    availability: "The backend chat route requires an authenticated identity and an authorized scope. The dashboard chat interface is not implemented.",
  },
};

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const feature = sections[section];

  if (!feature) notFound();

  return (
    <FeaturePlaceholder
      title={feature.title}
      purpose={feature.purpose}
      availability={feature.availability}
    />
  );
}