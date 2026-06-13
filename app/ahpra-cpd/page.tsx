import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "AHPRA CPD Requirements Australia â€” Doctor & Healthcare Professional CPD Guide 2025 | Hayya Med Pro",
  description:
    "Complete guide to AHPRA CPD requirements for Australian healthcare professionals. Medical practitioners need 50 CPD hours per year from 2023. Track AHPRA CPD and GCC CME in one compliance app.",
  keywords: [
    "AHPRA CPD requirements 2025",
    "Australian doctor CPD",
    "Medical Board Australia CPD",
    "AHPRA 50 hours CPD",
    "Australian medical practitioner CPD",
    "AHPRA CPD tracker app",
    "Medical Board Australia CPD framework",
    "AHPRA registration renewal CPD",
    "Australian healthcare professional CPD",
    "AHPRA CPD portfolio",
    "Australia doctor continuing professional development",
    "AHPRA CPD hours",
  ],
  openGraph: {
    title: "AHPRA CPD Requirements Australia â€” 2025 Framework",
    description:
      "50 CPD hours/year Â· 4 domains Â· Annual declaration. Track AHPRA CPD and GCC CME requirements in one compliance dashboard.",
    url: `${APP_URL}/ahpra-cpd`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=AHPRA+CPD+Requirements+%E2%80%94+Australia&s=50+CPD+hours%2Fyr+%C2%B7+4+domains+%C2%B7+Annual+declaration&a=%F0%9F%87%A6%F0%9F%87%BA+AHPRA&k=Authority+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/ahpra-cpd` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD hours do Australian doctors need under the new AHPRA framework?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "From 1 January 2023, all registered medical practitioners in Australia must complete a minimum of 50 CPD hours per year. These must span four domains: educational activities (minimum 12.5 hours), reviewing performance (minimum 12.5 hours), measuring outcomes (minimum 12.5 hours), and other CPD activities (remaining hours). This replaces the previous framework of 25 hours per year and 5 self-directed hours.",
      },
    },
    {
      "@type": "Question",
      name: "What are the 4 CPD domains under the Australian Medical Board (AHPRA) framework?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Medical Board of Australia CPD framework has four domains: (1) Educational activities â€” conferences, courses, online modules, workshops (min 12.5 hours); (2) Reviewing performance â€” peer review, MSF, clinical audit with feedback (min 12.5 hours); (3) Measuring outcomes â€” clinical audit, QI projects, data-driven review (min 12.5 hours); (4) Other CPD activities â€” teaching, mentoring, research, self-directed learning (remaining hours). The minimum in each of the first three domains is mandatory.",
      },
    },
    {
      "@type": "Question",
      name: "Do Australian doctors need to submit CPD records to AHPRA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. From 2023, medical practitioners must make an annual CPD declaration as part of their registration renewal. You declare that you have completed the required CPD and that it is documented in a portfolio. AHPRA does not review CPD records routinely but may audit them. Records must be kept for at least 3 years. Your college or CPD home can provide compliance certificates if you are audited.",
      },
    },
    {
      "@type": "Question",
      name: "What is a CPD home under the AHPRA framework?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A CPD home is an organisation that provides CPD for medical practitioners and verifies compliance. Most doctors' CPD home is their medical college (e.g., RACGP, RACP, RACS, RANZCOG). From 2023, all practitioners must have a CPD home and their CPD home verifies their compliance with the 50-hour framework. Specialists typically enroll with their college as CPD home.",
      },
    },
    {
      "@type": "Question",
      name: "Can Australian doctors working in GCC countries track both AHPRA and GCC CME requirements together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-authority tracking. Australian-trained doctors holding AHPRA registration alongside QCHP (Qatar), SCFHS (Saudi Arabia), or DHA (Dubai) licences can track all requirements in one dashboard. Many activities from international conferences (such as those accredited by RACP, AMA, or RACGP) are accepted by both AHPRA and GCC authorities.",
      },
    },
  ],
};

const DOMAINS = [
  {
    icon: "ðŸŽ“",
    title: "Educational Activities",
    min: "Min 12.5 hrs",
    desc: "Conferences, courses, workshops, online modules, journal clubs, grand rounds. Accredited and non-accredited activities both count.",
    color: "#dbeafe",
    textColor: "#1d4ed8",
  },
  {
    icon: "ðŸªž",
    title: "Reviewing Performance",
    min: "Min 12.5 hrs",
    desc: "Peer review, multi-source feedback (MSF), patient experience surveys, audit with external feedback on your own practice.",
    color: "#dcfce7",
    textColor: "#15803d",
  },
  {
    icon: "ðŸ“Š",
    title: "Measuring Outcomes",
    min: "Min 12.5 hrs",
    desc: "Clinical audit against standards, quality improvement projects, morbidity and mortality review, structured data analysis of patient outcomes.",
    color: "#fef9c3",
    textColor: "#92400e",
  },
  {
    icon: "ðŸ“š",
    title: "Other CPD Activities",
    min: "Remaining hrs",
    desc: "Teaching, supervision, mentoring, research, self-directed reading, case preparation, non-accredited e-learning. Flexible to meet 50-hour total.",
    color: "#fce7f3",
    textColor: "#9d174d",
  },
];

export default function AhpraCpdPage() {
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
            ðŸ‡¦ðŸ‡º Authority Guide â€” Australia
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            AHPRA CPD Requirements<br />for Australian Doctors â€” 2025
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 640, margin: "0 auto 32px" }}>
            50 CPD hours per year Â· 4 mandatory domains Â· Annual registration declaration.
            New framework active from 1 January 2023.
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

      {/* Stats bar */}
      <section style={{ background: "#1a56a0", padding: "28px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            { n: "50", label: "CPD hours / year" },
            { n: "4", label: "Mandatory domains" },
            { n: "12.5h", label: "Min per domain (Ã—3)" },
            { n: "Annual", label: "Declaration cycle" },
            { n: "3 yrs", label: "Records retention" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>{s.n}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Domains */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            The 4 AHPRA CPD Domains
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, maxWidth: 660, margin: "0 auto 40px" }}>
            The Medical Board of Australia framework requires a minimum of 12.5 hours in each of the first three domains. The fourth domain is flexible.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {DOMAINS.map((d) => (
              <div key={d.title} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{d.icon}</div>
                <span style={{ background: d.color, color: d.textColor, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "inline-block", marginBottom: 10 }}>{d.min}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{d.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            AHPRA CPD â€” Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqLd.mainEntity.map((q) => (
              <div key={q.name} style={{ background: "#f8fafc", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{q.name}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GCC cross-links */}
      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 12 }}>
            Also licensed in GCC or UK?
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>
            Many Australian-trained doctors work in Qatar, UAE, and Saudi Arabia. Hayya Med Pro tracks both AHPRA and GCC requirements in one dashboard.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {[
              { href: "/qchp", label: "ðŸ‡¶ðŸ‡¦ QCHP Qatar" },
              { href: "/scfhs", label: "ðŸ‡¸ðŸ‡¦ SCFHS Saudi" },
              { href: "/dha", label: "ðŸ‡¦ðŸ‡ª DHA Dubai" },
              { href: "/doh", label: "ðŸ‡¦ðŸ‡ª DOH Abu Dhabi" },
              { href: "/gmc-cpd", label: "ðŸ‡¬ðŸ‡§ GMC UK" },
              { href: "/nmc-india-cme", label: "ðŸ‡®ðŸ‡³ NMC India" },
              { href: "/gcc-cme-requirements", label: "ðŸŒ All GCC" },
              { href: "/physician-cme", label: "ðŸ©º Physician CME" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 13 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Track AHPRA CPD â€” and your GCC CME</h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            50 hours, 4 domains, annual declaration â€” plus any GCC authority you hold. All in one dashboard, free to start.
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
          Hayya Med PRO supports CPD tracking and licensing readiness. It does not issue registrations and does not replace official AHPRA or Medical Board of Australia requirements. Always verify final requirements at ahpra.gov.au and with your CPD home (medical college).
        </p>
      </section>
    </>
  );
}
