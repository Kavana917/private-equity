import { useEffect, useState, useSyncExternalStore } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  MessageSquare,
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

const MOBILE_NAV_QUERY = "(max-width: 960px)";
const OTTO_DRAWER_QUERY = "(max-width: 1280px)";

function subscribeMobileNav(cb: () => void) {
  const mq = window.matchMedia(MOBILE_NAV_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getMobileNavSnapshot() {
  return window.matchMedia(MOBILE_NAV_QUERY).matches;
}

function subscribeOttoDrawer(cb: () => void) {
  const mq = window.matchMedia(OTTO_DRAWER_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getOttoDrawerSnapshot() {
  return window.matchMedia(OTTO_DRAWER_QUERY).matches;
}

export function AppShell() {
  const location = useLocation();
  const hideOtto = location.pathname.startsWith("/admin");
  const isNarrowViewport = useSyncExternalStore(
    subscribeMobileNav,
    getMobileNavSnapshot,
    () => false
  );
  const isOttoDrawerLayout = useSyncExternalStore(
    subscribeOttoDrawer,
    getOttoDrawerSnapshot,
    () => false
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" ? getMobileNavSnapshot() : false
  );
  const [isOttoExpanded, setIsOttoExpanded] = useState(false);
  const [isOttoPanelOpen, setIsOttoPanelOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_QUERY);
    function onBreakpointChange() {
      setIsSidebarCollapsed(mq.matches);
    }
    mq.addEventListener("change", onBreakpointChange);
    return () => mq.removeEventListener("change", onBreakpointChange);
  }, []);

  useEffect(() => {
    if (!isNarrowViewport) return;
    setIsSidebarCollapsed(true);
  }, [location.pathname, isNarrowViewport]);

  useEffect(() => {
    if (!isNarrowViewport || isSidebarCollapsed) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isNarrowViewport, isSidebarCollapsed]);

  useEffect(() => {
    if (!isNarrowViewport) {
      setIsOttoPanelOpen(true);
    }
  }, [isNarrowViewport]);

  const showSidebarBackdrop = isNarrowViewport && !isSidebarCollapsed;
  const showOttoBackdrop = !hideOtto && isOttoPanelOpen && isOttoDrawerLayout;

  return (
    <div className={isSidebarCollapsed ? "app-shell sidebar-collapsed" : "app-shell"}>
      {showSidebarBackdrop ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      ) : null}
      {showOttoBackdrop ? (
        <button
          type="button"
          className="otto-drawer-backdrop"
          aria-label="Close Otto assistant"
          onClick={() => setIsOttoPanelOpen(false)}
        />
      ) : null}
      <aside className="sidebar" aria-hidden={isSidebarCollapsed}>
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
          <div className="topbar-actions">
            {isNarrowViewport && !hideOtto ? (
              <button
                type="button"
                className={
                  isOttoPanelOpen ? "otto-toolbar-toggle otto-toolbar-toggle-active" : "otto-toolbar-toggle"
                }
                onClick={() => setIsOttoPanelOpen((open) => !open)}
                aria-expanded={isOttoPanelOpen}
                aria-controls="otto-assistant-panel"
                title={isOttoPanelOpen ? "Hide Otto assistant" : "Show Otto assistant"}
              >
                <MessageSquare size={18} strokeWidth={1.75} />
                <span className="otto-toolbar-label">Otto</span>
              </button>
            ) : null}
            <span className="pill">Audit-first mode</span>
          </div>
        </header>

        <div
          className={[
            "content-row",
            isOttoExpanded ? "otto-expanded" : "",
            !isOttoPanelOpen ? "otto-panel-closed" : "",
            isOttoDrawerLayout && isOttoPanelOpen ? "otto-drawer-layout" : ""
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <main className="content">
            <Outlet />
          </main>
          {!hideOtto && isOttoPanelOpen ? (
            <aside
              id="otto-assistant-panel"
              className={isOttoExpanded ? "assistant-pane assistant-expanded" : "assistant-pane"}
            >
              <OttoAssistant
                isExpanded={isOttoExpanded}
                onToggleExpand={() => setIsOttoExpanded((value) => !value)}
                onTogglePanel={isNarrowViewport ? () => setIsOttoPanelOpen(false) : undefined}
              />
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
