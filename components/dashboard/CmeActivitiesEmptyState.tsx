"use client";

import { useState } from "react";
import AddActivityModal from "./AddActivityModal";
import type { Plan } from "@/lib/planUtils";

const EXAMPLES = [
  "🎓 Medical conference",
  "💻 Online CME course",
  "🏥 Workshop or simulation",
  "📖 Journal article review",
  "🎙️ Grand rounds or lecture",
  "🔬 Research or publication",
];

export default function CmeActivitiesEmptyState({
  walletId,
  plan,
}: {
  walletId: string;
  plan: Plan;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="px-6 py-14 text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-[#e8f0fe] rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-7 h-7 text-[#1a56a0]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
        </div>

        {/* Headline */}
        <h3 className="text-base font-semibold text-[#111] mb-2">
          Log your first CME activity
        </h3>
        <p className="text-sm text-[#64748b] max-w-sm mx-auto mb-6 leading-relaxed">
          Every conference, course, workshop, and journal article you complete
          can count towards your renewal. Start building your compliance record today.
        </p>

        {/* Example chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-7">
          {EXAMPLES.map((label) => (
            <span
              key={label}
              className="text-xs text-[#374151] bg-[#f1f5f9] px-3 py-1.5 rounded-full"
            >
              {label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => setOpen(true)}
          className="bg-[#1a56a0] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1547a0] transition-colors"
        >
          + Log my first activity
        </button>
      </div>

      {open && (
        <AddActivityModal
          walletId={walletId}
          plan={plan}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
