import { useEffect, useRef, useState } from "react";
import { fetchIngestStatus } from "../api/deals";
export function useIngestPolling(jobId) {
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [isPolling, setIsPolling] = useState(false);
    const timerRef = useRef(null);
    useEffect(() => {
        if (!jobId) {
            setStatus(null);
            setError(null);
            setIsPolling(false);
            return;
        }
        let cancelled = false;
        setIsPolling(true);
        setError(null);
        const activeJobId = jobId;
        async function poll() {
            try {
                const nextStatus = await fetchIngestStatus(activeJobId);
                if (cancelled) {
                    return;
                }
                setStatus(nextStatus);
                const terminalState = nextStatus.status === "COMPLETED" || nextStatus.status === "FAILED";
                if (terminalState) {
                    setIsPolling(false);
                    return;
                }
                timerRef.current = window.setTimeout(poll, 2000);
            }
            catch (pollError) {
                if (cancelled) {
                    return;
                }
                setIsPolling(false);
                setError(pollError instanceof Error ? pollError.message : "Polling failed.");
            }
        }
        void poll();
        return () => {
            cancelled = true;
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, [jobId]);
    return { status, isPolling, error };
}
