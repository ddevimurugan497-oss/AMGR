import type { GraphEdge } from "@/lib/types";

interface LineagePanelProps {
  edge?: GraphEdge | null;
}

export function LineagePanel({ edge }: LineagePanelProps) {
  return (
    <section className="lineage-panel" aria-labelledby="lineage-panel-title">
      <h2 id="lineage-panel-title">Edge history and lineage</h2>
      {edge ? (
        <dl className="lineage-edge-details">
          <div>
            <dt>Edge ID</dt>
            <dd>{edge.id}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{edge.source}</dd>
          </div>
          <div>
            <dt>Target</dt>
            <dd>{edge.target}</dd>
          </div>
          <div>
            <dt>Action</dt>
            <dd>{edge.action}</dd>
          </div>
        </dl>
      ) : (
        <p className="lineage-panel-message">
          Select an edge from available graph data to view its confirmed fields.
        </p>
      )}
      <p className="lineage-panel-message" role="note">
        Edge event history and lineage are unavailable. The backend graph and flow-event
        endpoints return HTTP 501, and no lineage query endpoint is defined.
      </p>
    </section>
  );
}
