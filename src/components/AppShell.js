import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useSyncExternalStore } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { MessageSquare, PanelLeft, Shield, LayoutDashboard, FileSearch, GitBranch, Building2, BarChart3, ShieldCheck, Settings } from "lucide-react";
import { OttoAssistant } from "./OttoAssistant";
const navGroups = [
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
function subscribeMobileNav(cb) {
    const mq = window.matchMedia(MOBILE_NAV_QUERY);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}
function getMobileNavSnapshot() {
    return window.matchMedia(MOBILE_NAV_QUERY).matches;
}
function subscribeOttoDrawer(cb) {
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
    const isNarrowViewport = useSyncExternalStore(subscribeMobileNav, getMobileNavSnapshot, () => false);
    const isOttoDrawerLayout = useSyncExternalStore(subscribeOttoDrawer, getOttoDrawerSnapshot, () => false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => typeof window !== "undefined" ? getMobileNavSnapshot() : false);
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
        if (!isNarrowViewport)
            return;
        setIsSidebarCollapsed(true);
    }, [location.pathname, isNarrowViewport]);
    useEffect(() => {
        if (!isNarrowViewport || isSidebarCollapsed)
            return;
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
    return (_jsxs("div", { className: isSidebarCollapsed ? "app-shell sidebar-collapsed" : "app-shell", children: [showSidebarBackdrop ? (_jsx("button", { type: "button", className: "sidebar-backdrop", "aria-label": "Close navigation menu", onClick: () => setIsSidebarCollapsed(true) })) : null, showOttoBackdrop ? (_jsx("button", { type: "button", className: "otto-drawer-backdrop", "aria-label": "Close Otto assistant", onClick: () => setIsOttoPanelOpen(false) })) : null, _jsxs("aside", { className: "sidebar", "aria-hidden": isSidebarCollapsed, children: [_jsxs("div", { className: "sidebar-brand", children: [_jsx("div", { className: "sidebar-brand-icon", children: _jsx(Shield, { size: 15 }) }), _jsxs("div", { className: "sidebar-brand-text", children: [_jsx("h1", { children: "Fiducia OS" }), _jsx("p", { className: "muted", children: "Private Equity Platform" })] })] }), _jsx("nav", { children: navGroups.map((group, index) => (_jsxs("div", { className: "sidebar-group", children: [group.title ? _jsx("p", { className: "sidebar-section-label", children: group.title }) : null, group.links.map((item) => (_jsxs(NavLink, { to: item.to, title: item.label, className: ({ isActive }) => (isActive ? "nav-link active" : "nav-link"), children: [_jsx(item.icon, { className: "nav-icon" }), _jsx("span", { children: item.label })] }, item.to)))] }, `${group.title || "group"}-${index}`))) })] }), _jsxs("div", { className: "workspace", children: [_jsxs("header", { className: "topbar", children: [_jsxs("div", { className: "topbar-title", children: [_jsx("button", { type: "button", className: "sidebar-toggle", onClick: () => setIsSidebarCollapsed((value) => !value), "aria-label": isSidebarCollapsed ? "Expand navigation" : "Collapse navigation", children: _jsx(PanelLeft, { size: 14 }) }), _jsxs("div", { children: [_jsx("strong", { children: "Sentinel Agentic PE Governance Platform" }), _jsx("p", { className: "muted", children: "Audit-first operating workflow" })] })] }), _jsxs("div", { className: "topbar-actions", children: [isNarrowViewport && !hideOtto ? (_jsxs("button", { type: "button", className: isOttoPanelOpen ? "otto-toolbar-toggle otto-toolbar-toggle-active" : "otto-toolbar-toggle", onClick: () => setIsOttoPanelOpen((open) => !open), "aria-expanded": isOttoPanelOpen, "aria-controls": "otto-assistant-panel", title: isOttoPanelOpen ? "Hide Otto assistant" : "Show Otto assistant", children: [_jsx(MessageSquare, { size: 18, strokeWidth: 1.75 }), _jsx("span", { className: "otto-toolbar-label", children: "Otto" })] })) : null, _jsx("span", { className: "pill", children: "Audit-first mode" })] })] }), _jsxs("div", { className: [
                            "content-row",
                            isOttoExpanded ? "otto-expanded" : "",
                            !isOttoPanelOpen ? "otto-panel-closed" : "",
                            isOttoDrawerLayout && isOttoPanelOpen ? "otto-drawer-layout" : ""
                        ]
                            .filter(Boolean)
                            .join(" "), children: [_jsx("main", { className: "content", children: _jsx(Outlet, {}) }), !hideOtto && isOttoPanelOpen ? (_jsx("aside", { id: "otto-assistant-panel", className: isOttoExpanded ? "assistant-pane assistant-expanded" : "assistant-pane", children: _jsx(OttoAssistant, { isExpanded: isOttoExpanded, onToggleExpand: () => setIsOttoExpanded((value) => !value), onTogglePanel: isNarrowViewport ? () => setIsOttoPanelOpen(false) : undefined }) })) : null] })] })] }));
}
