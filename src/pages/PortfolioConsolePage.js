import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const companySnapshots = [
    { company: "Apex Manufacturing", revenue: "$84M", ebitda: "$14.2M", trend: "Up" },
    { company: "BlueRiver Health", revenue: "$63M", ebitda: "$9.4M", trend: "Flat" },
    { company: "Northlane Software", revenue: "$48M", ebitda: "$11.1M", trend: "Up" }
];
const valueLevers = [
    "Pricing optimization rollout - 3 of 6 BUs completed",
    "Procurement cost-out initiative - 2.4% savings to date",
    "Sales ops redesign - lead conversion +11% QoQ"
];
const riskAlerts = [
    "Liquidity watch: BlueRiver cash runway below 8 months",
    "Churn deviation: Northlane enterprise logo churn at 6.4%",
    "Margin pressure: Apex freight and input costs elevated"
];
export function PortfolioConsolePage() {
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Portfolio Console" }), _jsx("p", { className: "muted", children: "Post-acquisition monitoring surface for operating performance and risk signals." }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Company Performance" }), _jsx("div", { className: "table-responsive", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Company" }), _jsx("th", { children: "Revenue" }), _jsx("th", { children: "Adjusted EBITDA" }), _jsx("th", { children: "Trend" })] }) }), _jsx("tbody", { children: companySnapshots.map((row) => (_jsxs("tr", { children: [_jsx("td", { children: row.company }), _jsx("td", { children: row.revenue }), _jsx("td", { children: row.ebitda }), _jsx("td", { children: row.trend })] }, row.company))) })] }) })] }), _jsxs("div", { className: "grid", children: [_jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Value-Creation Tracker" }), _jsx("ul", { className: "module-list", children: valueLevers.map((item) => (_jsx("li", { children: item }, item))) })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Risk Monitor" }), _jsx("ul", { className: "module-list", children: riskAlerts.map((item) => (_jsx("li", { children: item }, item))) })] })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Q&A / Follow-up" }), _jsx("p", { className: "muted", children: "Otto-generated follow-up pack for portfolio CFOs." }), _jsxs("div", { className: "controls", children: [_jsx("button", { type: "button", children: "Generate Liquidity Question Set" }), _jsx("button", { type: "button", children: "Generate Churn Deep-Dive Questions" }), _jsx("button", { type: "button", children: "Export CFO Follow-up Pack" })] })] })] }));
}
