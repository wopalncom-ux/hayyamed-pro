import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help & FAQ — Hayya Med Pro",
  description: "Answers to common questions about CME tracking, licensing, QCHP requirements, and your Hayya Med Pro account.",
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is Hayya Med Pro?",
    a: "Hayya Med Pro is a professional CME tracking and licensing readiness platform for healthcare professionals in Qatar and the GCC. It helps you log CME activities, monitor your license renewal timeline, link to your employer, and generate compliance reports.",
  },
  {
    q: "How do I log a CME activity?",
    a: "Go to CME Wallet → click 'Log Activity'. Enter the activity title, category, credits earned, date, and upload your certificate. Activities are reviewed and verified — verified activities automatically update your credit total.",
  },
  {
    q: "How many CME credits do I need in Qatar (QCHP)?",
    a: "QCHP (Qatar Council for Healthcare Practitioners) requires 80 CPD credits per 2-year renewal cycle, with a minimum of 40 per year. Requirements may vary by profession and specialty. Hayya Med Pro reads your country and profession and applies the correct requirement — always verify final requirements with QCHP directly.",
  },
  {
    q: "Does Hayya Med Pro issue licenses or verify credentials?",
    a: "No. Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with your relevant regulatory body (e.g. QCHP, SCFHS, DHA).",
  },
  {
    q: "How do I link to my employer?",
    a: "During onboarding (Step 4) or via Settings, search for your hospital or clinic. Your employer admin receives a link request and approves it. Once linked, your employer can monitor your compliance status (only the data you choose to share in Privacy Settings).",
  },
  {
    q: "What data does my employer see?",
    a: "Only what you explicitly allow. In Dashboard → Settings → Privacy, you control which data fields are visible to your employer: CME progress, license status, specialty, and compliance status. You can toggle each field on or off at any time.",
  },
  {
    q: "What is the difference between Free and Pro?",
    a: "Free lets you track up to 10 CME activities and view your compliance status. Pro ($6/month or $61.20/year — save 15%) removes the activity limit, unlocks AI gap analysis powered by Claude, enables PDF report downloads, adds multi-license tracking, and gives you priority support.",
  },
  {
    q: "How do I download my CPD report?",
    a: "Go to CME Wallet → click 'Download PDF Report'. This requires a Pro subscription. The report includes all verified activities, credits by category, and a compliance summary suitable for QCHP submission.",
  },
  {
    q: "What does the AI Compliance Assistant do?",
    a: "The AI assistant (Pro only) reads your actual CME wallet data and gives you personalized advice: which categories you're short in, which types of activities to prioritize, and how many credits you need before your renewal deadline. It is powered by Claude by Anthropic.",
  },
  {
    q: "How do I reset my password?",
    a: "Go to the login page and click 'Forgot password'. Enter your email address and you will receive a password reset link. The link expires in 60 minutes.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Dashboard → Settings → Subscription → click 'Manage Billing'. This opens the Paddle customer portal where you can cancel, upgrade, or update payment details. Cancellation takes effect at the end of your current billing period.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is stored in a Supabase PostgreSQL database with row-level security — each user can only access their own data. Certificates are stored in a private bucket with signed URLs (1-hour expiry). All admin actions are logged. See our Security Standards for full details.",
  },
  {
    q: "Which countries are supported?",
    a: "Qatar (QCHP) is the primary market. Saudi Arabia (SCFHS), UAE Dubai (DHA), UAE Abu Dhabi (DOH), Kuwait, Bahrain (NHRA), Oman (OMSB), UK (GMC/NMC), and more are being added. Compliance rules are configured per country — no logic is hardcoded.",
  },
  {
    q: "How do I get support?",
    a: "Email us at support@hayyamed.pro. Pro and Enterprise subscribers receive priority response within 4 business hours. Free tier response time is 1–2 business days.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-[#64748b] hover:text-[#111] transition-colors">Log in</Link>
            <Link href="/dashboard" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1547a0] transition-colors">Dashboard</Link>
          </div>
        </div>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#111] mb-3">Help & FAQ</h1>
          <p className="text-[#64748b]">
            Common questions about CME tracking, licensing, and your account.
            Can&apos;t find what you need?{" "}
            <a href="mailto:support@hayyamed.pro" className="text-[#1a56a0] hover:underline">Email support</a>.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-[#f8fafc] transition-colors">
                <span className="text-sm font-semibold text-[#111] pr-4">{q}</span>
                <span className="shrink-0 w-5 h-5 flex items-center justify-center text-[#64748b] group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
              </summary>
              <div className="px-5 pb-5 pt-1">
                <p className="text-sm text-[#374151] leading-relaxed">{a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 bg-[#1a56a0] rounded-xl px-6 py-8 text-center">
          <p className="text-white font-semibold text-lg mb-2">Still have questions?</p>
          <p className="text-blue-200 text-sm mb-5">Our support team typically responds within one business day.</p>
          <a
            href="/contact"
            className="inline-block bg-white text-[#1a56a0] font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>

      <footer className="border-t border-[#e2e8f0] mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
          <span>© 2026 Hayya Med Pro · Healthcare Professional Platform · Qatar</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#374151] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#374151] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
