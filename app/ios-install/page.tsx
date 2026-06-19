import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Install Hayya Med Pro on iPhone — iOS Safari Install Guide",
  description:
    "Add Hayya Med Pro to your iPhone home screen in 3 steps. Works on Safari iOS 16.4+ — no App Store required. Track CME and CPD from your iPhone like a native app.",
  keywords: [
    "install Hayya Med Pro iPhone",
    "add to home screen iOS safari",
    "PWA install iPhone",
    "Hayya Med Pro iOS",
    "CME tracker iPhone app",
    "install medical app iPhone Safari",
  ],
  openGraph: {
    title: "Install Hayya Med Pro on iPhone",
    description: "Add Hayya Med Pro to your iPhone home screen in 3 steps — no App Store required.",
    url: `${BASE}/ios-install`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=Install+on+iPhone`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Install Hayya Med Pro on iPhone",
    description: "Add to home screen in 3 steps — Safari iOS 16.4+.",
  },
  alternates: { canonical: `${BASE}/ios-install` },
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Install on iPhone", url: `${BASE}/ios-install` },
];

const STEPS = [
  {
    n: 1,
    title: "Open in Safari",
    detail: "Make sure you're using Safari — the default iPhone browser. Chrome and Firefox cannot add to home screen on iOS.",
    tip: "The URL should be hayyamed.pro",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="#1a56a0" strokeWidth="2" />
        <path d="M24 8l2 10-10-2 8-8z M24 40l-2-10 10 2-8 8z" fill="#1a56a0" />
        <circle cx="24" cy="24" r="3" fill="#1a56a0" />
      </svg>
    ),
  },
  {
    n: 2,
    title: "Tap the Share button",
    detail: "At the bottom of the Safari browser, tap the Share icon — it looks like a box with an arrow pointing upward (↑).",
    tip: "On iPad, the Share button is in the top-right corner of Safari",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="4" y="18" width="40" height="26" rx="4" stroke="#1a56a0" strokeWidth="2" />
        <path d="M24 4v24M16 12l8-8 8 8" stroke="#1a56a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: 3,
    title: 'Tap "Add to Home Screen"',
    detail: 'Scroll down the share menu and tap "Add to Home Screen". Tap "Add" in the top-right corner to confirm. Hayya Med Pro will appear on your home screen like any app.',
    tip: "You can rename the app before adding it",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <rect x="8" y="8" width="32" height="32" rx="8" stroke="#1a56a0" strokeWidth="2" />
        <path d="M24 18v12M18 24h12" stroke="#1a56a0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const FAQ = [
  {
    q: "Which version of iOS do I need?",
    a: "iOS 16.4 or later is required for full PWA support including push notifications. Most features work on iOS 14+. To update: Settings → General → Software Update.",
  },
  {
    q: "Why can't I use Chrome or Firefox to install on iPhone?",
    a: "Apple restricts PWA installation to Safari only on iOS. All other browsers on iPhone use the same WebKit engine and cannot add to home screen directly.",
  },
  {
    q: "Will I get push notifications after installing?",
    a: "Yes — once you've added Hayya Med Pro to your home screen on iOS 16.4+, you can enable push notifications for CME deadline reminders and compliance alerts. You'll be prompted the first time you open the app from your home screen.",
  },
  {
    q: "Does the home screen app work offline?",
    a: "Yes. Hayya Med Pro caches your CME data locally. You can log activities offline and they will sync automatically when you're back online.",
  },
  {
    q: "Is there a native App Store app?",
    a: "The PWA version is the recommended way to use Hayya Med Pro on iPhone — it installs directly from Safari with no App Store required and is always up to date. A native App Store version is planned for a future release.",
  },
];

export default function IosInstallPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to install Hayya Med Pro on iPhone (Safari)",
            description: "Add Hayya Med Pro to your iPhone home screen in 3 steps using Safari.",
            totalTime: "PT1M",
            step: STEPS.map((s) => ({
              "@type": "HowToStep",
              position: s.n,
              name: s.title,
              text: s.detail,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/android-install" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">Android</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Start free</Link>
          </div>
        </nav>

        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-6 py-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl" aria-hidden="true">🍎</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">iOS · Safari</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
              Install Hayya Med Pro on your iPhone
            </h1>
            <p className="text-lg text-[#64748b] leading-relaxed mb-6 max-w-2xl">
              Add Hayya Med Pro to your home screen in 3 steps — no App Store required.
              Works on Safari iOS 16.4+. Offline CME tracking, push notifications, fast as a native app.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 bg-[#f0f7ff] text-[#1a56a0] px-3 py-1.5 rounded-full font-medium">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                No App Store required
              </span>
              <span className="flex items-center gap-1.5 bg-[#f0fdf4] text-[#16a34a] px-3 py-1.5 rounded-full font-medium">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                Always up to date
              </span>
              <span className="flex items-center gap-1.5 bg-[#fff7ed] text-[#d97706] px-3 py-1.5 rounded-full font-medium">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                Requires iOS 16.4+
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-3xl mx-auto px-6 py-12 space-y-12">

          {/* Steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">3 steps to install</h2>
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div key={step.n} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#f0f7ff] flex items-center justify-center mb-3">
                      <span className="text-lg font-black text-[#1a56a0]">{step.n}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#0f1f3d] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed mb-3">{step.detail}</p>
                    <p className="text-xs text-[#94a3b8] bg-[#f8fafc] rounded-lg px-3 py-2 border border-[#e2e8f0]">
                      💡 {step.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* After install */}
          <section aria-labelledby="after-heading">
            <h2 id="after-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">After installing</h2>
            <div className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-6">
              <ul className="space-y-3 text-sm text-[#1a56a0]">
                {[
                  "Open the app from your home screen icon",
                  "Sign in with your existing account or create a free account",
                  "Allow push notifications when prompted to receive renewal reminders",
                  "Log a CME activity and watch your compliance ring update in real time",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{f.q}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Android link */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-[#0f1f3d] mb-1">Using Android instead?</p>
              <p className="text-sm text-[#64748b]">See the Android install guide — Chrome makes it even easier.</p>
            </div>
            <Link
              href="/android-install"
              className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-[#f0f7ff] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#dbeafe] transition-colors"
            >
              Android install guide →
            </Link>
          </div>

          {/* CTA */}
          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Track your CME from anywhere</h2>
            <p className="text-white/75 mb-6 text-sm max-w-md mx-auto">
              Install Hayya Med Pro on your iPhone and log CME activities on the go —
              even offline. Free account, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Create free account
              </Link>
              <Link href="/login" className="inline-block border border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
                Sign in
              </Link>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
