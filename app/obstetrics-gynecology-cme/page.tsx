import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Obstetrics & Gynecology CME Requirements in GCC â€” OB/GYN CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for OB/GYN specialists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. ALSO and NRP mandatory. Track all requirements in one app.",
  keywords: [
    "obstetrics gynecology CME requirements GCC",
    "OB/GYN CME Saudi Arabia",
    "SCFHS obstetrics CME",
    "QCHP gynecology CPD",
    "obstetrics CME Qatar",
    "ALSO CME GCC",
    "NRP CME obstetrics",
    "OB GYN license renewal GCC",
    "gynecologist CME tracker",
    "ACOG CME recognised SCFHS",
    "maternal fetal medicine CME",
    "continuing medical education obstetrics",
  ],
  openGraph: {
    title: "Obstetrics & Gynecology CME Requirements in GCC â€” OB/GYN CME Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. ALSO & NRP mandatory. Track all GCC OB/GYN requirements in one app.",
    url: `${APP_URL}/obstetrics-gynecology-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=OB%2FGyn+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+ALSO+%26+NRP+mandatory+%C2%B7+Free+to+track&a=%F0%9F%A4%B1+OB%2FGyn&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/obstetrics-gynecology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an OB/GYN specialist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered obstetricians and gynaecologists must complete 60 CME credits per year. The Saudi Board of Obstetrics and Gynecology (SBOG) and the Saudi Society of Obstetrics and Gynecology (SSOG) are recognised accreditors. At least 20 credits should be in obstetrics- or gynaecology-specific activities.",
      },
    },
    {
      "@type": "Question",
      name: "Is ALSO (Advanced Life Support in Obstetrics) mandatory for QCHP CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP strongly recommends ALSO certification for licensed OB/GYN professionals. ALSO courses earn CPD credits and count toward the 80 CPD points required over a 2-year cycle. NRP (Neonatal Resuscitation Program) is also accepted and recommended for obstetricians managing deliveries.",
      },
    },
    {
      "@type": "Question",
      name: "Does laparoscopic surgery training count as CME for DHA-licensed OB/GYN specialists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. DHA-licensed OB/GYN specialists can claim CME credits for accredited surgical skills workshops including laparoscopic hysterectomy, hysteroscopy, and minimally invasive gynaecology courses. These typically count as hands-on or procedural CME and are capped at a percentage of total credits depending on the accreditor.",
      },
    },
    {
      "@type": "Question",
      name: "Are ACOG, FIGO, and RCOG conferences recognised for GCC CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ACOG (American College of Obstetricians and Gynecologists), FIGO (International Federation of Gynecology and Obstetrics), and RCOG (Royal College of Obstetricians and Gynaecologists) events are widely recognised by SCFHS and DHA. QCHP recognises events accredited by GCC authorities and international bodies on its approved list. Always verify with the relevant authority before attendance.",
      },
    },
    {
      "@type": "Question",
      name: "Can an OB/GYN specialist track CME for multiple GCC licenses simultaneously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-license tracking. OB/GYN specialists practising in Qatar (QCHP), Saudi Arabia (SCFHS), and Dubai (DHA) simultaneously can log activities against each license profile, with separate compliance status indicators for every renewal deadline.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",   note: "ALSO + NRP highly recommended" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia",  cycle: "60 CME / yr",     note: "SBOG & SSOG recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "Dubai",         cycle: "40 CME / 2 yr",   note: "Surgical skills credits accepted" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "Abu Dhabi",     cycle: "40 CPD / cycle",  note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",        cycle: "30 CME / yr",     note: "Ministry of Health approved" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",       cycle: "40 CPD / 2 yr",   note: "NHRA accredited events" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",          cycle: "40 CME / 2 yr",   note: "Oman Medical Specialty Board" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ†˜",
    title: "ALSO & NRP â€” Safety Essentials",
    body: "Advanced Life Support in Obstetrics (ALSO) and Neonatal Resuscitation Program (NRP) courses are recognised across all GCC authorities. Both earn CME/CPD credits and demonstrate clinical readiness. QCHP recommends renewal every 2â€“4 years.",
  },
  {
    icon: "ðŸ¥",
    title: "ACOG, FIGO & RCOG Recognition",
    body: "The ACOG Annual Clinical and Scientific Meeting, FIGO World Congress, and RCOG World Congress generate CME credits widely recognised by SCFHS and DHA. GCC-based events such as the Middle East Fertility Society (MEFS) annual congress are also accepted.",
  },
  {
    icon: "ðŸ”¬",
    title: "Minimally Invasive & Subspecialty CME",
    body: "Laparoscopic and hysteroscopic surgery workshops earn hands-on CME credits. Maternal-fetal medicine, reproductive endocrinology, and gynaecologic oncology subspecialty CME counts toward the annual requirement and demonstrates advanced practice development.",
  },
  {
    icon: "ðŸ“‹",
    title: "Audit, QI & Perinatal Review",
    body: "Perinatal mortality review, clinical audit of caesarean rates, and quality improvement projects are accepted by QCHP and DHA for up to 10 CPD/CME credits per cycle â€” valuable for OB/GYN specialists in academic hospital settings.",
  },
];

export default function ObstetricsGynecologyCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ¤± Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Obstetrics &amp; Gynecology CME<br />Requirements Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            ALSO &amp; NRP mandatory. Track every credit in one compliance dashboard.
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>OB/GYN CME Requirements by Authority</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>Verify current rules with your licensing authority before your renewal date.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "OB/GYN Notes"].map((h) => (
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>What GCC OB/GYN Specialists Need to Know</h2>
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>OB/GYN CME â€” Frequently Asked Questions</h2>
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
              { href: "/pediatrics-cme", label: "ðŸ‘¶ Pediatrics" },
              { href: "/anesthesia-cme", label: "ðŸ’‰ Anesthesia" },
              { href: "/emergency-medicine-cme", label: "ðŸš‘ Emergency Med" },
              { href: "/psychiatry-cme", label: "ðŸ§  Psychiatry" },
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
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Never miss an OB/GYN CME deadline</h2>
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
