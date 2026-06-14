"use client";

import { useEffect, useState, useCallback } from "react";
import { getQueue, dequeue, type QueuedCmeActivity } from "@/lib/cmeOfflineQueue";

export default function CmeOfflineSyncBanner() {
  const [queue, setQueue] = useState<QueuedCmeActivity[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);

  // Read queue from localStorage on mount
  useEffect(() => {
    setQueue(getQueue());
  }, []);

  const flushQueue = useCallback(async (items: QueuedCmeActivity[]) => {
    if (items.length === 0 || syncing) return;
    setSyncing(true);
    let succeeded = 0;

    for (const item of items) {
      try {
        const res = await fetch("/api/cme/submit-queued", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletId: item.walletId,
            title: item.title,
            provider: item.provider,
            activityDate: item.activityDate,
            credits: item.credits,
            category: item.category,
          }),
        });

        if (res.ok) {
          dequeue(item.id);
          succeeded++;
        }
      } catch {
        // Leave in queue; will retry on next reconnect
      }
    }

    setSyncedCount((c) => c + succeeded);
    setQueue(getQueue());
    setSyncing(false);
  }, [syncing]);

  // Auto-flush when back online
  useEffect(() => {
    function handleOnline() {
      const current = getQueue();
      setQueue(current);
      if (current.length > 0) flushQueue(current);
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [flushQueue]);

  // Nothing to show
  if (queue.length === 0 && syncedCount === 0) return null;

  return (
    <div className="mb-4">
      {syncedCount > 0 && queue.length === 0 && (
        <div className="bg-[#dcfce7] border border-[#86efac] rounded-lg px-4 py-3 flex items-center gap-3">
          <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-[#15803d] font-medium">
            {syncedCount} offline {syncedCount === 1 ? "activity" : "activities"} synced successfully.
          </p>
        </div>
      )}

      {queue.length > 0 && (
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-lg px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-[#d97706] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-[#92400e]">
                  {queue.length} {queue.length === 1 ? "activity" : "activities"} queued offline
                </p>
                <p className="text-xs text-[#b45309] mt-0.5">
                  {syncing
                    ? "Syncing…"
                    : navigator.onLine
                    ? "Tap sync to upload now"
                    : "Will sync automatically when you reconnect"}
                </p>
                <ul className="mt-2 space-y-1">
                  {queue.map((item) => (
                    <li key={item.id} className="text-xs text-[#92400e] truncate max-w-xs">
                      • {item.title} ({item.credits} cr) — {new Date(item.activityDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {navigator.onLine && !syncing && (
              <button
                onClick={() => flushQueue(queue)}
                className="text-xs font-semibold text-white bg-[#d97706] hover:bg-[#b45309] px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Sync now
              </button>
            )}
            {syncing && (
              <span className="text-xs text-[#b45309] flex-shrink-0">Syncing…</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
