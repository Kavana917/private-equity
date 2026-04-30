const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";
async function request(path, method = "GET") {
    const response = await fetch(`${API_BASE_URL}${path}`, { method });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed (${response.status})`);
    }
    return response.json();
}
export function createTables() {
    return request("/api/admin/sample-data/create", "POST");
}
export function deleteTables() {
    return request("/api/admin/sample-data/delete", "POST");
}
export function fetchSampleData() {
    return request("/api/admin/sample-data/data");
}
