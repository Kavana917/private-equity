type EvidenceCoordinate = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  sourceLabel?: string;
};

type CanonicalMetricKey = "Revenue" | "GrossProfit" | "AdjustedEBITDA" | "Capex";

type DatagolMetricInput = {
  label: string;
  value: number | string;
  fiscalYear?: number;
  evidence?: EvidenceCoordinate[];
};

type DatagolCustomerShareInput = {
  customer?: string;
  sharePercent?: number;
  evidence?: EvidenceCoordinate[];
};

export type NormalizedMetricRecord = {
  canonicalKey: CanonicalMetricKey;
  fiscalYear: number;
  value: number;
  datagolExtractionId: string;
  evidenceRef: {
    references: EvidenceCoordinate[];
  };
  isVerified: boolean;
};

export type DerivedRiskFlagRecord = {
  flagCode: string;
  severity: "WARNING" | "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
  sourceReferenceId: string | null;
  datagolExtractionId: string;
  evidenceRef: {
    references: EvidenceCoordinate[];
  };
  isVerified: boolean;
};

export type DatagolMappingOutput = {
  mappedMetrics: NormalizedMetricRecord[];
  derivedRiskFlags: DerivedRiskFlagRecord[];
  warnings: string[];
};

const metricAliasMap: Record<string, CanonicalMetricKey> = {
  revenue: "Revenue",
  "total revenue": "Revenue",
  "net sales": "Revenue",
  "gross profit": "GrossProfit",
  "adjusted ebitda": "AdjustedEBITDA",
  "ebitda (adjusted)": "AdjustedEBITDA",
  "normalized ebitda": "AdjustedEBITDA",
  capex: "Capex",
  "capital expenditure": "Capex"
};

function normalizeLabel(label: string) {
  return label.trim().toLowerCase();
}

function normalizeCoordinates(input: unknown): EvidenceCoordinate[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const normalized: EvidenceCoordinate[] = [];
  for (const entry of input) {
    const candidate = entry as Partial<EvidenceCoordinate>;
    if (
      typeof candidate.page !== "number" ||
      typeof candidate.x !== "number" ||
      typeof candidate.y !== "number" ||
      typeof candidate.width !== "number" ||
      typeof candidate.height !== "number"
    ) {
      continue;
    }

    normalized.push({
      page: candidate.page,
      x: candidate.x,
      y: candidate.y,
      width: candidate.width,
      height: candidate.height,
      sourceLabel: candidate.sourceLabel
    });
  }
  return normalized;
}

function parseNumber(value: number | string): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const numeric = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}

function hasLitigationRisk(textBlob: string) {
  const normalized = textBlob.toLowerCase();
  return normalized.includes("pending") || normalized.includes("active claim");
}

export function mapDatagolExtractionToCanonical(
  rawPayload: any,
  datagolExtractionId: string
): DatagolMappingOutput {
  const warnings: string[] = [];
  const mappedMetrics: NormalizedMetricRecord[] = [];
  const derivedRiskFlags: DerivedRiskFlagRecord[] = [];

  const metricsInput: DatagolMetricInput[] = Array.isArray(rawPayload?.metrics)
    ? rawPayload.metrics
    : [];
  const customerShares: DatagolCustomerShareInput[] = Array.isArray(rawPayload?.customerShares)
    ? rawPayload.customerShares
    : [];
  const managementTenureYears = parseNumber(rawPayload?.management?.avgTenureYears ?? rawPayload?.avgTenureYears);
  const litigationText = String(rawPayload?.litigationText ?? rawPayload?.litigation ?? "");

  for (const metric of metricsInput) {
    const canonicalKey = metricAliasMap[normalizeLabel(metric.label)];
    if (!canonicalKey) {
      warnings.push(`Ignored non-canonical metric label: ${metric.label}`);
      continue;
    }

    const parsedValue = parseNumber(metric.value);
    if (parsedValue === null) {
      warnings.push(`Ignored metric with non-numeric value: ${metric.label}`);
      continue;
    }

    const fiscalYear = metric.fiscalYear ?? new Date().getUTCFullYear();
    mappedMetrics.push({
      canonicalKey,
      fiscalYear,
      value: parsedValue,
      datagolExtractionId,
      evidenceRef: {
        references: normalizeCoordinates(metric.evidence)
      },
      isVerified: false
    });
  }

  const hasConcentrationRisk = customerShares.some((entry) => (entry.sharePercent ?? 0) > 20);
  if (hasConcentrationRisk) {
    const riskyShare = customerShares.find((entry) => (entry.sharePercent ?? 0) > 20);
    derivedRiskFlags.push({
      flagCode: "CUSTOMER_CONCENTRATION",
      severity: "HIGH",
      reason: `At least one customer exceeds 20% revenue share (${riskyShare?.sharePercent ?? "unknown"}%).`,
      sourceReferenceId: "rule:customer_concentration",
      datagolExtractionId,
      evidenceRef: {
        references: normalizeCoordinates(riskyShare?.evidence)
      },
      isVerified: false
    });
  }

  const distinctYears = new Set(mappedMetrics.map((metric) => metric.fiscalYear));
  if (distinctYears.size > 0 && distinctYears.size < 3) {
    derivedRiskFlags.push({
      flagCode: "THIN_FINANCIAL_HISTORY",
      severity: "WARNING",
      reason: `Only ${distinctYears.size} fiscal year(s) extracted; minimum 3 required.`,
      sourceReferenceId: "rule:financial_history",
      datagolExtractionId,
      evidenceRef: {
        references: []
      },
      isVerified: false
    });
  }

  if (managementTenureYears !== null && managementTenureYears < 2) {
    derivedRiskFlags.push({
      flagCode: "MANAGEMENT_TENURE_SHORT",
      severity: "MEDIUM",
      reason: `Average management tenure ${managementTenureYears.toFixed(2)} years is below 2 years.`,
      sourceReferenceId: "rule:management_tenure",
      datagolExtractionId,
      evidenceRef: {
        references: []
      },
      isVerified: false
    });
  }

  if (litigationText && hasLitigationRisk(litigationText)) {
    derivedRiskFlags.push({
      flagCode: "LITIGATION_PENDING",
      severity: "CRITICAL",
      reason: "Litigation text contains pending or active claim indicators.",
      sourceReferenceId: "rule:litigation",
      datagolExtractionId,
      evidenceRef: {
        references: []
      },
      isVerified: false
    });
  }

  return {
    mappedMetrics,
    derivedRiskFlags,
    warnings
  };
}
