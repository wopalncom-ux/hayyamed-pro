import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Bahrain CPD Requirements 2025 â€” NHRA CPD Credits & Renewal Guide",
  description:
    "Complete guide to CPD requirements in Bahrain. NHRA requires 40 CPD credits per 2-year cycle for all licensed healthcare professionals. Track your Bahrain NHRA compliance automatically with Hayya Med Pro.",
  keywords: [
    "Bahrain CPD requirements",
    "NHRA CPD requirements",
    "Bahrain CPD credits",
    "Bahrain healthcare CPD",
    "NHRA 40 CPD",
    "Bahrain doctor CPD",
    "Bahrain nurse CPD",
    "Bahrain medical license renewal",
    "NHRA continuing professional development",
    "Bahrain CPD 2 year cycle",
    "National Health Regulatory Authority CPD",
    "Bahrain structured CPD",
  ],
  openGraph: {
    title: "Bahrain CPD Requirements 2025 â€” NHRA Guide | Hayya Med Pro",
    description:
      "NHRA Bahrain requires 40 CPD credits per 2-year cycle for all healthcare professionals. Structured and unstructured CPD capped at 20 each. Complete country guide with renewal checklist.",
    url: `${APP_URL}/bahrain-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Bahrain+CPD+Requirements+2025&s=40+CPD+%2F+2-year+%C2%B7+Structured+%2B+Unstructured+%C2%B7+NHRA+Bahrain&a=%F0%9F%87%A7%F0%9F%87%AD+Bahrain&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bahrain CPD Requirements 2025 â€” NHRA",
    description:
      "40 CPD credits per 2-year cycle for all Bahrain healthcare professionals. NHRA structured and unstructured CPD framework explained.",
  },
  alternates: { canonical: `${APP_URL}/bahrain-cme` },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need in Bahrain per 2-year cycle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The National Health Regulatory Authority (NHRA) in Bahrain requires 40 CPD credits per 2-year renewal cycle for all licensed healthcare professionals, regardless of profession or specialty. There is no separate annual minimum â€” the full 40 credits must be completed by your 2-year renewal date.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between structured and unstructured CPD in Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA divides CPD into Structured (accredited activities like conferences, workshops, and accredited online courses) and Unstructured (self-directed learning such as journal reading, case studies, and teaching). A maximum of 20 credits per 2-year cycle can come from unstructured activities. Structured accredited CPD has no upper cap.",
      },
    },
    {
      "@type": "Question",
      name: "What is the online CPD limit for NHRA Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA Bahrain allows a maximum of 20 online CPD credits per 2-year cycle. Online activities must be from NHRA-accredited providers. Hayya Med Pro tracks your online CPD total automatically and alerts you when you approach the 20-credit cap.",
      },
    },
    {
      "@type": "Question",
      name: "Does NHRA Bahrain have the same CPD requirement for all professions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Unlike some GCC authorities that have different requirements by profession, NHRA Bahrain applies a uniform 40 CPD credits per 2-year cycle for all licensed healthcare professionals â€” physicians, nurses, pharmacists, dentists, and allied health professionals alike.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CPD portfolio to NHRA Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD portfolios are submitted through the NHRA online portal (nhra.bh) before your 2-year license renewal date. Hayya Med Pro generates a structured CPD activity report organized by type â€” structured, unstructured, online, and teaching â€” ready for NHRA portal upload.",
      },
    },
    {
      "@type": "Question",
      name: "Do teaching and research activities count toward NHRA Bahrain CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NHRA Bahrain accepts teaching and training activities (such as lecturing, supervising trainees, and facilitating workshops) and research activities (including publications and presentations) as CPD credits. These typically fall under the Unstructured or Structured category depending on NHRA guidelines â€” count toward the 40-credit total but are subject to the 20-credit cap for unstructured activities.",
      },
    },
  ],
};

const CPD_TYPES = [
  {
    name: "Structured Accredited",
    color: "#1a56a0",
    bg: "#dbeafe",
    limit: "No upper cap",
    examples: "Conferences, workshops, accredited seminars approved by NHRA or recognized bodies",
    preferred: true,
  },
  {
    name: "Online (Accredited)",
    color: "#7c3aed",
    bg: "#ede9fe",
    limit: "Max 20 per 2-year cycle",
    examples: "Accredited e-learning platforms and online CPD courses from NHRA-recognized providers",
    preferred: false,
  },
  {
    name: "Unstructured / Self-Directed",
    color: "#d97706",
    bg: "#fef3c7",
    limit: "Max 20 per 2-year cycle",
    examples: "Journal reading, case discussions, independent study, and non-accredited learning activities",
    preferred: false,
  },
  {
    name: "Teaching & Training",
    color: "#16a34a",
    bg: "#f0fdf4",
    limit: "Subject to NHRA limits",
    examples: "Lecturing, supervising trainees, facilitating workshops, mentoring â€” typically counts as unstructured",
    preferred: false,
  },
  {
    name: "Research & Publications",
    color: "#64748b",
    bg: "#f1f5f9",
    limit: "Subject to NHRA limits",
    examples: "Peer-reviewed publications, research presentations, posters at accredited conferences",
    preferred: false,
  },
];

const CHECKLIST = [
  { step: "1", title: "Find your 2-year renewal date", desc: "Your NHRA CPD cycle is tied to your license registration date. Log in to the NHRA portal at nhra.bh to confirm your next renewal deadline." },
  { step: "2", title: "Plan your 40 CPD credits", desc: "You need 40 credits over 2 years â€” roughly 20 per year. Since there is no annual minimum, you have flexibility, but don't leave it all to the final months." },
  { step: "3", title: "Track structured vs unstructured balance", desc: "At most 20 credits can be unstructured (self-directed). Prioritize accredited conferences and online courses (up to 20) to maximize your structured credit total." },
  { step: "4", title: "Keep all certificates of completion", desc: "NHRA may request documentation for any CPD activity. Save certificates, attendance records, and publication proofs for the full 2-year cycle." },
  { step: "5", title: "Generate your CPD portfolio report", desc: "Hayya Med Pro produces a CPD summary organized by Structured, Online, Unstructured, and Teaching categories â€” matching the NHRA Bahrain submission format." },
  { step: "6", title: "Submit via the NHRA portal", desc: "Upload your CPD portfolio to the NHRA online portal before your license renewal date. Activities submitted after the deadline typically cannot be counted for the current cycle." },
];

const RELATED = [
  { title: "NHRA Authority Guide", desc: "Full NHRA CPD tracker for Bahrain", href: "/nhra" },
  { title: "Bahrain License Renewal", desc: "Step-by-step NHRA renewal process", href: "/nhra-renewal" },
  { title: "GCC CPD Comparison", desc: "All 7 GCC authorities compared", href: "/gcc-cme-requirements" },
  { title: "Qatar CPD Guide", desc: "80 CPD / 2-year QCHP cycle", href: "/qatar-cme" },
  { title: "UAE CME Guide", desc: "DHA & DOH requirements", href: "/uae-cme" },
  { title: "Kuwait CME Guide", desc: "MOH Kuwait 30 CME/year", href: "/kuwait-cme" },
];

export default function BahrainCmePage() {
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
          { name: "Bahrain CPD Requirements", url: "/bahrain-cme" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Bahrain CPD Requirements"
        url="https://hayyamed.pro/bahrain-cme"
        description="Complete guide to CPD requirements in Bahrain. NHRA requires 40 CPD credits per 2-year cycle for all licensed healthcare professionals. Track your Bahrain NHRA compliance automatically with Hayya Med Pro."
        keywords={["Bahrain CPD requirements", "NHRA CPD credits", "Bahrain CPD 2025", "NHRA license renewal", "Bahrain healthcare professional CPD"]}
      />

      <main className="min-h-screen bg-[#f8fafc]">
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#15803d] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span>ðŸ‡§ðŸ‡­</span>
              <span>NHRA Bahrain Â· 2-Year Renewal Cycle</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight mb-4">
              Bahrain CPD Requirements 2025
            </h1>
            <p className="text-lg text-[#64748b] mb-8 max-w-2xl mx-auto">
              The National Health Regulatory Authority (NHRA) requires{" "}
              <strong className="text-[#111]">40 CPD credits every 2 years</strong> for all licensed healthcare
              professionals in Bahrain â€” physicians, nurses, pharmacists, and allied health alike.
              A maximum of <strong className="text-[#111]">20 credits</strong> can be unstructured or online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#1547a0] transition-colors"
              >
                Track my Bahrain CPD â€” free â†’
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
              { label: "All professions", value: "40 CPD", color: "#1a56a0" },
              { label: "Renewal cycle", value: "2 years", color: "#16a34a" },
              { label: "Online CPD cap", value: "20 credits", color: "#d97706" },
              { label: "Unstructured cap", value: "20 credits", color: "#7c3aed" },
            ].map((s) => (
              <div key={s.label} className="text-center bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                <p className="text-2xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#64748b]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Uniform requirement callout */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">One requirement for all professions</h2>
            <p className="text-sm text-[#64748b] mb-8">
              Unlike Qatar, UAE, or Saudi Arabia, NHRA Bahrain applies the same 40 CPD / 2-year requirement
              to every licensed healthcare professional. No profession-by-profession variation.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Physicians", "Nurses", "Pharmacists", "Allied Health"].map((p) => (
                <div key={p} className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
                  <p className="font-semibold text-[#111] text-sm mb-1">{p}</p>
                  <p className="text-xs text-[#1d4ed8] font-bold">40 CPD / 2 yr</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CPD types */}
        <section className="py-14 px-4 bg-white border-y border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">NHRA Bahrain CPD activity types</h2>
            <p className="text-sm text-[#64748b] mb-8">
              NHRA divides CPD into structured and unstructured categories. The balance between the two
              determines your compliance status. Accredited structured CPD is always preferred.
            </p>
            <div className="space-y-3">
              {CPD_TYPES.map((type) => (
                <div key={type.name} className="rounded-xl p-5 border border-[#e2e8f0] bg-[#f8fafc]">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: type.color }} />
                      <p className="font-semibold text-[#111] text-sm">{type.name}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${type.preferred ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                      {type.limit}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed ml-6">{type.examples}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3">
              <p className="text-sm text-[#1e40af]">
                <strong>Tip:</strong> To maximize your NHRA CPD portfolio, aim for at least 21 structured accredited credits
                (conferences, workshops, accredited online courses) per 2-year cycle. This ensures you can&apos;t be capped out
                by the unstructured or online limits.
              </p>
            </div>
          </div>
        </section>

        {/* CPD vs CME in Bahrain */}
        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-6">CPD vs CME in Bahrain</h2>
            <div className="prose prose-sm max-w-none text-[#374151] space-y-4">
              <p>
                Bahrain uses the term <strong>CPD (Continuing Professional Development)</strong> rather than CME
                (Continuing Medical Education). This reflects NHRA&apos;s broader definition of professional
                development that includes non-clinical skills: leadership, management, communication,
                research, and education â€” not just clinical learning.
              </p>
              <p>
                In practice, most accredited medical conferences and workshops attended by Bahrain healthcare
                professionals still count as CPD hours. The distinction matters more when you are trying to claim
                credit for non-clinical activities â€” management training, quality improvement projects, or teaching
                roles â€” which Bahrain explicitly allows under the CPD framework.
              </p>
              <p>
                Hayya Med Pro tracks your NHRA Bahrain CPD balance in real time â€” showing your structured total,
                unstructured total, online credit usage, and overall 40-credit progress against your 2-year renewal date.
              </p>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="py-14 px-4 bg-white border-y border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#111] mb-2">Bahrain NHRA CPD renewal checklist</h2>
            <p className="text-sm text-[#64748b] mb-8">
              Complete these steps before your 2-year NHRA license renewal to ensure a smooth process.
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
            <h2 className="text-2xl font-bold text-[#111] mb-8">Bahrain CPD â€” frequently asked questions</h2>
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
              Track your Bahrain NHRA CPD automatically
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm leading-relaxed">
              Hayya Med Pro tracks your structured vs unstructured CPD balance, enforces the 20-credit
              caps, and generates your NHRA-ready CPD portfolio report â€” so renewal is never a surprise.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#f0f4f8] transition-colors"
            >
              Start free â€” no credit card â†’
            </Link>
            <p className="text-[#64748b] text-xs mt-4">14-day Pro trial Â· Structured / unstructured balance tracked automatically</p>
          </div>
        </section>

        {/* Related */}
        <section className="py-14 px-4 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-[#111] mb-6">Related CPD and CME guides</h2>
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

