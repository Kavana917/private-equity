import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const marketFeed = [
    "Specialty manufacturing M&A volume up 18% QoQ.",
    "Vertical SaaS median EV/Revenue compresses to 5.8x.",
    "Regional healthcare platform receives growth-equity interest."
];
const targetLists = [
    "SaaS targets with >20% YoY growth",
    "Industrial automation assets with EBITDA > $10M",
    "Healthcare services roll-up candidates in Midwest"
];
const scoringRows = [
    { target: "ApexGrid", sectorFit: 92, financialHealth: 84, ownershipFit: 76, score: "Green" },
    { target: "NorthAxis", sectorFit: 85, financialHealth: 71, ownershipFit: 68, score: "Yellow" },
    { target: "SummitCare", sectorFit: 78, financialHealth: 66, ownershipFit: 72, score: "Yellow" }
];
export function SourcingDashboardPage() {
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Sourcing Dashboard" }), _jsx("p", { className: "muted", children: "Top-of-funnel command surface for market scanning and first-pass screening." }), _jsxs("div", { className: "grid", children: [_jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Market Feed" }), _jsx("ul", { className: "module-list", children: marketFeed.map((item) => (_jsx("li", { children: item }, item))) })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Target Lists" }), _jsx("ul", { className: "module-list", children: targetLists.map((item) => (_jsx("li", { children: item }, item))) })] })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Scoring Matrix" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Target" }), _jsx("th", { children: "Sector Fit" }), _jsx("th", { children: "Financials" }), _jsx("th", { children: "Ownership" }), _jsx("th", { children: "Priority" })] }) }), _jsx("tbody", { children: scoringRows.map((row) => (_jsxs("tr", { children: [_jsx("td", { children: row.target }), _jsx("td", { children: row.sectorFit }), _jsx("td", { children: row.financialHealth }), _jsx("td", { children: row.ownershipFit }), _jsx("td", { children: row.score })] }, row.target))) })] })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Screening Memo Creator" }), _jsx("p", { className: "muted", children: "Otto draft template: business summary, KPI snapshot, thesis fit, red flags, and recommendation." }), _jsxs("div", { className: "controls", children: [_jsx("button", { type: "button", children: "Generate 1-page Screening Memo" }), _jsx("button", { type: "button", children: "Generate Competitor Snapshot" }), _jsx("button", { type: "button", children: "Export Briefing Notes" })] })] })] }));
}
