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
  return (
    <AssistantProvider>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to="/sourcing" replace />} />
          <Route path="sourcing" element={<SourcingDashboardPage />} />
          <Route path="diligence" element={<DiligenceIcWorkspacePage />} />
          <Route path="diligence/ingestion" element={<IngestPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="portfolio" element={<PortfolioConsolePage />} />
          <Route path="fund-lp-analytics" element={<FundLpAnalyticsPage />} />
          <Route path="audit-vault" element={<AuditVaultPage />} />
          <Route path="deals/:dealId" element={<DealDetailPage />} />
          <Route path="admin/sample-data" element={<AdminSampleDataPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AssistantProvider>
  );
}
