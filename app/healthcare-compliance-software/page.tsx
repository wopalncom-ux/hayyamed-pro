import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Healthcare Compliance Software for GCC Clinics & Hospitals â€” Hayya Med Pro",
  description:
    "Healthcare compliance software for Qatar, Saudi Arabia, and UAE. Track staff CME requirements, manage QCHP/SCFHS/DHA renewals, and generate bulk compliance reports. Trusted by GCC clinic administrators and hospital HR teams.",
  keywords: [
    "healthcare compliance software",
    "medical staff compliance software",
    "CME tracking software for hospitals",
    "staff compliance management software GCC",
    "healthcare compliance software Qatar",
    "QCHP compliance software",
    "medical license management software",
    "hospital CME management system",
    "healthcare workforce compliance software",
    "clinic compliance software Saudi Arabia",
  ],
  openGraph: {
    title: "Healthcare Compliance Software for GCC Clinics & Hospitals",
    description:
      "Real-time staff CME compliance dashboard. Track QCHP, SCFHS, DHA, and DOH renewal requirements for your entire team. From $50/month.",
    url: `${APP_URL}/healthcare-compliance-software`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Healthcare+Compliance+Software+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+staff+CME+tracking+%C2%B7+from+%2450%2Fmonth&a=%F0%9F%8F%A5+GCC&k=Software`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthcare Compliance Software â€” GCC Clinics & Hospitals",
    description: "Track staff CME compliance for QCHP, SCFHS, DHA. Real-time dashboard, bulk PDF reports, weekly digest. From $50/month.",
  },
  alternates: { canonical: `${APP_URL}/healthcare-compliance-software` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is healthcare compliance software?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Healthcare compliance software is a platform that helps clinic administrators, hospital HR managers, and medical directors track whether their staff have completed the CME/CPD requirements needed for license renewal. It provides a real-time view of who is compliant, at risk, or non-compliant â€” and generates the reports needed for accreditation audits like JCI and CBAHI.",
      },
    },
    {
      "@type": "Question",
      name: "How does Hayya Med Pro help GCC clinics manage staff compliance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro gives employer admins a real-time compliance dashboard showing each staff member's CME credit progress, compliance status, and license expiry. You can generate bulk PDF compliance reports for the whole team, group staff by department, assign required courses, and receive weekly digest emails with compliance highlights. All GCC authorities are supported: QCHP, SCFHS, DHA, DOH, NHRA, OMSB, and MOH Kuwait.",
      },
    },
    {
      "@type": "Question",
      name: "What GCC licensing authorities are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro supports all major GCC healthcare licensing authorities: QCHP (Qatar), SCFHS (Saudi Arabia), DHA (Dubai), DOH (Abu Dhabi), NHRA (Bahrain), OMSB (Oman), and MOH Kuwait. Staff with licenses in multiple countries have their compliance tracked separately per jurisdiction in one dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "How is Hayya Med Pro different from a spreadsheet or HR system?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Spreadsheets require manual updating and don't enforce category caps or annual minimums. Most HR systems don't understand GCC CME requirements at all. Hayya Med Pro is purpose-built for GCC healthcare compliance â€” it knows that QCHP requires 80 CPD per 2 years (40/year minimum), that SCFHS requires 60 CME per year for physicians (30 for nurses), and that DHA has specific patient safety requirements. It applies these rules automatically.",
      },
    },
    {
      "@type": "Question",
      name: "What compliance reports can I generate for JCI or CBAHI audits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro generates bulk PDF compliance reports showing every staff member's CME credit total, compliance status, category breakdown, and license expiry. The report can be filtered by department and exported as a single PDF â€” ready to present to JCI or CBAHI auditors as evidence of staff compliance management.",
      },
    },
  ],
};

const COMPARISON_ROWS = [
  ["QCHP / SCFHS / DHA rules built in", "âŒ Manual work", "âœ… Automatic"],
  ["Annual minimum tracking (40/year QCHP)", "âŒ No", "âœ… Yes"],
  ["Profession-specific rules (60 vs 30 SCFHS)", "âŒ No", "âœ… Yes"],
  ["Staff compliance status at a glance", "âŒ No", "âœ… Yes"],
  ["Bulk PDF for JCI / CBAHI audits", "âŒ Manual", "âœ… One click"],
  ["Department grouping", "âŒ No", "âœ… Yes"],
  ["Weekly digest email to admin", "âŒ No", "âœ… Automatic"],
  ["Staff certificate storage", "âŒ No", "âœ… Encrypted"],
  ["License expiry reminders to staff", "âŒ No", "âœ… Automated"],
  ["Multi-authority (QCHP + SCFHS in one view)", "âŒ No", "âœ… Yes"],
];

const FEATURES = [
  {
    icon: "ðŸ“Š",
    title: "Real-time compliance grid",
    body: "See every staff member's CME progress, compliance status, and license expiry at a glance. Filterable by department, profession, or compliance status.",
    color: "#1a56a0",
  },
  {
    icon: "ðŸ“„",
    title: "One-click bulk PDF reports",
    body: "Generate a PDF compliance report for your entire team in seconds â€” formatted for QCHP, JCI, and CBAHI audit requirements.",
    color: "#16a34a",
  },
  {
    icon: "ðŸ“§",
    title: "Weekly compliance digest",
    body: "Every Monday, receive an automated email showing compliance changes, at-risk staff, and upcoming license renewals across your team.",
    color: "#7c3aed",
  },
  {
    icon: "ðŸ¥",
    title: "Department grouping",
    body: "Organise staff by department, ward, or specialty. See per-department compliance rates and identify which teams need immediate attention.",
    color: "#d97706",
  },
  {
    icon: "ðŸŒ",
    title: "All GCC authorities",
    body: "QCHP, SCFHS, DHA, DOH, NHRA, OMSB, and MOH Kuwait â€” all in one dashboard. Staff licensed in multiple countries are tracked separately per jurisdiction.",
    color: "#0891b2",
  },
  {
    icon: "ðŸ”’",
    title: "Privacy-first staff linking",
    body: "Staff link their own accounts. They control what compliance data is visible to you via privacy settings. Certificates are never accessed by the employer directly.",
    color: "#dc2626",
  },
];

const PLAN_TIERS = [
  { label: "Clinic", maxStaff: 10, monthly: 50 },
  { label: "Growth", maxStaff: 25, monthly: 100 },
  { label: "Department", maxStaff: 50, monthly: 180 },
  { label: "Hospital", maxStaff: 200, monthly: 350 },
];

export default function HealthcareComplianceSoftwarePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Header */}
      <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[#1a56a0] text-sm">
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/employers" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">
              Employer features
            </Link>
            <Link href="/login" className="text-sm text-[#64748b] hover:text-[#1a56a0]">
              Sign in
            </Link>
            <Link
              href="/request-demo"
              className="bg-[#1a56a0] text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Request demo
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <span className="inline-block bg-[#fff7ed] text-[#c2410c] text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-[#fed7aa]">
                For clinic admins, hospital HR, and medical directors
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111] mb-5 leading-tight">
                Healthcare compliance software built for the GCC
              </h1>
              <p className="text-lg text-[#475569] mb-8 max-w-2xl leading-relaxed">
                Stop chasing staff for CME certificates. Hayya Med Pro gives clinic and hospital
                teams a real-time compliance dashboard â€” QCHP, SCFHS, DHA, and all GCC authorities
                supported. From $50/month.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  "ðŸ‡¶ðŸ‡¦ QCHP â€” Qatar",
                  "ðŸ‡¸ðŸ‡¦ SCFHS â€” Saudi Arabia",
                  "ðŸ‡¦ðŸ‡ª DHA â€” Dubai",
                  "ðŸ‡¦ðŸ‡ª DOH â€” Abu Dhabi",
                  "+ 3 more GCC authorities",
                ].map((item) => (
                  <span key={item} className="text-xs font-medium text-[#374151] bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-full">
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/request-demo"
                  className="inline-block bg-[#1a56a0] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1547a0] transition-colors text-sm"
                >
                  Request a demo â†’
                </Link>
                <Link
                  href="/pricing#employer"
                  className="inline-block border border-[#e2e8f0] text-[#374151] font-medium px-8 py-3.5 rounded-xl hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors text-sm"
                >
                  See pricing â€” from $50/month
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why spreadsheets fail */}
        <section className="py-10 bg-[#fef2f2] border-y border-[#fecaca]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <blockquote className="text-center">
              <p className="text-base sm:text-lg font-semibold text-[#7f1d1d] mb-2">
                &ldquo;We found out two consultants had lapsed QCHP renewals during a JCI audit.&rdquo;
              </p>
              <p className="text-sm text-[#991b1b]">
                A common scenario when compliance is tracked by spreadsheet. Hayya Med Pro eliminates this risk.
              </p>
            </blockquote>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-14 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Spreadsheet vs Hayya Med Pro
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Purpose-built for GCC compliance â€” not a generic spreadsheet workaround.
            </p>
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide w-1/2"></th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Spreadsheet / HR system</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#1a56a0] uppercase tracking-wide bg-[#f0f7ff]">Hayya Med Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {COMPARISON_ROWS.map(([feature, manual, pro]) => (
                    <tr key={feature}>
                      <td className="px-6 py-3 text-sm text-[#374151]">{feature}</td>
                      <td className="px-4 py-3 text-center text-sm text-[#94a3b8]">{manual}</td>
                      <td className="px-4 py-3 text-center text-sm bg-[#f8fbff]">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="py-14 bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Everything a GCC clinic or hospital needs
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-10">
              Built around QCHP, SCFHS, DHA, and DOH requirements â€” not generic HR compliance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-5">
                  <span className="text-2xl block mb-3" aria-hidden>{f.icon}</span>
                  <h3 className="text-sm font-semibold text-[#111] mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing tiers */}
        <section className="py-14 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Simple pricing for any team size
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Employer admin&apos;s own Pro features included free. Save 15% annually.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {PLAN_TIERS.map((t) => (
                <div key={t.label} className="bg-white rounded-xl border border-[#e2e8f0] p-5 text-center">
                  <p className="text-xs font-semibold text-[#64748b] mb-0.5">{t.label}</p>
                  <p className="text-xs text-[#94a3b8] mb-3">Up to {t.maxStaff} staff</p>
                  <p className="text-2xl font-black text-[#111]">${t.monthly}</p>
                  <p className="text-xs text-[#94a3b8] mb-4">/month</p>
                  <Link
                    href="/request-demo"
                    className="block w-full text-center py-2 rounded-lg text-xs font-semibold bg-[#1a56a0] text-white hover:bg-[#154890] transition-colors"
                  >
                    Request demo
                  </Link>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#111]">Hospital group or government authority?</p>
                <p className="text-xs text-[#64748b] mt-0.5">Unlimited staff Â· HRIS API integration Â· White-label Â· Custom SLA</p>
              </div>
              <Link href="/request-demo" className="flex-shrink-0 text-sm font-semibold bg-[#f1f5f9] text-[#1a56a0] px-5 py-2 rounded-xl hover:bg-[#e2e8f0] transition-colors">
                Contact us for Enterprise â†’
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-b border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details key={faq.name} className="group border border-[#e2e8f0] rounded-xl overflow-hidden bg-white">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-[#f8fafc] transition-colors">
                    <span className="font-medium text-[#111] text-sm pr-4">{faq.name}</span>
                    <span className="text-[#64748b] flex-shrink-0 transition-transform duration-200 group-open:rotate-45 text-lg leading-none">+</span>
                  </summary>
                  <div className="px-5 pb-4 pt-2 text-sm text-[#475569] leading-relaxed bg-[#f8fafc] border-t border-[#f0f4f8]">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#0f1f3d]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              See Hayya Med Pro for your team
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm max-w-xl mx-auto">
              Clinics and hospital departments across Qatar and Saudi Arabia use Hayya Med Pro
              to manage staff CME compliance before QCHP and SCFHS renewal season.
              Request a demo and see the dashboard for your organisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/request-demo"
                className="bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Request a demo â†’
              </Link>
              <Link
                href="/employers"
                className="border border-[rgba(255,255,255,0.25)] text-white font-medium px-8 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                See all employer features
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
              Hayya Med Pro supports CME tracking and licensing readiness for GCC healthcare organisations.
              It does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or their relevant regulatory body.
            </p>
            <p className="text-xs text-[#94a3b8] text-center mt-2">
              <Link href="/employers" className="hover:text-[#64748b]">Employer features</Link>
              {" Â· "}
              <Link href="/pricing" className="hover:text-[#64748b]">Pricing</Link>
              {" Â· "}
              <Link href="/request-demo" className="hover:text-[#64748b]">Request demo</Link>
              {" Â· "}
              <Link href="/privacy" className="hover:text-[#64748b]">Privacy</Link>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
