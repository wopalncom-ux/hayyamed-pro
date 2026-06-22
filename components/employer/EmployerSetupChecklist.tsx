"use client";

import { useState } from "react";
import Link from "next/link";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  action: React.ReactNode;
  done: boolean;
};

export default function EmployerSetupChecklist({
  organizationId,
  orgName,
  hasStaff,
  hasPendingRequests,
  hasRequiredTraining,
}: {
  organizationId: string;
  orgName: string;
  hasStaff: boolean;
  hasPendingRequests: boolean;
  hasRequiredTraining: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const items: ChecklistItem[] = [
    {
      id: "invite",
      title: "Invite your staff",
      description:
        "Share your organisation invite link or QR code so healthcare professionals can link their profiles.",
      action: (
        <Link
          href="/employer#invite-link"
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Get invite link →
        </Link>
      ),
      done: hasStaff,
    },
    {
      id: "approve",
      title: "Approve pending link requests",
      description:
        "Review and approve staff who have requested to link to your organisation.",
      action: (
        <Link
          href="/employer#pending-requests"
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Review requests →
        </Link>
      ),
      done: hasStaff && !hasPendingRequests,
    },
    {
      id: "training",
      title: "Set required training",
      description:
        "Specify which CME courses are mandatory for your staff. Completion is tracked automatically.",
      action: (
        <Link
          href="/employer/required-training"
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Configure training →
        </Link>
      ),
      done: hasRequiredTraining,
    },
    {
      id: "report",
      title: "Download your first compliance report",
      description:
        "Export a full CSV of your staff compliance status for HR or accreditation reporting.",
      action: hasStaff ? (
        <Link
          href="/employer/analytics"
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Open analytics →
        </Link>
      ) : (
        <span className="text-xs text-[#94a3b8]">Available once staff are linked</span>
      ),
      done: false,
    },
    {
      id: "branding",
      title: "Customise your dashboard branding",
      description:
        "Add your hospital logo and brand colour so the employer dashboard reflects your organisation.",
      action: (
        <Link
          href="/employer/settings"
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Open settings →
        </Link>
      ),
      done: false,
    },
  ];

  // "report" and "branding" are aspirational CTAs — exclude from completion count
  const scoredItems = items.filter((i) => i.id !== "report" && i.id !== "branding");
  const completedCount = scoredItems.filter((i) => i.done).length;
  const allCoreDone = completedCount === scoredItems.length;

  // Hide once the three core steps are done AND the org has staff
  if (allCoreDone && hasStaff) return null;

  // Suppress "approve" step entirely when no staff have requested yet
  const visibleItems = items.filter((item) => {
    if (item.id === "approve" && !hasStaff && !hasPendingRequests) return false;
    return true;
  });

  const visibleScored   = visibleItems.filter((i) => i.id !== "report" && i.id !== "branding");
  const visibleComplete = visibleScored.filter((i) => i.done).length;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#111]">Get started with {orgName}</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {visibleComplete} of {visibleScored.length} essential steps complete
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors"
          aria-label="Dismiss setup checklist"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-[#1a56a0] rounded-full transition-all duration-500"
          style={{ width: `${(visibleComplete / Math.max(visibleScored.length, 1)) * 100}%` }}
        />
      </div>

      <ol className="space-y-3">
        {visibleItems.map((item) => {
          const isAspirational = item.id === "report" || item.id === "branding";
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${
                  item.done
                    ? "bg-[#16a34a] border-[#16a34a]"
                    : isAspirational
                    ? "border-[#d1d5db] bg-[#f8fafc]"
                    : "border-[#d1d5db] bg-white"
                }`}
              >
                {item.done && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
                {isAspirational && !item.done && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d1d5db]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${item.done ? "text-[#64748b] line-through" : "text-[#111]"}`}>
                  {item.title}
                  {isAspirational && (
                    <span className="ml-2 text-xs font-normal text-[#94a3b8]">(optional)</span>
                  )}
                </p>
                {!item.done && (
                  <>
                    <p className="text-xs text-[#64748b] mt-0.5">{item.description}</p>
                    <div className="mt-1.5">{item.action}</div>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
