"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { QueueItem } from "./page";

const CHANNEL_COLORS: Record<string, string> = {
  email: "bg-blue-100 text-blue-700",
  push:  "bg-purple-100 text-purple-700",
  sms:   "bg-green-100 text-green-700",
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function QueueTable({
  items,
  selected,
  onToggle,
  onAction,
  isPending,
}: {
  items: QueueItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onAction: (ids: string[], action: "retry" | "cancel") => void;
  isPending: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-[#64748b] uppercase">
          <tr>
            <th className="px-3 py-2 text-left w-8" />
            <th className="px-3 py-2 text-left">Created</th>
            <th className="px-3 py-2 text-left">Channel</th>
            <th className="px-3 py-2 text-left">Template</th>
            <th className="px-3 py-2 text-left">Professional</th>
            <th className="px-3 py-2 text-center">Attempts</th>
            <th className="px-3 py-2 text-left">Error</th>
            <th className="px-3 py-2 text-left">Next retry</th>
            <th className="px-3 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className={selected.has(item.id) ? "bg-blue-50" : "hover:bg-gray-50"}
            >
              <td className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => onToggle(item.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-3 py-2 text-[#64748b] whitespace-nowrap">
                {fmtTime(item.created_at)}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    CHANNEL_COLORS[item.channel] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.channel}
                </span>
              </td>
              <td className="px-3 py-2 font-mono text-xs text-gray-700 max-w-[180px] truncate">
                {item.template_id}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-[#64748b]">
                {item.professional_id ? (
                  <a
                    href={`/admin/professionals/${item.professional_id}`}
                    className="text-[#1a56a0] hover:underline"
                  >
                    …{item.professional_id.slice(-8)}
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-3 py-2 text-center text-[#64748b]">
                {item.attempts}/{item.max_attempts}
              </td>
              <td
                className="px-3 py-2 text-red-600 text-xs max-w-[220px] truncate"
                title={item.error_message ?? ""}
              >
                {item.error_message ?? "—"}
              </td>
              <td className="px-3 py-2 text-[#64748b] text-xs whitespace-nowrap">
                {item.next_retry_at ? fmtTime(item.next_retry_at) : "—"}
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-1">
                  <button
                    disabled={isPending}
                    onClick={() => onAction([item.id], "retry")}
                    className="text-xs px-2 py-1 rounded bg-[#1a56a0] text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Retry
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => onAction([item.id], "cancel")}
                    className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function NotificationQueueClient({
  items,
  totalFailed,
}: {
  items: QueueItem[];
  totalFailed: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);

  async function doAction(ids: string[], action: "retry" | "cancel") {
    setFeedback(null);
    const res = await fetch("/api/admin/notification-queue", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action }),
    });
    const data = await res.json();
    if (res.ok) {
      setFeedback(`${action === "retry" ? "Queued" : "Cancelled"} ${data.updated} item${data.updated === 1 ? "" : "s"}.`);
      setSelected(new Set());
      startTransition(() => router.refresh());
    } else {
      setFeedback(`Error: ${data.error ?? "Unknown error"}`);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const failedItems  = items.filter((i) => i.status === "failed");
  const pendingItems = items.filter((i) => i.status === "pending");

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-[#64748b] border border-[#e2e8f0] rounded-lg bg-white">
        <p className="text-lg font-semibold text-gray-900">Queue is clear</p>
        <p className="text-sm mt-1">No failed or pending notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="px-4 py-2 rounded bg-green-50 border border-green-200 text-green-800 text-sm">
          {feedback}
        </div>
      )}

      {failedItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Failed{" "}
              <span className="text-red-600">
                ({failedItems.length}
                {totalFailed > failedItems.length
                  ? ` shown of ${totalFailed.toLocaleString()} total`
                  : ""}
                )
              </span>
            </h2>
            <div className="flex gap-2">
              {selected.size > 0 && (
                <>
                  <button
                    disabled={isPending}
                    onClick={() => doAction([...selected], "retry")}
                    className="text-sm px-3 py-1.5 rounded bg-[#1a56a0] text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Retry {selected.size} selected
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => doAction([...selected], "cancel")}
                    className="text-sm px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Cancel {selected.size}
                  </button>
                </>
              )}
              <button
                disabled={isPending || failedItems.length === 0}
                onClick={() => doAction(failedItems.map((i) => i.id), "retry")}
                className="text-sm px-3 py-1.5 rounded border border-[#1a56a0] text-[#1a56a0] hover:bg-blue-50 disabled:opacity-50"
              >
                {isPending ? "Working…" : "Retry all failed"}
              </button>
            </div>
          </div>
          <QueueTable
            items={failedItems}
            selected={selected}
            onToggle={toggleSelect}
            onAction={doAction}
            isPending={isPending}
          />
        </section>
      )}

      {pendingItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Pending{" "}
              <span className="text-yellow-600">({pendingItems.length})</span>
            </h2>
            {selected.size > 0 && pendingItems.some((i) => selected.has(i.id)) && (
              <button
                disabled={isPending}
                onClick={() =>
                  doAction(
                    pendingItems.filter((i) => selected.has(i.id)).map((i) => i.id),
                    "cancel"
                  )
                }
                className="text-sm px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel selected
              </button>
            )}
          </div>
          <QueueTable
            items={pendingItems}
            selected={selected}
            onToggle={toggleSelect}
            onAction={doAction}
            isPending={isPending}
          />
        </section>
      )}
    </div>
  );
}
