import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog â€” Hayya Med Pro",
  description:
    "New features, improvements, and fixes shipped to Hayya Med Pro â€” the CME and CPD compliance platform for GCC healthcare professionals.",
  alternates: { canonical: "https://hayyamed.pro/changelog" },
  openGraph: {
    title: "What's new in Hayya Med Pro",
    description: "See every feature and improvement shipped to the platform.",
    url: "https://hayyamed.pro/changelog",
    images: [{ url: `https://hayyamed.pro/api/og?t=What%27s+New+in+Hayya+Med+Pro&s=CME+%26+CPD+compliance+platform+for+GCC+healthcare+professionals&a=%F0%9F%9A%80+Changelog&k=Changelog`, width: 1200, height: 630 }],
  },
};

type Tag = "New" | "Improved" | "Fixed" | "Security";

interface ChangeEntry {
  tag: Tag;
  text: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  summary: string;
  entries: ChangeEntry[];
}

const TAG_STYLES: Record<Tag, string> = {
  New:      "bg-[#dcfce7] text-[#16a34a]",
  Improved: "bg-[#eff6ff] text-[#1a56a0]",
  Fixed:    "bg-[#fff7ed] text-[#d97706]",
  Security: "bg-[#fef2f2] text-[#dc2626]",
};

const RELEASES: Release[] = [
  {
    version: "1.4",
    date: "June 2026",
    title: "Email reliability & Pro export tools",
    summary: "One-click email unsubscribe, Postmark bounce protection, Pro calendar export (.ics), and NPS analytics for admins.",
    entries: [
      { tag: "New",      text: "Calendar export (.ics) â€” add all CME deadlines and license expiry dates to any calendar app. Pro only." },
      { tag: "New",      text: "One-click email unsubscribe â€” HMAC-signed tokens, full email preference control, and an unsubscribe landing page." },
      { tag: "New",      text: "Postmark bounce webhook â€” hard-bounced addresses are automatically suppressed to protect sender reputation." },
      { tag: "New",      text: "Admin NPS analytics page â€” view NPS score, promoter/detractor breakdown, and open-text responses." },
      { tag: "Improved", text: "Provider dashboard now shows enrollment counts per course and completion rate as a 4th stat card." },
      { tag: "Improved", text: "Settings page shows a clear warning banner when an email address has hard-bounced or reported spam." },
    ],
  },
  {
    version: "1.3",
    date: "June 2026",
    title: "Analytics funnel, PostHog identity & upgrade attribution",
    summary: "Full conversion funnel now measurable end-to-end â€” from first page view through payment confirmation.",
    entries: [
      { tag: "New",      text: "PostHog user identity â€” all analytics events now tied to the authenticated user ID for per-user funnel analysis." },
      { tag: "New",      text: "subscription_activated event â€” fires when the user lands back on the dashboard after completing payment, closing the full funnel." },
      { tag: "Improved", text: "All 13 upgrade CTAs now include ?source= attribution, revealing which feature drives the most upgrades." },
      { tag: "New",      text: "AI Compliance Chat widget added to the main dashboard home page (was CME page only)." },
      { tag: "New",      text: "Referral short URL â€” /r/[code] shows a personalised invitation page with referrer name and 30-day trial callout." },
      { tag: "New",      text: "Employer invitation landing page â€” /invite/[orgId] shows org branding and privacy reassurance before staff register." },
    ],
  },
  {
    version: "1.2",
    date: "June 2026",
    title: "University portal, training provider marketplace & GCC SEO",
    summary: "Full university admin portal, employer analytics, training provider course management, and 33 GCC SEO pages.",
    entries: [
      { tag: "New",      text: "University portal â€” faculty compliance overview, analytics, required training, and staff management for medical schools." },
      { tag: "New",      text: "Employer analytics â€” compliance rate %, average credits, license expiry breakdown, department comparison, and 6-month activity chart." },
      { tag: "New",      text: "Provider dashboard N+1 queries fixed â€” course stats now load with 2 parallel queries instead of N+1 per course." },
      { tag: "New",      text: "Complete GCC renewal guide set â€” QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait â€” all with FAQPage JSON-LD." },
      { tag: "New",      text: "For-providers and for-universities SEO landing pages added." },
      { tag: "Improved", text: "All 7 GCC country authority pages now cross-link to profession pages bidirectionally." },
      { tag: "New",      text: "Demo request form (/request-demo) â€” structured lead capture for employer prospects with admin email notification." },
    ],
  },
  {
    version: "1.1",
    date: "June 2026",
    title: "Pro trial system, AI compliance advisor, employer portal",
    summary: "14-day Pro trial on every signup, AI chat and gap analysis for Pro users, employer dashboard with staff compliance tracking.",
    entries: [
      { tag: "New",      text: "14-day Pro trial activates on onboarding completion. Referred users receive a 30-day trial automatically." },
      { tag: "New",      text: "AI Compliance Advisor â€” Pro tier chatbot (Claude Haiku) answers CME questions. Gap analysis uses Claude Sonnet." },
      { tag: "New",      text: "Employer portal â€” staff compliance grid, department grouping, bulk CSV import, weekly email digest, required training." },
      { tag: "New",      text: "Training provider marketplace â€” course listing, enrollment, CME auto-sync on completion." },
      { tag: "New",      text: "PDF compliance report (Pro) â€” A4 PDF with verified activities, pending section, and renewal status." },
      { tag: "New",      text: "Compliance badge â€” shareable OG image with LinkedIn and WhatsApp share buttons." },
      { tag: "New",      text: "NPS in-app survey â€” shown at 30 days and annually, with admin analytics page." },
      { tag: "New",      text: "Push notifications â€” license expiry, CME deadline alerts via web push." },
      { tag: "New",      text: "Multi-country compliance wallet â€” track CPD/CME across multiple GCC authorities simultaneously." },
      { tag: "New",      text: "Referral programme â€” share a link, earn a trial extension for every colleague who signs up." },
      { tag: "Security", text: "All AI routes (chat, recommendations, OCR) now require Pro subscription server-side. Previously only rate-limited." },
      { tag: "Security", text: "Employer registration gated by active employer subscription â€” no free employer dashboard access." },
      { tag: "Security", text: "Employer staff limit enforced per tier (Clinic 10 / Growth 25 / Department 50 / Hospital 200) in server action." },
    ],
  },
  {
    version: "1.0",
    date: "June 2026",
    title: "Platform launch â€” CME tracking for GCC healthcare professionals",
    summary: "Foundation release: CME activity tracking, 7-step onboarding, licensing readiness, Paddle payments, and full admin panel.",
    entries: [
      { tag: "New", text: "7-step onboarding â€” profession, specialty, license details, employer link, CME cycle setup, notifications, and trial activation." },
      { tag: "New", text: "CME activity log â€” add, edit, delete activities with AI-assisted categorisation and OCR certificate upload." },
      { tag: "New", text: "Compliance wallet â€” real-time credits progress, compliance status (Compliant / At Risk / Non-Compliant), cycle countdown." },
      { tag: "New", text: "License management â€” expiry tracking, renewal readiness checklist, inline edit, reminder scheduling." },
      { tag: "New", text: "Country rules engine â€” GCC compliance rules (QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait) stored in DB, never hardcoded." },
      { tag: "New", text: "Paddle payments â€” Pro monthly ($6) and annual ($61.20), 4 employer tiers (Clinic/Growth/Department/Hospital)." },
      { tag: "New", text: "Admin panel â€” CME moderation, professional profiles, organisation management, country rules, audit log, revenue dashboard." },
      { tag: "New", text: "Full email system â€” welcome, CME verified/rejected, trial start/ending/expired, license expiry, employer digest, weekly professional digest." },
      { tag: "New", text: "PWA support â€” installable, offline fallback, push notifications via VAPID web push." },
      { tag: "New", text: "33 GCC SEO pages â€” country authorities, profession guides, renewal guides, and CME/CPD tracker pages." },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="font-bold text-base text-[#111]">
              Hayya Med <span className="text-[#1a56a0]">Pro</span>
            </span>
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
          >
            Start free â†’
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12">
          <span className="inline-block text-xs font-semibold bg-[#eff6ff] text-[#1a56a0] px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Changelog
          </span>
          <h1 className="text-3xl font-bold text-[#111] mb-3">What&apos;s new in Hayya Med Pro</h1>
          <p className="text-base text-[#64748b] max-w-xl">
            Every feature, improvement, and fix shipped to the platform. Built for GCC healthcare professionals.
          </p>
        </div>

        {/* Releases */}
        <div className="space-y-10">
          {RELEASES.map((release, idx) => (
            <article key={release.version} className="relative">
              {/* Timeline connector */}
              {idx < RELEASES.length - 1 && (
                <div className="absolute left-[11px] top-10 bottom-[-2.5rem] w-px bg-[#e2e8f0]" />
              )}

              <div className="flex gap-5">
                {/* Timeline dot */}
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${idx === 0 ? "border-[#1a56a0] bg-[#1a56a0]" : "border-[#e2e8f0] bg-white"}`}>
                    {idx === 0 && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  {/* Version + date */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono font-semibold bg-[#f1f5f9] text-[#374151] px-2 py-0.5 rounded">
                      v{release.version}
                    </span>
                    <span className="text-xs text-[#94a3b8]">{release.date}</span>
                    {idx === 0 && (
                      <span className="text-xs font-semibold bg-[#1a56a0] text-white px-2 py-0.5 rounded-full">Latest</span>
                    )}
                  </div>

                  {/* Title + summary */}
                  <h2 className="text-lg font-bold text-[#111] mb-1">{release.title}</h2>
                  <p className="text-sm text-[#64748b] mb-4">{release.summary}</p>

                  {/* Entries */}
                  <ul className="space-y-2.5">
                    {release.entries.map((entry, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide mt-0.5 ${TAG_STYLES[entry.tag]}`}
                        >
                          {entry.tag}
                        </span>
                        <span className="text-sm text-[#374151] leading-relaxed">{entry.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Start tracking your CME compliance</h2>
          <p className="text-[rgba(255,255,255,0.7)] text-sm mb-6 max-w-sm mx-auto">
            Free to start Â· 14-day Pro trial Â· No credit card required
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-[#1a56a0] px-6 py-3 rounded-xl hover:bg-[#f0f4f8] transition-colors"
          >
            Create free account â†’
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-8 mt-8 border-t border-[#e2e8f0]">
        <div className="flex flex-wrap gap-4 text-xs text-[#94a3b8] justify-center">
          <Link href="/" className="hover:text-[#1a56a0]">Home</Link>
          <Link href="/pricing" className="hover:text-[#1a56a0]">Pricing</Link>
          <Link href="/help" className="hover:text-[#1a56a0]">Help</Link>
          <Link href="/terms" className="hover:text-[#1a56a0]">Terms</Link>
          <Link href="/privacy" className="hover:text-[#1a56a0]">Privacy</Link>
          <Link href="/contact" className="hover:text-[#1a56a0]">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
