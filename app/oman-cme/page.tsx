import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Oman CME Requirements 2025 â€” OMSB CME Credits & Renewal Guide",
  description:
    "Complete guide to CME requirements in Oman. OMSB requires 40 CME credits per 2-year cycle for physicians and 30 for nurses and AHPs. Track Category A and B CME automatically with Hayya Med Pro.",
  keywords: [
    "Oman CME requirements",
    "OMSB CME requirements",
    "Oman CME credits",
    "OMSB CME 2025",
    "Oman physician CME",
    "Oman nurse CME",
    "Oman medical license renewal",
    "OMSB Category A B CME",
    "Oman healthcare CME",
    "Oman Medical Specialty Board CME",
    "CME requirements Muscat",
    "OMSB 40 CME credits",
  ],
  openGraph: {
    title: "Oman CME Requirements 2025 â€” OMSB Guide | Hayya Med Pro",
    description:
      "OMSB Oman requires 40 CME credits per 2-year cycle for physicians and 30 for nurses and AHPs. Category A (accredited) and Category B (self-directed) framework with 20-credit online cap.",
    url: `${APP_URL}/oman-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Oman+CME+Requirements+2025&s=40+CME%2F2yr+%28physicians%29+%C2%B7+30%2F2yr+%28nurses%29+%C2%B7+OMSB&a=%F0%9F%87%B4%F0%9F%87%B2+Oman&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oman CME Requirements 2025 â€” OMSB",
    description:
      "OMSB requires 40 CME/2yr for physicians, 30/2yr for nurses. Category A and B framework â€” max 20 online credits per cycle.",
  },
  alternates: { canonical: `${APP_URL}/oman-cme` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need in Oman per 2-year cycle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Oman Medical Specialty Board (OMSB) requires physicians to complete 40 CME credits per 2-year renewal cycle. Nurses and Allied Health Professionals (AHPs) require 30 CME credits per 2-year cycle. Requirements differ by profession, so Hayya Med Pro automatically applies the correct rule based on your registered profession.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Category A and Category B CME in Oman?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB divides CME into Category A (structured, externally accredited activities such as conferences, workshops, and accredited online courses) and Category B (self-directed learning including journal reading, case discussions, teaching, research, and postgraduate study). Category A activities carry the most weight; Category B activities are limited in how many can be credited per cycle.",
      },
    },
    {
      "@type": "Question",
      name: "What is the online CME limit for OMSB Oman?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB allows a maximum of 20 online CME credits per 2-year cycle. Online activities count within Category A and must come from accredited providers recognized by OMSB or equivalent international bodies. Hayya Med Pro tracks your online credit total and notifies you when you approach the 20-credit cap.",
      },
    },
    {
      "@type": "Question",
      name: "Does OMSB accept international CME conferences?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. OMSB Oman accepts CME credits from accredited international conferences and events, including activities accredited by AMA (PRA Category 1), Royal Colleges, ACGME, and other GCC authorities. International activities should be documented with proof of accreditation and attendance certificate for inclusion in your CME portfolio.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CME portfolio to OMSB Oman?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME portfolios are submitted through the OMSB online portal (omsb.org) before your 2-year license renewal date. Hayya Med Pro generates a complete CME activity log organized by Category A and Category B â€” including activity name, provider, date, credits, and accreditation â€” ready for OMSB portal submission.",
      },
    },
    {
      "@type": "Question",
      name: "Do teaching and research activities count toward OMSB CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Teaching activities (lecturing, supervising, facilitating) and research activities (publications, presentations) are accepted by OMSB under Category B CME. These count toward the 30 or 40 credit total but are subject to Category B limits. Activities must be documented with supporting evidence (teaching timetables, publication receipts, etc.).",
      },
    },
  ],
};

const PROFESSIONS = [
  { title: "Physicians", credits: "40 CME", cycle: "2 years", onlineCap: "20 credits", highlight: true },
  { title: "Dentists", credits: "40 CME", cycle: "2 years", onlineCap: "20 credits", highlight: false },
  { title: "Nurses", credits: "30 CME", cycle: "2 years", onlineCap: "20 credits", highlight: false },
  { title: "Allied Health (AHP)", credits: "30 CME", cycle: "2 years", onlineCap: "20 credits", highlight: false },
];

const CATEGORIES = [
  {
    letter: "A",
    name: "Accredited In-Person",
    color: "#1a56a0",
    limit: "No upper cap",
    highlight: false,
    desc: "Accredited conferences, symposia, workshops, and hands-on training courses approved by OMSB or recognized international bodies",
  },
  {
    letter: "A",
    name: "Accredited Online",
    color: "#7c3aed",
    limit: "Max 20 per 2-year cycle",
    highlight: true,
    desc: "Accredited e-learning and online CME from OMSB-recognized providers â€” counts as Category A but online credits are capped at 20 per cycle",
  },
  {
    letter: "B",
    name: "Self-Directed Learning",
    color: "#d97706",
    limit: "Subject to OMSB limits",
    highlight: false,
    desc: "Journal reading, case discussions, independent study, and non-accredited educational activities â€” must be documented",
  },
  {
    letter: "B",
    name: "Teaching & Research",
    color: "#16a34a",
    limit: "Subject to OMSB limits",
    highlight: false,
    desc: "Lecturing, supervising trainees, research publications, and conference presentations â€” accepted with supporting documentation",
  },
];

const CHECKLIST = [
  { step: "1", title: "Confirm your 2-year renewal date", desc: "Your OMSB CME cycle runs for 2 years from your license registration or last renewal date. Log in to the OMSB portal at omsb.org to verify your next renewal deadline." },
  { step: "2", title: "Know your profession-specific requirement", desc: "Physicians and dentists need 40 CME per 2-year cycle. Nurses and AHPs need 30. Hayya Med Pro applies the correct rule automatically based on your registered profession." },
  { step: "3", title: "Prioritize Category A accredited activities", desc: "Category A (conferences, workshops, accredited online) carries the most value and has no upper cap for in-person activities. Build your CME plan around 2â€“3 major accredited events each year." },
  { step: "4", title: "Track your online credit total", desc: "Online CME is capped at 20 credits per 2-year cycle â€” even though it falls under Category A. If you rely on online learning, monitor this limit carefully to avoid credits that won't count toward renewal." },
  { step: "5", title: "Document all Category B activities", desc: "Self-directed learning and teaching activities need documentation. Keep reading logs, teaching timetables, and publication receipts. OMSB may request evidence during renewal verification." },
  { step: "6", title: "Generate and submit your CME portfolio", desc: "Before your renewal date, generate a CME portfolio report from Hayya Med Pro organized by Category A and B â€” and upload it to the OMSB online portal." },
];

const RELATED = [
  { title: "OMSB Authority Guide", desc: "Full OMSB CME tracker for Oman", href: "/omsb" },
  { title: "Oman License Renewal", desc: "Step-by-step OMSB renewal process", href: "/omsb-renewal" },
  { title: "GCC CME Comparison", desc: "All 7 GCC authorities compared", href: "/gcc-cme-requirements" },
  { title: "Qatar CPD Guide", desc: "80 CPD / 2-year QCHP cycle", href: "/qatar-cme" },
  { title: "Bahrain CPD Guide", desc: "NHRA 40 CPD / 2-year cycle", href: "/bahrain-cme" },
  { title: "Kuwait CME Guide", desc: "MOH Kuwait 30 CME/year", href: "/kuwait-cme" },
];

export default function OmanCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "GCC CME Requirements", url: "/gcc-cme-requirements" },
          { name: "Oman CME Requirements", url: "/oman-cme" },
        ]}
      />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#15803d] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span>ðŸ‡´ðŸ‡²</span>
              <span>OMSB Oman Â· 2-Year Renewal Cycle</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight mb-4">
              Oman CME Requirements 2025
            </h1>
            <p className="text-lg text-[#64748b] mb-8 max-w-2xl mx-auto">
              The Oman Medical Specialty Board (OMSB) requires{" "}
              <strong className="text-[#111]">40 CME credits per 2-year cycle</strong> for physicians and dentists,
              and <strong className="text-[#111]">30 CME credits</strong> for nurses and allied health professionals.
              Online CME is capped at <strong className="text-[#111]">20 credits</strong> per cycle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#1547a0] transition-colors"
              >
                Track my Oman CME â€” free â†’
              </Link>
              <Link
                href="/cme-calculator"
                className="inline-flex items-center justify-center gap-2 bg-white border border-[#e2e8f0] text-[#374151] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#f8fafc] transition-colors"
              >
                Calculate my credit gap
              </Link>
            </div>
            <p className="text-xs text-[#64748b] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>
        </section>

        {/* Quick stats */}
        <section className="py-10 px-4 border-b border-[#e2e8f0] bg-white">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Physicians / Dentists", value: "40 CME", color: "#1a56a0" },
              { label: "Nurses / AHP", value: "30 CME", color: "#7c3aed" },
              { label: "Online cap (Cat A)", value: "20 credits", color: "#d97706" },
              { label: "Renewal cycle", value: "2 years", color: "#16a34a" },
            ].map((s) => (
              <div key={s.label} className="text-center bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                <p className="text-2xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#64748b]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Profession table */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">CME requirements by profession</h2>
            <p className="text-sm text-[#64748b] mb-8">
              OMSB Oman has two credit tiers based on profession. Physicians and dentists face the higher 40-credit threshold;
              nurses and allied health professionals need 30 over the same 2-year cycle.
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    {["Profession", "Credits / 2-year cycle", "Renewal cycle", "Online cap (Cat A)"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROFESSIONS.map((p, i) => (
                    <tr key={p.title} className={`${i < PROFESSIONS.length - 1 ? "border-b border-[#f1f5f9]" : ""} ${p.highlight ? "bg-[#eff6ff]" : ""}`}>
                      <td className="px-4 py-3 font-semibold text-[#111]">{p.title}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#dbeafe] text-[#1d4ed8] text-xs font-bold px-2.5 py-1 rounded-full">{p.credits}</span>
                      </td>
                      <td className="px-4 py-3 text-[#374151]">{p.cycle}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#fef3c7] text-[#92400e] text-xs font-semibold px-2 py-0.5 rounded">{p.onlineCap}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#64748b] mt-3">Source: OMSB (Oman Medical Specialty Board). Verify with OMSB before renewal.</p>
          </div>
        </section>

        {/* Category A/B */}
        <section className="py-14 px-4 bg-white border-y border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">Category A and Category B CME in Oman</h2>
            <p className="text-sm text-[#64748b] mb-8">
              OMSB uses a two-category framework. Category A covers externally accredited activities;
              Category B covers self-directed and teaching activities. Most of your CME should come from Category A.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((cat, i) => (
                <div key={`${cat.letter}-${i}`} className={`rounded-xl p-5 border ${cat.highlight ? "border-[#fca5a5] bg-[#fef2f2]" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: cat.color }}>
                      {cat.letter}
                    </span>
                    <div>
                      <p className="font-semibold text-[#111] text-sm">{cat.name}</p>
                      <p className={`text-xs font-semibold ${cat.highlight ? "text-[#dc2626]" : cat.limit.startsWith("No") ? "text-[#16a34a]" : "text-[#64748b]"}`}>
                        {cat.limit}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3">
              <p className="text-sm text-[#1e40af]">
                <strong>Strategy:</strong> Aim for at least 21 Category A credits (in-person) per 2-year cycle if you&apos;re
                a physician. This gives you room to use all 20 online credits and still exceed the 40-credit requirement without
                depending on Category B self-directed activities.
              </p>
            </div>
          </div>
        </section>

        {/* Context */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-6">Oman&apos;s CME landscape</h2>
            <div className="prose prose-sm max-w-none text-[#374151] space-y-4">
              <p>
                The <strong>Oman Medical Specialty Board (OMSB)</strong> is the primary authority overseeing postgraduate
                medical education and professional development for healthcare professionals in Oman. Unlike Qatar&apos;s QCHP
                or Bahrain&apos;s NHRA, OMSB was originally established to manage specialty training â€” CME for licensed
                professionals is part of its broader mandate.
              </p>
              <p>
                Oman&apos;s healthcare workforce is concentrated in Muscat but serves a wide geography. Many Oman-based
                healthcare professionals attend regional GCC conferences in Dubai, Riyadh, or Doha to earn CME credits.
                These international activities are accepted by OMSB provided they carry recognized accreditation.
              </p>
              <p>
                The 20-credit online cap reflects OMSB&apos;s emphasis on in-person learning and clinical engagement.
                With the growing number of high-quality online CME platforms, professionals need to track their online
                credits carefully to avoid exceeding the cap â€” a common issue flagged at renewal time.
              </p>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="py-14 px-4 bg-white border-y border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">Oman OMSB CME renewal checklist</h2>
            <p className="text-sm text-[#64748b] mb-8">
              Follow these steps before your 2-year OMSB license renewal to avoid credit gaps or documentation issues.
            </p>
            <div className="space-y-4">
              {CHECKLIST.map((item) => (
                <div key={item.step} className="flex gap-4 bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111] text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-8">Oman CME â€” frequently asked questions</h2>
            <div className="space-y-5">
              {faqJsonLd.mainEntity.map((faq) => (
                <div key={faq.name} className="border border-[#e2e8f0] bg-white rounded-xl p-5">
                  <h3 className="font-semibold text-[#111] text-sm mb-2">{faq.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-4 bg-[#0f1f3d]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Track your Oman OMSB CME automatically
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm leading-relaxed">
              Hayya Med Pro applies the correct credit target for your profession (40 or 30),
              tracks Category A and B totals, enforces the 20-credit online cap, and generates
              your OMSB-ready CME portfolio report.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#f0f4f8] transition-colors"
            >
              Start free â€” no credit card â†’
            </Link>
            <p className="text-[#64748b] text-xs mt-4">14-day Pro trial Â· Category A / B tracked automatically</p>
          </div>
        </section>

        {/* Related */}
        <section className="py-14 px-4 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-[#111] mb-6">Related CME guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {RELATED.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-[#1a56a0] text-sm mb-1">{r.title}</p>
                  <p className="text-xs text-[#64748b]">{r.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

