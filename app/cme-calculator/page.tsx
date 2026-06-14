import type { Metadata } from "next";
import Link from "next/link";
import CmeCalculatorClient from "./CmeCalculatorClient";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "GCC CME & CPD Credit Calculator — Free | Hayya Med Pro",
  description:
    "Free CME and CPD credit calculator for GCC healthcare professionals. Instantly calculate how many CME credits you still need for QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB license renewal. No account required.",
  keywords: [
    "CME calculator GCC",
    "CPD credit calculator Qatar",
    "QCHP CPD calculator",
    "SCFHS CME calculator",
    "DHA CME credits calculator",
    "how many CME credits do I need",
    "CME requirement calculator",
    "GCC healthcare CME credits",
    "CME compliance calculator",
    "CPD hours calculator healthcare",
  ],
  openGraph: {
    title: "Free GCC CME & CPD Credit Calculator | Hayya Med Pro",
    description:
      "Instantly calculate your CME / CPD credit gap for QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB. Free, no account required.",
    url: `${APP_URL}/cme-calculator`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=GCC+CME+%26+CPD+Calculator&s=Calculate+your+credit+gap+for+QCHP%2C+SCFHS%2C+DHA+%26+more&a=%F0%9F%A7%AE+Free+Tool&k=CME+Calculator`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free GCC CME Calculator — QCHP, SCFHS, DHA & More",
    description: "Calculate your CME credit gap instantly. Free, no account required.",
  },
  alternates: { canonical: `${APP_URL}/cme-calculator` },
};

const toolJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GCC CME & CPD Credit Calculator",
  url: `${APP_URL}/cme-calculator`,
  description:
    "Free interactive calculator for GCC healthcare professionals to determine how many CME or CPD credits they still need for license renewal under QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB.",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: {
    "@type": "Organization",
    name: "Hayya Med",
    url: APP_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need for QCHP renewal in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP requires 80 CPD credits per 2-year cycle for all licensed healthcare professionals in Qatar, regardless of profession. A minimum of 40 credits must be completed in each year of the cycle.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits does SCFHS require in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS CME requirements vary by profession. Physicians, pharmacists, and dentists need 60 CME credits per year. Nurses and allied health professionals need 30 CME credits per year. The cycle is annual (1 year).",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits does DHA require in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA requires 40 CME credits per 2-year cycle for all healthcare professionals licensed in Dubai. Up to 20 credits can come from online or e-learning activities.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between CME and CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME (Continuing Medical Education) and CPD (Continuing Professional Development) refer to the same concept — ongoing learning required to maintain a healthcare licence. GCC authorities use both terms depending on country. Qatar (QCHP) and Bahrain (NHRA) use CPD; Saudi Arabia (SCFHS) and UAE (DHA) use CME.",
      },
    },
    {
      "@type": "Question",
      name: "How do I track my CME credits automatically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro is a free CME and CPD tracking platform for GCC healthcare professionals. Create a free account, set your country and profession, and log activities as you complete them. Your compliance percentage updates automatically. The Pro plan ($6/month) adds PDF report generation for QCHP/SCFHS submission.",
      },
    },
  ],
};

export default function CmeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center" aria-hidden="true">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline text-sm text-[#64748b] hover:text-[#111] transition-colors">Sign in</Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] hover:bg-[#1547a0] px-4 py-2 rounded-lg transition-colors">
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="min-h-screen bg-[#f8fafc]">
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] px-6 py-14 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              🧮 Free Tool — No Account Required
            </div>
            <h1 className="text-4xl font-extrabold text-[#111] leading-tight mb-4">
              GCC CME &amp; CPD Credit Calculator
            </h1>
            <p className="text-lg text-[#64748b] leading-relaxed">
              Instantly calculate how many CME or CPD credits you still need for QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB license renewal.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="px-4 sm:px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <CmeCalculatorClient />
            <p className="text-xs text-[#94a3b8] text-center mt-4">
              Hayya Med Pro supports CME/CPD tracking. It does not issue licenses and does not replace official licensing authorities — QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait. Always verify final requirements with your authority.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
