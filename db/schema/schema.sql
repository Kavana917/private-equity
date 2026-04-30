CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  deal_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  geography TEXT NOT NULL,
  ownership_structure TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deal_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  fiscal_year INT NOT NULL,
  revenue NUMERIC(14, 2) NOT NULL,
  gross_profit NUMERIC(14, 2) NOT NULL,
  adjusted_ebitda NUMERIC(14, 2) NOT NULL,
  capex NUMERIC(14, 2) NOT NULL,
  datagol_extraction_id TEXT,
  evidence_ref JSONB,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (deal_id, fiscal_year)
);

CREATE TABLE IF NOT EXISTS unit_economics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  cac NUMERIC(12, 2) NOT NULL,
  ltv NUMERIC(12, 2) NOT NULL,
  churn_rate NUMERIC(5, 2) NOT NULL,
  snapshot_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  flag_code TEXT NOT NULL,
  severity TEXT NOT NULL,
  reason TEXT NOT NULL,
  source_reference_id TEXT,
  datagol_extraction_id TEXT,
  evidence_ref JSONB,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_code TEXT NOT NULL,
  status TEXT NOT NULL,
  datagol_extraction_id TEXT,
  metrics_saved INT NOT NULL DEFAULT 0,
  risk_flags_saved INT NOT NULL DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deal_metrics_extraction_id
  ON deal_metrics(datagol_extraction_id);

CREATE INDEX IF NOT EXISTS idx_risk_flags_extraction_id
  ON risk_flags(datagol_extraction_id);

CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status
  ON ingestion_jobs(status);
