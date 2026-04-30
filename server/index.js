import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";
import { executeSqlFile, pool } from "./db";
import { DatagolService } from "./services/datagol";
import { mapDatagolExtractionToCanonical } from "./services/metricMapper";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.post("/api/admin/sample-data/create", async (_req, res) => {
    try {
        await executeSqlFile("db/schema/schema.sql");
        await executeSqlFile("db/seed/seed.sql");
        res.json({ message: "Tables created and seed data inserted." });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Create failed");
    }
});
app.post("/api/admin/sample-data/delete", async (_req, res) => {
    try {
        await executeSqlFile("db/schema/drop.sql");
        res.json({ message: "Tables deleted." });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Delete failed");
    }
});
app.get("/api/admin/sample-data/data", async (_req, res) => {
    try {
        const result = await pool.query(`SELECT code AS id, deal_name, sector, geography, status
       FROM deals
       ORDER BY created_at DESC`);
        res.json({ deals: result.rows });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Read failed");
    }
});
app.get("/api/deals/stats", async (_req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        (SELECT COUNT(*)::text FROM deals) AS deals_screened,
        (SELECT COUNT(*)::text FROM risk_flags WHERE UPPER(severity) IN ('HIGH', 'CRITICAL')) AS high_risk_flags,
        (SELECT COUNT(*)::text FROM deals WHERE status = 'IC Review') AS ic_packs_ready
    `);
        const row = result.rows[0];
        res.json({
            dealsScreened: Number(row?.deals_screened ?? 0),
            highRiskFlags: Number(row?.high_risk_flags ?? 0),
            icPacksReady: Number(row?.ic_packs_ready ?? 0)
        });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Stats read failed");
    }
});
app.get("/api/deals/pipeline", async (_req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        d.code,
        d.deal_name,
        d.sector,
        MAX(d.created_at) AS latest_created_at,
        MAX(
          CASE UPPER(rf.severity)
            WHEN 'CRITICAL' THEN 4
            WHEN 'HIGH' THEN 3
            WHEN 'MEDIUM' THEN 2
            WHEN 'WARNING' THEN 2
            WHEN 'LOW' THEN 1
            ELSE 0
          END
        ) AS max_risk_rank
      FROM deals d
      LEFT JOIN risk_flags rf ON rf.deal_id = d.id
      GROUP BY d.code, d.deal_name, d.sector
      ORDER BY MAX(d.created_at) DESC
    `);
        const rankToRisk = {
            4: "Critical",
            3: "High",
            2: "Medium",
            1: "Low",
            0: "Low"
        };
        res.json({
            deals: result.rows.map((row) => ({
                id: row.code.toLowerCase(),
                code: row.code,
                name: row.deal_name,
                sector: row.sector ?? "Unknown",
                risk: rankToRisk[row.max_risk_rank ?? 0] ?? "Low"
            }))
        });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Pipeline read failed");
    }
});
const datagolService = new DatagolService();
function normalizeDealCode(rawDealId) {
    return rawDealId.replace(/-/g, "_").toUpperCase().replace(/_/g, "-");
}
function coordinateFromRef(ref) {
    let hash = 0;
    for (let index = 0; index < ref.length; index += 1) {
        hash = (hash << 5) - hash + ref.charCodeAt(index);
        hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    return {
        page: (positiveHash % 3) + 1,
        x: 8 + (positiveHash % 55),
        y: 12 + ((positiveHash >> 3) % 70),
        width: 26 + ((positiveHash >> 5) % 20),
        height: 8 + ((positiveHash >> 7) % 12)
    };
}
function normalizeCoordinates(input) {
    if (!input || typeof input !== "object") {
        return [];
    }
    const references = input.references;
    if (!Array.isArray(references)) {
        return [];
    }
    return references
        .map((entry) => {
        const candidate = entry;
        if (typeof candidate.page !== "number" ||
            typeof candidate.x !== "number" ||
            typeof candidate.y !== "number" ||
            typeof candidate.width !== "number" ||
            typeof candidate.height !== "number") {
            return null;
        }
        return {
            page: candidate.page,
            x: candidate.x,
            y: candidate.y,
            width: candidate.width,
            height: candidate.height
        };
    })
        .filter((value) => Boolean(value));
}
async function updateIngestionJob(jobId, patch) {
    await pool.query(`UPDATE ingestion_jobs
     SET status = COALESCE($2, status),
         datagol_extraction_id = COALESCE($3, datagol_extraction_id),
         metrics_saved = COALESCE($4, metrics_saved),
         risk_flags_saved = COALESCE($5, risk_flags_saved),
         error = COALESCE($6, error),
         updated_at = NOW()
     WHERE job_id = $1`, [
        jobId,
        patch.status ?? null,
        patch.datagolExtractionId ?? null,
        patch.metricsSaved ?? null,
        patch.riskFlagsSaved ?? null,
        patch.error ?? null
    ]);
}
async function processIngestionJob(input) {
    const warnings = [];
    try {
        await updateIngestionJob(input.jobId, { status: "PROCESSING" });
        const triggerResult = await datagolService.triggerExtraction(input.extractionId, "FILE", input.fileId);
        const statusResult = await datagolService.pollExtractionStatus(triggerResult.requestId);
        if (statusResult.failed) {
            throw new Error(`Datagol extraction failed with status: ${statusResult.status}`);
        }
        const extractionPayload = await datagolService.getExtractionResults(triggerResult.requestId);
        const mapped = mapDatagolExtractionToCanonical(extractionPayload, triggerResult.requestId);
        warnings.push(...mapped.warnings);
        await pool.query(`INSERT INTO deals (code, deal_name, sector, geography, ownership_structure, status)
       VALUES ($1, $2, 'Unknown', 'Unknown', 'Unknown', 'Screening')
       ON CONFLICT (code) DO NOTHING`, [input.dealCode, input.dealCode]);
        const dealResult = await pool.query(`SELECT id FROM deals WHERE code = $1 LIMIT 1`, [input.dealCode]);
        const dealId = dealResult.rows[0]?.id;
        if (!dealId) {
            throw new Error("Deal row could not be resolved after upsert.");
        }
        const metricsByYear = new Map();
        for (const metric of mapped.mappedMetrics) {
            const record = metricsByYear.get(metric.fiscalYear) ?? {};
            record[metric.canonicalKey] = metric.value;
            record[`${metric.canonicalKey}_evidence`] = metric.evidenceRef.references;
            metricsByYear.set(metric.fiscalYear, record);
        }
        let metricsSaved = 0;
        for (const [fiscalYear, metricMap] of metricsByYear.entries()) {
            const evidenceRef = {
                references: [
                    ...(metricMap.Revenue_evidence ?? []),
                    ...(metricMap.GrossProfit_evidence ?? []),
                    ...(metricMap.AdjustedEBITDA_evidence ?? []),
                    ...(metricMap.Capex_evidence ?? [])
                ]
            };
            await pool.query(`INSERT INTO deal_metrics (
          deal_id, fiscal_year, revenue, gross_profit, adjusted_ebitda, capex,
          datagol_extraction_id, evidence_ref, is_verified
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, false)
        ON CONFLICT (deal_id, fiscal_year)
        DO UPDATE SET
          revenue = EXCLUDED.revenue,
          gross_profit = EXCLUDED.gross_profit,
          adjusted_ebitda = EXCLUDED.adjusted_ebitda,
          capex = EXCLUDED.capex,
          datagol_extraction_id = EXCLUDED.datagol_extraction_id,
          evidence_ref = EXCLUDED.evidence_ref,
          is_verified = EXCLUDED.is_verified`, [
                dealId,
                fiscalYear,
                Number(metricMap.Revenue ?? 0),
                Number(metricMap.GrossProfit ?? 0),
                Number(metricMap.AdjustedEBITDA ?? 0),
                Number(metricMap.Capex ?? 0),
                triggerResult.requestId,
                JSON.stringify(evidenceRef)
            ]);
            metricsSaved += 1;
        }
        let riskFlagsSaved = 0;
        for (const riskFlag of mapped.derivedRiskFlags) {
            await pool.query(`INSERT INTO risk_flags (
          deal_id, flag_code, severity, reason, source_reference_id,
          datagol_extraction_id, evidence_ref, is_verified
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, false)`, [
                dealId,
                riskFlag.flagCode,
                riskFlag.severity,
                riskFlag.reason,
                riskFlag.sourceReferenceId,
                triggerResult.requestId,
                JSON.stringify(riskFlag.evidenceRef)
            ]);
            riskFlagsSaved += 1;
        }
        await updateIngestionJob(input.jobId, {
            status: "COMPLETED",
            datagolExtractionId: triggerResult.requestId,
            metricsSaved,
            riskFlagsSaved,
            error: warnings.length > 0 ? warnings.join(" | ") : null
        });
    }
    catch (error) {
        await updateIngestionJob(input.jobId, {
            status: "FAILED",
            error: error instanceof Error ? error.message : "Unknown ingestion failure"
        });
    }
}
app.get("/api/datagol/files", async (_req, res) => {
    try {
        const files = await datagolService.listWorkspaceFiles();
        res.json({ files });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Datagol files read failed");
    }
});
app.post("/api/deals/ingest", async (req, res) => {
    try {
        const rawDealCode = String(req.body.dealCode ?? "").trim();
        if (!rawDealCode) {
            res.status(400).send("dealCode is required.");
            return;
        }
        const fileId = String(req.body.fileId ?? "").trim();
        if (!fileId) {
            res.status(400).send("fileId is required.");
            return;
        }
        const extractionId = String(req.body.extractionId ?? process.env.DATAGOL_EXTRACTION_ID ?? "").trim();
        if (!extractionId) {
            res.status(400).send("extractionId is required (or set DATAGOL_EXTRACTION_ID).");
            return;
        }
        const dealCode = normalizeDealCode(rawDealCode);
        const jobId = randomUUID();
        await pool.query(`INSERT INTO ingestion_jobs (job_id, deal_code, status)
       VALUES ($1, $2, 'QUEUED')`, [jobId, dealCode]);
        void processIngestionJob({
            jobId,
            dealCode,
            fileId,
            extractionId
        });
        res.status(202).json({
            jobId,
            dealCode,
            status: "QUEUED"
        });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Ingestion kickoff failed");
    }
});
app.get("/api/deals/ingest/:jobId/status", async (req, res) => {
    try {
        const result = await pool.query(`SELECT job_id, deal_code, status, datagol_extraction_id, metrics_saved, risk_flags_saved, error, created_at, updated_at
       FROM ingestion_jobs
       WHERE job_id = $1
       LIMIT 1`, [req.params.jobId]);
        const row = result.rows[0];
        if (!row) {
            res.status(404).send("Ingestion job not found");
            return;
        }
        res.json({
            jobId: row.job_id,
            dealCode: row.deal_code,
            status: row.status,
            datagolExtractionId: row.datagol_extraction_id,
            metricsSaved: row.metrics_saved,
            riskFlagsSaved: row.risk_flags_saved,
            error: row.error,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Ingestion status read failed");
    }
});
app.get("/api/deals/:dealId/evidence", async (req, res) => {
    try {
        const normalizedCode = normalizeDealCode(req.params.dealId);
        const dealResult = await pool.query(`SELECT id, code, deal_name, sector, status
       FROM deals
       WHERE code = $1
       LIMIT 1`, [normalizedCode]);
        const deal = dealResult.rows[0];
        if (!deal) {
            res.status(404).send("Deal not found");
            return;
        }
        const metricsResult = await pool.query(`SELECT fiscal_year, revenue, gross_profit, adjusted_ebitda, capex, evidence_ref
       FROM deal_metrics
       WHERE deal_id = $1
       ORDER BY fiscal_year DESC
       LIMIT 1`, [deal.id]);
        const riskRefsResult = await pool.query(`SELECT source_reference_id, evidence_ref
       FROM risk_flags
       WHERE deal_id = $1
       ORDER BY created_at DESC`, [deal.id]);
        const riskRefs = riskRefsResult.rows.map((row) => ({
            sourceReferenceId: row.source_reference_id,
            coordinates: normalizeCoordinates(row.evidence_ref)
        }));
        const latestMetrics = metricsResult.rows[0];
        if (!latestMetrics) {
            res.json({
                deal,
                kpis: [],
                document: {
                    title: `${deal.deal_name} - Source Document (Placeholder)`,
                    pageCount: 3
                },
                highlights: {}
            });
            return;
        }
        const kpiDefs = [
            { key: "revenue", label: "Revenue", value: latestMetrics.revenue },
            { key: "adjustedEbitda", label: "Adjusted EBITDA", value: latestMetrics.adjusted_ebitda },
            { key: "grossProfit", label: "Gross Profit", value: latestMetrics.gross_profit },
            { key: "capex", label: "Capex", value: latestMetrics.capex }
        ];
        const metricCoordinates = normalizeCoordinates(latestMetrics.evidence_ref);
        const kpis = kpiDefs.map((kpi, index) => {
            const riskCoordinates = riskRefs[index]?.coordinates ?? [];
            const sourceReferenceId = riskRefs[index]?.sourceReferenceId;
            const references = riskCoordinates.length > 0
                ? riskCoordinates
                : metricCoordinates.length > 0
                    ? metricCoordinates
                    : [coordinateFromRef(`mock:${kpi.key}:${deal.code}`)];
            const evidenceRef = sourceReferenceId ?? `mock:${kpi.key}:${deal.code}`;
            const evidenceOptions = references.map((coordinates, optionIndex) => ({
                id: `${evidenceRef}:${optionIndex}`,
                evidenceRef,
                ...coordinates
            }));
            return {
                key: kpi.key,
                label: kpi.label,
                value: Number(kpi.value),
                fiscalYear: latestMetrics.fiscal_year,
                evidenceRef,
                evidenceOptions
            };
        });
        const highlights = Object.fromEntries(kpis.flatMap((kpi) => kpi.evidenceOptions.map((option) => [
            option.id,
            {
                page: option.page,
                x: option.x,
                y: option.y,
                width: option.width,
                height: option.height
            }
        ])));
        res.json({
            deal,
            kpis,
            document: {
                title: `${deal.deal_name} - Source Document (Placeholder)`,
                pageCount: 3
            },
            highlights
        });
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Evidence read failed");
    }
});
const port = Number(process.env.PORT ?? 8787);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${port}`);
});
