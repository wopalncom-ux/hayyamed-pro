"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { Plan } from "@/lib/planUtils";

const CertificateLink = dynamic(() => import("./CertificateLink"), { ssr: false });
const CmeActivityActions = dynamic(() => import("./CmeActivityActions"), { ssr: false });
const CmeActivitiesEmptyState = dynamic(
  () => import("./CmeActivitiesEmptyState"),
  { ssr: false }
);

type Activity = {
  id: string;
  title: string;
  provider: string | null;
  activity_date: string;
  credits: number;
  category: string | null;
  certificate_url: string | null;
  verification_status: string;
  rejection_reason: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  verified: "Verified",
  pending:  "Pending",
  rejected: "Rejected",
};

export default function CmeActivityList({
  activities,
  walletId,
  plan,
}: {
  activities: Activity[];
  walletId: string;
  plan: Plan | null;
}) {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus]     = useState("");

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const a of activities) if (a.category) s.add(a.category);
    return Array.from(s).sort();
  }, [activities]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activities.filter((a) => {
      if (q && !a.title.toLowerCase().includes(q) && !(a.provider ?? "").toLowerCase().includes(q)) return false;
      if (category && a.category !== category) return false;
      if (status && a.verification_status !== status) return false;
      return true;
    });
  }, [activities, search, category, status]);

  const hasFilters = search || category || status;

  if (activities.length === 0) {
    return <CmeActivitiesEmptyState walletId={walletId} plan={plan ?? "free"} />;
  }

  return (
    <>
      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-[#f1f5f9] bg-[#fafbfc] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities…"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a56a0] bg-white text-[#111]"
          />
        </div>

        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs border border-[#e2e8f0] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a56a0] bg-white text-[#374151]"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
            ))}
          </select>
        )}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-xs border border-[#e2e8f0] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a56a0] bg-white text-[#374151]"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}
            className="text-xs text-[#64748b] hover:text-[#1a56a0] font-medium transition-colors flex-shrink-0"
          >
            Clear filters
          </button>
        )}

        <span className="text-xs text-[#64748b] ml-auto flex-shrink-0">
          {filtered.length} / {activities.length}
        </span>
      </div>

      {/* Activity list */}
      {filtered.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-[#64748b]">
          No activities match your filters.
        </div>
      ) : (
        <div className="divide-y divide-[#e2e8f0]">
          {filtered.map((a) => (
            <div key={a.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#111]">{a.title}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {a.provider ?? "—"} • {a.activity_date}
                    {a.category && (
                      <span className="ml-2 bg-[#f1f5f9] text-[#374151] rounded px-1.5 py-0.5 text-[10px] capitalize">
                        {a.category.replace(/_/g, " ")}
                      </span>
                    )}
                  </p>
                  {a.certificate_url && (
                    <div className="mt-0.5">
                      <CertificateLink certificatePath={a.certificate_url} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-[#1a56a0]">+{a.credits} credits</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    a.verification_status === "verified"
                      ? "bg-[#dcfce7] text-[#16a34a]"
                      : a.verification_status === "rejected"
                      ? "bg-[#fef2f2] text-[#dc2626]"
                      : "bg-[#f1f5f9] text-[#64748b]"
                  }`}>
                    {a.verification_status}
                  </span>
                  {a.verification_status === "rejected" && a.rejection_reason && (
                    <p className="text-[10px] text-[#dc2626] max-w-[160px] text-right leading-tight">
                      {a.rejection_reason}
                    </p>
                  )}
                </div>
              </div>
              {(a.verification_status === "pending" || a.verification_status === "rejected") && (
                <CmeActivityActions
                  id={a.id}
                  status={a.verification_status}
                  title={a.title}
                  provider={a.provider ?? null}
                  activityDate={a.activity_date}
                  credits={a.credits}
                  category={a.category ?? null}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
