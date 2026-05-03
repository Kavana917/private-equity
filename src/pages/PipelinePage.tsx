import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPipelineDeals, type PipelineDeal } from "../api/deals";

export function PipelinePage() {
  const [deals, setDeals] = useState<PipelineDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPipeline() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedDeals = await fetchPipelineDeals();
        setDeals(fetchedDeals);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load pipeline deals.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadPipeline();
  }, []);

  return (
    <section className="page">
      <h2>Deal Pipeline</h2>
      <p className="muted">Live pipeline view with synced deals and derived risk status.</p>
      {isLoading && <p className="muted">Loading pipeline...</p>}
      {error && <p className="status">{error}</p>}
      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Sector</th>
                <th>Risk</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && deals.length === 0 && (
                <tr>
                  <td colSpan={4}>No deals found yet. Sync from Datagol to populate pipeline.</td>
                </tr>
              )}
              {deals.map((deal) => (
                <tr key={deal.id}>
                  <td>{deal.name}</td>
                  <td>{deal.sector}</td>
                  <td>{deal.risk}</td>
                  <td>
                    <Link to={`/deals/${deal.code.toLowerCase()}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
