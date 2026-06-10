"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcknowledgeTaskButton({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function update(status: "acknowledged" | "completed") {
    setLoading(true);
    await fetch(`/api/employer/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1.5 shrink-0">
      {currentStatus === "pending" && (
        <button
          onClick={() => update("acknowledged")}
          disabled={loading}
          className="text-xs text-[#1a56a0] hover:bg-[#eff6ff] px-2 py-1 rounded border border-[#bfdbfe] whitespace-nowrap disabled:opacity-50 transition-colors"
        >
          Acknowledge
        </button>
      )}
      <button
        onClick={() => update("completed")}
        disabled={loading}
        className="text-xs text-[#16a34a] hover:bg-[#f0fdf4] px-2 py-1 rounded border border-[#bbf7d0] whitespace-nowrap disabled:opacity-50 transition-colors"
      >
        Mark Complete
      </button>
    </div>
  );
}
