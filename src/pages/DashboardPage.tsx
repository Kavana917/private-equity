import { useEffect, useMemo, useState } from "react";
import { fetchDealStats } from "../api/deals";

export function DashboardPage() {
  const [stats, setStats] = useState({
    dealsScreened: 0,
    highRiskFlags: 0,
    icPacksReady: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchDealStats();
        setStats(result);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const kpiTiles = useMemo(
    () => [
      { label: "Deals Screened", value: stats.dealsScreened, hint: "Live from deals table" },
      { label: "High-Risk Flags", value: stats.highRiskFlags, hint: "Severity HIGH/CRITICAL" },
      { label: "IC Packs Ready", value: stats.icPacksReady, hint: "Deals in IC Review status" }
    ],
    [stats]
  );

  return (
    <section className="page">
      <h2>Dashboard</h2>
      <p className="muted">
        Live metrics from Neon-backed API, aligned to PE workflows.
      </p>
      {isLoading && <p className="muted">Loading live stats...</p>}
      {error && <p className="status">{error}</p>}
      <div className="grid">
        {kpiTiles.map((tile) => (
          <article className="card" key={tile.label}>
            <h3>{tile.label}</h3>
            <strong>{isLoading ? "--" : tile.value}</strong>
            <p className="muted">{tile.hint}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
