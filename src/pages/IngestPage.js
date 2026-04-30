import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDatagolFiles, submitIngestJob } from "../api/deals";
import { useIngestPolling } from "../hooks/useIngestPolling";
import { useAssistant } from "../context/AssistantContext";
function toRouteDealId(code) {
    return code.toLowerCase().replace(/_/g, "-");
}
export function IngestPage() {
    const navigate = useNavigate();
    const { pushMessage } = useAssistant();
    const [dealCode, setDealCode] = useState("");
    const [datagolFiles, setDatagolFiles] = useState([]);
    const [selectedFileId, setSelectedFileId] = useState("");
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [filesError, setFilesError] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [submitError, setSubmitError] = useState(null);
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
            }
            catch (error) {
                setFilesError(error instanceof Error ? error.message : "Datagol files could not be loaded.");
            }
            finally {
                setIsLoadingFiles(false);
            }
        }
        void loadFiles();
    }, []);
    const progressPercent = useMemo(() => {
        if (!status)
            return 0;
        if (status.status === "QUEUED")
            return 20;
        if (status.status === "PROCESSING")
            return 70;
        if (status.status === "COMPLETED")
            return 100;
        return 100;
    }, [status]);
    useEffect(() => {
        if (!status || successHandled || status.status !== "COMPLETED") {
            return;
        }
        setSuccessHandled(true);
        const highRiskSummary = (status.riskFlagsSaved ?? 0) > 0
            ? `I flagged ${status.riskFlagsSaved} risk signal(s).`
            : "No high-risk flags were detected.";
        pushMessage({
            role: "otto",
            text: `Analysis for ${status.dealCode} is complete. I extracted ${status.metricsSaved} metric row(s). ${highRiskSummary}`
        });
        navigate(`/deals/${toRouteDealId(status.dealCode)}`);
    }, [navigate, pushMessage, status, successHandled]);
    async function handleSubmit(event) {
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
        }
        catch (submitErrorValue) {
            setSubmitError(submitErrorValue instanceof Error ? submitErrorValue.message : "Ingestion start failed.");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (_jsxs("section", { className: "page", children: [_jsx("h2", { children: "Upload & Analyze" }), _jsx("p", { className: "muted", children: "Upload CIM or financial statements in Datagol first, then sync them here for Otto analysis." }), _jsxs("form", { className: "card ingest-form", onSubmit: handleSubmit, children: [_jsx("label", { className: "ingest-label", htmlFor: "dealCode", children: "Deal Code" }), _jsx("input", { id: "dealCode", value: dealCode, onChange: (event) => setDealCode(event.target.value), placeholder: "PRJ-NEXUS" }), _jsx("label", { className: "ingest-label", htmlFor: "datagolFile", children: "Datagol File" }), _jsxs("select", { id: "datagolFile", value: selectedFileId, onChange: (event) => setSelectedFileId(event.target.value), disabled: isLoadingFiles || isSubmitting || isPolling, children: [datagolFiles.length === 0 && _jsx("option", { value: "", children: "No Datagol files available" }), datagolFiles.map((fileOption) => (_jsx("option", { value: fileOption.id, children: fileOption.name }, fileOption.id)))] }), _jsx("button", { type: "button", className: "button-secondary", onClick: async () => {
                            try {
                                setIsLoadingFiles(true);
                                setFilesError(null);
                                const files = await fetchDatagolFiles();
                                setDatagolFiles(files);
                                if (!files.some((fileOption) => fileOption.id === selectedFileId)) {
                                    setSelectedFileId(files[0]?.id ?? "");
                                }
                            }
                            catch (error) {
                                setFilesError(error instanceof Error ? error.message : "Datagol files could not be loaded.");
                            }
                            finally {
                                setIsLoadingFiles(false);
                            }
                        }, disabled: isLoadingFiles || isSubmitting || isPolling, children: isLoadingFiles ? "Refreshing files..." : "Refresh Datagol Files" }), _jsx("button", { type: "submit", disabled: isSubmitting || isPolling, children: isSubmitting ? "Starting sync..." : "Sync from Datagol" })] }), (status || isPolling) && (_jsxs("article", { className: "card ingest-status", children: [_jsx("h3", { children: "Otto Status Tracker" }), _jsx("p", { className: "muted", children: status
                            ? `Job ${status.jobId} is ${status.status.toLowerCase()}.`
                            : "Otto is analyzing your document..." }), _jsx("div", { className: "progress-track", children: _jsx("div", { className: "progress-fill", style: { width: `${progressPercent}%` } }) }), status?.status === "FAILED" && _jsx("p", { className: "status", children: status.error ?? "Job failed." }), status?.status === "COMPLETED" && (_jsxs("div", { className: "result-preview", children: [_jsxs("p", { children: [_jsx("strong", { children: "Deal:" }), " ", status.dealCode] }), _jsxs("p", { children: [_jsx("strong", { children: "Metrics:" }), " ", status.metricsSaved] }), _jsxs("p", { children: [_jsx("strong", { children: "Risk Flags:" }), " ", status.riskFlagsSaved] })] }))] })), submitError && _jsx("p", { className: "status", children: submitError }), filesError && _jsx("p", { className: "status", children: filesError }), pollingError && _jsx("p", { className: "status", children: pollingError })] }));
}
