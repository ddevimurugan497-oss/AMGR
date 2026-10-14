interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="ui-state ui-loading-state" role="status" aria-live="polite" aria-busy="true">
      <span className="ui-state-indicator" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
