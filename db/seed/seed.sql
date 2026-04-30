INSERT INTO deals (code, deal_name, sector, geography, ownership_structure, status)
VALUES
  ('PRJ-AURORA', 'Project Aurora', 'FinTech', 'North America', 'Founder-led', 'Screening'),
  ('PRJ-NEXUS', 'Project Nexus', 'Healthcare SaaS', 'Europe', 'VC-backed', 'Diligence'),
  ('PRJ-VECTOR', 'Project Vector', 'Industrial Tech', 'APAC', 'Family-owned', 'IC Review')
ON CONFLICT (code) DO NOTHING;

INSERT INTO deal_metrics (
  deal_id,
  fiscal_year,
  revenue,
  gross_profit,
  adjusted_ebitda,
  capex,
  datagol_extraction_id,
  evidence_ref,
  is_verified
)
SELECT
  d.id,
  m.fiscal_year,
  m.revenue,
  m.gross_profit,
  m.adjusted_ebitda,
  m.capex,
  m.datagol_extraction_id,
  m.evidence_ref::jsonb,
  m.is_verified
FROM deals d
JOIN (
  VALUES
    ('PRJ-AURORA', 2022, 42000000, 20100000, 9200000, 1800000, 'seed-ext-aurora', '{"references":[{"page":18,"x":14,"y":28,"width":22,"height":9,"sourceLabel":"Summary table"}]}', true),
    ('PRJ-AURORA', 2023, 49000000, 23600000, 11100000, 2100000, 'seed-ext-aurora', '{"references":[{"page":20,"x":18,"y":22,"width":20,"height":8,"sourceLabel":"Financial appendix"}]}', true),
    ('PRJ-AURORA', 2024, 56000000, 27300000, 13600000, 2500000, 'seed-ext-aurora', '{"references":[{"page":22,"x":16,"y":30,"width":24,"height":10,"sourceLabel":"Management report"}]}', false),
    ('PRJ-NEXUS', 2022, 31000000, 12700000, 6100000, 1600000, 'seed-ext-nexus', '{"references":[{"page":11,"x":15,"y":26,"width":21,"height":9,"sourceLabel":"P&L snapshot"}]}', true),
    ('PRJ-NEXUS', 2023, 36500000, 15100000, 7600000, 1750000, 'seed-ext-nexus', '{"references":[{"page":13,"x":12,"y":29,"width":23,"height":9,"sourceLabel":"Forecast worksheet"}]}', true),
    ('PRJ-NEXUS', 2024, 41800000, 17400000, 9050000, 1950000, 'seed-ext-nexus', '{"references":[{"page":14,"x":11,"y":24,"width":25,"height":10,"sourceLabel":"Board pack"}]}', false),
    ('PRJ-VECTOR', 2022, 52000000, 20200000, 8800000, 2800000, 'seed-ext-vector', '{"references":[{"page":8,"x":17,"y":35,"width":22,"height":8,"sourceLabel":"Historical summary"}]}', true),
    ('PRJ-VECTOR', 2023, 54500000, 21400000, 9300000, 3000000, 'seed-ext-vector', '{"references":[{"page":9,"x":13,"y":27,"width":24,"height":9,"sourceLabel":"Audit schedule"}]}', false),
    ('PRJ-VECTOR', 2024, 57900000, 22900000, 9800000, 3200000, 'seed-ext-vector', '{"references":[{"page":10,"x":12,"y":23,"width":23,"height":9,"sourceLabel":"Operating model"}]}', false)
) AS m(
  code,
  fiscal_year,
  revenue,
  gross_profit,
  adjusted_ebitda,
  capex,
  datagol_extraction_id,
  evidence_ref,
  is_verified
)
ON d.code = m.code
ON CONFLICT (deal_id, fiscal_year) DO NOTHING;

INSERT INTO unit_economics (deal_id, cac, ltv, churn_rate, snapshot_date)
SELECT d.id, u.cac, u.ltv, u.churn_rate, u.snapshot_date
FROM deals d
JOIN (
  VALUES
    ('PRJ-AURORA', 8500, 61000, 5.20, DATE '2025-12-31'),
    ('PRJ-NEXUS', 9200, 54000, 6.80, DATE '2025-12-31'),
    ('PRJ-VECTOR', 7300, 47000, 4.10, DATE '2025-12-31')
) AS u(code, cac, ltv, churn_rate, snapshot_date)
ON d.code = u.code;

INSERT INTO risk_flags (
  deal_id,
  flag_code,
  severity,
  reason,
  source_reference_id,
  datagol_extraction_id,
  evidence_ref,
  is_verified
)
SELECT
  d.id,
  r.flag_code,
  r.severity,
  r.reason,
  r.source_reference_id,
  r.datagol_extraction_id,
  r.evidence_ref::jsonb,
  r.is_verified
FROM deals d
JOIN (
  VALUES
    ('PRJ-AURORA', 'CUSTOMER_CONCENTRATION', 'HIGH', 'Top customer contributes 28% of revenue.', 'datagol:aurora:p18', 'seed-ext-aurora', '{"references":[{"page":18,"x":20,"y":33,"width":25,"height":8,"sourceLabel":"Customer concentration chart"}]}', true),
    ('PRJ-NEXUS', 'LITIGATION_PENDING', 'CRITICAL', 'Active IP dispute in EU market.', 'datagol:nexus:p44', 'seed-ext-nexus', '{"references":[{"page":44,"x":12,"y":54,"width":28,"height":9,"sourceLabel":"Legal notes"}]}', false),
    ('PRJ-VECTOR', 'MANAGEMENT_TENURE_SHORT', 'MEDIUM', 'CFO joined within last 9 months.', 'datagol:vector:p12', 'seed-ext-vector', '{"references":[{"page":12,"x":24,"y":48,"width":20,"height":9,"sourceLabel":"Leadership profile"}]}', false)
) AS r(
  code,
  flag_code,
  severity,
  reason,
  source_reference_id,
  datagol_extraction_id,
  evidence_ref,
  is_verified
)
ON d.code = r.code;
