export function GraphFilters() {
  return (
    <section className="graph-filters-unavailable" aria-labelledby="graph-filters-title">
      <h2 id="graph-filters-title">Graph filters unavailable</h2>
      <p>
        The graph API does not currently define supported filters. Filtering will be
        available when the backend exposes filter parameters.
      </p>
    </section>
  );
}
