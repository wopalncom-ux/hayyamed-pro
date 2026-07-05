"use client";
import { useState, useCallback, useEffect } from "react";

type ServiceStatus = "ok" | "degraded" | "down" | "checking" | "idle";

type ServiceInfo = {
  id: string;
  label: string;
  description: string;
  icon: string;
  critical: boolean;
};

const SERVICES: ServiceInfo[] = [
  { id: "supabase",  label: "Supabase DB",        icon: "🗄",  description: "PostgreSQL — primary database", critical: true },
  { id: "storage",   label: "Supabase Storage",    icon: "📦",  description: "media-library bucket",          critical: true },
  { id: "postmark",  label: "Postmark Email",       icon: "✉️",  description: "Transactional email delivery",  critical: true },
  { id: "vertex",    label: "Vertex AI (Gemini)",    icon: "🤖",  description: "Gemini — all AI features",      critical: false },
  { id: "paddle",    label: "Paddle Payments",      icon: "💳",  description: "Subscriptions & billing",       critical: true },
  { id: "vapid",     label: "Web Push / VAPID",     icon: "🔔",  description: "Push notification keys",        critical: false },
  { id: "app",       label: "App (Cloud Run)",      icon: "☁️",  description: "hayyamed.pro self-ping",        critical: true },
];

const statusColors: Record<ServiceStatus, string> = {
  ok:       "bg-[#dcfce7] border-[#bbf7d0] text-[#15803d]",
  degraded: "bg-[#fef9c3] border-[#fde68a] text-[#92400e]",
  down:     "bg-[#fee2e2] border-[#fecaca] text-[#dc2626]",
  checking: "bg-[#f0f4f8] border-[#e2e8f0] text-[#64748b]",
  idle:     "bg-white border-[#e2e8f0] text-[#94a3b8]",
};

const statusDot: Record<ServiceStatus, string> = {
  ok:       "bg-[#16a34a]",
  degraded: "bg-[#d97706]",
  down:     "bg-[#dc2626]",
  checking: "bg-[#94a3b8] animate-pulse",
  idle:     "bg-[#e2e8f0]",
};

const statusLabel: Record<ServiceStatus, string> = {
  ok: "Operational", degraded: "Degraded", down: "Down", checking: "Checking…", idle: "Not checked",
};

type ServiceState = { status: ServiceStatus; latency_ms: number; detail: string; checked_at: string | null };

const init: ServiceState = { status: "idle", latency_ms: 0, detail: "", checked_at: null };

export default function HealthClient() {
  const [states, setStates] = useState<Record<string, ServiceState>>(
    Object.fromEntries(SERVICES.map((s) => [s.id, { ...init }]))
  );
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const checkOne = useCallback(async (id: string): Promise<ServiceState> => {
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], status: "checking" } }));
    try {
      const res = await fetch("/api/admin/health/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: id }),
      });
      const json: { status: ServiceStatus; latency_ms: number; detail: string } = await res.json();
      const state: ServiceState = { ...json, checked_at: new Date().toISOString() };
      setStates((prev) => ({ ...prev, [id]: state }));
      return state;
    } catch (e) {
      const state: ServiceState = { status: "down", latency_ms: 0, detail: String(e), checked_at: new Date().toISOString() };
      setStates((prev) => ({ ...prev, [id]: state }));
      return state;
    }
  }, []);

  const checkAll = useCallback(async () => {
    setRunning(true);
    await Promise.all(SERVICES.map((s) => checkOne(s.id)));
    setLastRun(new Date().toLocaleTimeString("en-GB"));
    setRunning(false);
  }, [checkOne]);

  // Auto-run on mount
  useEffect(() => { checkAll(); }, [checkAll]);

  // Summary
  const results = Object.values(states);
  const okCount      = results.filter((s) => s.status === "ok").length;
  const degradedCount = results.filter((s) => s.status === "degraded").length;
  const downCount    = results.filter((s) => s.status === "down").length;
  const checkedCount = results.filter((s) => s.status !== "idle" && s.status !== "checking").length;

  const overallStatus: ServiceStatus =
    downCount > 0 && SERVICES.filter((s) => s.critical).some((s) => states[s.id]?.status === "down")
      ? "down"
      : downCount > 0 || degradedCount > 0 ? "degraded" : checkedCount === SERVICES.length ? "ok" : "checking";

  const overallBg = overallStatus === "ok" ? "from-[#dcfce7] to-[#f0fdf4]"
    : overallStatus === "down" ? "from-[#fee2e2] to-[#fff1f2]"
    : "from-[#fef9c3] to-[#fefce8]";

  return (
    <div>
      {/* Overall status banner */}
      <div className={`bg-gradient-to-r ${overallBg} border rounded-2xl p-5 mb-6 flex items-center justify-between`}
        style={{ borderColor: overallStatus === "ok" ? "#bbf7d0" : overallStatus === "down" ? "#fecaca" : "#fde68a" }}>
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full flex-shrink-0 ${statusDot[overallStatus]} ${overallStatus === "ok" ? "" : "animate-pulse"}`} />
          <div>
            <p className="text-base font-bold text-[#0f172a]">
              {overallStatus === "ok" ? "All Systems Operational"
                : overallStatus === "degraded" ? "Partial Degradation Detected"
                : overallStatus === "down" ? "Critical Service Down"
                : "Checking Services…"}
            </p>
            <p className="text-xs text-[#64748b]">
              {checkedCount}/{SERVICES.length} checked · {okCount} OK · {degradedCount} degraded · {downCount} down
              {lastRun && ` · Last run: ${lastRun}`}
            </p>
          </div>
        </div>
        <button
          onClick={checkAll}
          disabled={running}
          className="px-4 py-2 bg-white border border-[#e2e8f0] rounded-xl text-sm font-medium text-[#0f172a] hover:bg-[#f8fafc] disabled:opacity-50 shadow-sm transition-colors"
        >
          {running ? "Checking…" : "Refresh All"}
        </button>
      </div>

      {/* Service grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((svc) => {
          const state = states[svc.id];
          return (
            <div
              key={svc.id}
              className={`rounded-2xl border p-5 transition-all ${statusColors[state.status]}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{svc.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{svc.label}</p>
                    <p className="text-[10px] text-[#64748b]">{svc.description}</p>
                  </div>
                </div>
                {svc.critical && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#0f172a]/10 text-[#374151] rounded font-medium">Critical</span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot[state.status]}`} />
                <span className="text-xs font-semibold">{statusLabel[state.status]}</span>
                {state.latency_ms > 0 && (
                  <span className="text-[10px] text-[#64748b] ml-auto">{state.latency_ms}ms</span>
                )}
              </div>

              {state.detail && (
                <p className="text-[10px] text-[#64748b] mb-3 leading-relaxed">{state.detail}</p>
              )}

              {state.checked_at && (
                <p className="text-[9px] text-[#94a3b8] mb-3">
                  Checked {new Date(state.checked_at).toLocaleTimeString("en-GB")}
                </p>
              )}

              <button
                onClick={() => checkOne(svc.id)}
                disabled={state.status === "checking" || running}
                className="w-full py-1.5 rounded-lg text-xs font-medium border border-current/20 bg-white/50 hover:bg-white/80 disabled:opacity-50 transition-colors"
              >
                {state.status === "checking" ? "Checking…" : "Re-check"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Latency table */}
      {checkedCount > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f1f5f9]">
            <h3 className="text-sm font-semibold text-[#0f172a]">Response Times</h3>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-4 py-2 text-left text-[#64748b] font-medium">Service</th>
                <th className="px-4 py-2 text-left text-[#64748b] font-medium">Status</th>
                <th className="px-4 py-2 text-right text-[#64748b] font-medium">Latency</th>
                <th className="px-4 py-2 text-left text-[#64748b] font-medium">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {SERVICES.map((svc) => {
                const state = states[svc.id];
                if (state.status === "idle") return null;
                return (
                  <tr key={svc.id}>
                    <td className="px-4 py-2 font-medium text-[#0f172a]">{svc.icon} {svc.label}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        state.status === "ok" ? "bg-[#dcfce7] text-[#16a34a]"
                          : state.status === "degraded" ? "bg-[#fef9c3] text-[#92400e]"
                          : "bg-[#fee2e2] text-[#dc2626]"
                      }`}>{statusLabel[state.status]}</span>
                    </td>
                    <td className={`px-4 py-2 text-right font-mono font-medium ${
                      state.latency_ms > 2000 ? "text-[#dc2626]" : state.latency_ms > 1000 ? "text-[#d97706]" : "text-[#16a34a]"
                    }`}>
                      {state.latency_ms > 0 ? `${state.latency_ms}ms` : "—"}
                    </td>
                    <td className="px-4 py-2 text-[#64748b] truncate max-w-[240px]">{state.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
