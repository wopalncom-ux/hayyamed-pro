import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Allied Health CPD Requirements in GCC â€” Physiotherapist, Radiographer, Lab Technician CME",
  description:
    "CPD and CME requirements for allied health professionals across GCC: physiotherapists, radiographers, lab technicians, occupational therapists. SCFHS Saudi (30/yr), QCHP Qatar (80/2yr), DHA Dubai (40/2yr). Track all requirements in one app.",
  keywords: [
    "allied health CPD GCC",
    "physiotherapist CME Saudi Arabia",
    "radiographer CPD Qatar",
    "lab technician CME SCFHS",
    "occupational therapist CPD GCC",
    "allied health CME requirements",
    "SCFHS allied health CPD",
    "QCHP allied health CPD",
    "DHA allied health CME",
    "physiotherapy CPD requirements",
  ],
  openGraph: {
    title: "Allied Health CPD Requirements Across the GCC â€” Complete Guide",
    description:
      "SCFHS, QCHP, DHA, DOH, MOH Kuwait â€” CPD and CME requirements for physiotherapists, radiographers, lab technicians, and all allied health professionals.",
    url: `${APP_URL}/allied-health-cpd`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Allied+Health+CPD+Requirements+%E2%80%94+GCC&s=Physiotherapy+%C2%B7+Radiology+%C2%B7+Lab+%C2%B7+OT+%E2%80%94+all+GCC+authorities&a=%F0%9F%A6%BF+Allied+Health&k=Profession+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Allied Health CPD in GCC â€” All Countries & Authorities",
    description: "CPD requirements for physiotherapists, radiographers, lab technicians, and allied health across Qatar, Saudi Arabia, and UAE.",
  },
  alternates: { canonical: `${APP_URL}/allied-health-cpd` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do allied health professionals need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allied health professionals registered with SCFHS in Saudi Arabia â€” including physiotherapists, radiographers, medical laboratory technicians, occupational therapists, and speech therapists â€” must complete 30 CME credits per year. This is half the requirement for physicians (60/yr). No more than 50% (15 credits) may come from online activities.",
      },
    },
    {
      "@type": "Question",
      name: "What are the CPD requirements for allied health professionals in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All healthcare professionals licensed by QCHP in Qatar â€” including allied health â€” must complete 80 CPD credits per 2-year renewal cycle, with a minimum of 40 credits per year. Qatar does not differentiate requirements by profession at the overall credit level.",
      },
    },
    {
      "@type": "Question",
      name: "What allied health professions does SCFHS regulate in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS regulates a wide range of allied health professions including: physiotherapy, occupational therapy, speech and language therapy, diagnostic radiology and radiography, medical laboratory science, respiratory therapy, dietetics and nutrition, pharmacy technicians, health information management, and orthotics and prosthetics, among others.",
      },
    },
    {
      "@type": "Question",
      name: "Can physiotherapists use online CPD activities to meet GCC requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but with caps. SCFHS allows up to 50% of credits (15 of 30) from online activities. DHA Dubai allows up to 50% online (20 of 40 credits). QCHP Qatar does not specify a strict online cap but recommends a balance of learning formats. MOH Kuwait restricts online credits to 30%.",
      },
    },
    {
      "@type": "Question",
      name: "Do physiotherapists and radiographers have the same CPD requirements in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In most GCC countries, yes. SCFHS applies 30 CME/yr to all allied health professions â€” physiotherapists and radiographers alike. QCHP applies 80 CPD/2yr to all licensed healthcare professionals regardless of profession. DHA applies 40 CME/2yr. Some authorities may have specialty-specific category requirements within the overall total.",
      },
    },
  ],
};

const professions = [
  { icon: "ðŸ¦¿", name: "Physiotherapists" },
  { icon: "â˜¢ï¸", name: "Radiographers" },
  { icon: "ðŸ”¬", name: "Lab Technicians" },
  { icon: "ðŸ§ ", name: "Occupational Therapists" },
  { icon: "ðŸ—£ï¸", name: "Speech Therapists" },
  { icon: "ðŸ«", name: "Respiratory Therapists" },
  { icon: "ðŸ¥—", name: "Dietitians / Nutritionists" },
  { icon: "ðŸ‘ï¸", name: "Optometrists" },
];

const countries = [
  {
    country: "Qatar",
    authority: "QCHP / DHP-AS",
    credits: "80 CPD",
    cycle: "2 years",
    minPerYear: "40/year min",
    onlineCap: "No specific cap",
    terminology: "CPD",
  },
  {
    country: "Saudi Arabia",
    authority: "SCFHS",
    credits: "30 CME",
    cycle: "1 year",
    minPerYear: "â€”",
    onlineCap: "Max 50% online",
    terminology: "CME",
  },
  {
    country: "UAE (Dubai)",
    authority: "DHA",
    credits: "40 CME",
    cycle: "2 years",
    minPerYear: "â€”",
    onlineCap: "Max 50% online",
    terminology: "CME",
  },
  {
    country: "UAE (Abu Dhabi)",
    authority: "DOH",
    credits: "30â€“40 CPD",
    cycle: "1â€“2 years",
    minPerYear: "Profession-specific",
    onlineCap: "Max 20 online",
    terminology: "CPD",
  },
  {
    country: "Kuwait",
    authority: "MOH Kuwait",
    credits: "20 CME",
    cycle: "1 year",
    minPerYear: "â€”",
    onlineCap: "Max 30% online",
    terminology: "CME",
  },
  {
    country: "Bahrain",
    authority: "NHRA",
    credits: "40 CPD",
    cycle: "2 years",
    minPerYear: "â€”",
    onlineCap: "Max 20 online",
    terminology: "CPD",
  },
  {
    country: "Oman",
    authority: "OMSB",
    credits: "30 CME",
    cycle: "2 years",
    minPerYear: "â€”",
    onlineCap: "Max 20 online",
    terminology: "CME",
  },
];

const categories = [
  {
    icon: "ðŸŽ“",
    title: "Accredited Training Courses",
    description: "Short courses and workshops accredited by the relevant licensing authority",
  },
  {
    icon: "ðŸ’»",
    title: "Online & E-Learning",
    description: "Accredited online modules â€” capped at 50% in Saudi Arabia and Kuwait",
  },
  {
    icon: "ðŸ¥",
    title: "Conferences & Symposia",
    description: "National and international allied health conferences with accreditation",
  },
  {
    icon: "ðŸ“‹",
    title: "Research & Publications",
    description: "Peer-reviewed papers, case reports, audit, and research presentations",
  },
  {
    icon: "ðŸ‘©â€ðŸ«",
    title: "Teaching & Supervision",
    description: "Student supervision, peer education, and clinical mentoring",
  },
  {
    icon: "ðŸ›ï¸",
    title: "Postgraduate Study",
    description: "Masters, clinical fellowships, and advanced specialist training",
  },
];

export default function AlliedHealthCpdPage() {
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
              Allied Health CPD &amp; CME â€” GCC Guide
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              Allied Health CPD Requirements<br className="hidden sm:block" /> Across the GCC
            </h1>
            <p className="text-lg text-[#475569] mb-6 max-w-2xl mx-auto">
              CPD and CME requirements for physiotherapists, radiographers, lab technicians,
              occupational therapists, and all allied health professionals across GCC.
            </p>

            {/* Profession chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {professions.map((p) => (
                <span
                  key={p.name}
                  className="inline-flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-full px-3 py-1 text-xs text-[#374151]"
                >
                  <span>{p.icon}</span>
                  {p.name}
                </span>
              ))}
            </div>

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

        {/* Saudi callout â€” most searched */}
        <section className="py-8 bg-[#f0fdf4] border-b border-[#bbf7d0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white border border-[#bbf7d0] rounded-xl px-5 py-4 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">ðŸ‡¸ðŸ‡¦</span>
              <div>
                <p className="text-sm font-semibold text-[#111] mb-1">
                  SCFHS (Saudi Arabia): Allied health professionals require <strong>30 CME credits per year</strong> â€” half the physician requirement
                </p>
                <p className="text-sm text-[#475569]">
                  This is one of the most common questions from physiotherapists and radiographers working in Saudi Arabia. The 30/yr rule applies to all allied health specialties under SCFHS, with a maximum 50% from online activities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements table */}
        <section className="py-12 bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Allied Health CPD Requirements by Country
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
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Online Cap</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#374151]">Term</th>
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
                        {c.minPerYear !== "â€”" && (
                          <span className="block text-xs text-[#64748b]">{c.minPerYear}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#475569]">{c.cycle}</td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">{c.onlineCap}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-[#eff6ff] text-[#1a56a0] px-2 py-0.5 rounded-full font-medium">
                          {c.terminology}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Accepted categories */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Accepted CPD Categories for Allied Health
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Most GCC authorities accept the same broad categories with varying credit caps.
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
              How Allied Health Professionals Track CPD with Hayya Med Pro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Select your country",
                  body: "Choose Qatar, Saudi Arabia, UAE, or any GCC country. Credit requirements load automatically.",
                },
                {
                  step: "2",
                  title: "Add your profession",
                  body: "Select physiotherapy, radiography, lab science, or any allied health specialty.",
                },
                {
                  step: "3",
                  title: "Log CPD activities",
                  body: "Add conferences, online courses, training days, and research â€” AI reads your certificates.",
                },
                {
                  step: "4",
                  title: "Track to renewal",
                  body: "See your progress bar and get deadline reminders at 90, 30, and 7 days out.",
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

        {/* Authority links */}
        <section className="py-10 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#111] mb-6 text-center">
              Allied Health CPD by Authority
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: "QCHP Qatar", href: "/qchp" },
                { label: "SCFHS Saudi Arabia", href: "/scfhs" },
                { label: "DHA Dubai", href: "/dha" },
                { label: "DOH Abu Dhabi", href: "/doh" },
                { label: "MOH Kuwait", href: "/moh-kuwait" },
                { label: "NHRA Bahrain", href: "/nhra" },
                { label: "OMSB Oman", href: "/omsb" },
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

        {/* Other profession guides */}
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
                { label: "Dentist CME", href: "/dentist-cme" },
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
              Track your allied health CPD in one place
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm max-w-xl mx-auto">
              Hayya Med Pro supports all allied health professions across all GCC authorities.
              Free to start â€” no credit card needed.
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
              Hayya Med Pro supports CPD tracking and licensing readiness. It does not issue licenses
              and does not replace official licensing authorities. Allied health professionals must verify final CPD
              requirements with SCFHS, QCHP, DHA, DOH, MOH Kuwait, NHRA, or OMSB as applicable.
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
