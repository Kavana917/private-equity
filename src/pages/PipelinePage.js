import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPipelineDeals } from "../api/deals";
export function PipelinePage() {
    const [deals, setDeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function loadPipeline() {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedDeals = await fetchPipelineDeals();
                setDeals(fetchedDeals);
            }
            catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Failed to load pipeline deals.");
            }
            finally {
                setIsLoading(false);
            }
        }
        void loadPipeline();
    }, []);
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Deal Pipeline" }), _jsx("p", { className: "muted", children: "Live pipeline view with synced deals and derived risk status." }), isLoading && _jsx("p", { className: "muted", children: "Loading pipeline..." }), error && _jsx("p", { className: "status", children: error }), _jsx("div", { className: "card", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Deal" }), _jsx("th", { children: "Sector" }), _jsx("th", { children: "Risk" }), _jsx("th", { children: "Action" })] }) }), _jsxs("tbody", { children: [!isLoading && deals.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 4, children: "No deals found yet. Sync from Datagol to populate pipeline." }) })), deals.map((deal) => (_jsxs("tr", { children: [_jsx("td", { children: deal.name }), _jsx("td", { children: deal.sector }), _jsx("td", { children: deal.risk }), _jsx("td", { children: _jsx(Link, { to: `/deals/${deal.code.toLowerCase()}`, children: "Open" }) })] }, deal.id)))] })] }) })] }));
}
