import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transplant Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for transplant and hepatobiliary surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, organ procurement credentials, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Transplant Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for transplant surgeons practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Transplant Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Transplant Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Transplant surgery operates within one of the most tightly regulated clinical environments in the GCC. In addition to standard CME obligations, transplant surgeons must maintain currency with national organ procurement frameworks, transplant authority accreditation, and evolving immunosuppression protocols."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Transplant Surgeon CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; transplant unit affiliation"],
              ["SCFHS / SCOT", "Saudi Arabia", "40–60 CME", "1–3 years", "Saudi Centre for Organ Transplantation"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "National Transplant Network affiliation"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "Cleveland Clinic/Tawam transplant unit"],
              ["MOH Kuwait", "Kuwait", "30 CME", "1 year", "Kuwait Organ Transplant Program"],
              ["NHRA", "Bahrain", "40 CPD", "2 years", "Verified activities required"],
              ["OMSB", "Oman", "40 CME", "2 years", "Oman National Transplant Program"],
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

        <h2>The Regulatory Framework for Transplant in the GCC</h2>
        <p>Every GCC country with an active transplant programme operates a national transplant authority that governs organ procurement, waiting list management, and centre accreditation separately from the main medical licensing authority. In Saudi Arabia, the Saudi Centre for Organ Transplantation (SCOT) maintains a registry of approved transplant centres and surgeons; transplant activity without SCOT affiliation is not permitted. Qatar&apos;s Hamad General Hospital operates the national transplant programme under QCHP oversight. Surgeons must maintain dual compliance — CME credits through the licensing authority and transplant activity documentation through the transplant authority.</p>

        <h2>Key CME Topics for Transplant Surgeons</h2>
        <ul>
          <li><strong>Solid organ transplantation</strong> — kidney, liver, heart, lung — surgical technique updates, outcomes data</li>
          <li><strong>Immunosuppression protocols</strong> — calcineurin inhibitors, mTOR inhibitors, steroid minimisation, tacrolimus monitoring</li>
          <li><strong>Organ procurement and preservation</strong> — normothermic machine perfusion, DCD procurement, back-table preparation</li>
          <li><strong>Rejection management</strong> — acute cellular rejection, antibody-mediated rejection, biopsy interpretation</li>
          <li><strong>Living donor evaluation</strong> — donor safety, long-term donor outcomes, ethical frameworks</li>
          <li><strong>Post-transplant oncology</strong> — PTLD, skin malignancy, surveillance protocols</li>
          <li><strong>Hepatobiliary surgery</strong> — liver resection, biliary reconstruction, portal hypertension management</li>
          <li><strong>Paediatric transplantation</strong> — split liver, living donor paediatric kidney, growth outcomes</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>The Transplantation Society (TTS) International Congress</li>
          <li>American Transplant Congress (ATC)</li>
          <li>European Society for Organ Transplantation (ESOT) Congress</li>
          <li>Gulf Transplant Congress — GCC-specific, SCOT-recognised</li>
          <li>Arab Health — surgical and critical care CME sessions</li>
          <li>International Liver Transplantation Society (ILTS) Annual Meeting</li>
        </ul>

        <h2>Living Donor and Deceased Donor Programme Requirements</h2>
        <p>GCC authorities require transplant surgeons performing living donor procedures to maintain specific credentialing beyond standard CME. This typically includes documentation of supervised living donor cases, familiarity with the national living donor evaluation protocol, and participation in ethics committee review. Deceased donor programmes require brain death declaration competency and organ procurement team training, which most GCC transplant authorities mandate as annual refresher activities.</p>

        <h2>Track Your Transplant CME</h2>
        <p>Hayya Med Pro tracks CME credits per licensing authority with automated gap analysis. Securely upload and store your transplant conference certificates and surgical skills course documentation for each renewal cycle.</p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
