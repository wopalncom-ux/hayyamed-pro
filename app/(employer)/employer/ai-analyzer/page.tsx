"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EmployerAnalysisResult } from "@/app/api/ai/employer-analyzer/route";

// ── Severity config ───────────────────────────────────────────────────────────
const SEVERITY = {
  critical: { label: "Critical", bg: "bg-[#fef2f2]", text: "text-[#dc2626]", border: "border-[#fca5a5]", dot: "bg-[#dc2626]" },
  high:     { label: "High",     bg: "bg-[#fff7ed]", text: "text-[#d97706]", border: "border-[#fcd34d]", dot: "bg-[#d97706]" },
  medium:   { label: "Medium",   bg: "bg-[#fffbeb]", text: "text-[#b45309]", border: "border-[#fde68a]", dot: "bg-[#b45309]" },
  low:      { label: "Low",      bg: "bg-[#f0fdf4]", text: "text-[#16a34a]", border: "border-[#86efac]", dot: "bg-[#16a34a]" },
};

// ── Risk meter ────────────────────────────────────────────────────────────────
function RiskMeter({ score }: { score: number }) {
  const color = score >= 70 ? "#dc2626" : score >= 40 ? "#d97706" : "#16a34a";
  const label = score >= 70 ? "High Risk" : score >= 40 ? "Moderate Risk" : "Low Risk";
  const angle = (score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-32 h-16 overflow-hidden">
        {/* Background arc */}
        <svg viewBox="0 0 128 64" className="w-full h-full">
          <path d="M 8 64 A 56 56 0 0 1 120 64" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
          <path
            d="M 8 64 A 56 56 0 0 1 120 64"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 175} 175`}
            style={{ transition: "stroke-dasharray 1s ease-out, stroke 0.5s" }}
          />
          {/* Needle */}
          <motion.line
            x1="64" y1="64"
            x2="64" y2="16"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ rotate: -90, originX: "64px", originY: "64px" }}
            animate={{ rotate: angle, originX: "64px", originY: "64px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <circle cx="64" cy="64" r="4" fill={color} />
        </svg>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs font-medium" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

// ── Heatmap bar ───────────────────────────────────────────────────────────────
function DeptHeatmapRow({
  dept,
  delay,
}: {
  dept: { department: string; compliantPct: number; atRiskPct: number; nonCompliantPct: number };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div className="w-28 text-xs text-[#374151] font-medium truncate flex-shrink-0">{dept.department}</div>
      <div className="flex-1 flex rounded-full overflow-hidden h-5 bg-[#f1f5f9]">
        <motion.div
          className="bg-[#16a34a] h-full"
          initial={{ width: 0 }}
          animate={{ width: `${dept.compliantPct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
          title={`Compliant: ${dept.compliantPct}%`}
        />
        <motion.div
          className="bg-[#d97706] h-full"
          initial={{ width: 0 }}
          animate={{ width: `${dept.atRiskPct}%` }}
          transition={{ delay: delay + 0.4, duration: 0.6, ease: "easeOut" }}
          title={`At Risk: ${dept.atRiskPct}%`}
        />
        <motion.div
          className="bg-[#dc2626] h-full"
          initial={{ width: 0 }}
          animate={{ width: `${dept.nonCompliantPct}%` }}
          transition={{ delay: delay + 0.5, duration: 0.6, ease: "easeOut" }}
          title={`Non-Compliant: ${dept.nonCompliantPct}%`}
        />
      </div>
      <div className="flex gap-1 text-[10px] flex-shrink-0">
        <span className="text-[#16a34a] font-semibold">{dept.compliantPct}%</span>
        <span className="text-[#94a3b8]">/</span>
        <span className="text-[#d97706] font-semibold">{dept.atRiskPct}%</span>
        <span className="text-[#94a3b8]">/</span>
        <span className="text-[#dc2626] font-semibold">{dept.nonCompliantPct}%</span>
      </div>
    </motion.div>
  );
}

// ── PDF export ────────────────────────────────────────────────────────────────
function downloadPDF(result: EmployerAnalysisResult, orgName: string) {
  const content = `HAYYA MED PRO — EMPLOYER COMPLIANCE AI REPORT
Organization: ${orgName}
Generated: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXECUTIVE SUMMARY
${result.summary}

RISK SCORE: ${result.riskScore}/100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALERTS (${result.alerts.length})
${result.alerts.map((a) => `[${a.severity.toUpperCase()}] ${a.message} — ${a.affectedCount} staff`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATIONS
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPARTMENT BREAKDOWN
${(result.departmentBreakdown ?? []).map((d) => `${d.department}: ${d.compliantPct}% compliant / ${d.atRiskPct}% at-risk / ${d.nonCompliantPct}% non-compliant`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hayya Med Pro supports CME tracking and licensing readiness. It does not issue
licenses and does not replace official licensing authorities. Users must verify
final requirements with their relevant regulatory body.
`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hayya-compliance-report-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EmployerAIAnalyzerPage() {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("Your Organization");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmployerAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<"heatmap" | "risk_alerts" | "full_report">("full_report");

  // Fetch org on mount via employer page data attribute (set via server-rendered parent)
  useEffect(() => {
    // Derive orgId from the DOM meta tag injected by the parent layout or read from URL
    const metaOrgId = document.querySelector<HTMLMetaElement>("meta[name='x-org-id']")?.content;
    if (metaOrgId) { setOrgId(metaOrgId); return; }

    // Fallback: fetch from /employer/api proxy
    fetch("/api/employer/org-id")
      .then((r) => r.json())
      .then((d) => {
        if (d.organizationId) { setOrgId(d.organizationId); setOrgName(d.name ?? "Your Organization"); }
      })
      .catch(() => {});
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!orgId) { setError("Organization not found. Please try again."); return; }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai/employer-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: orgId, analysisType }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Analysis failed."); return; }
      setResult(data);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orgId, analysisType]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-[#1a56a0] uppercase tracking-wide">Hayya Med AI</span>
          <span className="text-[#e2e8f0]">·</span>
          <span className="text-xs text-[#64748b]">Employer Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0f1f3d]">Compliance AI Analyzer</h1>
        <p className="text-sm text-[#64748b] mt-1">
          AI-powered analysis of your workforce compliance posture. No personal data is shared with AI models.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-[#374151] mb-2 block">Analysis Type</label>
            <div className="flex flex-wrap gap-2">
              {(["full_report", "heatmap", "risk_alerts"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAnalysisType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    analysisType === t
                      ? "bg-[#1a56a0] text-white border-[#1a56a0]"
                      : "bg-white text-[#374151] border-[#e2e8f0] hover:border-[#1a56a0]"
                  }`}
                >
                  {t === "full_report" ? "Full Report" : t === "heatmap" ? "Heatmap Only" : "Risk Alerts"}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={runAnalysis}
            disabled={loading || !orgId}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a56a0] text-white text-sm font-semibold rounded-xl hover:bg-[#1e3a6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                Run AI Analysis
              </>
            )}
          </button>
        </div>

        {!orgId && (
          <p className="text-xs text-[#d97706] mt-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
            </svg>
            Loading organization data…
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-[#fef2f2] border border-[#fca5a5] rounded-xl p-4 mb-6 text-sm text-[#dc2626]">
          {error}
        </div>
      )}

      {/* Loading animation */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-[#e2e8f0]" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#1a56a0] animate-spin" />
            <div className="absolute inset-2 rounded-full bg-[#1a56a0]/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-[#64748b] font-medium">Analyzing compliance data with Hayya Med AI…</p>
          <p className="text-xs text-[#94a3b8]">No personal data is shared with AI models</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Top row: summary + risk meter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Executive summary */}
              <div className="md:col-span-2 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Executive Summary</h2>
                <p className="text-sm text-[#374151] leading-relaxed">{result.summary}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => downloadPDF(result, orgName)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#1a56a0] hover:text-[#1e3a6e] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download Report
                  </button>
                </div>
              </div>

              {/* Risk meter */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
                <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">Risk Score</h2>
                <RiskMeter score={result.riskScore} />
              </div>
            </div>

            {/* Department heatmap */}
            {result.departmentBreakdown && result.departmentBreakdown.length > 0 && (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">Department Compliance Heatmap</h2>
                  <div className="flex gap-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#16a34a]" />Compliant</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#d97706]" />At Risk</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#dc2626]" />Non-Compliant</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.departmentBreakdown.map((dept, i) => (
                    <DeptHeatmapRow key={dept.department} dept={dept} delay={i * 0.08} />
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            {result.alerts.length > 0 && (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">
                  Risk Alerts ({result.alerts.length})
                </h2>
                <div className="space-y-2.5">
                  {result.alerts.map((alert, i) => {
                    const s = SEVERITY[alert.severity];
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg} ${s.border}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${s.dot}`} />
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-bold ${s.text} uppercase tracking-wide mr-2`}>{s.label}</span>
                          <span className="text-xs text-[#374151]">{alert.message}</span>
                        </div>
                        <span className="text-xs text-[#64748b] font-medium flex-shrink-0">{alert.affectedCount} staff</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">AI Recommendations</h2>
              <ol className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#1a56a0]/10 text-[#1a56a0] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#374151] leading-relaxed">{rec}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-[#94a3b8] text-center leading-relaxed">
              Hayya Med Pro AI analysis is based on aggregated, anonymized compliance data.
              No individual staff personal information was used. Always verify requirements with your local regulatory authority.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="text-center py-16 text-[#94a3b8]">
          <svg className="w-12 h-12 mx-auto mb-4 text-[#e2e8f0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          <p className="text-sm font-medium">Select an analysis type and run AI Analysis</p>
          <p className="text-xs mt-1">Your compliance heatmap, risk alerts, and recommendations will appear here</p>
        </div>
      )}
    </div>
  );
}
