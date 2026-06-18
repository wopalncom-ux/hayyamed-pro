"use client";

import { useState } from "react";
import { InlineActivityActions } from "./InlineActivityActions";

type Activity = {
  id: string;
  title: string;
  provider: string | null;
  activity_date: string;
  credits: number;
  category: string | null;
  verification_status: string;
};

export function ActivitiesSection({ initialActivities }: { initialActivities: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const handleAction = (id: string, newStatus: "verified" | "rejected") => {
    setActivities((prev) =>
      prev.map((a) => a.id === id ? { ...a, verification_status: newStatus } : a)
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0]">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide">CME Activities (recent 50)</h2>
        <a href="/admin/cme-verification" className="text-xs text-[#1a56a0] hover:underline">
          Full queue →
        </a>
      </div>
      {activities.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-[#64748b]">No activities yet.</div>
      ) : (
        <div className="divide-y divide-[#f1f5f9]">
          {activities.map((a) => (
            <div key={a.id} className="px-6 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#111] truncate">{a.title}</p>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {a.provider ?? "—"} · {a.activity_date} · {a.credits} credits
                  {a.category && <span className="capitalize"> · {a.category.replace(/_/g, " ")}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {a.verification_status === "pending" ? (
                  <InlineActivityActions activityId={a.id} onAction={handleAction} />
                ) : (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    a.verification_status === "verified"
                      ? "bg-[#dcfce7] text-[#16a34a]"
                      : a.verification_status === "rejected"
                      ? "bg-[#fef2f2] text-[#dc2626]"
                      : "bg-[#fff7ed] text-[#d97706]"
                  }`}>
                    {a.verification_status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
