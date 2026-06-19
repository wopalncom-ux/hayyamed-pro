import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Install Hayya Med Pro on Android — Chrome Install Guide",
  description:
    "Add Hayya Med Pro to your Android home screen in 3 steps using Chrome. Track CME and CPD from your Android phone like a native app — no Google Play required.",
  keywords: [
    "install Hayya Med Pro Android",
    "add to home screen Android Chrome",
    "PWA install Android",
    "Hayya Med Pro Android",
    "CME tracker Android app",
    "install medical app Android Chrome",
  ],
  openGraph: {
    title: "Install Hayya Med Pro on Android",
    description: "Add Hayya Med Pro to your Android home screen in 3 steps — no Google Play required.",
    url: `${BASE}/android-install`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=Install+on+Android`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Install Hayya Med Pro on Android",
    description: "Add to home screen in 3 steps — Chrome for Android.",
  },
  alternates: { canonical: `${BASE}/android-install` },
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Install on Android", url: `${BASE}/android-install` },
];

const STEPS = [
  {
    n: 1,
    title: "Open in Chrome",
    detail: "Navigate to hayyamed.pro in Google Chrome on your Android phone. Chrome is the recommended browser for installing Android PWAs.",
    tip: "Samsung Internet browser also supports Add to Home Screen on Android",
  },
  {
    n: 2,
    title: "Tap the three-dot menu",
    detail: "In the top-right corner of Chrome, tap the three vertical dots (⋮) to open the Chrome menu. On some devices you may see an install banner appear automatically at the bottom of the screen.",
    tip: "If you see an 'Install Hayya Med Pro' banner at the bottom, just tap it",
  },
  {
    n: 3,
    title: 'Tap "Add to Home screen"',
    detail: 'In the Chrome menu, tap "Add to Home screen". Confirm by tapping "Add" in the dialog. Hayya Med Pro will appear on your Android home screen and app drawer like any installed app.',
    tip: "You can move the icon to any home screen or folder after installing",
  },
];

const FAQ = [
  {
    q: "Do I need to install from the Google Play Store?",
    a: "No — Hayya Med Pro installs directly from Chrome without Google Play. This means no Play Store review delays and you always get the latest version immediately.",
  },
  {
    q: "Which Android version do I need?",
    a: "Android 8.0 (Oreo) or later is recommended. Full push notification support requires Android 8.0+. Most Android phones running Chrome 80+ support PWA installation.",
  },
  {
    q: "Will I receive push notifications?",
    a: "Yes — after installing, Hayya Med Pro can send push notifications for CME deadline reminders, compliance alerts, and activity confirmations. You'll be prompted to allow notifications the first time you open the app.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Hayya Med Pro uses a service worker to cache your CME data. You can log activities offline and they sync automatically when you reconnect to the internet.",
  },
  {
    q: "Can I use Firefox or Samsung Internet instead of Chrome?",
    a: "Samsung Internet supports PWA installation on Android. Firefox on Android also supports Add to Home Screen. Chrome provides the best compatibility and is recommended.",
  },
];

export default function AndroidInstallPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to install Hayya Med Pro on Android (Chrome)",
            description: "Add Hayya Med Pro to your Android home screen in 3 steps using Chrome.",
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
            <Link href="/ios-install" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">iPhone</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Start free</Link>
          </div>
        </nav>

        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-6 py-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl" aria-hidden="true">🤖</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Android · Chrome</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
              Install Hayya Med Pro on Android
            </h1>
            <p className="text-lg text-[#64748b] leading-relaxed mb-6 max-w-2xl">
              Add Hayya Med Pro to your Android home screen in 3 steps — no Google Play required.
              Offline CME tracking, push notifications, fast as a native app.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 bg-[#f0f7ff] text-[#1a56a0] px-3 py-1.5 rounded-full font-medium">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                No Google Play required
              </span>
              <span className="flex items-center gap-1.5 bg-[#f0fdf4] text-[#16a34a] px-3 py-1.5 rounded-full font-medium">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                Always up to date
              </span>
              <span className="flex items-center gap-1.5 bg-[#f0fdf4] text-[#16a34a] px-3 py-1.5 rounded-full font-medium">
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg>
                Android 8.0+ recommended
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-3xl mx-auto px-6 py-12 space-y-12">

          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">3 steps to install</h2>
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div key={step.n} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#f0f7ff] flex items-center justify-center">
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

          <section aria-labelledby="after-heading">
            <h2 id="after-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">After installing</h2>
            <div className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-6">
              <ul className="space-y-3 text-sm text-[#1a56a0]">
                {[
                  "Open the app from your home screen or app drawer",
                  "Sign in with your existing account or create a free account",
                  "Allow push notifications when prompted for renewal reminders",
                  "Log your first CME activity — your compliance ring updates instantly",
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

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-[#0f1f3d] mb-1">Using iPhone instead?</p>
              <p className="text-sm text-[#64748b]">See the iPhone Safari install guide — 3 quick steps.</p>
            </div>
            <Link
              href="/ios-install"
              className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-[#f0f7ff] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#dbeafe] transition-colors"
            >
              iPhone install guide →
            </Link>
          </div>

          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Track your CME from anywhere</h2>
            <p className="text-white/75 mb-6 text-sm max-w-md mx-auto">
              Install Hayya Med Pro on Android and log CME activities on the go —
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
