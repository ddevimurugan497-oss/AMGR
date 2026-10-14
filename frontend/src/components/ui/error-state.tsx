interface ErrorStateProps {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Unable to load this content",
  message,
  retryLabel = "Try again",
  onRetry,
}: ErrorStateProps) {
  return (
    <section className="ui-state ui-error-state" role="alert">
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button className="ui-state-retry" type="button" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </section>
  );
}
