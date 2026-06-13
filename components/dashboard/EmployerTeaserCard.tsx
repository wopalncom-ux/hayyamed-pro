"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import type { Plan } from "@/lib/planUtils";

export default function EmployerTeaserCard({ plan }: { plan: Plan }) {
  // Employer plan holder who hasn't registered their org yet — show setup CTA
  if (plan === "employer") {
    return (
      <div className="bg-gradient-to-br from-[#fff7ed] to-[#fffbf5] border-2 border-[#d97706] rounded-xl p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#d97706] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#92400e] mb-0.5">
              Your Employer plan is active — complete your setup
            </p>
            <p className="text-xs text-[#64748b] mb-3">
              Register your organization to access the staff compliance dashboard. Takes 2 minutes.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {["Register organization", "Link your staff", "View compliance grid"].map((step, i) => (
                <span
                  key={step}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-[#fed7aa] text-[#d97706] flex items-center gap-1"
                >
                  <span className="w-4 h-4 rounded-full bg-[#d97706] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>

            <Link
              href="/employer/register?welcome=1"
              onClick={() => track("employer_setup_started", { source: "teaser_card" })}
              className="text-xs font-semibold bg-[#d97706] text-white px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors inline-block"
            >
              Set up my organization →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pro or trialing user — show employer upsell
  return (
    <div className="bg-gradient-to-br from-[#fff7ed] to-[#fffbf5] border border-[#fed7aa] rounded-xl p-5 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#d97706] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111] mb-0.5">
            Do you manage a healthcare team?
          </p>
          <p className="text-xs text-[#64748b] mb-3">
            Employer plans give you real-time compliance visibility across your entire staff — from residents to consultants — with zero admin overhead.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "Staff compliance grid",
              "Department grouping",
              "Bulk PDF reports",
              "Weekly digest emails",
            ].map((f) => (
              <span
                key={f}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#fff7ed] border border-[#fed7aa] text-[#d97706]"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/employers"
              onClick={() => track("upgrade_clicked", { source: "employer_teaser_card" })}
              className="text-xs font-semibold bg-[#d97706] text-white px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors"
            >
              See Employer plans →
            </a>
            <span className="text-xs text-[#64748b]">From $50/month · up to 10 staff</span>
          </div>
        </div>
      </div>
    </div>
  );
}
