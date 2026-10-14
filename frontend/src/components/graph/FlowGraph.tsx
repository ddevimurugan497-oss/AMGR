import { ComponentNode } from "@/components/graph/ComponentNode";
import { EmptyState } from "@/components/ui/empty-state";
import type { GraphEdge, GraphNode } from "@/lib/types";

interface FlowGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string | null;
  selectedEdgeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onSelectEdge?: (edgeId: string) => void;
}

export function FlowGraph({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
}: FlowGraphProps) {
  if (nodes.length === 0 && edges.length === 0) {
    return (
      <EmptyState
        eyebrow="Flow graph"
        title="No graph data available"
        description="There are no nodes or connections to display."
      />
    );
  }

  return (
    <section className="flow-graph" aria-label="Flow graph">
      <section className="flow-graph-section" aria-labelledby="flow-graph-nodes-title">
        <h2 id="flow-graph-nodes-title">Components</h2>
        {nodes.length > 0 ? (
          <ul className="flow-graph-nodes">
            {nodes.map((node) => (
              <li key={node.id}>
                <ComponentNode
                  node={node}
                  selected={selectedNodeId === node.id}
                  onSelect={onSelectNode ? () => onSelectNode(node.id) : undefined}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="flow-graph-empty-message">No component nodes were returned.</p>
        )}
      </section>

      <section className="flow-graph-section" aria-labelledby="flow-graph-edges-title">
        <h2 id="flow-graph-edges-title">Connections</h2>
        {edges.length > 0 ? (
          <ol className="flow-graph-edges">
            {edges.map((edge) => {
              const selected = selectedEdgeId === edge.id;
              const content = (
                <>
                  <span className="flow-graph-edge-endpoint">
                    <span className="flow-graph-edge-label">Source</span>
                    <span className="flow-graph-edge-value">{edge.source}</span>
                  </span>
                  <span className="flow-graph-edge-action">
                    <span className="flow-graph-edge-label">Action</span>
                    <span className="flow-graph-edge-value">{edge.action}</span>
                  </span>
                  <span className="flow-graph-edge-endpoint">
                    <span className="flow-graph-edge-label">Target</span>
                    <span className="flow-graph-edge-value">{edge.target}</span>
                  </span>
                </>
              );

              return (
                <li key={edge.id}>
                  {onSelectEdge ? (
                    <button
                      className="flow-graph-edge flow-graph-edge-selectable"
                      type="button"
                      aria-pressed={selected}
                      aria-label={`Select connection from ${edge.source} to ${edge.target}, action ${edge.action}`}
                      onClick={() => onSelectEdge(edge.id)}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className="flow-graph-edge">{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="flow-graph-empty-message">No connections were returned.</p>
        )}
      </section>
    </section>
  );
}
