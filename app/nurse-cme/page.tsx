import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Nurse CME Requirements GCC 2025 — QCHP, SCFHS, DHA, DOH Guide",
  description:
    "CME and CPD requirements for nurses across the GCC. Qatar QCHP requires 80 CPD/2 years, Saudi SCFHS requires 30 CME/year, UAE DHA requires 40 CME/2 years. Track your nursing credits automatically.",
  keywords: [
    "nurse CME requirements GCC",
    "nursing CME Qatar",
    "QCHP nurse CPD requirements",
    "SCFHS nurse CME requirements",
    "DHA nurse CME",
    "nurse CME Saudi Arabia",
    "nursing CPD requirements",
    "nurse license renewal CME",
    "GCC nurse CME credits",
    "Qatar nurse CPD credits",
    "nursing continuing education requirements",
    "nurse CME tracker",
  ],
  openGraph: {
    title: "Nurse CME Requirements GCC 2025 — Complete Authority Guide",
    description:
      "CME requirements for nurses across Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman. QCHP: 80 CPD/2 years. SCFHS: 30 CME/year. DHA: 40 CME/2 years.",
    url: `${APP_URL}/nurse-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Nurse+CME+Requirements+GCC+2025&s=QCHP+80+CPD%2F2yr+%C2%B7+SCFHS+30+CME%2Fyr+%C2%B7+DHA+40+CME%2F2yr&a=%F0%9F%91%A9%E2%80%8D%E2%9A%95%EF%B8%8F+Nursing&k=Profession+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurse CME Requirements GCC 2025 — QCHP, SCFHS, DHA",
    description: "Track your nursing CME credits for QCHP, SCFHS, DHA and all GCC authorities automatically. Free.",
  },
  alternates: { canonical: `${APP_URL}/nurse-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do nurses need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qatar nurses licensed by QCHP (under the Department of Healthcare Professions / DHP-AS, Ministry of Public Health) require 80 CPD credits over a 2-year cycle, with a minimum of 30 credits in the first year. Requirements apply equally to registered nurses, specialist nurses, and advanced practice nurses.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits do nurses need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Saudi Arabia nurses licensed by SCFHS (Saudi Commission for Health Specialties) need 30 CME credits per year. This is lower than the physician requirement of 60 credits/year. All nurses must also complete at least 5 credits in patient safety annually.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits do nurses need in Dubai (DHA)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dubai nurses licensed by the Dubai Health Authority (DHA) need 40 CME credits over a 2-year cycle. Credits must be from DHA-accredited CME providers. DHA accepts a mix of live and online CME activities.",
      },
    },
    {
      "@type": "Question",
      name: "Can nurses use online courses to meet CME requirements in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all GCC licensing authorities accept some online CME for nurses. Qatar QCHP allows online learning within the 80 CPD cycle. Saudi SCFHS allows up to 50% of credits online. Dubai DHA accepts online CME from approved providers. The proportion and accepted providers differ by authority.",
      },
    },
    {
      "@type": "Question",
      name: "Do nurse CME requirements differ from physician requirements in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. In Saudi Arabia, nurses need 30 CME credits/year versus 60 for physicians. In Qatar, the QCHP requirement is the same for nurses and physicians (80 CPD/2 years). In the UAE (DHA), the requirement is 40 CME/2 years for most healthcare professionals including nurses.",
      },
    },
    {
      "@type": "Question",
      name: "Can I carry over nursing CME credits from one cycle to the next?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Carryover policies differ by authority. QCHP Qatar generally does not allow carry-forward of excess credits between 2-year cycles. SCFHS Saudi Arabia requires credits to be earned within the annual cycle. DHA Dubai allows limited carry-over in some cases. Check with your specific authority for current policy.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: APP_URL },
  { name: "CME Requirements", url: `${APP_URL}/cme-requirements` },
  { name: "Nurse CME Requirements", url: `${APP_URL}/nurse-cme` },
];

const AUTHORITIES = [
  {
    country: "Qatar 🇶🇦",
    authority: "QCHP / DHP-AS",
    credits: 80,
    cycle: "2 years",
    notes: "Min 30 credits in year 1",
    color: "bg-[#eff6ff] border-[#bfdbfe] text-[#1e40af]",
    href: "/qchp",
  },
  {
    country: "Saudi Arabia 🇸🇦",
    authority: "SCFHS",
    credits: 30,
    cycle: "Annual",
    notes: "5 patient safety credits mandatory",
    color: "bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]",
    href: "/scfhs",
  },
  {
    country: "UAE — Dubai 🇦🇪",
    authority: "DHA",
    credits: 40,
    cycle: "2 years",
    notes: "DHA-accredited providers only",
    color: "bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]",
    href: "/dha",
  },
  {
    country: "UAE — Abu Dhabi 🇦🇪",
    authority: "DOH",
    credits: 30,
    cycle: "Annual",
    notes: "CPD portfolio required",
    color: "bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]",
    href: "/doh",
  },
  {
    country: "Kuwait 🇰🇼",
    authority: "MOH Kuwait",
    credits: 30,
    cycle: "Annual",
    notes: "MOH-accredited activities",
    color: "bg-[#fff7ed] border-[#fed7aa] text-[#9a3412]",
    href: "/moh-kuwait",
  },
  {
    country: "Bahrain 🇧🇭",
    authority: "NHRA",
    credits: 40,
    cycle: "2 years",
    notes: "CPD framework applies",
    color: "bg-[#fdf4ff] border-[#e9d5ff] text-[#7e22ce]",
    href: "/nhra",
  },
  {
    country: "Oman 🇴🇲",
    authority: "OMSB",
    credits: 40,
    cycle: "2 years",
    notes: "Oman Medical Specialty Board",
    color: "bg-[#fff7ed] border-[#fed7aa] text-[#9a3412]",
    href: "/omsb",
  },
];

const TIPS = [
  {
    icon: "📋",
    title: "Start your portfolio on day one",
    desc: "Don't wait until renewal time. Log each activity immediately while the certificate and attendance record are fresh. A running log prevents the scramble at renewal.",
  },
  {
    icon: "🏥",
    title: "Claim in-hospital education",
    desc: "Grand rounds, case conferences, journal clubs, and mandatory training sessions often qualify. Check with your nursing education department — these are frequently missed credits.",
  },
  {
    icon: "🌐",
    title: "Use online CME strategically",
    desc: "All GCC authorities accept some online nursing CME. Use accredited platforms to fill gaps, especially for topics not available locally. Check the cap for your authority before relying heavily on e-learning.",
  },
  {
    icon: "📄",
    title: "Keep every certificate",
    desc: "Upload your CME certificates immediately. Most renewal portals require provider name, accreditation number, date, and credit value. Missing documentation is the most common renewal delay.",
  },
  {
    icon: "⚠️",
    title: "Check authority-specific mandatory topics",
    desc: "Saudi SCFHS requires patient safety credits for all nurses. Some authorities have infection control or patient rights requirements. A generic CME portfolio may fall short if mandatory topics are missing.",
  },
];

const RELATED = [
  { title: "CME Requirements Guide", href: "/cme-requirements", desc: "All GCC & global authorities" },
  { title: "QCHP Tracker", href: "/qchp", desc: "Qatar nurse CME tracker" },
  { title: "SCFHS Tracker", href: "/scfhs", desc: "Saudi nurse CME tracker" },
  { title: "DHA Tracker", href: "/dha", desc: "Dubai nurse CME tracker" },
  { title: "GCC CME Comparison", href: "/gcc-cme-requirements", desc: "Compare all 6 countries" },
  { title: "Physician CME", href: "/physician-cme", desc: "Doctor CME requirements" },
];

export default function NurseCmePage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <MedicalWebPageJsonLd
        name="Nurse CME Requirements GCC"
        url="https://hayyamed.pro/nurse-cme"
        description="Track your nursing CME credits for QCHP, SCFHS, DHA and all GCC authorities automatically. Free for healthcare professionals."
        keywords={["nurse CME requirements GCC", "QCHP nursing CPD", "SCFHS nurse CME", "DHA nursing CME", "GCC nurse license renewal CME"]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
              Start free →
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#fdf4ff] border border-[#e9d5ff] text-[#7e22ce] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              👩‍⚕️ Nursing · All GCC Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Nurse CME Requirements<br className="hidden sm:block" /> GCC — 2025 Guide
            </h1>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto mb-8">
              CME and CPD requirements for nurses across Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman — with authority-by-authority credit breakdown and renewal tips.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-[#154890] transition-colors"
            >
              Track your nursing CME free →
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 mb-10 text-xs text-[#92400e] leading-relaxed">
            <strong>Note:</strong> CME requirements are sourced from official GCC licensing authorities. Requirements change — always verify current rules with your specific authority before submitting your renewal.
          </div>

          {/* Authority comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">Nurse CME requirements by GCC country</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Every GCC country has a different credit requirement and cycle for nurses. If you work in multiple GCC countries or are considering a move, understanding these differences is essential.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {AUTHORITIES.map((a) => (
                <Link
                  key={a.authority}
                  href={a.href}
                  className={`group block bg-white border-2 rounded-2xl px-5 py-4 hover:shadow-md transition-all ${a.color}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-[#111] text-sm">{a.country}</p>
                      <p className="text-xs text-[#64748b]">{a.authority}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1a56a0]">{a.credits}</p>
                      <p className="text-[10px] text-[#64748b]">credits / {a.cycle}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#64748b]">{a.notes}</p>
                  <p className="text-[11px] font-semibold text-[#1a56a0] mt-2 group-hover:underline">
                    View {a.authority} details →
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Nurse vs physician comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-4">Do nurses have the same CME requirements as doctors?</h2>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
              <div className="prose prose-sm max-w-none text-[#374151] space-y-3">
                <p>
                  In most GCC countries, <strong>nurse CME requirements differ from physician requirements</strong>. The most significant difference is in Saudi Arabia, where SCFHS requires 60 CME credits per year for physicians but only 30 for nurses.
                </p>
                <p>
                  In Qatar, QCHP applies the same 80 CPD credits per 2-year cycle to both physicians and nurses under the unified DHP-AS framework. This reflects the Qatar healthcare system&apos;s emphasis on parity across professions.
                </p>
                <p>
                  In the UAE, DHA requirements (40 CME/2 years) generally apply across clinical professions, though specialist nurses or advanced practice nurses may face additional requirements depending on their scope of practice.
                </p>
                <p>
                  The key takeaway: <strong>always check the requirements for your specific profession and authority</strong> — don&apos;t assume nursing requirements match what colleagues in other professions are completing.
                </p>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-6">Tips for meeting nursing CME requirements</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TIPS.map((t) => (
                <div key={t.title} className="bg-white border border-[#e2e8f0] rounded-xl p-4">
                  <p className="text-2xl mb-2">{t.icon}</p>
                  <p className="font-semibold text-[#111] text-sm mb-1.5">{t.title}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tracker CTA */}
          <section className="mb-12 bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center">
            <div className="inline-flex items-center gap-2 bg-[#1a56a0]/30 text-[#93c5fd] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              👩‍⚕️ Built for GCC nurses · All 7 authorities supported
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Track your nursing CME — automatically
            </h2>
            <p className="text-[#94a3b8] mb-6 text-sm max-w-md mx-auto leading-relaxed">
              Select your country and authority, log CME activities, and watch your compliance ring fill. Hayya Med Pro applies the correct nurse-specific credit rules — whether you&apos;re tracking QCHP, SCFHS, or DHA.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors"
            >
              Start tracking free →
            </Link>
            <p className="text-[#475569] text-xs mt-3">Free forever · No credit card · 14-day Pro trial</p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-6">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4">
                  <p className="font-semibold text-[#111] text-sm mb-1.5">{q.name}</p>
                  <p className="text-xs text-[#475569] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related guides */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#111] mb-4">Related CME guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {RELATED.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 hover:border-[#1a56a0]/40 hover:bg-[#f0f7ff] transition-all"
                >
                  <p className="text-xs font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{r.title}</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{r.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Back */}
          <div className="pt-6 border-t border-[#e2e8f0]">
            <Link href="/cme-requirements" className="text-sm text-[#1a56a0] hover:underline">
              ← Back to CME Requirements Guide
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
