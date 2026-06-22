"use client";
import { useState } from "react";

type Snapshot = {
  id: string;
  page_url: string;
  page_label: string;
  strategy: string;
  performance_score: number | null;
  accessibility_score: number | null;
  seo_score: number | null;
  best_practices_score: number | null;
  lcp_ms: number | null;
  cls_score: number | null;
  fid_ms: number | null;
  ttfb_ms: number | null;
  fcp_ms: number | null;
  si_ms: number | null;
  tbt_ms: number | null;
  created_at: string;
};

const TRACKED_PAGES = [
  { url: "https://hayyamed.pro", label: "Landing Page" },
  { url: "https://hayyamed.pro/about", label: "About" },
  { url: "https://hayyamed.pro/pricing", label: "Pricing" },
  { url: "https://hayyamed.pro/specialties", label: "Specialties" },
  { url: "https://hayyamed.pro/login", label: "Login" },
];

function scoreColor(score: number | null) {
  if (score === null) return "text-[#94a3b8]";
  if (score >= 90) return "text-[#16a34a]";
  if (score >= 50) return "text-[#d97706]";
  return "text-[#dc2626]";
}

function scoreBg(score: number | null) {
  if (score === null) return "bg-[#f1f5f9]";
  if (score >= 90) return "bg-[#dcfce7]";
  if (score >= 50) return "bg-[#fef9c3]";
  return "bg-[#fee2e2]";
}

function ScoreRing({ score, label }: { score: number | null; label: string }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const pct = score ?? 0;
  const dash = (pct / 100) * circ;
  const color = score === null ? "#e2e8f0" : score >= 90 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4" />
          <circle
            cx="22" cy="22" r={r} fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${scoreColor(score)}`}>
          {score ?? "—"}
        </span>
      </div>
      <span className="text-[10px] text-[#64748b] text-center leading-tight">{label}</span>
    </div>
  );
}

function ms(val: number | null, unit = "ms") {
  if (val === null) return "—";
  if (unit === "s") return `${(val / 1000).toFixed(1)}s`;
  return `${val}ms`;
}

function VitalBadge({ label, value, good, needs }: { label: string; value: string; good: boolean | null; needs: boolean | null }) {
  const bg = good ? "bg-[#dcfce7] text-[#16a34a]" : needs ? "bg-[#fef9c3] text-[#92400e]" : "bg-[#fee2e2] text-[#dc2626]";
  return (
    <div className={`rounded-lg px-3 py-2 ${bg}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}

type Props = { initial: Snapshot[] };

export default function PerformanceClient({ initial }: Props) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>(initial);
  const [running, setRunning] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<"desktop" | "mobile">("desktop");
  const [error, setError] = useState<string | null>(null);
  const [activeUrl, setActiveUrl] = useState(TRACKED_PAGES[0].url);

  const latest = snapshots
    .filter((s) => s.page_url === activeUrl && s.strategy === strategy)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] ?? null;

  const history = snapshots
    .filter((s) => s.page_url === activeUrl && s.strategy === strategy)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  const handleRun = async (url: string, label: string) => {
    setRunning(url);
    setError(null);
    try {
      const res = await fetch("/api/admin/performance/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy, page_label: label }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSnapshots((prev) => [json.data, ...prev]);
      setActiveUrl(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(null);
    }
  };

  const handleRunAll = async () => {
    for (const page of TRACKED_PAGES) {
      await handleRun(page.url, page.label);
      await new Promise((r) => setTimeout(r, 1500)); // avoid rate limit
    }
  };

  // Score history for sparkline
  const perfHistory = history.map((s) => s.performance_score ?? 0).reverse();
  const maxPerf = Math.max(...perfHistory, 1);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 bg-[#f0f4f8] rounded-lg p-1">
          {(["desktop", "mobile"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                strategy === s ? "bg-white text-[#0f172a] shadow-sm" : "text-[#64748b]"
              }`}
            >
              {s === "desktop" ? "🖥 Desktop" : "📱 Mobile"}
            </button>
          ))}
        </div>
        <button
          onClick={handleRunAll}
          disabled={!!running}
          className="px-4 py-2 bg-[#1a56a0] text-white text-sm font-medium rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {running ? "Running…" : "Run All Pages"}
        </button>
        <span className="text-xs text-[#64748b]">Uses Google PageSpeed Insights API — free, no key required</span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {/* Page tabs + run buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TRACKED_PAGES.map((page) => {
          const snap = snapshots
            .filter((s) => s.page_url === page.url && s.strategy === strategy)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          const score = snap?.performance_score ?? null;
          return (
            <div
              key={page.url}
              onClick={() => setActiveUrl(page.url)}
              className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                activeUrl === page.url
                  ? "border-[#1a56a0] bg-white shadow-sm"
                  : "border-[#e2e8f0] bg-white hover:border-[#1a56a0]/40"
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-[#0f172a]">{page.label}</p>
                <p className="text-[10px] text-[#94a3b8] truncate max-w-32">{page.url.replace("https://hayyamed.pro", "")  || "/"}</p>
              </div>
              <span className={`text-sm font-bold ml-1 ${scoreColor(score)}`}>
                {score ?? "—"}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleRun(page.url, page.label); }}
                disabled={running === page.url}
                className={`ml-1 px-2 py-1 text-[10px] rounded-md font-medium transition-colors ${
                  running === page.url
                    ? "bg-[#f0f4f8] text-[#94a3b8]"
                    : "bg-[#1a56a0]/10 text-[#1a56a0] hover:bg-[#1a56a0]/20"
                }`}
              >
                {running === page.url ? "…" : "Run"}
              </button>
            </div>
          );
        })}
      </div>

      {!latest ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-[#64748b] text-sm">No data yet for this page. Click <strong>Run</strong> to fetch Lighthouse scores.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scores */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-[#0f172a]">Lighthouse Scores</h3>
                <p className="text-xs text-[#64748b]">
                  {TRACKED_PAGES.find((p) => p.url === activeUrl)?.label} · {strategy} ·{" "}
                  {new Date(latest.created_at).toLocaleString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${scoreBg(latest.performance_score)}`}>
                {latest.performance_score !== null
                  ? latest.performance_score >= 90 ? "Good" : latest.performance_score >= 50 ? "Needs Improvement" : "Poor"
                  : "Unknown"}
              </div>
            </div>
            <div className="flex justify-around flex-wrap gap-4">
              <ScoreRing score={latest.performance_score} label="Performance" />
              <ScoreRing score={latest.accessibility_score} label="Accessibility" />
              <ScoreRing score={latest.best_practices_score} label="Best Practices" />
              <ScoreRing score={latest.seo_score} label="SEO" />
            </div>
          </div>

          {/* Core Web Vitals */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <h3 className="text-sm font-semibold text-[#0f172a] mb-4">Core Web Vitals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <VitalBadge
                label="LCP (target <2.5s)"
                value={ms(latest.lcp_ms, "s")}
                good={latest.lcp_ms !== null && latest.lcp_ms <= 2500}
                needs={latest.lcp_ms !== null && latest.lcp_ms <= 4000}
              />
              <VitalBadge
                label="CLS (target <0.1)"
                value={latest.cls_score !== null ? String(latest.cls_score) : "—"}
                good={latest.cls_score !== null && latest.cls_score <= 0.1}
                needs={latest.cls_score !== null && latest.cls_score <= 0.25}
              />
              <VitalBadge
                label="FID/INP (target <100ms)"
                value={ms(latest.fid_ms)}
                good={latest.fid_ms !== null && latest.fid_ms <= 100}
                needs={latest.fid_ms !== null && latest.fid_ms <= 300}
              />
              <VitalBadge
                label="TTFB (target <800ms)"
                value={ms(latest.ttfb_ms)}
                good={latest.ttfb_ms !== null && latest.ttfb_ms <= 800}
                needs={latest.ttfb_ms !== null && latest.ttfb_ms <= 1800}
              />
              <VitalBadge
                label="FCP (target <1.8s)"
                value={ms(latest.fcp_ms, "s")}
                good={latest.fcp_ms !== null && latest.fcp_ms <= 1800}
                needs={latest.fcp_ms !== null && latest.fcp_ms <= 3000}
              />
              <VitalBadge
                label="TBT (target <200ms)"
                value={ms(latest.tbt_ms)}
                good={latest.tbt_ms !== null && latest.tbt_ms <= 200}
                needs={latest.tbt_ms !== null && latest.tbt_ms <= 600}
              />
            </div>
          </div>

          {/* Performance history sparkline */}
          {perfHistory.length > 1 && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
              <h3 className="text-sm font-semibold text-[#0f172a] mb-4">
                Performance Score — Last {perfHistory.length} Checks
              </h3>
              <div className="flex items-end gap-2 h-20">
                {perfHistory.map((score, i) => {
                  const h = (score / maxPerf) * 100;
                  const color = score >= 90 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-[#64748b]">{score}</span>
                      <div
                        className="w-full rounded-t-sm"
                        style={{ height: `${Math.max(h, 4)}%`, backgroundColor: color }}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-[#94a3b8] mt-2">Oldest → Newest (left to right)</p>
            </div>
          )}

          {/* History table */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f1f5f9]">
                <h3 className="text-sm font-semibold text-[#0f172a]">Run History</h3>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#f1f5f9]">
                  <tr>
                    <th className="px-4 py-2 text-left text-[#64748b] font-medium">When</th>
                    <th className="px-4 py-2 text-center text-[#64748b] font-medium">Perf</th>
                    <th className="px-4 py-2 text-center text-[#64748b] font-medium">A11y</th>
                    <th className="px-4 py-2 text-center text-[#64748b] font-medium">SEO</th>
                    <th className="px-4 py-2 text-center text-[#64748b] font-medium">BP</th>
                    <th className="px-4 py-2 text-center text-[#64748b] font-medium">LCP</th>
                    <th className="px-4 py-2 text-center text-[#64748b] font-medium">CLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {history.map((s) => (
                    <tr key={s.id} className="hover:bg-[#f8fafc]">
                      <td className="px-4 py-2 text-[#64748b]">
                        {new Date(s.created_at).toLocaleString("en-GB", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className={`px-4 py-2 text-center font-bold ${scoreColor(s.performance_score)}`}>{s.performance_score ?? "—"}</td>
                      <td className={`px-4 py-2 text-center font-bold ${scoreColor(s.accessibility_score)}`}>{s.accessibility_score ?? "—"}</td>
                      <td className={`px-4 py-2 text-center font-bold ${scoreColor(s.seo_score)}`}>{s.seo_score ?? "—"}</td>
                      <td className={`px-4 py-2 text-center font-bold ${scoreColor(s.best_practices_score)}`}>{s.best_practices_score ?? "—"}</td>
                      <td className="px-4 py-2 text-center text-[#374151]">{ms(s.lcp_ms, "s")}</td>
                      <td className="px-4 py-2 text-center text-[#374151]">{s.cls_score ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
