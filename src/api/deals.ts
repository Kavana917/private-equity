const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export type DealStatsResponse = {
  dealsScreened: number;
  highRiskFlags: number;
  icPacksReady: number;
};

export type PipelineDeal = {
  id: string;
  code: string;
  name: string;
  sector: string;
  risk: string;
};

export type EvidenceKpi = {
  key: string;
  label: string;
  value: number;
  fiscalYear: number;
  evidenceRef: string;
  evidenceOptions: Array<{
    id: string;
    evidenceRef: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
};

export type EvidenceHighlight = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DealEvidenceResponse = {
  deal: {
    id: string;
    code: string;
    deal_name: string;
    sector: string;
    status: string;
  };
  kpis: EvidenceKpi[];
  document: {
    title: string;
    pageCount: number;
  };
  highlights: Record<string, EvidenceHighlight>;
};

export type IngestKickoffResponse = {
  jobId: string;
  dealCode: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
};

export type DatagolWorkspaceFile = {
  id: string;
  name: string;
  mimeType: string | null;
  updatedAt: string | null;
};

export type IngestJobStatusResponse = {
  jobId: string;
  dealCode: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  datagolExtractionId: string | null;
  metricsSaved: number;
  riskFlagsSaved: number;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};

export function fetchDealStats() {
  return request<DealStatsResponse>("/api/deals/stats");
}

export async function fetchPipelineDeals() {
  const response = await request<{ deals: PipelineDeal[] }>("/api/deals/pipeline");
  return response.deals;
}

export function fetchDealEvidence(dealId: string) {
  return request<DealEvidenceResponse>(`/api/deals/${dealId}/evidence`);
}

export async function submitIngestJob(fileId: string, dealCode: string) {
  const response = await fetch(`${API_BASE_URL}/api/deals/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, dealCode })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Ingest request failed (${response.status})`);
  }
  return response.json() as Promise<IngestKickoffResponse>;
}

export async function fetchDatagolFiles() {
  const response = await request<{ files: DatagolWorkspaceFile[] }>("/api/datagol/files");
  return response.files;
}

export function fetchIngestStatus(jobId: string) {
  return request<IngestJobStatusResponse>(`/api/deals/ingest/${jobId}/status`);
}
