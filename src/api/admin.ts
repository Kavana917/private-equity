const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";

async function request<T>(path: string, method = "GET"): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { method });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export function createTables() {
  return request<{ message: string }>("/api/admin/sample-data/create", "POST");
}

export function deleteTables() {
  return request<{ message: string }>("/api/admin/sample-data/delete", "POST");
}

export function fetchSampleData() {
  return request<{ deals: Array<Record<string, string | number>> }>("/api/admin/sample-data/data");
}
