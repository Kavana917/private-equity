const marketFeed = [
  "Specialty manufacturing M&A volume up 18% QoQ.",
  "Vertical SaaS median EV/Revenue compresses to 5.8x.",
  "Regional healthcare platform receives growth-equity interest."
];

const targetLists = [
  "SaaS targets with >20% YoY growth",
  "Industrial automation assets with EBITDA > $10M",
  "Healthcare services roll-up candidates in Midwest"
];

const scoringRows = [
  { target: "ApexGrid", sectorFit: 92, financialHealth: 84, ownershipFit: 76, score: "Green" },
  { target: "NorthAxis", sectorFit: 85, financialHealth: 71, ownershipFit: 68, score: "Yellow" },
  { target: "SummitCare", sectorFit: 78, financialHealth: 66, ownershipFit: 72, score: "Yellow" }
];

export function SourcingDashboardPage() {
  return (
    <section className="page">
      <h2>Sourcing Dashboard</h2>
      <p className="muted">Top-of-funnel command surface for market scanning and first-pass screening.</p>

      <div className="grid">
        <article className="card module-card">
          <h3>Market Feed</h3>
          <ul className="module-list">
            {marketFeed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card module-card">
          <h3>Target Lists</h3>
          <ul className="module-list">
            {targetLists.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="card module-card">
        <h3>Scoring Matrix</h3>
        <table>
          <thead>
            <tr>
              <th>Target</th>
              <th>Sector Fit</th>
              <th>Financials</th>
              <th>Ownership</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {scoringRows.map((row) => (
              <tr key={row.target}>
                <td>{row.target}</td>
                <td>{row.sectorFit}</td>
                <td>{row.financialHealth}</td>
                <td>{row.ownershipFit}</td>
                <td>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="card module-card">
        <h3>Screening Memo Creator</h3>
        <p className="muted">
          Otto draft template: business summary, KPI snapshot, thesis fit, red flags, and recommendation.
        </p>
        <div className="controls">
          <button type="button">Generate 1-page Screening Memo</button>
          <button type="button">Generate Competitor Snapshot</button>
          <button type="button">Export Briefing Notes</button>
        </div>
      </article>
    </section>
  );
}
