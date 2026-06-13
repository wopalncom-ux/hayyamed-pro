import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Anesthesia CME Requirements in GCC â€” Anaesthesiologist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for anaesthesiologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. ACLS mandatory. Track all requirements in one compliance app.",
  keywords: [
    "anesthesia CME requirements GCC",
    "anaesthesiologist CME Saudi Arabia",
    "SCFHS anesthesia CME",
    "QCHP anaesthesiology CPD",
    "anesthesia CME Qatar",
    "ACLS mandatory anaesthesiologist GCC",
    "simulation CME anesthesia",
    "anesthesiology license renewal GCC",
    "WFSA CME recognised SCFHS",
    "anesthesia CME tracker",
    "continuing medical education anesthesiology",
    "anaesthesia CPD GCC",
  ],
  openGraph: {
    title: "Anesthesia CME Requirements in GCC â€” Anaesthesiologist CME Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. ACLS mandatory. Track all GCC anaesthesia requirements in one app.",
    url: `${APP_URL}/anesthesia-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Anesthesia+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+ACLS+mandatory+%C2%B7+Free+to+track&a=%F0%9F%92%89+Anesthesia&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/anesthesia-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an anaesthesiologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered anaesthesiologists must complete 60 CME credits per year. The Saudi Board of Anesthesiology (SBA) and Saudi Society of Anaesthesiologists (SSA) are recognised accreditors. At least 20 credits should be in anaesthesia-specific activities, including at least one patient safety or quality improvement activity per cycle.",
      },
    },
    {
      "@type": "Question",
      name: "Is ACLS certification required for QCHP CPD renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ACLS (Advanced Cardiovascular Life Support) certification is required for all anaesthesiologists licensed with QCHP. ACLS renewal courses earn CPD credits and are a prerequisite for licence renewal. QCHP recommends ACLS renewal every 2 years, aligning with the standard certification validity period.",
      },
    },
    {
      "@type": "Question",
      name: "Does simulation-based anaesthesia training count as CME for DHA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. DHA recognises simulation-based CME for anaesthesiologists, including high-fidelity simulator training, crisis resource management (CRM) workshops, and regional anaesthesia simulation courses. These typically earn 2â€“8 CME credits per session depending on duration and accreditor.",
      },
    },
    {
      "@type": "Question",
      name: "Are WFSA, ESA, and ASA conferences recognised for GCC anaesthesia CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WFSA (World Federation of Societies of Anaesthesiologists), ESA (European Society of Anaesthesiology), and ASA (American Society of Anesthesiologists) events are widely recognised by SCFHS and DHA. The Arab Society of Regional Anaesthesia (ASRA-Arabia) annual meeting is particularly relevant for GCC anaesthesiologists.",
      },
    },
    {
      "@type": "Question",
      name: "Can an anaesthesiologist track CME across multiple GCC licences in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-licence tracking. Anaesthesiologists holding QCHP, SCFHS, and DHA licences can log CME activities against each licence profile simultaneously, with separate compliance dashboards and renewal deadline alerts for every authority.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",   note: "ACLS required Â· simulation credits accepted" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia",  cycle: "60 CME / yr",     note: "SBA & SSA recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "Dubai",         cycle: "40 CME / 2 yr",   note: "Simulation CME recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "Abu Dhabi",     cycle: "40 CPD / cycle",  note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",        cycle: "30 CME / yr",     note: "Ministry of Health approved" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",       cycle: "40 CPD / 2 yr",   note: "NHRA accredited events" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",          cycle: "40 CME / 2 yr",   note: "Oman Medical Specialty Board" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ’“",
    title: "ACLS â€” Required, Not Optional",
    body: "ACLS certification is a prerequisite for anaesthesiology licence renewal with QCHP and is strongly recommended by SCFHS. Each ACLS renewal course earns CPD/CME credits. Providers include AHA-certified centres across all GCC countries.",
  },
  {
    icon: "ðŸŽ®",
    title: "Simulation & PBLD Recognised",
    body: "Problem-Based Learning Discussions (PBLDs) and high-fidelity simulation workshops are accepted by SCFHS and DHA for CME credits. Crisis resource management (CRM) courses, regional anaesthesia workshops, and airway management simulation count as hands-on CME.",
  },
  {
    icon: "ðŸŒ",
    title: "WFSA, ESA & ASA Events",
    body: "Major international anaesthesia society conferences (WFSA World Congress, ESAIC Euroanaesthesia, ASA Annual Meeting) are recognised by SCFHS and DHA. The Arab Society of Regional Anaesthesia (ASRA-Arabia) annual meeting is the premier GCC-focused event.",
  },
  {
    icon: "ðŸ›¡ï¸",
    title: "Patient Safety â€” Mandatory Category",
    body: "QCHP requires at least 5 CPD credits in patient safety per 2-year cycle. For anaesthesiologists, this includes adverse event reporting, critical incident reviews, difficult airway management training, and malignant hyperthermia management courses.",
  },
];

export default function AnesthesiaCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ’‰ Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Anaesthesia CME Requirements<br />Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            ACLS mandatory. Track every credit in one compliance dashboard.
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

      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>Anaesthesia CME Requirements by Authority</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>Verify current rules with your licensing authority before your renewal date.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Anaesthesia Notes"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AUTHORITIES.map((a, i) => (
                  <tr key={a.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a" }}>{a.flag} {a.name}</td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>{a.country}</td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>{a.cycle}</td>
                    <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 14 }}>{a.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>What GCC Anaesthesiologists Need to Know</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {SPECIALTY_NOTES.map((n) => (
              <div key={n.title} style={{ background: "#f8fafc", borderRadius: 12, padding: 28, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{n.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{n.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 15 }}>{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>Anaesthesia CME â€” Frequently Asked Questions</h2>
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

      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 40 }}>More CME Specialty Guides</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { href: "/cardiology-cme", label: "â¤ï¸ Cardiology" },
              { href: "/surgery-cme", label: "ðŸ”ª Surgery" },
              { href: "/emergency-medicine-cme", label: "ðŸš‘ Emergency Med" },
              { href: "/obstetrics-gynecology-cme", label: "ðŸ¤± OB/Gyn" },
              { href: "/orthopedics-cme", label: "ðŸ¦´ Orthopedics" },
              { href: "/radiology-cme", label: "ðŸ©» Radiology" },
              { href: "/physician-cme", label: "ðŸ‘¨â€âš•ï¸ All Physicians" },
              { href: "/nurse-cpd", label: "ðŸ‘©â€âš•ï¸ Nursing CPD" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 14 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Never miss an anaesthesia CME deadline</h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>Track QCHP, SCFHS, DHA, and 4 more authorities in one compliance dashboard. Free to start.</p>
          <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}>
            Start tracking free â†’
          </Link>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>No credit card required Â· Free plan always available</p>
        </div>
      </section>

      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with their relevant regulatory body.
        </p>
      </section>
    </>
  );
}
