import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Ophthalmology CME Requirements in GCC â€” Ophthalmologist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for ophthalmologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Surgical simulation, phacoemulsification, and LASIK courses count. Track all 7 authorities.",
  keywords: [
    "ophthalmology CME requirements GCC",
    "ophthalmologist CME Saudi Arabia",
    "SCFHS ophthalmology CME",
    "QCHP ophthalmologist CPD",
    "ophthalmology CPD Qatar",
    "cataract surgery CME GCC",
    "LASIK training CME ophthalmology",
    "ophthalmologist license renewal GCC",
    "AAO ICO CME recognition GCC",
    "continuing medical education ophthalmology",
    "GCC ophthalmologist compliance",
    "vitreoretinal CME GCC",
  ],
  openGraph: {
    title: "Ophthalmology CME Requirements in GCC â€” Ophthalmologist Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. Surgical simulation + phaco + LASIK count. Track all GCC ophthalmology requirements.",
    url: `${APP_URL}/ophthalmology-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Ophthalmology+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+surgical+simulation+%C2%B7+Free+to+track&a=%F0%9F%91%81+Ophthalmology&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/ophthalmology-cme` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "CME by Specialty", item: `${APP_URL}/physician-cme` },
    { "@type": "ListItem", position: 3, name: "Ophthalmology CME", item: `${APP_URL}/ophthalmology-cme` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an ophthalmologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered ophthalmologists must complete 60 CME credits per year. Events accredited by the Saudi Ophthalmological Society (SOS), International Council of Ophthalmology (ICO), American Academy of Ophthalmology (AAO), European Society of Ophthalmology (SOE), and World Ophthalmology Congress (WOC) are recognised. Surgical skills workshops â€” including phacoemulsification, LASIK, and vitreoretinal simulation â€” count as clinical credits.",
      },
    },
    {
      "@type": "Question",
      name: "Does phacoemulsification (cataract surgery) training count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accredited phacoemulsification courses, wet lab surgical simulation, and cataract surgery masterclasses count as clinical CME across QCHP, SCFHS, and DHA under the procedural competency category. Courses from the International Council of Ophthalmology (ICO) and AAO Skills Transfer Laboratory are widely recognised. Wet lab courses typically earn 1.5â€“3.0 CME credits per session.",
      },
    },
    {
      "@type": "Question",
      name: "Does LASIK certification and refractive surgery training count as CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accredited LASIK and refractive surgery training courses â€” including femtosecond laser platforms, SMILE procedure training, and excimer laser certification â€” count as clinical CME when offered by an approved provider. QCHP and SCFHS recognise these under the clinical skills or procedural competency category. Many GCC hospitals also require documented laser certification for clinical privileges.",
      },
    },
    {
      "@type": "Question",
      name: "Are AAO and ICO meetings recognised for CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AAO Annual Meeting (AMA-PRA Category 1 credits) and ICO World Congress of Ophthalmology (ICO CME credits) are recognised by QCHP, SCFHS, and DHA. Retain your certificate of attendance listing credit hours and the accrediting body. Both authorities accept AMA-PRA Category 1 and ICO CME credits. The European Society of Ophthalmology (SOE) uses EACCME credits, which are also accepted.",
      },
    },
    {
      "@type": "Question",
      name: "Can an ophthalmologist track CME for both QCHP and SCFHS licences simultaneously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction tracking. Ophthalmologists with both QCHP (Qatar) and SCFHS (Saudi Arabia) licences can maintain separate compliance wallets within one account. Each wallet tracks independently â€” separate credit totals, cycle dates, and compliance status â€” so nothing falls through the cracks at renewal time.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",  note: "Ethics CPD mandatory (â‰¥5 credits)" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", cycle: "60 CME / yr",    note: "SOS, ICO, AAO, SOE recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "UAE (Dubai)",  cycle: "40 CME / 2 yr",  note: "5 patient safety credits mandatory" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "UAE (Abu Dhabi)", cycle: "40 CPD / cycle", note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",       cycle: "30 CME / yr",    note: "Annual renewal, 30% online cap" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",      cycle: "40 CPD / 2 yr",  note: "Structured + unstructured split" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",         cycle: "40 CME / 2 yr",  note: "Category A & B framework" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ”­",
    title: "Surgical simulation counts",
    body: "Phacoemulsification wet labs, vitreoretinal simulation courses, LASIK and SMILE training programmes, and corneal transplant workshops all count as clinical CME across GCC authorities. Wet lab sessions often earn the highest credit weights.",
  },
  {
    icon: "ðŸ©º",
    title: "OCT & imaging workshops",
    body: "Accredited optical coherence tomography (OCT) interpretation courses, fundus photography workshops, fluorescein angiography training, and retinal imaging CME count as clinical CME in QCHP and SCFHS â€” increasingly relevant as imaging platforms advance.",
  },
  {
    icon: "ðŸ‘",
    title: "Saudi Ophthalmological Society (SOS)",
    body: "SOS-accredited events are the primary SCFHS-recognised CME source for ophthalmologists in Saudi Arabia. The annual SOS meeting typically offers 15â€“25 CME credits. SOS membership provides access to additional CME activities throughout the year.",
  },
  {
    icon: "ðŸŒ",
    title: "Paediatric ophthalmology & strabismus",
    body: "Paediatric ophthalmology workshops, strabismus surgery simulation, and amblyopia management CME count as specialty clinical CME and are increasingly required for ophthalmologists with paediatric practice in GCC hospitals.",
  },
];

export default function OphthalmologyCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ‘ Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Ophthalmology CME Requirements<br />Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            Surgical simulation, phacoemulsification, and LASIK training all count.
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

      {/* Requirements Table */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            Ophthalmology CME Requirements by Authority
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            General physician requirements apply to ophthalmologists. Verify current rules with your licensing authority.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Ophthalmology Notes"].map((h) => (
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

      {/* Specialty Notes */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            What GCC Ophthalmologists Need to Know
          </h2>
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

      {/* FAQ */}
      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            Ophthalmology CME â€” Frequently Asked Questions
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

      {/* Cross-links */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 40 }}>
            More CME Specialty Guides
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { href: "/cardiology-cme",        label: "â¤ï¸ Cardiology" },
              { href: "/surgery-cme",           label: "ðŸ”ª Surgery" },
              { href: "/dermatology-cme",       label: "ðŸ©º Dermatology" },
              { href: "/neurology-cme",         label: "ðŸ§  Neurology" },
              { href: "/nephrology-cme",        label: "ðŸ« Nephrology" },
              { href: "/orthopedics-cme",       label: "ðŸ¦´ Orthopedics" },
              { href: "/radiology-cme",         label: "ðŸ©» Radiology" },
              { href: "/physician-cme",         label: "ðŸ‘¨â€âš•ï¸ All Physicians" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 14 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Never miss an ophthalmology CME deadline
          </h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            Track QCHP, SCFHS, DHA, and 4 more authorities in one compliance dashboard. Free to start.
          </p>
          <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}>
            Start tracking free â†’
          </Link>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>No credit card required Â· Free plan always available</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or their relevant GCC authority.
        </p>
      </section>
    </>
  );
}
