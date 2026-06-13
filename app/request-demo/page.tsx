import type { Metadata } from "next";
import Link from "next/link";
import DemoForm from "./DemoForm";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Request a Demo â€” Hayya Med Pro Employer",
  description:
    "See how Hayya Med Pro helps clinic directors and hospital HR managers track staff CME compliance in real time. Request a personalised demo for your organisation.",
  openGraph: {
    title: "Request a Demo â€” Hayya Med Pro Employer Compliance Dashboard",
    description:
      "Real-time staff compliance tracking for GCC clinics and hospitals. See QCHP, SCFHS, DHA, and DOH compliance at a glance. Request a demo for your team.",
    url: `${APP_URL}/request-demo`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/request-demo` },
  robots: { index: false },
};

const TRUST_POINTS = [
  {
    icon: "ðŸ“‹",
    title: "Real-time compliance grid",
    body: "See every staff member's CME progress, compliance status, and license expiry at a glance.",
  },
  {
    icon: "ðŸ“„",
    title: "Bulk PDF reports",
    body: "One-click PDF showing full team compliance â€” ready for QCHP, JCI, and CBAHI audits.",
  },
  {
    icon: "ðŸ“§",
    title: "Weekly digest emails",
    body: "Automated Monday morning report with compliance changes and upcoming renewal deadlines.",
  },
  {
    icon: "ðŸ¥",
    title: "All GCC authorities",
    body: "QCHP, SCFHS, DHA, DOH, NHRA, OMSB, and MOH Kuwait â€” all in one dashboard.",
  },
];

export default function RequestDemoPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="font-bold text-base text-[#111]">
              Hayya Med <span className="text-[#1a56a0]">Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/employers" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">
              Employer features
            </Link>
            <Link href="/login" className="text-[#1a56a0] font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left â€” context + trust signals */}
          <div className="lg:col-span-2">
            <span className="inline-block bg-[#fff7ed] border border-[#fed7aa] text-[#c2410c] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              For clinic admins and hospital HR
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mb-3 leading-tight">
              See Hayya Med Pro in action for your team
            </h1>
            <p className="text-sm text-[#64748b] mb-7 leading-relaxed">
              We&apos;ll walk you through the staff compliance dashboard, bulk reporting,
              and how other GCC clinics use Hayya Med Pro before QCHP renewal season.
            </p>

            <div className="space-y-4 mb-8">
              {TRUST_POINTS.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden>{p.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#111]">{p.title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing teaser */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-sm">
              <p className="font-semibold text-[#111] mb-1">Employer plans start at $50/month</p>
              <p className="text-[#64748b] text-xs leading-relaxed mb-3">
                Up to 10 staff Â· Real-time dashboard Â· Bulk PDF reports Â· Weekly digest Â· No setup fee
              </p>
              <Link
                href="/pricing#employer"
                className="text-xs font-semibold text-[#1a56a0] hover:underline"
              >
                See full pricing â†’
              </Link>
            </div>
          </div>

          {/* Right â€” form */}
          <div className="lg:col-span-3">
            <p className="text-sm font-medium text-[#374151] mb-4">
              Fill in your details and we&apos;ll be in touch within one business day.
            </p>
            <DemoForm />
          </div>
        </div>

        {/* Bottom reassurance */}
        <div className="mt-12 border-t border-[#e2e8f0] pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 text-xs text-[#94a3b8]">
          <p>Already have an account? <Link href="/login" className="text-[#1a56a0] hover:underline">Sign in â†’</Link></p>
          <p>Individual professional? <Link href="/register" className="text-[#1a56a0] hover:underline">Create a free account â†’</Link></p>
          <p className="sm:ml-auto">
            <Link href="/privacy" className="hover:text-[#64748b] transition-colors">Privacy Policy</Link>
            {" Â· "}
            <Link href="/terms" className="hover:text-[#64748b] transition-colors">Terms</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
