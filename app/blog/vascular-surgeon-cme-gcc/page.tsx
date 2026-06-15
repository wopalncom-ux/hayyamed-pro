import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vascular Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for vascular and endovascular surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, endovascular training, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Vascular Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for vascular surgeons practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Vascular Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Vascular Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Vascular surgery is a rapidly evolving specialty with endovascular techniques increasingly replacing open surgery. GCC licensing authorities require vascular surgeons to maintain current CME compliance for both license renewal and surgical privileges."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Vascular Surgeon CME Requirements by Authority</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year minimum"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Surgical specialty board"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "By classification"],
              ["MOH Kuwait", "Kuwait", "30 CME", "1 year", "Annual renewal"],
              ["NHRA", "Bahrain", "40 CPD", "2 years", "Verified activities"],
              ["OMSB", "Oman", "40 CME", "2 years", "OMSB-accepted formats"],
            ].map(([auth, country, credits, cycle, note]) => (
              <tr key={auth} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", fontWeight: 600 }}>{auth}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{country}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{cycle}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", color: "#64748b", fontSize: "0.85em" }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Why CME Is Critical for Vascular Surgeons</h2>
        <p>Vascular surgery CME must cover both open and endovascular domains. The specialty has been transformed by EVAR, TEVAR, carotid stenting, and peripheral arterial intervention. GCC facilities with hybrid operating rooms require their vascular surgeons to maintain endovascular competencies through formal, documented training. JCI and CBAHI audits include review of surgical staff CME portfolios.</p>

        <h2>Key CME Topics for Vascular Surgeons</h2>
        <ul>
          <li><strong>EVAR and TEVAR</strong> — fenestrated and branched devices, type II endoleak management, reintervention planning</li>
          <li><strong>Carotid disease</strong> — CEA vs CAS outcomes, embolic protection, stroke prevention protocols</li>
          <li><strong>Peripheral arterial disease</strong> — endovascular vs bypass decision-making, below-the-knee interventions, critical limb-threatening ischaemia</li>
          <li><strong>Diabetic foot and wound care</strong> — high GCC prevalence; multidisciplinary management, angiosome concept</li>
          <li><strong>Venous disease</strong> — varicose vein thermal ablation, DVT management, venous malformations, May-Thurner</li>
          <li><strong>Haemodialysis access</strong> — AVF creation, graft surveillance, endovascular intervention for access failure</li>
          <li><strong>Acute aortic syndromes</strong> — type B dissection, TBAD management, endovascular repair timing</li>
          <li><strong>Vascular imaging</strong> — duplex ultrasound, CTA reconstruction, intravascular ultrasound, cone-beam CT</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>Society for Vascular Surgery (SVS) Annual Meeting</li>
          <li>European Society for Vascular Surgery (ESVS) Annual Congress</li>
          <li>Charing Cross International Symposium — endovascular focus</li>
          <li>Gulf Vascular Surgery Meeting — GCC-region credited activity</li>
          <li>VEITH Symposium — aortic and peripheral endovascular</li>
          <li>Arab Health — vascular surgery and hybrid OR sessions</li>
        </ul>

        <h2>Endovascular Proctoring and Skills Courses</h2>
        <p>Many GCC facilities require documented endovascular skills training before granting privileges for new procedures. Proctored cases and cadaveric skills laboratories — when formally structured and certified — are accepted as Category A CME by SCFHS and recognised by QCHP. Obtain a formal certificate from the proctor with date, procedure type, and proctor credentials documented.</p>

        <h2>Track Your Vascular Surgery CME</h2>
        <p>Hayya Med Pro tracks CME compliance per country and per cycle with automated gap analysis for each GCC authority before your renewal date. Certificate uploads are stored securely with signed URL access.</p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
