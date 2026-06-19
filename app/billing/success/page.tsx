"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PRO_FEATURES = [
  { icon: "📄", title: "Download PDF compliance report", desc: "Official report for QCHP, SCFHS, DHA and every authority" },
  { icon: "🤖", title: "AI gap analysis", desc: "Ask your AI assistant exactly what CME you still need" },
  { icon: "📊", title: "Advanced analytics", desc: "Visualise your compliance progress over time" },
  { icon: "🔔", title: "Smart renewal alerts", desc: "90/60/30-day alerts before every license deadline" },
  { icon: "🌍", title: "Multi-country tracking", desc: "Track compliance for every country you're licensed in" },
  { icon: "📱", title: "Mobile app access", desc: "Log CME from your phone, even offline" },
];

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const [confettiDone, setConfettiDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setConfettiDone(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const checkoutId = searchParams.get("checkout_id") ?? searchParams.get("transaction_id");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
          <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
          Hayya Med Pro
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold text-[#1a56a0] hover:underline">
          Go to dashboard →
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center">

          {/* Success icon */}
          <div
            className="w-20 h-20 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-6"
            style={{ animation: "scale-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-hidden="true">
              <path d="M8 20l8 8 16-16" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#0f1f3d] mb-3">
            Welcome to Hayya Med Pro 🎉
          </h1>
          <p className="text-[#64748b] mb-8 leading-relaxed">
            Your subscription is active. You now have full access to all Pro features
            — including PDF compliance reports, AI gap analysis, and multi-country tracking.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15"
            >
              Go to my dashboard
            </Link>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center justify-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors"
            >
              Download PDF report
            </Link>
          </div>

          {/* Pro features unlocked */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-left mb-6">
            <h2 className="text-sm font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1a56a0] flex items-center justify-center text-white text-[10px] font-black">✓</span>
              Features now available to you
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRO_FEATURES.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0f1f3d]">{title}</p>
                    <p className="text-xs text-[#64748b]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What to do first */}
          <div className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-6 text-left mb-6">
            <h2 className="text-sm font-bold text-[#0f1f3d] mb-4">Recommended next steps</h2>
            <ol className="space-y-3">
              {[
                { step: "1", text: "Add your existing CME activities to your tracker", href: "/dashboard/cme" },
                { step: "2", text: "Download your compliance PDF report for your authority", href: "/dashboard/analytics" },
                { step: "3", text: "Ask your AI assistant about your current compliance gap", href: "/dashboard/ai" },
                { step: "4", text: "Set up license renewal reminders", href: "/dashboard/licenses" },
              ].map(({ step, text, href }) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{step}</span>
                  <Link href={href} className="text-sm text-[#1a56a0] font-medium hover:underline">{text}</Link>
                </li>
              ))}
            </ol>
          </div>

          {checkoutId && (
            <p className="text-xs text-[#94a3b8]">
              Order reference: <span className="font-mono">{checkoutId}</span>
            </p>
          )}

          <p className="text-xs text-[#94a3b8] mt-3">
            Your receipt has been sent to your email address. Questions? Contact{" "}
            <a href="mailto:support@hayyamed.pro" className="text-[#1a56a0] hover:underline">support@hayyamed.pro</a>
          </p>
        </div>
      </main>

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
