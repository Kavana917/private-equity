import { useState } from "react";
import { createTables, deleteTables, fetchSampleData } from "../api/admin";

type DealRow = Record<string, string | number>;

export function AdminSampleDataPage() {
  const [status, setStatus] = useState<string>("Ready");
  const [rows, setRows] = useState<DealRow[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  async function runAction(action: () => Promise<{ message: string }>) {
    setIsBusy(true);
    try {
      const result = await action();
      setStatus(result.message);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Action failed");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSeeData() {
    setIsBusy(true);
    try {
      const data = await fetchSampleData();
      setRows(data.deals);
      setStatus(`Loaded ${data.deals.length} deal rows`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to fetch data");
    } finally {
      setIsBusy(false);
    }
  }

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <section className="page">
      <h2>Admin / Sample Data</h2>
      <p className="muted">Functions modeled after IT Risk app sample-data operations.</p>

      <div className="card controls">
        <button type="button" onClick={() => runAction(createTables)} disabled={isBusy}>
          Create Tables
        </button>
        <button type="button" onClick={() => runAction(deleteTables)} disabled={isBusy}>
          Delete Tables
        </button>
        <button type="button" onClick={handleSeeData} disabled={isBusy}>
          See Data
        </button>
      </div>

      <p className="status">{status}</p>

      {rows.length > 0 && (
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)}>
                    {headers.map((header) => (
                      <td key={header}>{String(row[header] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
