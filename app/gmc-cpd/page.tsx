import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "GMC CPD Requirements UK â€” Doctor CPD Guide 2025 | Hayya Med Pro",
  description:
    "Complete guide to GMC CPD requirements for UK-licensed doctors. 50 CPD credits per year recommended. Revalidation every 5 years. Track your UK GMC CPD and GCC CME in one compliance dashboard.",
  keywords: [
    "GMC CPD requirements UK",
    "UK doctor CPD 2025",
    "GMC revalidation CPD",
    "general medical council CPD",
    "UK medical CPD tracker",
    "GMC CPD points",
    "doctor CPD portfolio UK",
    "GMC 50 CPD credits",
    "UK NHS doctor CME",
    "GMC revalidation requirements",
    "UK doctor continuing professional development",
    "GMC CPD app",
  ],
  openGraph: {
    title: "GMC CPD Requirements UK â€” Doctor CPD Guide 2025",
    description:
      "50 CPD credits per year Â· Revalidation every 5 years Â· Royal college CPD portfolio. Track UK GMC CPD and GCC CME in one app.",
    url: `${APP_URL}/gmc-cpd`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=GMC+CPD+Requirements+%E2%80%94+UK&s=50+CPD+credits%2Fyr+%C2%B7+Revalidation+every+5+years+%C2%B7+Free+to+track&a=%F0%9F%87%AC%F0%9F%87%A7+GMC&k=Authority+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/gmc-cpd` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do UK doctors need for GMC revalidation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The GMC does not mandate a specific annual CPD credit count but expects all licensed doctors to engage in regular CPD. Most royal colleges recommend approximately 50 CPD credits per year (250 credits over the 5-year revalidation cycle). The Royal College of Physicians, Royal College of Surgeons, RCGP, and RCOG all use a 50 credits/year standard. CPD must be recorded in your annual appraisal portfolio.",
      },
    },
    {
      "@type": "Question",
      name: "What counts as CPD for GMC revalidation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GMC-accepted CPD activities include: educational events (conferences, courses, e-learning modules), clinical experience (ward rounds, case reviews, simulation), reviewing performance (360-degree feedback, MSF, patient surveys), measuring outcomes (clinical audit, quality improvement), and teaching/supervision. All activities must be documented with evidence of learning and reflection.",
      },
    },
    {
      "@type": "Question",
      name: "How often do UK doctors need to revalidate with the GMC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UK doctors must revalidate every 5 years. Revalidation requires a recommendation from a Responsible Officer (usually via annual appraisal) supported by supporting information including CPD records. There is no formal pass/fail for CPD â€” the GMC expects engagement, reflection, and documentation rather than a credit count.",
      },
    },
    {
      "@type": "Question",
      name: "Can UK-trained doctors working in GCC use the same CPD activities for both GMC and QCHP/SCFHS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In many cases, yes. Activities from internationally recognised providers (AMA PRA, royal college-accredited events, RCPCH, RCOG) are often accepted by both GMC and GCC authorities such as QCHP and SCFHS. However, each authority has its own approved provider list and credit-counting rules. Hayya Med Pro tracks both GMC CPD and GCC CME simultaneously, letting you log one activity against multiple profiles.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a GMC-approved CPD tracking app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The GMC does not endorse a specific CPD tracking app, but accepts CPD documented in any structured portfolio (royal college ePortfolios, NHS appraisal systems, or third-party tools). Hayya Med Pro supports UK GMC CPD tracking and is particularly useful for doctors who are also licensed in one or more GCC countries, allowing all compliance requirements to be tracked in a single dashboard.",
      },
    },
  ],
};

const CPD_CATEGORIES = [
  { icon: "ðŸŽ“", title: "Educational Events", desc: "Conferences, courses, workshops, grand rounds, e-learning modules. Typically earn 1 credit per hour. Most flexible category." },
  { icon: "ðŸ”¬", title: "Clinical Experience", desc: "Case reviews, ward rounds, clinical simulation, procedures. Documents active clinical engagement. Up to 20% of annual CPD." },
  { icon: "ðŸ“Š", title: "Reviewing Performance", desc: "360-degree feedback (MSF), patient surveys, colleague feedback. Required for revalidation portfolio." },
  { icon: "ðŸ“ˆ", title: "Measuring Outcomes", desc: "Clinical audit, quality improvement projects, significant event analysis. Demonstrates impact on patient care." },
  { icon: "ðŸ“š", title: "Self-Directed Learning", desc: "Journal reading, research, guided self-reflection. Must include evidence of learning â€” not just reading time." },
  { icon: "ðŸ‘¨â€ðŸ«", title: "Teaching & Supervision", desc: "Supervising trainees, developing educational material, examiner roles. Recognised by all major UK royal colleges." },
];

const KEY_DATES = [
  { label: "Revalidation cycle", value: "Every 5 years" },
  { label: "Annual appraisal", value: "1 per year (mandatory)" },
  { label: "CPD recommended", value: "50 credits/year" },
  { label: "Revalidation cycle total", value: "250 credits / 5 yr" },
  { label: "Online CPD cap", value: "No fixed cap" },
  { label: "Responsible Officer sign-off", value: "Required" },
];

export default function GmcCpdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ‡¬ðŸ‡§ Authority Guide â€” United Kingdom
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            GMC CPD Requirements<br />for UK Doctors â€” 2025
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            50 CPD credits per year Â· 5-year revalidation cycle.
            Track UK GMC CPD and GCC CME in one compliance dashboard.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              Start tracking free â†’
            </Link>
            <Link href="/pricing" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              View plans
            </Link>
          </div>
        </div>
      </section>

      {/* Key dates summary */}
      <section style={{ background: "#1a56a0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, textAlign: "center" }}>
          {KEY_DATES.map((k) => (
            <div key={k.label}>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>{k.value}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: 0 }}>{k.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            GMC CPD â€” What UK Doctors Need to Know
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, maxWidth: 680, margin: "0 auto 40px" }}>
            The General Medical Council expects all licensed doctors to engage in regular CPD as part of the annual appraisal and 5-year revalidation process.
          </p>
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 32px", border: "1px solid #e2e8f0", marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>How GMC CPD works</h3>
            <ol style={{ paddingLeft: 20, color: "#64748b", lineHeight: 2, fontSize: 15 }}>
              <li>Engage in CPD activities throughout the year (target ~50 credits)</li>
              <li>Document activities with evidence of learning and personal reflection</li>
              <li>Discuss CPD at your annual appraisal with your Appraiser</li>
              <li>Appraiser submits Form R and supporting information each year</li>
              <li>After 5 years, your Responsible Officer recommends revalidation to the GMC</li>
              <li>GMC grants a new licence to practise for 5 more years</li>
            </ol>
          </div>
          <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 10, padding: "16px 20px" }}>
            <p style={{ color: "#92400e", fontSize: 14, margin: 0 }}>
              <strong>Also licensed in GCC?</strong> Many UK-trained doctors practise in Qatar, Saudi Arabia, or UAE. Hayya Med Pro tracks GMC CPD alongside QCHP, SCFHS, and DHA requirements â€” in one dashboard, with separate deadlines for each authority.
            </p>
          </div>
        </div>
      </section>

      {/* CPD categories */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            Accepted CPD Activity Categories
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            All activity types recognised by major UK royal colleges and the GMC revalidation framework.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {CPD_CATEGORIES.map((c) => (
              <div key={c.title} style={{ background: "#f8fafc", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{c.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            GMC CPD â€” Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqLd.mainEntity.map((q) => (
              <div key={q.name} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{q.name}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GCC cross-links */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 12 }}>
            Also practising in the GCC?
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>
            UK-trained doctors frequently work in Qatar, Saudi Arabia, and UAE. Each authority has different CME/CPD requirements.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {[
              { href: "/qchp", label: "ðŸ‡¶ðŸ‡¦ QCHP Qatar" },
              { href: "/scfhs", label: "ðŸ‡¸ðŸ‡¦ SCFHS Saudi" },
              { href: "/dha", label: "ðŸ‡¦ðŸ‡ª DHA Dubai" },
              { href: "/doh", label: "ðŸ‡¦ðŸ‡ª DOH Abu Dhabi" },
              { href: "/nhra", label: "ðŸ‡§ðŸ‡­ NHRA Bahrain" },
              { href: "/omsb", label: "ðŸ‡´ðŸ‡² OMSB Oman" },
              { href: "/ahpra-cpd", label: "ðŸ‡¦ðŸ‡º AHPRA Australia" },
              { href: "/gcc-cme-requirements", label: "ðŸŒ All GCC" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 13 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Track your GMC CPD â€” and your GCC CME</h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            One dashboard for UK revalidation CPD and every GCC licensing authority. Free to start.
          </p>
          <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}>
            Start tracking free â†’
          </Link>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>No credit card required Â· 14-day Pro trial included</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med PRO supports CME/CPD tracking and licensing readiness. It does not issue licences and does not replace official GMC or royal college requirements. Always verify final requirements with the General Medical Council (gmc-uk.org) and your relevant royal college.
        </p>
      </section>
    </>
  );
}
