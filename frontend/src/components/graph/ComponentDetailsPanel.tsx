import type { GraphNode } from "@/lib/types";

interface ComponentDetailsPanelProps {
  component?: GraphNode | null;
}

export function ComponentDetailsPanel({ component }: ComponentDetailsPanelProps) {
  if (!component) {
    return (
      <section className="component-details-panel" aria-labelledby="component-details-title">
        <h2 id="component-details-title">Component details</h2>
        <p className="component-details-unavailable" role="status">
          Select a component from available graph data to view its details.
        </p>
      </section>
    );
  }

  const label = component.label?.trim() || component.component.name?.trim() || component.id;

  return (
    <section className="component-details-panel" aria-labelledby="component-details-title">
      <h2 id="component-details-title">Component details</h2>
      <dl className="component-details-list">
        <div>
          <dt>Label</dt>
          <dd>{label}</dd>
        </div>
        <div>
          <dt>Node ID</dt>
          <dd>{component.id}</dd>
        </div>
        <div>
          <dt>Component ID</dt>
          <dd>{component.component.component_id}</dd>
        </div>
        <div>
          <dt>Component type</dt>
          <dd>{component.component.component_type}</dd>
        </div>
      </dl>
      <p className="component-details-unavailable" role="note">
        Additional component details are unavailable; the backend does not provide a component-detail endpoint.
      </p>
    </section>
  );
}
