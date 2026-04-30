import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { PanelLeft, Shield, LayoutDashboard, FileSearch, GitBranch, Building2, BarChart3, ShieldCheck, Settings } from "lucide-react";
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
export function AppShell() {
    const location = useLocation();
    const hideOtto = location.pathname.startsWith("/admin");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isOttoExpanded, setIsOttoExpanded] = useState(false);
    return (_jsxs("div", { className: isSidebarCollapsed ? "app-shell sidebar-collapsed" : "app-shell", children: [_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-brand", children: [_jsx("div", { className: "sidebar-brand-icon", children: _jsx(Shield, { size: 15 }) }), _jsxs("div", { className: "sidebar-brand-text", children: [_jsx("h1", { children: "Fiducia OS" }), _jsx("p", { className: "muted", children: "Private Equity Platform" })] })] }), _jsx("nav", { children: navGroups.map((group) => (_jsxs("div", { className: "sidebar-group", children: [group.title ? _jsx("p", { className: "sidebar-section-label", children: group.title }) : null, group.links.map((item) => (_jsxs(NavLink, { to: item.to, title: item.label, className: ({ isActive }) => (isActive ? "nav-link active" : "nav-link"), children: [_jsx(item.icon, { className: "nav-icon" }), _jsx("span", { children: item.label })] }, item.to)))] }, group.title))) })] }), _jsxs("div", { className: "workspace", children: [_jsxs("header", { className: "topbar", children: [_jsxs("div", { className: "topbar-title", children: [_jsx("button", { type: "button", className: "sidebar-toggle", onClick: () => setIsSidebarCollapsed((value) => !value), "aria-label": isSidebarCollapsed ? "Expand navigation" : "Collapse navigation", children: _jsx(PanelLeft, { size: 14 }) }), _jsxs("div", { children: [_jsx("strong", { children: "Sentinel Agentic PE Governance Platform" }), _jsx("p", { className: "muted", children: "Audit-first operating workflow" })] })] }), _jsx("span", { className: "pill", children: "Audit-first mode" })] }), _jsxs("div", { className: isOttoExpanded ? "content-row otto-expanded" : "content-row", children: [_jsx("main", { className: "content", children: _jsx(Outlet, {}) }), !hideOtto && (_jsx("aside", { className: isOttoExpanded ? "assistant-pane assistant-expanded" : "assistant-pane", children: _jsx(OttoAssistant, { isExpanded: isOttoExpanded, onToggleExpand: () => setIsOttoExpanded((value) => !value) }) }))] })] })] }));
}
