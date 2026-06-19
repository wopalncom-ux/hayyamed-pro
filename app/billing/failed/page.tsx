"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FAILURE_REASONS = [
  { icon: "💳", title: "Card declined", desc: "Check that your card details are correct and you have sufficient funds." },
  { icon: "🌐", title: "3D Secure issue", desc: "Your bank may require you to approve the payment in your banking app." },
  { icon: "🔒", title: "International payment blocked", desc: "Some banks block international transactions — contact your bank to allow payments to Hayya Med Pro." },
  { icon: "📋", title: "Billing address mismatch", desc: "Ensure the billing address matches your card statement." },
];

export default function BillingFailedPage() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id") ?? searchParams.get("transaction_id");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
          <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
          Hayya Med Pro
        </Link>
        <Link href="/pricing" className="text-sm font-semibold text-[#1a56a0] hover:underline">
          Try again →
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center">

          {/* Error icon */}
          <div className="w-20 h-20 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
              <path d="M14 14l12 12M26 14l-12 12" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#0f1f3d] mb-3">
            Payment was not completed
          </h1>
          <p className="text-[#64748b] mb-8 leading-relaxed">
            Your card was not charged. This can happen for a few common reasons — try again or contact your bank.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15"
            >
              Try again
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors"
            >
              Back to dashboard (Free)
            </Link>
          </div>

          {/* Common reasons */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-left mb-6">
            <h2 className="text-sm font-bold text-[#0f1f3d] mb-4">Common reasons for payment failure</h2>
            <div className="space-y-4">
              {FAILURE_REASONS.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f1f3d]">{title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Free tier reminder */}
          <div className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-6 text-left mb-6">
            <h2 className="text-sm font-bold text-[#0f1f3d] mb-2">Your free account is still active</h2>
            <p className="text-sm text-[#64748b] leading-relaxed mb-4">
              You can continue using Hayya Med Pro Free — log up to 5 CME activities and track your compliance overview.
              Upgrade whenever you're ready to unlock PDF reports, AI analysis, and unlimited tracking.
            </p>
            <Link href="/dashboard" className="text-sm font-semibold text-[#1a56a0] hover:underline">
              Continue with Free →
            </Link>
          </div>

          {checkoutId && (
            <p className="text-xs text-[#94a3b8] mb-3">
              Reference: <span className="font-mono">{checkoutId}</span>
            </p>
          )}

          <p className="text-xs text-[#94a3b8]">
            Still having trouble? Contact us at{" "}
            <a href="mailto:support@hayyamed.pro" className="text-[#1a56a0] hover:underline">support@hayyamed.pro</a>
            {" "}and we&apos;ll help you get set up.
          </p>
        </div>
      </main>
    </div>
  );
}
