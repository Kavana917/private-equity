import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDealEvidence } from "../api/deals";
export function DealDetailPage() {
    const { dealId } = useParams();
    const [payload, setPayload] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvidenceOptionId, setSelectedEvidenceOptionId] = useState(null);
    useEffect(() => {
        async function loadEvidence() {
            if (!dealId) {
                setError("Missing deal id.");
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                const result = await fetchDealEvidence(dealId);
                setPayload(result);
                setSelectedEvidenceOptionId(result.kpis[0]?.evidenceOptions[0]?.id ?? null);
            }
            catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : "Unable to load deal evidence.");
            }
            finally {
                setIsLoading(false);
            }
        }
        loadEvidence();
    }, [dealId]);
    const selectedHighlight = useMemo(() => {
        if (!payload || !selectedEvidenceOptionId) {
            return null;
        }
        return payload.highlights[selectedEvidenceOptionId] ?? null;
    }, [payload, selectedEvidenceOptionId]);
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Deal Workspace" }), _jsxs("p", { className: "muted", children: ["Deal ID: ", dealId] }), isLoading && _jsx("p", { className: "muted", children: "Loading KPI evidence..." }), error && _jsx("p", { className: "status", children: error }), !isLoading && payload && (_jsxs("div", { className: "detail-layout", children: [_jsxs("article", { className: "card evidence-left", children: [_jsx("h3", { children: "Extracted KPIs" }), _jsx("p", { className: "muted", children: "Click a KPI to highlight its source coordinates in the document pane." }), _jsx("div", { className: "kpi-list", children: payload.kpis.map((kpi) => (_jsxs("div", { className: "kpi-item-wrap", children: [_jsxs("button", { type: "button", className: kpi.evidenceOptions.some((option) => option.id === selectedEvidenceOptionId)
                                                ? "kpi-item active"
                                                : "kpi-item", onClick: () => setSelectedEvidenceOptionId(kpi.evidenceOptions[0]?.id ?? null), children: [_jsx("span", { children: kpi.label }), _jsx("strong", { children: kpi.value.toLocaleString() }), _jsxs("small", { children: ["FY ", kpi.fiscalYear, " \u2022 ", kpi.evidenceRef] })] }), kpi.evidenceOptions.length > 1 && (_jsx("div", { className: "evidence-options", children: kpi.evidenceOptions.map((option, optionIndex) => (_jsxs("button", { type: "button", className: selectedEvidenceOptionId === option.id ? "evidence-chip active" : "evidence-chip", onClick: () => setSelectedEvidenceOptionId(option.id), children: ["Source ", optionIndex + 1] }, option.id))) }))] }, kpi.key))) })] }), _jsxs("article", { className: "card evidence-right", children: [_jsx("h3", { children: "Document Viewer (Placeholder)" }), _jsx("p", { className: "muted", children: payload.document.title }), _jsxs("div", { className: "doc-canvas", children: [_jsxs("div", { className: "doc-page-label", children: ["Page ", selectedHighlight?.page ?? 1] }), selectedHighlight && (_jsx("div", { className: "doc-highlight", style: {
                                            left: `${selectedHighlight.x}%`,
                                            top: `${selectedHighlight.y}%`,
                                            width: `${selectedHighlight.width}%`,
                                            height: `${selectedHighlight.height}%`
                                        } }))] }), _jsxs("p", { className: "muted", children: ["Selected evidence: ", selectedEvidenceOptionId ?? "none", " ", selectedHighlight ? `(p${selectedHighlight.page})` : ""] })] })] })), !isLoading && payload?.kpis.length === 0 && (_jsx("article", { className: "card", children: _jsx("p", { className: "muted", children: "No KPI evidence found for this deal yet." }) })), !isLoading && !payload && !error && (_jsx("article", { className: "card", children: _jsx("p", { className: "muted", children: "No data returned for this deal." }) }))] }));
}
