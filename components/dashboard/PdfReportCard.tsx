"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import DownloadReportButton from "./DownloadReportButton";
import type { Plan } from "@/lib/planUtils";
import { isPro } from "@/lib/planUtils";

const REPORT_FEATURES = [
  "Full CME credit breakdown by category",
  "Activity log with providers and dates",
  "Compliance status vs licensing authority target",
  "Certificate evidence list with file references",
  "Ready to submit to QCHP, SCFHS, DHA and more",
];

function MockReportPreview() {
  return (
    <div
      className="relative rounded-xl overflow-hidden border border-[#e2e8f0] bg-white select-none"
      style={{ filter: "blur(3px)", pointerEvents: "none" }}
      aria-hidden="true"
    >
      {/* Report header */}
      <div className="bg-[#0f1f3d] px-4 py-3 flex items-center justify-between">
        <div>
          <div className="h-3 w-24 bg-white/20 rounded mb-1.5" />
          <div className="h-2 w-36 bg-white/10 rounded" />
        </div>
        <div className="h-8 w-8 rounded bg-white/10" />
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Name + profession */}
        <div>
          <div className="h-2.5 w-40 bg-[#e2e8f0] rounded mb-1.5" />
          <div className="h-2 w-56 bg-[#f1f5f9] rounded" />
        </div>

        {/* Compliance bar */}
        <div className="bg-[#f8fafc] rounded-lg px-3 py-2.5">
          <div className="h-2 w-28 bg-[#e2e8f0] rounded mb-2" />
          <div className="w-full bg-[#e2e8f0] rounded-full h-2 mb-1">
            <div className="h-2 w-3/4 bg-[#1a56a0] rounded-full" />
          </div>
          <div className="h-2 w-20 bg-[#f1f5f9] rounded" />
        </div>

        {/* Activities */}
        <div>
          <div className="h-2 w-28 bg-[#e2e8f0] rounded mb-2" />
          {[56, 44, 64, 36].map((w) => (
            <div key={w} className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-[#16a34a] flex-shrink-0" />
              <div className={`h-2 bg-[#f1f5f9] rounded`} style={{ width: `${w}%` }} />
              <div className="h-2 w-8 bg-[#e8f0fe] rounded ml-auto flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[#f1f5f9] pt-2 flex items-center justify-between">
          <div className="h-2 w-32 bg-[#f1f5f9] rounded" />
          <div className="h-2 w-16 bg-[#e2e8f0] rounded" />
        </div>
      </div>
    </div>
  );
}

interface Props {
  plan: Plan;
  walletCountry?: string | null;
}

export default function PdfReportCard({ plan, walletCountry }: Props) {
  useEffect(() => {
    if (!isPro(plan)) {
      track("pdf_paywall_shown", { plan });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPro(plan)) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-5 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111]">
              {walletCountry ? `${walletCountry}` : "Compliance"} Report
            </p>
            <p className="text-xs text-[#64748b]">QCHP-ready · includes all verified activities</p>
          </div>
        </div>
        <DownloadReportButton />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-6 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] px-6 py-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[#93c5fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="text-xs font-semibold text-[#93c5fd] uppercase tracking-wide">Pro Feature</p>
          </div>
          <h3 className="text-base font-bold text-white">Your compliance report is ready</h3>
          <p className="text-[rgba(255,255,255,0.6)] text-xs mt-0.5">
            {walletCountry ? `${walletCountry}-ready` : "Authority-ready"} · Download to submit or share with employers
          </p>
        </div>
        <span className="text-xs font-semibold bg-[rgba(255,255,255,0.1)] text-white border border-[rgba(255,255,255,0.15)] px-2 py-1 rounded-full flex-shrink-0">
          Locked
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Blurred preview */}
          <div className="relative">
            <MockReportPreview />
            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[rgba(255,255,255,0.5)]">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mb-1">
                <svg className="w-5 h-5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-[#64748b]">Pro only</p>
            </div>
          </div>

          {/* Feature list */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">What's included</p>
            <ul className="space-y-2.5">
              {REPORT_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#374151] leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#f8fafc] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#111]">Unlock with Pro</p>
            <p className="text-xs text-[#64748b] mt-0.5">
              <span className="font-semibold text-[#1a56a0]">$6/month</span>
              {" "}· or $61.20/year (save 15%) · Cancel anytime
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/pricing?source=pdf_report_card"
              onClick={() => track("upgrade_clicked", { source: "pdf_report_card" })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2.5 rounded-xl hover:bg-[#154890] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Unlock PDF Report →
            </a>
          </div>
        </div>

        <p className="text-[11px] text-[#94a3b8] mt-3 text-center">
          14-day money-back guarantee · No credit card required to start
        </p>
      </div>
    </div>
  );
}
