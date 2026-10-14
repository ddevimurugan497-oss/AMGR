interface GraphToolbarProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  counts?: {
    nodes?: number;
    edges?: number;
  };
}

export function GraphToolbar({
  onRefresh,
  isRefreshing = false,
  counts,
}: GraphToolbarProps) {
  const hasCounts = counts?.nodes !== undefined || counts?.edges !== undefined;

  return (
    <div className="graph-toolbar" role="toolbar" aria-label="Flow graph actions">
      {hasCounts && (
        <ul className="graph-toolbar-counts" aria-label="Graph counts">
          {counts?.nodes !== undefined && (
            <li>
              <span className="graph-toolbar-count">{counts.nodes}</span>
              <span>{counts.nodes === 1 ? "component" : "components"}</span>
            </li>
          )}
          {counts?.edges !== undefined && (
            <li>
              <span className="graph-toolbar-count">{counts.edges}</span>
              <span>{counts.edges === 1 ? "connection" : "connections"}</span>
            </li>
          )}
        </ul>
      )}
      <button
        className="graph-toolbar-refresh"
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label={isRefreshing ? "Refreshing flow graph" : "Refresh flow graph"}
      >
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}
