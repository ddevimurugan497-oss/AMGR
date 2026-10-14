import type { GraphNode as GraphNodeData } from "@/lib/types";

interface ComponentNodeProps {
  node: GraphNodeData;
  selected?: boolean;
  onSelect?: () => void;
}

export function ComponentNode({ node, selected = false, onSelect }: ComponentNodeProps) {
  const label = node.label?.trim() || node.component.name?.trim() || node.id;

  if (onSelect) {
    return (
      <button
        className="component-node component-node-selectable"
        type="button"
        aria-label={`Select component ${label}, ${node.component.component_type}`}
        aria-pressed={selected}
        onClick={onSelect}
      >
        <span className="component-node-type">{node.component.component_type}</span>
        <span className="component-node-label">{label}</span>
        <span className="component-node-id">ID: {node.id}</span>
      </button>
    );
  }

  return (
    <article className="component-node" aria-label={`${label}, ${node.component.component_type}`}>
      <span className="component-node-type">{node.component.component_type}</span>
      <span className="component-node-label">{label}</span>
      <span className="component-node-id">ID: {node.id}</span>
    </article>
  );
}
