import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Dentist CME Requirements in GCC â€” SCFHS, QCHP, DHA, DOH, MOH Kuwait, NHRA, OMSB",
  description:
    "Complete guide to dentist CME and CPD requirements across the GCC. QCHP Qatar (80 CPD/2yr), SCFHS Saudi Arabia (60 CME/yr), DHA Dubai (40 CME/2yr). Track all dental CME requirements in one professional compliance app.",
  keywords: [
    "dentist CME requirements GCC",
    "SCFHS dentist CME",
    "QCHP dentist CPD",
    "dental CME Saudi Arabia",
    "dentist license renewal GCC",
    "DHA dentist CME",
    "dentist CPD Qatar",
    "GCC dental continuing education",
    "dental CME compliance",
    "dentist CPD portfolio",
  ],
  openGraph: {
    title: "Dentist CME Requirements Across the GCC â€” Complete Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB â€” dentist CME and CPD requirements across all 7 GCC countries in one guide.",
    url: `${APP_URL}/dentist-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Dentist+CME+Requirements+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%C2%B7+DOH+%E2%80%94+all+7+GCC+countries&a=%F0%9F%A6%B7+Dentistry&k=Profession+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentist CME Requirements in GCC â€” Track All 7 Countries",
    description: "Complete dentist CME guide for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/dentist-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a dentist need for SCFHS renewal in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dentists registered with SCFHS in Saudi Arabia must complete 60 CME credits per year â€” the same requirement as physicians and pharmacists. No more than 50% of credits (30 credits) may come from online activities. The renewal cycle ranges from 1 to 3 years depending on the dental specialty.",
      },
    },
    {
      "@type": "Question",
      name: "What are the CPD requirements for dentists in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dentists licensed by QCHP (DHP-AS under MOPH Qatar) must complete 80 CPD credits per 2-year renewal cycle. A minimum of 40 credits must be completed each year. Qatar applies the same 80-credit requirement to all licensed healthcare professionals including dentists and dental specialists.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities count for dentists in GCC countries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Accepted CME activities for dentists across GCC include: dental conferences and symposia, accredited online modules, practical workshops and hands-on training, research publications and presentations, postgraduate education, and peer case discussions. Most authorities require the majority of credits to come from live or interactive formats rather than self-study.",
      },
    },
    {
      "@type": "Question",
      name: "Does a dental specialist have different CME requirements than a general dentist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In most GCC countries, the CME credit total is the same for general dentists and dental specialists. However, SCFHS and DHA may require specialist dentists to complete a proportion of their credits in their specialty area. Oral surgeons, orthodontists, and periodontists may need specialty-specific accredited activities.",
      },
    },
    {
      "@type": "Question",
      name: "Can dentists count dental conference attendance for CME in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Attendance at SCFHS-accredited dental conferences counts toward the 60 CME credits per year. Major events such as the Saudi Dental Society annual conference and Arab Health symposia are typically recognised. Always verify the accreditation status of a conference with SCFHS before attendance.",
      },
    },
  ],
};

const countries = [
  {
    country: "Qatar",
    authority: "QCHP / DHP-AS",
    credits: "80 CPD",
    cycle: "2 years",
    minPerYear: "40/year minimum",
    terminology: "CPD",
    note: "",
  },
  {
    country: "Saudi Arabia",
    authority: "SCFHS",
    credits: "60 CME",
    cycle: "1 year",
    minPerYear: "â€”",
    terminology: "CME",
    note: "Max 50% online (30 credits)",
  },
  {
    country: "UAE (Dubai)",
    authority: "DHA",
    credits: "40 CME",
    cycle: "2 years",
    minPerYear: "â€”",
    terminology: "CME",
    note: "",
  },
  {
    country: "UAE (Abu Dhabi)",
    authority: "DOH",
    credits: "40 CPD",
    cycle: "2 years",
    minPerYear: "â€”",
    terminology: "CPD",
    note: "",
  },
  {
    country: "Kuwait",
    authority: "MOH Kuwait",
    credits: "30 CME",
    cycle: "1 year",
    minPerYear: "â€”",
    terminology: "CME",
    note: "",
  },
  {
    country: "Bahrain",
    authority: "NHRA",
    credits: "40 CPD",
    cycle: "2 years",
    minPerYear: "â€”",
    terminology: "CPD",
    note: "",
  },
  {
    country: "Oman",
    authority: "OMSB",
    credits: "40 CME",
    cycle: "2 years",
    minPerYear: "â€”",
    terminology: "CME",
    note: "",
  },
];

const categories = [
  {
    icon: "ðŸ¦·",
    title: "Dental Clinical Practice",
    description: "Restorative, endodontics, periodontics, oral surgery â€” accredited clinical CPD",
  },
  {
    icon: "ðŸ’»",
    title: "Online & E-Learning",
    description: "Accredited online modules (capped at 50% in Saudi Arabia, Kuwait)",
  },
  {
    icon: "ðŸŽ“",
    title: "Postgraduate Education",
    description: "Fellowship programs, specialist training, accredited short courses",
  },
  {
    icon: "ðŸ“‹",
    title: "Research & Publications",
    description: "Dental research, peer-reviewed publications, case reports, audit",
  },
  {
    icon: "ðŸ¥",
    title: "Conferences & Workshops",
    description: "Dental symposia, hands-on workshops, accredited grand rounds",
  },
  {
    icon: "ðŸ‘©â€ðŸ«",
    title: "Teaching & Mentoring",
    description: "Clinical teaching, dental student supervision, peer training",
  },
];

export default function DentistCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Header nav */}
      <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[#1a56a0] text-sm">
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#64748b] hover:text-[#1a56a0]">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-[#1a56a0] text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block bg-[#eff6ff] text-[#1a56a0] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Dentist CME &amp; CPD â€” GCC Guide
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              Dentist CME Requirements<br className="hidden sm:block" /> Across the GCC
            </h1>
            <p className="text-lg text-[#475569] mb-8 max-w-2xl mx-auto">
              QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB â€” dentist CME and CPD requirements for
              every GCC country. One app to track them all.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-[#1a56a0] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1547a0] transition-colors text-sm"
              >
                Start tracking free
              </Link>
              <Link
                href="/pricing"
                className="border border-[#e2e8f0] text-[#374151] font-medium px-6 py-3 rounded-lg hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors text-sm"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Requirements table */}
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Dentist CME Requirements by Country
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Requirements as of 2025â€“2026. Verify final requirements with your licensing authority.
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Country</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Authority</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Credits Required</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Cycle</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Term</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((c, i) => (
                    <tr
                      key={c.country}
                      className={`border-b border-[#f0f4f8] ${i % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"}`}
                    >
                      <td className="px-4 py-3 font-medium text-[#111]">{c.country}</td>
                      <td className="px-4 py-3 text-[#475569]">{c.authority}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#1a56a0]">{c.credits}</span>
                        {c.minPerYear && (
                          <span className="block text-xs text-[#64748b]">{c.minPerYear}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#475569]">{c.cycle}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-[#eff6ff] text-[#1a56a0] px-2 py-0.5 rounded-full font-medium">
                          {c.terminology}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">{c.note || "â€”"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Accepted CME Categories for Dentists
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Categories vary by authority â€” check your specific licensing body for exact credit limits.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.title} className="border border-[#e2e8f0] rounded-xl p-5 bg-[#f8fafc]">
                  <span className="text-2xl mb-3 block">{cat.icon}</span>
                  <h3 className="font-semibold text-[#111] mb-1 text-sm">{cat.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-10 text-center">
              How Dentists Track CME with Hayya Med Pro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Add your country",
                  body: "Select Qatar, Saudi Arabia, UAE, or any GCC country. Requirements load automatically.",
                },
                {
                  step: "2",
                  title: "Log activities",
                  body: "Add attended conferences, online modules, workshops, and research contributions.",
                },
                {
                  step: "3",
                  title: "Upload certificates",
                  body: "Upload certificate PDFs or images. AI reads the credit value and date.",
                },
                {
                  step: "4",
                  title: "Stay compliant",
                  body: "See your progress toward renewal and receive reminders before your deadline.",
                },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#1a56a0] text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-[#111] mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details key={faq.name} className="group border border-[#e2e8f0] rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-white hover:bg-[#f8fafc] transition-colors">
                    <span className="font-medium text-[#111] text-sm pr-4">{faq.name}</span>
                    <span className="text-[#64748b] flex-shrink-0 transition-transform duration-200 group-open:rotate-45 text-lg leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 pt-2 text-sm text-[#475569] leading-relaxed bg-[#f8fafc] border-t border-[#f0f4f8]">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Country grid */}
        <section className="py-10 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#111] mb-6 text-center">
              Dentist CME Requirements by Authority
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: "QCHP Qatar â€” Dentists", href: "/qchp" },
                { label: "SCFHS Saudi â€” Dentists", href: "/scfhs" },
                { label: "DHA Dubai â€” Dentists", href: "/dha" },
                { label: "DOH Abu Dhabi â€” Dentists", href: "/doh" },
                { label: "MOH Kuwait â€” Dentists", href: "/moh-kuwait" },
                { label: "NHRA Bahrain â€” Dentists", href: "/nhra" },
                { label: "OMSB Oman â€” Dentists", href: "/omsb" },
                { label: "CME vs CPD Explained", href: "/cme-vs-cpd" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-xs text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] bg-white transition-colors text-center"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Other professions */}
        <section className="py-10 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#111] mb-6 text-center">
              CME Requirements by Profession
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Physician CME", href: "/physician-cme" },
                { label: "Nurse CPD", href: "/nurse-cpd" },
                { label: "Pharmacist CME", href: "/pharmacist-cme" },
                { label: "All Countries", href: "/countries" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-xs text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] bg-white transition-colors text-center"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#0f1f3d]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Track your dental CME in one place
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm max-w-xl mx-auto">
              Hayya Med Pro automatically calculates your progress toward SCFHS, QCHP, DHA, and all
              GCC authority requirements. Free to start â€” no credit card needed.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
            >
              Start tracking free
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
              Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses
              and does not replace official licensing authorities. Dentists must verify final CME
              requirements with QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB as applicable.
            </p>
            <p className="text-xs text-[#94a3b8] text-center mt-2">
              <Link href="/privacy" className="hover:text-[#64748b]">Privacy</Link>
              {" Â· "}
              <Link href="/terms" className="hover:text-[#64748b]">Terms</Link>
              {" Â· "}
              <Link href="/countries" className="hover:text-[#64748b]">All Countries</Link>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
