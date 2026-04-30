import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const performanceCards = [
    { label: "Gross IRR", value: "19.4%" },
    { label: "MOIC", value: "2.1x" },
    { label: "DPI", value: "0.8x" }
];
const waterfallRows = [
    { segment: "2019 Vintage / Industrials", cashflow: "$126M", holdingPeriod: "4.2 years" },
    { segment: "2020 Vintage / Healthcare", cashflow: "$98M", holdingPeriod: "3.6 years" },
    { segment: "2021 Vintage / Software", cashflow: "$142M", holdingPeriod: "2.8 years" }
];
export function FundLpAnalyticsPage() {
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Fund & LP Analytics" }), _jsx("p", { className: "muted", children: "Investor-relations module for fund performance, reporting, and disclosure workflows." }), _jsx("div", { className: "grid", children: performanceCards.map((card) => (_jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: card.label }), _jsx("strong", { children: card.value }), _jsx("p", { className: "muted", children: "Sample value for UX preview" })] }, card.label))) }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Waterfall Engine" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Segment" }), _jsx("th", { children: "Cashflows" }), _jsx("th", { children: "Holding Period" })] }) }), _jsx("tbody", { children: waterfallRows.map((row) => (_jsxs("tr", { children: [_jsx("td", { children: row.segment }), _jsx("td", { children: row.cashflow }), _jsx("td", { children: row.holdingPeriod })] }, row.segment))) })] })] }), _jsxs("div", { className: "grid", children: [_jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Reporting Packager" }), _jsx("p", { className: "muted", children: "Build LP-ready quarterly packs with Otto-generated performance narrative." }), _jsx("button", { type: "button", children: "Generate Quarterly LP Pack" })] }), _jsxs("article", { className: "card module-card", children: [_jsx("h3", { children: "Disclosure Generator" }), _jsx("p", { className: "muted", children: "Generate audit-ready disclosure logs and supporting summary notes." }), _jsx("button", { type: "button", children: "Generate Disclosure Bundle" })] })] })] }));
}
