"use client";

import { useState, useTransition } from "react";

type Flag = {
  key: string;
  enabled: boolean;
  enabled_plans: string[] | null;
  rollout_pct: number | null;
  description: string | null;
  updated_at: string;
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-[#f1f5f9] text-[#64748b]",
  pro: "bg-[#ede9fe] text-[#7c3aed]",
  employer: "bg-[#fff7ed] text-[#d97706]",
  university: "bg-[#ecfdf5] text-[#16a34a]",
  government: "bg-[#fef2f2] text-[#dc2626]",
};

function FlagRow({ flag }: { flag: Flag }) {
  const [enabled, setEnabled] = useState(flag.enabled);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    startTransition(async () => {
      const res = await fetch("/api/admin/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: flag.key, enabled: next }),
      });
      if (!res.ok) setEnabled(!next); // revert on failure
    });
  };

  return (
    <div className={`bg-white rounded-xl border transition-all ${enabled ? "border-[#e2e8f0]" : "border-dashed border-[#e2e8f0] opacity-70"}`}>
      <div className="p-4 flex items-start gap-4">
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-label={enabled ? `Disable ${flag.key}` : `Enable ${flag.key}`}
          className={`relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
            enabled ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"
          } ${pending ? "opacity-50" : ""}`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <code className="text-sm font-semibold text-[#0f1f3d] font-mono">{flag.key}</code>
            {enabled ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d]">ON</span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b]">OFF</span>
            )}
            {flag.rollout_pct !== null && flag.rollout_pct < 100 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef9c3] text-[#92400e]">
                {flag.rollout_pct}% rollout
              </span>
            )}
          </div>

          {flag.description && (
            <p className="text-xs text-[#64748b] mb-2 leading-relaxed">{flag.description}</p>
          )}

          {flag.enabled_plans && flag.enabled_plans.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-[#64748b] self-center">Plans:</span>
              {flag.enabled_plans.map((p) => (
                <span key={p} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PLAN_COLORS[p] ?? "bg-[#f1f5f9] text-[#374151]"}`}>
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[10px] text-[#64748b]">All plans</span>
          )}
        </div>

        <p className="text-[10px] text-[#64748b] whitespace-nowrap flex-shrink-0">
          {new Date(flag.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
        </p>
      </div>
    </div>
  );
}

export default function FeatureFlagsClient({ flags }: { flags: Flag[] }) {
  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f3d] mb-1">Feature Flags</h1>
          <p className="text-sm text-[#64748b]">
            Kill switches and feature gates — changes take effect immediately on next request.
            {" "}{enabledCount} of {flags.length} flags enabled.
          </p>
        </div>
      </div>

      {flags.length === 0 ? (
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-5 py-4">
          <p className="text-sm text-[#92400e] font-medium">No feature flags found.</p>
          <p className="text-xs text-[#92400e] mt-1">
            Run migration 041 which creates the <code>feature_flags</code> table and seeds default flags.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {flags.map((flag) => (
            <FlagRow key={flag.key} flag={flag} />
          ))}
        </div>
      )}

      <div className="mt-6 bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl px-5 py-4">
        <p className="text-xs text-[#1e40af] font-semibold mb-1">How feature flags work</p>
        <ul className="text-xs text-[#1e40af] space-y-1 list-disc list-inside">
          <li>Toggling a flag takes effect immediately — no code deploy needed.</li>
          <li>If <code>enabled_plans</code> is set, only users on those plans see the feature.</li>
          <li>If <code>rollout_pct</code> is less than 100, the flag is in gradual rollout (server-side).</li>
          <li>All flag changes are logged in the audit log.</li>
        </ul>
      </div>
    </div>
  );
}
