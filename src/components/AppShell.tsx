import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  PanelLeft,
  Shield,
  LayoutDashboard,
  FileSearch,
  GitBranch,
  Building2,
  BarChart3,
  ShieldCheck,
  Settings,
  type LucideIcon
} from "lucide-react";
import { OttoAssistant } from "./OttoAssistant";

type NavGroup = {
  title: string;
  links: Array<{ to: string; label: string; icon: LucideIcon }>;
};

const navGroups: NavGroup[] = [
  {
    title: "Main Navigation",
    links: [{ to: "/sourcing", label: "Overview", icon: LayoutDashboard }]
  },
  {
    title: "",
    links: [
      { to: "/diligence", label: "Diligence Workspace", icon: FileSearch },
      { to: "/pipeline", label: "Deal Pipeline", icon: GitBranch },
      { to: "/portfolio", label: "Portfolio Console", icon: Building2 }
    ]
  },
  {
    title: "",
    links: [
      { to: "/fund-lp-analytics", label: "Fund & LP Analytics", icon: BarChart3 },
      { to: "/audit-vault", label: "Audit Vault", icon: ShieldCheck }
    ]
  },
  {
    title: "Governance",
    links: [{ to: "/admin/sample-data", label: "Admin Tools", icon: Settings }]
  }
];

export function AppShell() {
  const location = useLocation();
  const hideOtto = location.pathname.startsWith("/admin");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isOttoExpanded, setIsOttoExpanded] = useState(false);

  return (
    <div className={isSidebarCollapsed ? "app-shell sidebar-collapsed" : "app-shell"}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Shield size={15} />
          </div>
          <div className="sidebar-brand-text">
            <h1>Fiducia OS</h1>
            <p className="muted">Private Equity Platform</p>
          </div>
        </div>
        <nav>
          {navGroups.map((group, index) => (
            <div key={`${group.title || "group"}-${index}`} className="sidebar-group">
              {group.title ? <p className="sidebar-section-label">{group.title}</p> : null}
              {group.links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  <item.icon className="nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-title">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
              aria-label={isSidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              <PanelLeft size={14} />
            </button>
            <div>
              <strong>Sentinel Agentic PE Governance Platform</strong>
              <p className="muted">Audit-first operating workflow</p>
            </div>
          </div>
          <span className="pill">Audit-first mode</span>
        </header>

        <div className={isOttoExpanded ? "content-row otto-expanded" : "content-row"}>
          <main className="content">
            <Outlet />
          </main>
          {!hideOtto && (
            <aside className={isOttoExpanded ? "assistant-pane assistant-expanded" : "assistant-pane"}>
              <OttoAssistant
                isExpanded={isOttoExpanded}
                onToggleExpand={() => setIsOttoExpanded((value) => !value)}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
