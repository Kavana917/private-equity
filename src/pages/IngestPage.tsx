import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDatagolFiles, submitIngestJob, type DatagolWorkspaceFile } from "../api/deals";
import { useIngestPolling } from "../hooks/useIngestPolling";
import { useAssistant } from "../context/AssistantContext";

function toRouteDealId(code: string) {
  return code.toLowerCase().replace(/_/g, "-");
}

export function IngestPage() {
  const navigate = useNavigate();
  const { pushMessage } = useAssistant();

  const [dealCode, setDealCode] = useState("");
  const [datagolFiles, setDatagolFiles] = useState<DatagolWorkspaceFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successHandled, setSuccessHandled] = useState(false);

  const { status, isPolling, error: pollingError } = useIngestPolling(jobId);

  useEffect(() => {
    async function loadFiles() {
      try {
        setIsLoadingFiles(true);
        setFilesError(null);
        const files = await fetchDatagolFiles();
        setDatagolFiles(files);
        setSelectedFileId((previousId) => {
          if (previousId && files.some((file) => file.id === previousId)) {
            return previousId;
          }
          return files[0]?.id ?? "";
        });
      } catch (error) {
        setFilesError(error instanceof Error ? error.message : "Datagol files could not be loaded.");
      } finally {
        setIsLoadingFiles(false);
      }
    }

    void loadFiles();
  }, []);

  const progressPercent = useMemo(() => {
    if (!status) return 0;
    if (status.status === "QUEUED") return 20;
    if (status.status === "PROCESSING") return 70;
    if (status.status === "COMPLETED") return 100;
    return 100;
  }, [status]);

  useEffect(() => {
    if (!status || successHandled || status.status !== "COMPLETED") {
      return;
    }

    setSuccessHandled(true);
    const highRiskSummary =
      (status.riskFlagsSaved ?? 0) > 0
        ? `I flagged ${status.riskFlagsSaved} risk signal(s).`
        : "No high-risk flags were detected.";

    pushMessage({
      role: "otto",
      text: `Analysis for ${status.dealCode} is complete. I extracted ${status.metricsSaved} metric row(s). ${highRiskSummary}`
    });

    navigate(`/deals/${toRouteDealId(status.dealCode)}`);
  }, [navigate, pushMessage, status, successHandled]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!dealCode.trim()) {
      setSubmitError("Deal code is required.");
      return;
    }
    if (!selectedFileId) {
      setSubmitError("Please select a Datagol file.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSuccessHandled(false);
      const result = await submitIngestJob(selectedFileId, dealCode.trim());
      setJobId(result.jobId);
    } catch (submitErrorValue) {
      setSubmitError(
        submitErrorValue instanceof Error ? submitErrorValue.message : "Ingestion start failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page">
      <h2>Upload & Analyze</h2>
      <p className="muted">
        Upload CIM or financial statements in Datagol first, then sync them here for Otto analysis.
      </p>

      <form className="card ingest-form" onSubmit={handleSubmit}>
        <label className="ingest-label" htmlFor="dealCode">
          Deal Code
        </label>
        <input
          id="dealCode"
          value={dealCode}
          onChange={(event) => setDealCode(event.target.value)}
          placeholder="PRJ-NEXUS"
        />

        <label className="ingest-label" htmlFor="datagolFile">
          Datagol File
        </label>
        <select
          id="datagolFile"
          value={selectedFileId}
          onChange={(event) => setSelectedFileId(event.target.value)}
          disabled={isLoadingFiles || isSubmitting || isPolling}
        >
          {datagolFiles.length === 0 && <option value="">No Datagol files available</option>}
          {datagolFiles.map((fileOption) => (
            <option key={fileOption.id} value={fileOption.id}>
              {fileOption.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="button-secondary"
          onClick={async () => {
            try {
              setIsLoadingFiles(true);
              setFilesError(null);
              const files = await fetchDatagolFiles();
              setDatagolFiles(files);
              if (!files.some((fileOption) => fileOption.id === selectedFileId)) {
                setSelectedFileId(files[0]?.id ?? "");
              }
            } catch (error) {
              setFilesError(error instanceof Error ? error.message : "Datagol files could not be loaded.");
            } finally {
              setIsLoadingFiles(false);
            }
          }}
          disabled={isLoadingFiles || isSubmitting || isPolling}
        >
          {isLoadingFiles ? "Refreshing files..." : "Refresh Datagol Files"}
        </button>

        <button type="submit" disabled={isSubmitting || isPolling}>
          {isSubmitting ? "Starting sync..." : "Sync from Datagol"}
        </button>
      </form>

      {(status || isPolling) && (
        <article className="card ingest-status">
          <h3>Otto Status Tracker</h3>
          <p className="muted">
            {status
              ? `Job ${status.jobId} is ${status.status.toLowerCase()}.`
              : "Otto is analyzing your document..."}
          </p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          {status?.status === "FAILED" && <p className="status">{status.error ?? "Job failed."}</p>}
          {status?.status === "COMPLETED" && (
            <div className="result-preview">
              <p>
                <strong>Deal:</strong> {status.dealCode}
              </p>
              <p>
                <strong>Metrics:</strong> {status.metricsSaved}
              </p>
              <p>
                <strong>Risk Flags:</strong> {status.riskFlagsSaved}
              </p>
            </div>
          )}
        </article>
      )}

      {submitError && <p className="status">{submitError}</p>}
      {filesError && <p className="status">{filesError}</p>}
      {pollingError && <p className="status">{pollingError}</p>}
    </section>
  );
}
