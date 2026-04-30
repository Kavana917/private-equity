import { Link } from "react-router-dom";

const kpiSnapshot = [
  { label: "Revenue", value: "$84M", note: "FY24, +17% YoY" },
  { label: "Adjusted EBITDA", value: "$14.2M", note: "17% margin" },
  { label: "Customer Concentration", value: "34%", note: "Top account exposure" }
];

const riskHeatmap = [
  { risk: "Customer Concentration", severity: "High", status: "Flagged" },
  { risk: "Litigation Exposure", severity: "Critical", status: "Monitor" },
  { risk: "Management Tenure", severity: "Medium", status: "Review" }
];

const governanceItems = [
  "IC vote session created for PRJ-NEXUS",
  "Partner comments pending on valuation bridge",
  "Compliance sign-off checklist at 60%"
];

export function DiligenceIcWorkspacePage() {
  return (
    <section className="page">
      <h2>Diligence & IC Workspace</h2>
      <p className="muted">
        Execution environment for ingestion, KPI evidence review, risk analysis, and IC preparation.
      </p>

      <article className="card module-card">
        <h3>Ingestion Hub</h3>
        <p className="muted">
          Use the existing Datagol workflow for file refresh, sync kickoff, and status polling.
        </p>
        <div className="inline-actions">
          <Link to="/diligence/ingestion" className="inline-link">
            Open Ingestion Hub
          </Link>
          <Link to="/pipeline" className="inline-link secondary">
            View Deal Pipeline
          </Link>
        </div>
      </article>

      <div className="grid">
        <article className="card module-card">
          <h3>KPI Dashboard</h3>
          <ul className="module-list">
            {kpiSnapshot.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.value} <span className="muted">({item.note})</span>
              </li>
            ))}
          </ul>
          <p className="muted">
            Evidence Viewer remains available via each deal workspace after ingestion completion.
          </p>
        </article>

        <article className="card module-card">
          <h3>Risk Heatmap</h3>
          <table>
            <thead>
              <tr>
                <th>Risk</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {riskHeatmap.map((item) => (
                <tr key={item.risk}>
                  <td>{item.risk}</td>
                  <td>{item.severity}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>

      <div className="grid">
        <article className="card module-card">
          <h3>IC Pack Builder</h3>
          <p className="muted">Generate memo and deck drafts with valuation bridge placeholders.</p>
          <div className="controls">
            <button type="button">Generate IC One-Pager</button>
            <button type="button">Generate IC Deck Outline</button>
            <button type="button">Generate Valuation Bridge</button>
          </div>
        </article>

        <article className="card module-card">
          <h3>Governance Panel</h3>
          <ul className="module-list">
            {governanceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
