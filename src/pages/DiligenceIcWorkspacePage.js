import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const kpiSnapshot = [
    { label: "Revenue", value: "$84M", note: "FY24, +17% YoY" },
    { label: "Adjusted EBITDA", value: "$14.2M", note: "17% margin" },
    { label: "Customer Concentration", value: "34%", note: "Top account exposure" }
];
const riskHeatmap = [
    { risk: "Customer Concentration", severity: "High", status: "Flagged" },
    { risk: "Litigation Exposure", severity: "Critical", status: "Monitor" },
    { risk: "Management Tenure", severity: "Medium", status: "Review" }
];
const governanceItems = [
    "IC vote session created for PRJ-NEXUS",
    "Partner comments pending on valuation bridge",
    "Compliance sign-off checklist at 60%"
];
export function DiligenceIcWorkspacePage() {
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Diligence & IC Workspace" }), _jsx("p", { className: "muted", children: "Execution environment for ingestion, KPI evidence review, risk analysis, and IC preparation." }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Ingestion Hub" }), _jsx("p", { className: "muted", children: "Use the existing Datagol workflow for file refresh, sync kickoff, and status polling." }), _jsxs("div", { className: "inline-actions", children: [_jsx(Link, { to: "/diligence/ingestion", className: "inline-link", children: "Open Ingestion Hub" }), _jsx(Link, { to: "/pipeline", className: "inline-link secondary", children: "View Deal Pipeline" })] })] }), _jsxs("div", { className: "grid", children: [_jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "KPI Dashboard" }), _jsx("ul", { className: "module-list", children: kpiSnapshot.map((item) => (_jsxs("li", { children: [_jsxs("strong", { children: [item.label, ":"] }), " ", item.value, " ", _jsxs("span", { className: "muted", children: ["(", item.note, ")"] })] }, item.label))) }), _jsx("p", { className: "muted", children: "Evidence Viewer remains available via each deal workspace after ingestion completion." })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Risk Heatmap" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Risk" }), _jsx("th", { children: "Severity" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: riskHeatmap.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.risk }), _jsx("td", { children: item.severity }), _jsx("td", { children: item.status })] }, item.risk))) })] })] })] }), _jsxs("div", { className: "grid", children: [_jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "IC Pack Builder" }), _jsx("p", { className: "muted", children: "Generate memo and deck drafts with valuation bridge placeholders." }), _jsxs("div", { className: "controls", children: [_jsx("button", { type: "button", children: "Generate IC One-Pager" }), _jsx("button", { type: "button", children: "Generate IC Deck Outline" }), _jsx("button", { type: "button", children: "Generate Valuation Bridge" })] })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Governance Panel" }), _jsx("ul", { className: "module-list", children: governanceItems.map((item) => (_jsx("li", { children: item }, item))) })] })] })] }));
}
