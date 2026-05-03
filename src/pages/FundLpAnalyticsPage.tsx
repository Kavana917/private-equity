const performanceCards = [
  { label: "Gross IRR", value: "19.4%" },
  { label: "MOIC", value: "2.1x" },
  { label: "DPI", value: "0.8x" }
];

const waterfallRows = [
  { segment: "2019 Vintage / Industrials", cashflow: "$126M", holdingPeriod: "4.2 years" },
  { segment: "2020 Vintage / Healthcare", cashflow: "$98M", holdingPeriod: "3.6 years" },
  { segment: "2021 Vintage / Software", cashflow: "$142M", holdingPeriod: "2.8 years" }
];

export function FundLpAnalyticsPage() {
  return (
    <section className="page">
      <h2>Fund & LP Analytics</h2>
      <p className="muted">Investor-relations module for fund performance, reporting, and disclosure workflows.</p>

      <div className="grid">
        {performanceCards.map((card) => (
          <article className="card module-card" key={card.label}>
            <h3>{card.label}</h3>
            <strong>{card.value}</strong>
            <p className="muted">Sample value for UX preview</p>
          </article>
        ))}
      </div>

      <article className="card module-card">
        <h3>Waterfall Engine</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Cashflows</th>
                <th>Holding Period</th>
              </tr>
            </thead>
            <tbody>
              {waterfallRows.map((row) => (
                <tr key={row.segment}>
                  <td>{row.segment}</td>
                  <td>{row.cashflow}</td>
                  <td>{row.holdingPeriod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="grid">
        <article className="card module-card">
          <h3>Reporting Packager</h3>
          <p className="muted">Build LP-ready quarterly packs with Otto-generated performance narrative.</p>
          <button type="button">Generate Quarterly LP Pack</button>
        </article>
        <article className="card module-card">
          <h3>Disclosure Generator</h3>
          <p className="muted">Generate audit-ready disclosure logs and supporting summary notes.</p>
          <button type="button">Generate Disclosure Bundle</button>
        </article>
      </div>
    </section>
  );
}
