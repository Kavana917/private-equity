import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { SourcingDashboardPage } from "./pages/SourcingDashboardPage";
import { PipelinePage } from "./pages/PipelinePage";
import { DealDetailPage } from "./pages/DealDetailPage";
import { AdminSampleDataPage } from "./admin/AdminSampleDataPage";
import { IngestPage } from "./pages/IngestPage";
import { PortfolioConsolePage } from "./pages/PortfolioConsolePage";
import { FundLpAnalyticsPage } from "./pages/FundLpAnalyticsPage";
import { AuditVaultPage } from "./pages/AuditVaultPage";
import { AssistantProvider } from "./context/AssistantContext";
import { DiligenceIcWorkspacePage } from "./pages/DiligenceIcWorkspacePage";
export default function App() {
    return (_jsx(AssistantProvider, { children: _jsxs(Routes, { children: [_jsxs(Route, { path: "/", element: _jsx(AppShell, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/sourcing", replace: true }) }), _jsx(Route, { path: "sourcing", element: _jsx(SourcingDashboardPage, {}) }), _jsx(Route, { path: "diligence", element: _jsx(DiligenceIcWorkspacePage, {}) }), _jsx(Route, { path: "diligence/ingestion", element: _jsx(IngestPage, {}) }), _jsx(Route, { path: "pipeline", element: _jsx(PipelinePage, {}) }), _jsx(Route, { path: "portfolio", element: _jsx(PortfolioConsolePage, {}) }), _jsx(Route, { path: "fund-lp-analytics", element: _jsx(FundLpAnalyticsPage, {}) }), _jsx(Route, { path: "audit-vault", element: _jsx(AuditVaultPage, {}) }), _jsx(Route, { path: "deals/:dealId", element: _jsx(DealDetailPage, {}) }), _jsx(Route, { path: "admin/sample-data", element: _jsx(AdminSampleDataPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }));
}
