"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  providerId: string;
  status: string;
}

export default function ProviderActions({ providerId, status }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function doAction(action: string) {
    setLoading(action);
    await fetch("/api/admin/training-providers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, action }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {status === "pending" && (
        <button
          onClick={() => doAction("approve")}
          disabled={loading === "approve"}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
        >
          {loading === "approve" ? "…" : "Approve"}
        </button>
      )}
      {status === "active" && (
        <button
          onClick={() => doAction("suspend")}
          disabled={loading === "suspend"}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#dc2626] text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-60 transition-colors"
        >
          {loading === "suspend" ? "…" : "Suspend"}
        </button>
      )}
      {status === "suspended" && (
        <button
          onClick={() => doAction("reactivate")}
          disabled={loading === "reactivate"}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#16a34a] text-[#16a34a] hover:bg-[#dcfce7] disabled:opacity-60 transition-colors"
        >
          {loading === "reactivate" ? "…" : "Reactivate"}
        </button>
      )}
    </div>
  );
}
