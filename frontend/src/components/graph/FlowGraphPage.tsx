"use client";

import { useState } from "react";

import { ComponentDetailsPanel } from "@/components/graph/ComponentDetailsPanel";
import { FlowGraph } from "@/components/graph/FlowGraph";
import { GraphFilters } from "@/components/graph/GraphFilters";
import { GraphToolbar } from "@/components/graph/GraphToolbar";
import { LineagePanel } from "@/components/graph/LineagePanel";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ApiError, ApiTimeoutError } from "@/lib/api";
import { useFlowGraph } from "@/hooks/useFlowGraph";

export function FlowGraphPage() {
  const { state, refresh } = useFlowGraph();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const graphData = state.status === "success" || state.status === "empty"
    ? state.data
    : undefined;
  const selectedNode = graphData?.nodes.find((node) => node.id === selectedNodeId);
  const selectedEdge = graphData?.edges.find((edge) => edge.id === selectedEdgeId);

  return (
    <div className="page-content">
      <PageHeader
        title="Flow Graph"
        subtitle="View relationships and information flows between runtime components."
        breadcrumbs={[{ label: "Workspace", href: "/" }, { label: "Flow Graph" }]}
      />

      <div className="flow-graph-page">
        <GraphToolbar
          onRefresh={() => void refresh()}
          isRefreshing={state.status === "loading"}
          counts={graphData ? {
            nodes: graphData.nodes.length,
            edges: graphData.edges.length,
          } : undefined}
        />

        <GraphFilters />

        {state.status === "loading" && (
          <LoadingState message="Loading flow graph from the backend..." />
        )}

        {state.status === "error" && (
          <ErrorState
            title={state.error instanceof ApiError
              ? `Graph API returned HTTP ${state.error.status}`
              : state.error instanceof ApiTimeoutError
                ? "Graph request timed out"
                : "Unable to load the flow graph"}
            message={state.error.message}
            onRetry={() => void refresh()}
          />
        )}

        {state.status === "invalid-response" && (
          <ErrorState
            title="The graph API returned invalid data"
            message={state.error.message}
            onRetry={() => void refresh()}
          />
        )}

        {graphData && (
          <>
            <FlowGraph
              nodes={graphData.nodes}
              edges={graphData.edges}
              selectedNodeId={selectedNodeId}
              selectedEdgeId={selectedEdgeId}
              onSelectNode={setSelectedNodeId}
              onSelectEdge={setSelectedEdgeId}
            />
            {(graphData.nodes.length > 0 || graphData.edges.length > 0) && (
              <div className="flow-graph-panels">
                <ComponentDetailsPanel component={selectedNode} />
                <LineagePanel edge={selectedEdge} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
