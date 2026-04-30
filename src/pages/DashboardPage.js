import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { fetchDealStats } from "../api/deals";
export function DashboardPage() {
    const [stats, setStats] = useState({
        dealsScreened: 0,
        highRiskFlags: 0,
        icPacksReady: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function loadStats() {
            try {
                setIsLoading(true);
                setError(null);
                const result = await fetchDealStats();
                setStats(result);
            }
            catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard stats");
            }
            finally {
                setIsLoading(false);
            }
        }
        loadStats();
    }, []);
    const kpiTiles = useMemo(() => [
        { label: "Deals Screened", value: stats.dealsScreened, hint: "Live from deals table" },
        { label: "High-Risk Flags", value: stats.highRiskFlags, hint: "Severity HIGH/CRITICAL" },
        { label: "IC Packs Ready", value: stats.icPacksReady, hint: "Deals in IC Review status" }
    ], [stats]);
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Dashboard" }), _jsx("p", { className: "muted", children: "Live metrics from Neon-backed API, aligned to PE workflows." }), isLoading && _jsx("p", { className: "muted", children: "Loading live stats..." }), error && _jsx("p", { className: "status", children: error }), _jsx("div", { className: "grid", children: kpiTiles.map((tile) => (_jsxs("article", { className: "card", children: [_jsx("h3", { children: tile.label }), _jsx("strong", { children: isLoading ? "--" : tile.value }), _jsx("p", { className: "muted", children: tile.hint })] }, tile.label))) })] }));
}
