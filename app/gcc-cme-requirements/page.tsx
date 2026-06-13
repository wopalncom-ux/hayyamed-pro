import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "GCC CME Requirements 2025 â€” All 7 Countries Compared | Hayya Med Pro",
  description:
    "Complete guide to CME and CPD requirements across all 7 GCC countries. Compare QCHP Qatar, SCFHS Saudi Arabia, DHA Dubai, DOH Abu Dhabi, MOH Kuwait, NHRA Bahrain, and OMSB Oman â€” credits, cycles, mandatory categories, and online caps.",
  keywords: [
    "GCC CME requirements",
    "GCC healthcare professional CME",
    "CME requirements Gulf countries",
    "QCHP SCFHS DHA CME comparison",
    "GCC doctor CME credits",
    "Gulf CME requirements 2025",
    "healthcare professional CPD GCC",
    "CME requirements Qatar Saudi UAE",
    "GCC medical license renewal CME",
    "continuing medical education GCC",
    "CPD requirements Gulf healthcare",
    "GCC CME credits by country",
  ],
  openGraph: {
    title: "GCC CME Requirements 2025 â€” All 7 Countries Compared",
    description:
      "QCHP Â· SCFHS Â· DHA Â· DOH Â· MOH Kuwait Â· NHRA Â· OMSB. Credits, cycles, online caps, and mandatory categories â€” all in one guide.",
    url: `${APP_URL}/gcc-cme-requirements`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=GCC+CME+Requirements+2025&s=7+countries+%C2%B7+7+authorities+%C2%B7+complete+comparison+guide&a=%F0%9F%8C%8D+All+GCC&k=Regional+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/gcc-cme-requirements` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do GCC healthcare professionals need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME/CPD requirements vary by country and authority: QCHP Qatar requires 80 CPD credits per 2-year cycle (minimum 40/year); SCFHS Saudi Arabia requires 60 CME credits per year; DHA Dubai requires 40 CME credits per 2-year cycle; DOH Abu Dhabi requires 30â€“50 CPD credits per cycle (by profession); MOH Kuwait requires 30 CME credits per year for physicians; NHRA Bahrain requires 40 CPD credits per 2-year cycle; OMSB Oman requires 40 CME credits per 2-year cycle for physicians.",
      },
    },
    {
      "@type": "Question",
      name: "Can a healthcare professional licensed in multiple GCC countries track all requirements in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-license tracking. Professionals holding licenses from QCHP, SCFHS, DHA, and other GCC authorities simultaneously can log CME activities against each license profile, with separate compliance dashboards and renewal deadline alerts for every authority.",
      },
    },
    {
      "@type": "Question",
      name: "Is the terminology CME or CPD in GCC countries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both terms are used. Qatar (QCHP), Bahrain (NHRA), and UAE Abu Dhabi (DOH) use CPD (Continuing Professional Development). Saudi Arabia (SCFHS), Dubai (DHA), Oman (OMSB), and Kuwait (MOH) primarily use CME (Continuing Medical Education). Hayya Med Pro handles both terminologies automatically based on your country selection.",
      },
    },
    {
      "@type": "Question",
      name: "Do GCC CME requirements differ by specialty?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. While base credit requirements are often the same across specialties within a country, mandatory activity types vary significantly. For example, ACLS is required for cardiologists, emergency physicians, and anaesthesiologists; radiation safety training is mandatory for radiologists; and ethics CPD is required for psychiatrists under QCHP. Hayya Med Pro tracks specialty-specific mandatory requirements separately.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC authority has the most CME credits requirement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP Qatar has the highest total credit requirement at 80 CPD credits per 2-year cycle (40 minimum per year), compared to SCFHS Saudi Arabia at 60 CME credits per year, DHA Dubai at 40 per 2 years, NHRA Bahrain and OMSB Oman at 40 per 2 years, and MOH Kuwait at 30 per year. On an annualized basis, SCFHS and QCHP have the highest requirements.",
      },
    },
  ],
};

const COUNTRIES = [
  {
    flag: "ðŸ‡¶ðŸ‡¦",
    name: "Qatar",
    authority: "QCHP",
    term: "CPD",
    credits: "80",
    cycle: "2 years",
    minPerYear: "40/yr",
    onlineCap: "50%",
    mandatory: "Patient safety (2+), ethics",
    href: "/qchp",
  },
  {
    flag: "ðŸ‡¸ðŸ‡¦",
    name: "Saudi Arabia",
    authority: "SCFHS",
    term: "CME",
    credits: "60",
    cycle: "Annual",
    minPerYear: "60/yr",
    onlineCap: "50%",
    mandatory: "Specialty-specific",
    href: "/scfhs",
  },
  {
    flag: "ðŸ‡¦ðŸ‡ª",
    name: "Dubai, UAE",
    authority: "DHA",
    term: "CME",
    credits: "40",
    cycle: "2 years",
    minPerYear: "20/yr",
    onlineCap: "50%",
    mandatory: "Patient safety (5+)",
    href: "/dha",
  },
  {
    flag: "ðŸ‡¦ðŸ‡ª",
    name: "Abu Dhabi, UAE",
    authority: "DOH",
    term: "CPD",
    credits: "30â€“50",
    cycle: "1â€“2 years",
    minPerYear: "Varies",
    onlineCap: "Varies",
    mandatory: "Profession-specific",
    href: "/doh",
  },
  {
    flag: "ðŸ‡°ðŸ‡¼",
    name: "Kuwait",
    authority: "MOH",
    term: "CME",
    credits: "30",
    cycle: "Annual",
    minPerYear: "30/yr",
    onlineCap: "30%",
    mandatory: "Physicians & pharmacists",
    href: "/moh-kuwait",
  },
  {
    flag: "ðŸ‡§ðŸ‡­",
    name: "Bahrain",
    authority: "NHRA",
    term: "CPD",
    credits: "40",
    cycle: "2 years",
    minPerYear: "20/yr",
    onlineCap: "50%",
    mandatory: "Structured CPD min",
    href: "/nhra",
  },
  {
    flag: "ðŸ‡´ðŸ‡²",
    name: "Oman",
    authority: "OMSB",
    term: "CME",
    credits: "40",
    cycle: "2 years",
    minPerYear: "20/yr",
    onlineCap: "20 credits",
    mandatory: "Category A minimum",
    href: "/omsb",
  },
];

const SPECIALTIES = [
  { icon: "â¤ï¸", title: "Cardiology",        href: "/cardiology-cme" },
  { icon: "ðŸ©º", title: "Internal Medicine",  href: "/internal-medicine-cme" },
  { icon: "ðŸš‘", title: "Emergency Med",      href: "/emergency-medicine-cme" },
  { icon: "ðŸ”ª", title: "Surgery",            href: "/surgery-cme" },
  { icon: "ðŸ‘¶", title: "Pediatrics",         href: "/pediatrics-cme" },
  { icon: "ðŸ©»", title: "Radiology",          href: "/radiology-cme" },
  { icon: "ðŸ§ ", title: "Psychiatry",         href: "/psychiatry-cme" },
  { icon: "ðŸ¤±", title: "OB / Gyn",          href: "/obstetrics-gynecology-cme" },
  { icon: "ðŸ’‰", title: "Anesthesia",         href: "/anesthesia-cme" },
  { icon: "ðŸ¦´", title: "Orthopedics",        href: "/orthopedics-cme" },
  { icon: "ðŸ¡", title: "Family Medicine",    href: "/family-medicine-cme" },
];

const PROFESSIONS = [
  { icon: "ðŸ©º", title: "Physicians",    href: "/physician-cme" },
  { icon: "ðŸ‘©â€âš•ï¸", title: "Nurses",       href: "/nurse-cpd" },
  { icon: "ðŸ’Š", title: "Pharmacists",   href: "/pharmacist-cme" },
  { icon: "ðŸ¦·", title: "Dentists",      href: "/dentist-cme" },
  { icon: "ðŸ¦¿", title: "Allied Health", href: "/allied-health-cpd" },
];

export default function GccCmeRequirementsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸŒ GCC CME Requirements â€” Complete Guide
          </p>
          <h1 style={{ fontSize: "clamp(30px,5vw,52px)", fontWeight: 800, lineHeight: 1.12, marginBottom: 20 }}>
            CME & CPD Requirements Across<br />All 7 GCC Countries
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 660, margin: "0 auto 32px" }}>
            QCHP Â· SCFHS Â· DHA Â· DOH Â· MOH Kuwait Â· NHRA Â· OMSB.
            Every country, every authority, every specialty â€” in one place.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/register"
              style={{ background: "#1a56a0", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}
            >
              Track my compliance free â†’
            </Link>
            <Link
              href="/countries"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}
            >
              Compare all countries
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section style={{ background: "#1a56a0", padding: "24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            { n: "7", label: "GCC Countries" },
            { n: "7", label: "Licensing Authorities" },
            { n: "11", label: "Specialty Guides" },
            { n: "5", label: "Profession Guides" },
            { n: "Free", label: "To get started" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>{s.n}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            GCC CME Requirements â€” Country Comparison
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, maxWidth: 700, margin: "0 auto 40px" }}>
            All figures as of 2025. Verify current requirements with your licensing authority before renewal.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
              <thead>
                <tr style={{ background: "#0f1f3d", color: "#fff" }}>
                  {["Country", "Authority", "Term", "Credits", "Cycle", "Per Year", "Online Cap", "Mandatory Categories"].map((h) => (
                    <th key={h} style={{ padding: "14px 12px", textAlign: "left", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map((c, i) => (
                  <tr key={c.authority} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "14px 12px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                      <Link href={c.href} style={{ textDecoration: "none", color: "#1a56a0" }}>{c.flag} {c.name}</Link>
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <Link href={c.href} style={{ textDecoration: "none", color: "#1a56a0", fontWeight: 600 }}>{c.authority}</Link>
                    </td>
                    <td style={{ padding: "14px 12px", color: "#374151" }}>{c.term}</td>
                    <td style={{ padding: "14px 12px", fontWeight: 700, color: "#1a56a0" }}>{c.credits}</td>
                    <td style={{ padding: "14px 12px", color: "#374151" }}>{c.cycle}</td>
                    <td style={{ padding: "14px 12px", color: "#374151" }}>{c.minPerYear}</td>
                    <td style={{ padding: "14px 12px", color: "#d97706", fontWeight: 600 }}>{c.onlineCap}</td>
                    <td style={{ padding: "14px 12px", color: "#64748b", fontSize: 13 }}>{c.mandatory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 16 }}>
            Source: QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, and OMSB official websites. Verify with each authority before renewal.
          </p>
        </div>
      </section>

      {/* Authority cards */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 12 }}>
            CME Requirements by Authority
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            Deep-dive guides for each licensing authority â€” requirements, activity types, accepted providers, and renewal steps.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {COUNTRIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 20px", textDecoration: "none", display: "block" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{c.flag}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: "#1a56a0", fontSize: 16, margin: 0 }}>{c.authority}</p>
                    <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>{c.name}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>{c.credits} {c.term}</span>
                  <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>{c.cycle}</span>
                </div>
                <p style={{ color: "#1a56a0", fontWeight: 600, fontSize: 13, marginTop: 12, marginBottom: 0 }}>Full guide â†’</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty grid */}
      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 12 }}>
            CME Requirements by Specialty
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            Specialty-specific mandatory activities, recognised accreditors, and GCC-specific notes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {SPECIALTIES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px", textAlign: "center", textDecoration: "none" }}
              >
                <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>{s.icon}</span>
                <p style={{ fontWeight: 600, color: "#1a56a0", fontSize: 13, margin: 0 }}>{s.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Profession grid */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 12 }}>
            CME Requirements by Profession
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            Profession-specific guides for all 7 GCC authorities.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {PROFESSIONS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 16px", textAlign: "center", textDecoration: "none" }}
              >
                <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{p.icon}</span>
                <p style={{ fontWeight: 600, color: "#1a56a0", fontSize: 14, margin: 0 }}>{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            GCC CME Requirements â€” Frequently Asked Questions
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

      {/* CTA */}
      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Track all 7 GCC authorities in one dashboard
          </h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            Free compliance tracking for QCHP, SCFHS, DHA, and every other GCC authority. Upgrade for PDF reports and AI gap analysis.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/register"
              style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}
            >
              Start tracking free â†’
            </Link>
            <Link
              href="/pricing"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "16px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16, display: "inline-block" }}
            >
              See pricing
            </Link>
          </div>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>No credit card required Â· Free plan always available</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB, or their relevant regulatory body.
        </p>
      </section>
    </>
  );
}
