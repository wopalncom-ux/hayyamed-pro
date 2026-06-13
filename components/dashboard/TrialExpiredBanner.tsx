import Link from "next/link";

const LOST_FEATURES = [
  "PDF compliance reports (QCHP-ready)",
  "AI-powered gap analysis",
  "Compliance chatbot",
  "Unlimited CME activity tracking",
  "Certificate storage",
];

export default function TrialExpiredBanner({ daysAgo }: { daysAgo: number }) {
  return (
    <div className="rounded-xl border border-[#fecaca] bg-gradient-to-br from-[#fef2f2] to-[#fff7ed] px-5 py-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-[#dc2626] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#991b1b] mb-0.5">
            Your Pro trial ended {daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo} days ago`}
          </p>
          <p className="text-xs text-[#b91c1c] mb-3">
            You no longer have access to the following features:
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {LOST_FEATURES.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white border border-[#fecaca] text-[#dc2626]"
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                {f}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pricing?source=trial_expired_banner"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-[#dc2626] text-white px-5 py-2.5 rounded-lg hover:bg-[#b91c1c] transition-colors"
            >
              Resume Pro — $6/month →
            </Link>
            <span className="text-xs text-[#92400e]">14-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
