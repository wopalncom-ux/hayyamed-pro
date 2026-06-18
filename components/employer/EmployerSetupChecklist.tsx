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
  hasComplianceRules,
}: {
  organizationId: string;
  orgName: string;
  hasStaff: boolean;
  hasComplianceRules: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const items: ChecklistItem[] = [
    {
      id: "invite",
      title: "Invite your staff",
      description: "Share your invite link so team members can link their profiles to your organisation.",
      action: (
        <Link
          href={`/employer?invite=1`}
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Copy invite link →
        </Link>
      ),
      done: hasStaff,
    },
    {
      id: "compliance",
      title: "Set compliance country & rules",
      description: "Configure which country's CME/CPD rules apply to your staff. The system calculates compliance automatically.",
      action: (
        <Link
          href="/admin/country-rules"
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Configure rules →
        </Link>
      ),
      done: hasComplianceRules,
    },
    {
      id: "ai",
      title: "Run AI workforce analysis",
      description: "Get an AI-generated compliance risk summary and recommendations for your team.",
      action: (
        <Link
          href="/employer/ai-analyzer"
          className="text-xs font-semibold text-[#1a56a0] hover:underline"
        >
          Open AI Analyzer →
        </Link>
      ),
      done: false,
    },
    {
      id: "export",
      title: "Export compliance report",
      description: "Download a CSV of your staff compliance status for HR or accreditation reporting.",
      action: (
        <span className="text-xs text-[#64748b]">Available once staff are linked</span>
      ),
      done: false,
    },
  ];

  const completedCount = items.filter((i) => i.done).length;
  const allDone = completedCount === items.length;

  if (allDone) return null;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#111]">Get started with {orgName}</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {completedCount} of {items.length} steps complete
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-[#64748b] hover:text-[#64748b] transition-colors"
          aria-label="Dismiss setup checklist"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-[#1a56a0] rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / items.length) * 100}%` }}
        />
      </div>

      <ol className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${
              item.done
                ? "bg-[#16a34a] border-[#16a34a]"
                : "border-[#d1d5db] bg-white"
            }`}>
              {item.done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${item.done ? "text-[#64748b] line-through" : "text-[#111]"}`}>
                {item.title}
              </p>
              {!item.done && (
                <>
                  <p className="text-xs text-[#64748b] mt-0.5">{item.description}</p>
                  <div className="mt-1.5">{item.action}</div>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
