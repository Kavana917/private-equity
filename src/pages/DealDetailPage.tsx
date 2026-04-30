import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDealEvidence, type DealEvidenceResponse } from "../api/deals";

export function DealDetailPage() {
  const { dealId } = useParams();
  const [payload, setPayload] = useState<DealEvidenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvidenceOptionId, setSelectedEvidenceOptionId] = useState<string | null>(null);

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
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load deal evidence.");
      } finally {
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

  return (
    <section className="page">
      <h2>Deal Workspace</h2>
      <p className="muted">Deal ID: {dealId}</p>
      {isLoading && <p className="muted">Loading KPI evidence...</p>}
      {error && <p className="status">{error}</p>}

      {!isLoading && payload && (
        <div className="detail-layout">
          <article className="card evidence-left">
            <h3>Extracted KPIs</h3>
            <p className="muted">
              Click a KPI to highlight its source coordinates in the document pane.
            </p>
            <div className="kpi-list">
              {payload.kpis.map((kpi) => (
                <div key={kpi.key} className="kpi-item-wrap">
                  <button
                    type="button"
                    className={
                      kpi.evidenceOptions.some((option) => option.id === selectedEvidenceOptionId)
                        ? "kpi-item active"
                        : "kpi-item"
                    }
                    onClick={() => setSelectedEvidenceOptionId(kpi.evidenceOptions[0]?.id ?? null)}
                  >
                    <span>{kpi.label}</span>
                    <strong>{kpi.value.toLocaleString()}</strong>
                    <small>
                      FY {kpi.fiscalYear} • {kpi.evidenceRef}
                    </small>
                  </button>
                  {kpi.evidenceOptions.length > 1 && (
                    <div className="evidence-options">
                      {kpi.evidenceOptions.map((option, optionIndex) => (
                        <button
                          key={option.id}
                          type="button"
                          className={selectedEvidenceOptionId === option.id ? "evidence-chip active" : "evidence-chip"}
                          onClick={() => setSelectedEvidenceOptionId(option.id)}
                        >
                          Source {optionIndex + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          <article className="card evidence-right">
            <h3>Document Viewer (Placeholder)</h3>
            <p className="muted">{payload.document.title}</p>

            <div className="doc-canvas">
              <div className="doc-page-label">Page {selectedHighlight?.page ?? 1}</div>
              {selectedHighlight && (
                <div
                  className="doc-highlight"
                  style={{
                    left: `${selectedHighlight.x}%`,
                    top: `${selectedHighlight.y}%`,
                    width: `${selectedHighlight.width}%`,
                    height: `${selectedHighlight.height}%`
                  }}
                />
              )}
            </div>
            <p className="muted">
              Selected evidence: {selectedEvidenceOptionId ?? "none"}{" "}
              {selectedHighlight ? `(p${selectedHighlight.page})` : ""}
            </p>
          </article>
        </div>
      )}

      {!isLoading && payload?.kpis.length === 0 && (
        <article className="card">
          <p className="muted">No KPI evidence found for this deal yet.</p>
        </article>
      )}
      {!isLoading && !payload && !error && (
        <article className="card">
          <p className="muted">No data returned for this deal.</p>
        </article>
      )}
    </section>
  );
}
