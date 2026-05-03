import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { createTables, deleteTables, fetchSampleData } from "../api/admin";
export function AdminSampleDataPage() {
    const [status, setStatus] = useState("Ready");
    const [rows, setRows] = useState([]);
    const [isBusy, setIsBusy] = useState(false);
    async function runAction(action) {
        setIsBusy(true);
        try {
            const result = await action();
            setStatus(result.message);
        }
        catch (error) {
            setStatus(error instanceof Error ? error.message : "Action failed");
        }
        finally {
            setIsBusy(false);
        }
    }
    async function handleSeeData() {
        setIsBusy(true);
        try {
            const data = await fetchSampleData();
            setRows(data.deals);
            setStatus(`Loaded ${data.deals.length} deal rows`);
        }
        catch (error) {
            setStatus(error instanceof Error ? error.message : "Unable to fetch data");
        }
        finally {
            setIsBusy(false);
        }
    }
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Admin / Sample Data" }), _jsx("p", { className: "muted", children: "Functions modeled after IT Risk app sample-data operations." }), _jsxs("div", { className: "card controls", children: [_jsx("button", { type: "button", onClick: () => runAction(createTables), disabled: isBusy, children: "Create Tables" }), _jsx("button", { type: "button", onClick: () => runAction(deleteTables), disabled: isBusy, children: "Delete Tables" }), _jsx("button", { type: "button", onClick: handleSeeData, disabled: isBusy, children: "See Data" })] }), _jsx("p", { className: "status", children: status }), rows.length > 0 && (_jsx("div", { className: "card", children: _jsx("div", { className: "table-responsive", children: _jsxs("table", { children: [_jsx("thead", { children: _jsx("tr", { children: headers.map((header) => (_jsx("th", { children: header }, header))) }) }), _jsx("tbody", { children: rows.map((row) => (_jsx("tr", { children: headers.map((header) => (_jsx("td", { children: String(row[header] ?? "") }, header))) }, String(row.id)))) })] }) }) }))] }));
}
