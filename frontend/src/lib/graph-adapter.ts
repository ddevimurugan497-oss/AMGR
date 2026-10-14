import type { ComponentRef, GraphEdge, GraphNode, GraphResponse } from "@/lib/types";

export class GraphResponseValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphResponseValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== "string") {
    throw new GraphResponseValidationError(`${path} must be a string.`);
  }
  return value;
}

function adaptComponentRef(value: unknown, path: string): ComponentRef {
  if (!isRecord(value)) {
    throw new GraphResponseValidationError(`${path} must be an object.`);
  }

  const component: ComponentRef = {
    component_id: requireString(value.component_id, `${path}.component_id`),
    component_type: requireString(value.component_type, `${path}.component_type`),
  };

  if (value.name !== undefined) {
    if (value.name !== null && typeof value.name !== "string") {
      throw new GraphResponseValidationError(`${path}.name must be a string or null.`);
    }
    component.name = value.name;
  }

  return component;
}

function adaptNode(value: unknown, index: number): GraphNode {
  const path = `nodes[${index}]`;
  if (!isRecord(value)) {
    throw new GraphResponseValidationError(`${path} must be an object.`);
  }

  const node: GraphNode = {
    id: requireString(value.id, `${path}.id`),
    component: adaptComponentRef(value.component, `${path}.component`),
  };

  if (value.label !== undefined) {
    if (value.label !== null && typeof value.label !== "string") {
      throw new GraphResponseValidationError(`${path}.label must be a string or null.`);
    }
    node.label = value.label;
  }

  return node;
}

function adaptEdge(value: unknown, index: number): GraphEdge {
  const path = `edges[${index}]`;
  if (!isRecord(value)) {
    throw new GraphResponseValidationError(`${path} must be an object.`);
  }

  return {
    id: requireString(value.id, `${path}.id`),
    source: requireString(value.source, `${path}.source`),
    target: requireString(value.target, `${path}.target`),
    action: requireString(value.action, `${path}.action`),
  };
}

export function adaptGraphResponse(value: unknown): GraphResponse {
  if (!isRecord(value)) {
    throw new GraphResponseValidationError("Graph response must be an object.");
  }

  if (!Array.isArray(value.nodes)) {
    throw new GraphResponseValidationError("Graph response nodes must be an array.");
  }
  if (!Array.isArray(value.edges)) {
    throw new GraphResponseValidationError("Graph response edges must be an array.");
  }

  const generatedAt = requireString(value.generated_at, "generated_at");
  if (Number.isNaN(Date.parse(generatedAt))) {
    throw new GraphResponseValidationError("generated_at must be a valid datetime string.");
  }

  return {
    nodes: value.nodes.map(adaptNode),
    edges: value.edges.map(adaptEdge),
    generated_at: generatedAt,
  };
}
