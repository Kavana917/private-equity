const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";
async function request(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed (${response.status})`);
    }
    return response.json();
}
export function fetchDealStats() {
    return request("/api/deals/stats");
}
export async function fetchPipelineDeals() {
    const response = await request("/api/deals/pipeline");
    return response.deals;
}
export function fetchDealEvidence(dealId) {
    return request(`/api/deals/${dealId}/evidence`);
}
export async function submitIngestJob(fileId, dealCode) {
    const response = await fetch(`${API_BASE_URL}/api/deals/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, dealCode })
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Ingest request failed (${response.status})`);
    }
    return response.json();
}
export async function fetchDatagolFiles() {
    const response = await request("/api/datagol/files");
    return response.files;
}
export function fetchIngestStatus(jobId) {
    return request(`/api/deals/ingest/${jobId}/status`);
}
