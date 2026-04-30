import { setTimeout as sleep } from "node:timers/promises";
const defaultOptions = {
    baseUrl: process.env.DATAGOL_BASE_URL ?? "https://be.datagol.ai",
    workspaceId: process.env.DATAGOL_WORKSPACE_ID ?? "",
    apiToken: process.env.DATAGOL_API_TOKEN ?? "",
    pollIntervalMs: Number(process.env.DATAGOL_POLL_INTERVAL_MS ?? 3000),
    pollTimeoutMs: Number(process.env.DATAGOL_POLL_TIMEOUT_MS ?? 180000),
    requestTimeoutMs: Number(process.env.DATAGOL_REQUEST_TIMEOUT_MS ?? 15000),
    uploadEndpoint: process.env.DATAGOL_UPLOAD_ENDPOINT ?? "/noCo/api/v2/workspaces/{workspaceId}/file/upload"
};
function requiredOption(value, key) {
    if (!value) {
        throw new Error(`Missing required Datagol configuration: ${key}`);
    }
    return value;
}
function authHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        "x-auth-token": token
    };
}
function parseJsonIfPossible(text) {
    try {
        return JSON.parse(text);
    }
    catch {
        return text;
    }
}
function extractFileId(payload) {
    const candidates = [
        payload?.fileId,
        payload?.file_id,
        payload?.id,
        payload?.data?.fileId,
        payload?.data?.file_id,
        payload?.data?.id,
        payload?.result?.fileId,
        payload?.result?.file_id
    ];
    return candidates.find((candidate) => typeof candidate === "string") ?? null;
}
function extractRequestId(payload) {
    const candidates = [
        payload?.requestId,
        payload?.request_id,
        payload?.id,
        payload?.data?.requestId,
        payload?.data?.request_id,
        payload?.data?.id,
        payload?.result?.requestId
    ];
    return candidates.find((candidate) => typeof candidate === "string") ?? null;
}
function extractStatus(payload) {
    const rawStatus = payload?.status ??
        payload?.state ??
        payload?.data?.status ??
        payload?.result?.status ??
        payload?.requestStatus ??
        "UNKNOWN";
    return String(rawStatus).toUpperCase();
}
function toObjectArray(payload) {
    const queue = [payload];
    const seen = new Set();
    const output = [];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current === undefined || current === null || seen.has(current)) {
            continue;
        }
        seen.add(current);
        if (Array.isArray(current)) {
            for (const item of current) {
                if (item && typeof item === "object") {
                    output.push(item);
                }
                queue.push(item);
            }
            continue;
        }
        if (typeof current === "object") {
            const obj = current;
            for (const value of Object.values(obj)) {
                queue.push(value);
            }
        }
    }
    return output;
}
function toWorkspaceFile(entry) {
    const idCandidate = entry.fileId ?? entry.file_id ?? entry.id;
    const id = typeof idCandidate === "string" || typeof idCandidate === "number" ? String(idCandidate) : "";
    if (!id) {
        return null;
    }
    const entryTypeCandidate = entry.elementType ?? entry.type ?? entry.resourceType;
    if (typeof entryTypeCandidate === "string" && entryTypeCandidate.toUpperCase().includes("FOLDER")) {
        return null;
    }
    const nameCandidate = entry.name ?? entry.filename ?? entry.fileName ?? entry.title ?? entry.label;
    const name = typeof nameCandidate === "string" && nameCandidate.trim().length > 0
        ? nameCandidate
        : `Datagol file ${id}`;
    const mimeTypeCandidate = entry.mimeType ?? entry.mime_type ?? entry.contentType;
    const updatedCandidate = entry.updatedAt ?? entry.modifiedAt ?? entry.createDate ?? entry.modiDate;
    return {
        id,
        name,
        mimeType: typeof mimeTypeCandidate === "string" ? mimeTypeCandidate : null,
        updatedAt: typeof updatedCandidate === "string" ? updatedCandidate : null,
        raw: entry
    };
}
function extractFolderIds(entries) {
    const folderIds = new Set();
    for (const entry of entries) {
        const entryTypeCandidate = entry.elementType ?? entry.type ?? entry.resourceType;
        const looksLikeFolder = typeof entryTypeCandidate === "string" && entryTypeCandidate.toUpperCase().includes("FOLDER");
        if (!looksLikeFolder) {
            continue;
        }
        const idCandidate = entry.id ?? entry.folderId ?? entry.folder_id;
        if (typeof idCandidate === "string" || typeof idCandidate === "number") {
            folderIds.add(String(idCandidate));
        }
    }
    return [...folderIds];
}
async function requestDatagol(path, init, token, baseUrl, requestTimeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
    const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
            Accept: "application/json",
            ...authHeaders(token),
            ...(init.headers ?? {})
        }
    }).finally(() => clearTimeout(timeout));
    const text = await response.text();
    const payload = parseJsonIfPossible(text);
    if (!response.ok) {
        throw new Error(`Datagol request failed (${response.status}): ${text}`);
    }
    return payload;
}
export class DatagolService {
    options;
    constructor(options) {
        this.options = { ...defaultOptions, ...options };
        requiredOption(this.options.workspaceId, "DATAGOL_WORKSPACE_ID");
        requiredOption(this.options.apiToken, "DATAGOL_API_TOKEN");
    }
    async uploadDocument(fileBuffer, fileName, mimeType) {
        const uploadPath = this.options.uploadEndpoint.replace("{workspaceId}", this.options.workspaceId);
        const form = new FormData();
        const byteArray = new Uint8Array(fileBuffer);
        form.append("file", new Blob([byteArray], { type: mimeType }), fileName);
        const payload = await requestDatagol(uploadPath, {
            method: "POST",
            body: form
        }, this.options.apiToken, this.options.baseUrl, this.options.requestTimeoutMs);
        const fileId = extractFileId(payload);
        if (!fileId) {
            throw new Error("Datagol upload succeeded but file id was not returned.");
        }
        return { fileId, raw: payload };
    }
    async listWorkspaceFiles() {
        const candidatePaths = [
            `/noCo/api/v2/workspaces/${this.options.workspaceId}/file`,
            `/noCo/api/v2/workspaces/${this.options.workspaceId}/file?page=0&size=200`,
            `/noCo/api/v2/workspaces/${this.options.workspaceId}/files`,
            `/noCo/api/v2/workspaces/${this.options.workspaceId}/folder`,
            `/noCo/api/v2/workspaces/${this.options.workspaceId}/folder?page=0&size=200`
        ];
        const parsedResults = [];
        const endpointErrors = [];
        for (const path of candidatePaths) {
            try {
                const payload = await requestDatagol(path, { method: "GET" }, this.options.apiToken, this.options.baseUrl, this.options.requestTimeoutMs);
                const rows = toObjectArray(payload);
                parsedResults.push(...rows.map(toWorkspaceFile).filter((value) => Boolean(value)));
                if (parsedResults.length > 0) {
                    break;
                }
            }
            catch (error) {
                endpointErrors.push(`${path}: ${error instanceof Error ? error.message : "unknown Datagol list error"}`);
            }
        }
        if (parsedResults.length === 0) {
            try {
                const folderPayload = await requestDatagol(`/noCo/api/v2/workspaces/${this.options.workspaceId}/folder`, { method: "GET" }, this.options.apiToken, this.options.baseUrl, this.options.requestTimeoutMs);
                const folderRows = toObjectArray(folderPayload);
                const folderIds = extractFolderIds(folderRows);
                for (const folderId of folderIds) {
                    const folderFilePaths = [
                        `/noCo/api/v2/workspaces/${this.options.workspaceId}/folder/${folderId}/file`,
                        `/noCo/api/v2/workspaces/${this.options.workspaceId}/folder/${folderId}/files`,
                        `/noCo/api/v2/workspaces/${this.options.workspaceId}/folder/${folderId}/file?page=0&size=200`
                    ];
                    for (const folderFilePath of folderFilePaths) {
                        try {
                            const folderFilesPayload = await requestDatagol(folderFilePath, { method: "GET" }, this.options.apiToken, this.options.baseUrl, this.options.requestTimeoutMs);
                            const folderFileRows = toObjectArray(folderFilesPayload);
                            parsedResults.push(...folderFileRows
                                .map(toWorkspaceFile)
                                .filter((value) => Boolean(value)));
                            if (parsedResults.length > 0) {
                                break;
                            }
                        }
                        catch {
                            // Continue trying other folder file endpoints.
                        }
                    }
                    if (parsedResults.length > 0) {
                        break;
                    }
                }
            }
            catch (error) {
                endpointErrors.push(`/folder fallback: ${error instanceof Error ? error.message : "unknown Datagol folder list error"}`);
            }
        }
        const deduped = new Map();
        for (const file of parsedResults) {
            deduped.set(file.id, file);
        }
        const files = [...deduped.values()];
        if (files.length === 0 && endpointErrors.length > 0) {
            throw new Error(`Datagol file listing failed. ${endpointErrors[0]}`);
        }
        return files;
    }
    async triggerExtraction(extractionId, elementType, elementId) {
        const path = `/noCo/api/v2/workspaces/${this.options.workspaceId}/extraction/${extractionId}/${elementType}/${elementId}/run?extractOnlyNew=true`;
        const payload = await requestDatagol(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectAll: true })
        }, this.options.apiToken, this.options.baseUrl, this.options.requestTimeoutMs);
        const requestId = extractRequestId(payload);
        if (!requestId) {
            throw new Error("Datagol trigger response did not include request id.");
        }
        return { requestId, raw: payload };
    }
    async pollExtractionStatus(requestId) {
        const startedAt = Date.now();
        while (Date.now() - startedAt < this.options.pollTimeoutMs) {
            const payload = await requestDatagol(`/noCo/api/v1/requestLog/status/${requestId}`, { method: "GET" }, this.options.apiToken, this.options.baseUrl, this.options.requestTimeoutMs);
            const status = extractStatus(payload);
            const completed = ["COMPLETED", "SUCCESS", "DONE"].includes(status);
            const failed = ["FAILED", "ERROR", "CANCELLED"].includes(status);
            if (completed || failed) {
                return { requestId, status, completed, failed, raw: payload };
            }
            await sleep(this.options.pollIntervalMs);
        }
        throw new Error(`Datagol extraction polling timed out for request: ${requestId}`);
    }
    async getExtractionResults(requestId) {
        const payload = await requestDatagol(`/noCo/api/v1/requestLog/status/${requestId}`, { method: "GET" }, this.options.apiToken, this.options.baseUrl, this.options.requestTimeoutMs);
        return payload;
    }
}
