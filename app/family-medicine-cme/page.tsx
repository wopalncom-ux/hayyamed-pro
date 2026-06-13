import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Family Medicine CME Requirements in GCC â€” GP & Family Physician CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for family medicine physicians and GPs in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Broadest CME scope. Track all requirements in one app.",
  keywords: [
    "family medicine CME requirements GCC",
    "GP CME Saudi Arabia",
    "SCFHS family physician CME",
    "QCHP family medicine CPD",
    "general practitioner CME Qatar",
    "family medicine CME tracker",
    "WONCA CME recognised GCC",
    "GP license renewal Saudi Arabia",
    "primary care CME GCC",
    "continuing medical education family medicine",
    "RCGP CME recognised SCFHS",
    "family medicine CPD GCC",
  ],
  openGraph: {
    title: "Family Medicine CME Requirements in GCC â€” GP & Family Physician CME Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. Broadest CME scope in medicine. Track all GCC family medicine requirements in one app.",
    url: `${APP_URL}/family-medicine-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Family+Medicine+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+broadest+CME+scope+%C2%B7+Free+to+track&a=%F0%9F%8F%A1+Family+Medicine&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/family-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a family physician need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered family physicians must complete 60 CME credits per year. The Saudi Board of Family Medicine and the Saudi Society of Family and Community Medicine (SSFCM) are recognised accreditors. Family medicine has the broadest accepted CME scope â€” activities from most clinical areas count, making it easier to accumulate credits across practice.",
      },
    },
    {
      "@type": "Question",
      name: "What CPD activities count for a GP licensed with QCHP in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP-licensed GPs and family physicians can claim CPD for a wide range of activities: accredited conferences and workshops, online e-learning modules, clinical audits, case-based discussions, journal club participation, and quality improvement projects. At least 5 CPD credits must be in patient safety per 2-year cycle.",
      },
    },
    {
      "@type": "Question",
      name: "What are the DHA CME requirements for family medicine in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA-licensed family physicians must complete 40 CME credits per 2-year renewal cycle. At least 5 credits should be in patient safety and at least 5 in clinical practice. Online CME is accepted up to 50% of total credits. DHA publishes a list of approved CME providers and recognised international events.",
      },
    },
    {
      "@type": "Question",
      name: "Are WONCA, RCGP, and AAFP events recognised for GCC family medicine CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WONCA (World Organization of Family Doctors) World Conference, RCGP (Royal College of General Practitioners) Annual Conference, and AAFP (American Academy of Family Physicians) events are widely recognised by SCFHS and DHA. The Gulf and Middle East Association of Family and Community Medicine (GULFMENA-FCM) meetings are the most relevant GCC-specific events.",
      },
    },
    {
      "@type": "Question",
      name: "Does preventive care and health promotion training count as CME for family physicians?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Preventive care, health screening, chronic disease management, diabetes education, and health promotion training all count as CME for family physicians across QCHP, SCFHS, and DHA. These topics are particularly valued as family medicine sits at the front line of the GCC's non-communicable disease prevention programmes.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",   note: "Broadest scope Â· preventive care counts" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia",  cycle: "60 CME / yr",     note: "SSFCM & SBFM recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "Dubai",         cycle: "40 CME / 2 yr",   note: "50% online cap Â· patient safety required" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "Abu Dhabi",     cycle: "40 CPD / cycle",  note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",        cycle: "30 CME / yr",     note: "Ministry of Health approved" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",       cycle: "40 CPD / 2 yr",   note: "NHRA accredited events" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",          cycle: "40 CME / 2 yr",   note: "Oman Medical Specialty Board" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸŒ¿",
    title: "Broadest CME Scope in Medicine",
    body: "Family medicine has the most flexible CME landscape of any specialty. Activities across most clinical domains count â€” from cardiology updates to paediatric screening, mental health first aid to dermatology workshops. This makes accumulating CME credits more achievable for busy GPs.",
  },
  {
    icon: "ðŸŒ",
    title: "WONCA, RCGP & GULFMENA-FCM",
    body: "WONCA World Conference, RCGP Annual Conference, and the Gulf and Middle East Association of Family and Community Medicine (GULFMENA-FCM) annual meeting are the premier events. SCFHS and DHA recognise credits from all three. The Saudi Society of Family and Community Medicine (SSFCM) annual congress is the top GCC-specific choice.",
  },
  {
    icon: "ðŸ«€",
    title: "Chronic Disease & NCD Management",
    body: "With GCC countries facing high rates of diabetes, hypertension, and obesity, CME in non-communicable disease management is highly valued by QCHP and SCFHS. Diabetes educator certifications, cardiovascular risk management courses, and obesity medicine training all earn recognised credits.",
  },
  {
    icon: "ðŸ”¬",
    title: "QI, Audit & Online CME",
    body: "Quality improvement projects, clinical audit cycles, and peer case review all earn CME credits for family physicians. Online e-learning is accepted up to 50% of total credits by DHA and SCFHS, making it practical for GPs in high-volume clinics to accumulate credits flexibly.",
  },
];

export default function FamilyMedicineCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ¡ Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Family Medicine CME Requirements<br />Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            The broadest CME scope in medicine. Track every credit in one dashboard.
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>Family Medicine CME Requirements by Authority</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>Verify current rules with your licensing authority before your renewal date.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Family Medicine Notes"].map((h) => (
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>What GCC Family Physicians Need to Know</h2>
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>Family Medicine CME â€” Frequently Asked Questions</h2>
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
              { href: "/internal-medicine-cme", label: "ðŸ©º Internal Med" },
              { href: "/cardiology-cme", label: "â¤ï¸ Cardiology" },
              { href: "/pediatrics-cme", label: "ðŸ‘¶ Pediatrics" },
              { href: "/psychiatry-cme", label: "ðŸ§  Psychiatry" },
              { href: "/obstetrics-gynecology-cme", label: "ðŸ¤± OB/Gyn" },
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
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Never miss a family medicine CME deadline</h2>
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
