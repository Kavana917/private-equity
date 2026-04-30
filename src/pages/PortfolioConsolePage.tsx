const companySnapshots = [
  { company: "Apex Manufacturing", revenue: "$84M", ebitda: "$14.2M", trend: "Up" },
  { company: "BlueRiver Health", revenue: "$63M", ebitda: "$9.4M", trend: "Flat" },
  { company: "Northlane Software", revenue: "$48M", ebitda: "$11.1M", trend: "Up" }
];

const valueLevers = [
  "Pricing optimization rollout - 3 of 6 BUs completed",
  "Procurement cost-out initiative - 2.4% savings to date",
  "Sales ops redesign - lead conversion +11% QoQ"
];

const riskAlerts = [
  "Liquidity watch: BlueRiver cash runway below 8 months",
  "Churn deviation: Northlane enterprise logo churn at 6.4%",
  "Margin pressure: Apex freight and input costs elevated"
];

export function PortfolioConsolePage() {
  return (
    <section className="page">
      <h2>Portfolio Console</h2>
      <p className="muted">Post-acquisition monitoring surface for operating performance and risk signals.</p>

      <article className="card module-card">
        <h3>Company Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Revenue</th>
              <th>Adjusted EBITDA</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {companySnapshots.map((row) => (
              <tr key={row.company}>
                <td>{row.company}</td>
                <td>{row.revenue}</td>
                <td>{row.ebitda}</td>
                <td>{row.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <div className="grid">
        <article className="card module-card">
          <h3>Value-Creation Tracker</h3>
          <ul className="module-list">
            {valueLevers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="card module-card">
          <h3>Risk Monitor</h3>
          <ul className="module-list">
            {riskAlerts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className="card module-card">
        <h3>Q&A / Follow-up</h3>
        <p className="muted">Otto-generated follow-up pack for portfolio CFOs.</p>
        <div className="controls">
          <button type="button">Generate Liquidity Question Set</button>
          <button type="button">Generate Churn Deep-Dive Questions</button>
          <button type="button">Export CFO Follow-up Pack</button>
        </div>
      </article>
    </section>
  );
}
