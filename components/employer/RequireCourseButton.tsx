"use client";

import { useState, useTransition } from "react";
import { requireCourse, unrequireCourse } from "@/app/(employer)/employer/required-training/actions";

export function RequireCourseButton({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleRequire() {
    startTransition(async () => {
      await requireCourse(courseId, dueDate || undefined, note || undefined);
      setOpen(false);
    });
  }

  if (open) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Due date (optional)"
          className="text-xs border border-[#e2e8f0] rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1a56a0] w-36"
        />
        <button
          onClick={handleRequire}
          disabled={isPending}
          className="text-xs bg-[#1a56a0] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#1547a0] transition-colors disabled:opacity-50"
        >
          {isPending ? "…" : "Confirm"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-[#64748b] hover:text-[#111] px-2 py-1"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="text-xs border border-[#1a56a0] text-[#1a56a0] px-3 py-1.5 rounded-lg font-medium hover:bg-[#eff6ff] transition-colors"
    >
      + Require
    </button>
  );
}

export function UnrequireCourseButton({ requirementId }: { requirementId: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#64748b]">Remove requirement?</span>
        <button
          onClick={() => startTransition(() => unrequireCourse(requirementId))}
          disabled={isPending}
          className="text-xs bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-3 py-1 rounded-lg font-medium hover:bg-[#fee2e2] transition-colors disabled:opacity-50"
        >
          {isPending ? "…" : "Remove"}
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-[#64748b] hover:text-[#111]">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-xs text-[#dc2626] hover:text-[#b91c1c] font-medium"
    >
      Remove
    </button>
  );
}
