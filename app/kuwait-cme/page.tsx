import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Kuwait CME Requirements 2025 â€” MOH Kuwait CME Credits & Renewal Guide",
  description:
    "Complete guide to CME requirements in Kuwait. MOH Kuwait requires 30 CME credits per year for physicians and pharmacists, 20 per year for nurses. Track your Kuwait MOH compliance automatically with Hayya Med Pro.",
  keywords: [
    "Kuwait CME requirements",
    "MOH Kuwait CME requirements",
    "Kuwait CME credits",
    "Kuwait doctor CME",
    "Kuwait physician CME",
    "Kuwait nurse CME",
    "Ministry of Health Kuwait CME",
    "Kuwait medical license renewal",
    "Kuwait healthcare CME",
    "Kuwait CME 30 credits",
    "Kuwait CME annual",
    "Kuwait healthcare professional CME",
  ],
  openGraph: {
    title: "Kuwait CME Requirements 2025 â€” MOH Kuwait Guide | Hayya Med Pro",
    description:
      "Kuwait MOH requires 30 CME credits/year for physicians and pharmacists, 20/year for nurses. Strict 30% online cap. Complete country guide with profession breakdown and renewal checklist.",
    url: `${APP_URL}/kuwait-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Kuwait+CME+Requirements+2025&s=30+CME%2Fyear+%28physicians%29+%C2%B7+20%2Fyear+%28nurses%29+%C2%B7+MOH+Kuwait&a=%F0%9F%87%B0%F0%9F%87%BC+Kuwait&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuwait CME Requirements 2025 â€” MOH Kuwait",
    description:
      "30 CME credits/year for Kuwait physicians. 20/year for nurses. Strictest online cap in GCC at 30%. Full guide with renewal checklist.",
  },
  alternates: { canonical: `${APP_URL}/kuwait-cme` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need in Kuwait per year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kuwait Ministry of Health (MOH) requires 30 CME credits per year for physicians and pharmacists, and 20 CME credits per year for nurses and allied health professionals. The cycle resets annually based on your license registration date.",
      },
    },
    {
      "@type": "Question",
      name: "What is Kuwait's online CME limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kuwait has the strictest online CME cap in the GCC â€” a maximum of 30% of total annual credits can come from online activities. For physicians this means a maximum of 9 online credits per year out of 30 total. The remaining 70% must come from in-person conferences, workshops, or seminars.",
      },
    },
    {
      "@type": "Question",
      name: "Do all healthcare professions in Kuwait have the same CME requirement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. MOH Kuwait has two tiers: physicians and pharmacists require 30 CME credits per year; nurses and allied health professionals require 20 CME credits per year. The annual cycle applies to all professions equally.",
      },
    },
    {
      "@type": "Question",
      name: "What types of CME activities does Kuwait MOH accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kuwait MOH accepts: accredited conferences and seminars, workshops and practical training sessions, accredited online activities (capped at 30% of annual total), and self-directed learning such as journal reading and case studies (subject to caps). All activities must be from MOH-accredited providers or internationally recognized CME bodies.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CME record to Kuwait MOH?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME records are submitted through the Kuwait MOH health professional portal before your annual license renewal date. Hayya Med Pro maintains your complete CME log and generates a summary report â€” with activity names, dates, credits, and providers â€” ready to attach to your renewal application.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use international CME activities for Kuwait MOH renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. International CME activities from recognized bodies such as AMA (PRA Category 1), ACGME, Royal Colleges (UK/Canada), and similar bodies are generally accepted by Kuwait MOH with appropriate documentation. Check with MOH Kuwait for the current list of recognized international accreditors.",
      },
    },
  ],
};

const PROFESSIONS = [
  { title: "Physicians", credits: "30 CME", cycle: "Annual", onlineCap: "9 credits (30%)", highlight: true },
  { title: "Pharmacists", credits: "30 CME", cycle: "Annual", onlineCap: "9 credits (30%)", highlight: false },
  { title: "Nurses", credits: "20 CME", cycle: "Annual", onlineCap: "6 credits (30%)", highlight: false },
  { title: "Allied Health", credits: "20 CME", cycle: "Annual", onlineCap: "6 credits (30%)", highlight: false },
];

const CATEGORIES = [
  {
    letter: "A",
    name: "Conferences & Seminars",
    color: "#1a56a0",
    bg: "#dbeafe",
    limit: "Unlimited (accredited)",
    desc: "Accredited medical conferences, symposia, and professional seminars approved by MOH Kuwait or recognized bodies",
  },
  {
    letter: "B",
    name: "Workshops & Training",
    color: "#7c3aed",
    bg: "#ede9fe",
    limit: "Unlimited (accredited)",
    desc: "Practical skills workshops, hands-on training sessions, and clinical courses accredited by MOH Kuwait",
  },
  {
    letter: "C",
    name: "Online Activities",
    color: "#d97706",
    bg: "#fef3c7",
    limit: "Max 30% of total",
    highlight: true,
    desc: "Accredited e-learning platforms and online CME courses â€” strictly capped at 30% of annual total (9 for physicians, 6 for nurses)",
  },
  {
    letter: "D",
    name: "Self-Directed Learning",
    color: "#64748b",
    bg: "#f1f5f9",
    limit: "Subject to limits",
    desc: "Journal reading, case discussions, and independent study â€” subject to MOH Kuwait caps and documentation requirements",
  },
];

const CHECKLIST = [
  { step: "1", title: "Confirm your renewal date", desc: "Your annual CME cycle is tied to your MOH Kuwait license registration date. Log in to the MOH portal to confirm your next renewal deadline." },
  { step: "2", title: "Calculate your CME gap", desc: "Count credits earned so far this year. Physicians need 30 total; nurses and AHPs need 20. Use the Hayya Med Pro CME calculator or your wallet dashboard." },
  { step: "3", title: "Check your online credit total", desc: "Online activities are capped at 30% (9 credits for physicians, 6 for nurses). If you've exceeded the cap, additional online activities won't count toward your renewal." },
  { step: "4", title: "Attend remaining in-person activities", desc: "At least 70% of your CME must come from in-person conferences, workshops, or seminars. Plan ahead for accredited events before your renewal date." },
  { step: "5", title: "Upload certificates to your portfolio", desc: "Keep certificates of completion for every accredited activity. MOH Kuwait may request documentation during the renewal verification process." },
  { step: "6", title: "Submit via the MOH Kuwait portal", desc: "Log in to the Kuwait Ministry of Health health professional portal and submit your CME summary report before your license renewal deadline." },
];

const RELATED = [
  { title: "MOH Kuwait Authority Guide", desc: "Full MOH Kuwait CME tracker", href: "/moh-kuwait" },
  { title: "Kuwait License Renewal", desc: "Step-by-step renewal process", href: "/moh-kuwait-renewal" },
  { title: "GCC CME Comparison", desc: "All 7 GCC authorities compared", href: "/gcc-cme-requirements" },
  { title: "Qatar CPD Guide", desc: "80 CPD / 2-year QCHP cycle", href: "/qatar-cme" },
  { title: "Saudi Arabia CME", desc: "SCFHS CME requirements 2025", href: "/saudi-arabia-cme" },
  { title: "UAE CME Guide", desc: "DHA & DOH requirements", href: "/uae-cme" },
];

export default function KuwaitCmePage() {
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
          { name: "Kuwait CME Requirements", url: "/kuwait-cme" },
        ]}
      />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#15803d] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span>ðŸ‡°ðŸ‡¼</span>
              <span>MOH Kuwait Â· Annual Renewal Cycle</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight mb-4">
              Kuwait CME Requirements 2025
            </h1>
            <p className="text-lg text-[#64748b] mb-8 max-w-2xl mx-auto">
              Kuwait Ministry of Health requires <strong className="text-[#111]">30 CME credits per year</strong> for
              physicians and pharmacists, and <strong className="text-[#111]">20 per year</strong> for nurses
              and allied health professionals. Kuwait has the strictest online CME cap in the GCC at just <strong className="text-[#111]">30%</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#1547a0] transition-colors"
              >
                Track my Kuwait CME â€” free â†’
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
              { label: "Physicians/Pharmacists", value: "30 CME/yr", color: "#1a56a0" },
              { label: "Nurses / AHP", value: "20 CME/yr", color: "#7c3aed" },
              { label: "Online CME cap", value: "30%", color: "#dc2626" },
              { label: "Renewal cycle", value: "Annual", color: "#16a34a" },
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
              Kuwait MOH uses a two-tier system: physicians and pharmacists have higher annual requirements than nurses and allied health professionals.
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    {["Profession", "Annual CME credits", "Cycle", "Online cap"].map((h) => (
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
                        <span className="bg-[#fee2e2] text-[#dc2626] text-xs font-semibold px-2 py-0.5 rounded">{p.onlineCap}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#64748b] mt-3">Source: Kuwait Ministry of Health (MOH). Verify with MOH Kuwait before renewal.</p>
          </div>
        </section>

        {/* CME categories */}
        <section className="py-14 px-4 bg-white border-y border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">Kuwait MOH CME activity categories</h2>
            <p className="text-sm text-[#64748b] mb-8">
              MOH Kuwait recognizes four types of CME activities. The 30% cap on online activities is the lowest in the GCC â€”
              most of your annual CME must come from in-person learning.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.letter} className={`rounded-xl p-5 border ${cat.highlight ? "border-[#fca5a5] bg-[#fef2f2]" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: cat.color }}>
                      {cat.letter}
                    </span>
                    <div>
                      <p className="font-semibold text-[#111] text-sm">{cat.name}</p>
                      <p className={`text-xs font-semibold ${cat.highlight ? "text-[#dc2626]" : "text-[#16a34a]"}`}>{cat.limit}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-[#fef3c7] border border-[#fcd34d] rounded-xl px-4 py-3">
              <p className="text-sm text-[#92400e]">
                <strong>Important:</strong> Kuwait&apos;s 30% online cap is the strictest in the GCC. If you rely heavily on online
                courses (Coursera, Medscape, UpToDate, etc.), plan carefully â€” only 9 credits per year (physicians) or 6 credits per year
                (nurses) will count toward renewal.
              </p>
            </div>
          </div>
        </section>

        {/* Kuwait CME context */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-6">Understanding Kuwait&apos;s CME system</h2>
            <div className="prose prose-sm max-w-none text-[#374151] space-y-4">
              <p>
                The Kuwait Ministry of Health (MOH) governs CME for all licensed healthcare professionals in Kuwait.
                Unlike some GCC authorities that use the term CPD (Continuing Professional Development), Kuwait uses CME
                (Continuing Medical Education) for all professions â€” doctors, nurses, pharmacists, and allied health.
              </p>
              <p>
                Kuwait&apos;s annual CME cycle is the shortest in the GCC. While Qatar and Bahrain use 2-year cycles and
                the UAE varies by authority, Kuwait requires annual renewal â€” meaning your CME record resets every year
                based on your license registration date.
              </p>
              <p>
                The 30% online cap makes Kuwait&apos;s CME system distinct. Qatar allows 50% online, Bahrain allows 50%,
                and some UAE authorities are similar. In Kuwait, attending accredited conferences, workshops, and live seminars
                is essential to meeting your annual requirement â€” you cannot meet it through online learning alone.
              </p>
              <p>
                MOH Kuwait accepts CME from internationally recognized bodies including AMA (Category 1), ACGME-accredited
                programs, Royal Colleges, and GCC equivalence-recognized providers. Activities attended in other GCC countries
                are generally accepted provided they carry recognized accreditation.
              </p>
            </div>
          </div>
        </section>

        {/* Annual renewal checklist */}
        <section className="py-14 px-4 bg-white border-y border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">Kuwait MOH annual CME renewal checklist</h2>
            <p className="text-sm text-[#64748b] mb-8">
              Complete these steps before your annual MOH Kuwait license renewal date to avoid delays.
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
            <h2 className="text-2xl font-bold text-[#111] mb-8">Kuwait CME â€” frequently asked questions</h2>
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
              Track your Kuwait MOH CME automatically
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm leading-relaxed">
              Hayya Med Pro calculates your annual Kuwait CME total, enforces the 30% online cap,
              and shows your real-time compliance status â€” so you&apos;re never caught short before renewal.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#f0f4f8] transition-colors"
            >
              Start free â€” no credit card â†’
            </Link>
            <p className="text-[#64748b] text-xs mt-4">14-day Pro trial Â· 30% online cap enforced automatically</p>
          </div>
        </section>

        {/* Related guides */}
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

