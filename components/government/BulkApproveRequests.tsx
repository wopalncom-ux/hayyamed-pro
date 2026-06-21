"use client";

import { useState, useTransition } from "react";
import { bulkApproveRequests, bulkRejectRequests } from "@/app/(government)/government/actions";

interface PendingRequest {
  id: string;
  name: string;
  profession: string;
  requestedAt: string;
}

export default function BulkApproveRequests({
  requests,
  organizationId,
}: {
  requests: PendingRequest[];
  organizationId: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const allSelected = requests.length > 0 && selected.size === requests.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(requests.map((r) => r.id)));
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handle(action: "approve" | "reject") {
    if (selected.size === 0) return;
    const ids = [...selected];
    startTransition(async () => {
      setMessage(null);
      const fn = action === "approve" ? bulkApproveRequests : bulkRejectRequests;
      const result = await fn(ids, organizationId);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: `${result?.count ?? ids.length} request${ids.length > 1 ? "s" : ""} ${action === "approve" ? "approved" : "rejected"} successfully.`,
        });
        setSelected(new Set());
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-[#111]">Pending Registration Requests</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {requests.length} professional{requests.length !== 1 ? "s" : ""} requesting to link with your authority
          </p>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748b]">{selected.size} selected</span>
            <button
              onClick={() => handle("reject")}
              disabled={isPending}
              className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
            >
              Reject selected
            </button>
            <button
              onClick={() => handle("approve")}
              disabled={isPending}
              className="text-xs px-4 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors font-medium"
            >
              {isPending ? "Processing…" : `Approve ${selected.size}`}
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`mx-6 mt-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === "success"
            ? "bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a]"
            : "bg-[#fef2f2] border border-[#fecaca] text-[#dc2626]"
        }`}>
          {message.text}
        </div>
      )}

      <div className="divide-y divide-[#e2e8f0]">
        {/* Select all row */}
        <div className="px-6 py-3 flex items-center gap-3 bg-[#f8fafc]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 rounded border-[#cbd5e1] text-[#1a56a0] focus:ring-[#1a56a0]/20"
            aria-label="Select all"
          />
          <span className="text-xs font-medium text-[#64748b]">Select all</span>
        </div>

        {requests.map((req) => (
          <div key={req.id} className="px-6 py-4 flex items-center gap-4">
            <input
              type="checkbox"
              checked={selected.has(req.id)}
              onChange={() => toggle(req.id)}
              className="w-4 h-4 rounded border-[#cbd5e1] text-[#1a56a0] focus:ring-[#1a56a0]/20 flex-shrink-0"
              aria-label={`Select ${req.name}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111]">{req.name}</p>
              <p className="text-xs text-[#64748b] mt-0.5">
                {req.profession} &middot; Requested {new Date(req.requestedAt).toLocaleDateString()}
              </p>
            </div>
            {/* Individual quick actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setSelected(new Set([req.id]));
                  handle("reject");
                }}
                disabled={isPending}
                className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setSelected(new Set([req.id]));
                  handle("approve");
                }}
                disabled={isPending}
                className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
