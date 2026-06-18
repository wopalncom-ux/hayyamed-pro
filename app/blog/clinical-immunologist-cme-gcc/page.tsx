import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Immunologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for clinical immunologists and allergists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, biologics in allergy/immunology, inborn errors, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Clinical Immunologist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for clinical immunologists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Clinical Immunologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Clinical Immunologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Clinical immunology spans allergy, primary immunodeficiency, autoinflammatory disease, and transplant immunology. The GCC&apos;s high prevalence of allergic rhinitis, asthma, food allergy, and hereditary angioedema — combined with increasing recognition of inborn errors of immunity — has created strong demand for trained clinical immunologists across the region. GCC licensing authorities expect practitioners to maintain current knowledge across the full breadth of the specialty."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Clinical Immunologist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; high allergy burden context"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Internal Medicine + Paediatrics immunology track"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting portal"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "By professional classification"],
              ["MOH Kuwait", "Kuwait", "30 CME", "1 year", "Annual renewal"],
              ["NHRA", "Bahrain", "40 CPD", "2 years", "Verified activities required"],
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

        <h2>Clinical Immunology in the GCC: A Growing Specialty</h2>
        <p>The Arabian Peninsula has one of the highest rates of allergic rhinitis and atopic disease globally — partly driven by the dust and sand particle burden, partly by indoor climate-controlled environments that concentrate allergens. Saudi Arabia has documented asthma prevalence rates of 8–10% in urban adults; Qatar&apos;s National Asthma Programme reflects the MOPH&apos;s recognition of allergic disease as a national health priority. Inborn errors of immunity (IEI, previously called primary immunodeficiencies) are increasingly diagnosed across the GCC as genetic testing becomes accessible — Hamad Medical Corporation&apos;s Immunology department and King Abdulaziz Medical City&apos;s Paediatric Immunology service both run active IEI clinics. Clinical immunologists working in transplant centres (Sidra Medicine solid organ transplant, Hamad bone marrow transplant) face additional requirements around HLA matching, chimerism monitoring, and graft-versus-host disease immunology.</p>

        <h2>Key CME Topics for Clinical Immunologists</h2>
        <ul>
          <li><strong>Biologics in allergy and asthma</strong> — dupilumab (IL-4/13), mepolizumab, benralizumab (IL-5 pathway), tezepelumab (TSLP) for severe asthma, omalizumab updates, patient selection</li>
          <li><strong>Inborn errors of immunity (IEI)</strong> — 2022 IUIS classification update, CVID diagnosis and management, CGD treatment, gene therapy advances (ADA-SCID, X-CGD), newborn screening</li>
          <li><strong>Allergic rhinitis and food allergy</strong> — ARIA guideline 2023 update, sublingual immunotherapy evidence in GCC populations, OIT for peanut (Palforzia), sesame allergy (FDA-recognised allergen) implications</li>
          <li><strong>Hereditary angioedema (HAE)</strong> — C1-INH concentrate, icatibant, lanadelumab prophylaxis, garadacimab, donidalorsen — management cascade and GCC access</li>
          <li><strong>Autoinflammatory diseases</strong> — FMF (high prevalence in Middle Eastern populations), TRAPS, CAPS, Schnitzler syndrome, colchicine and IL-1 inhibitor management</li>
          <li><strong>Anaphylaxis management</strong> — updated WAO anaphylaxis guidance 2024, epinephrine auto-injector prescribing, cofactor-dependent allergies (exercise, NSAID, alcohol)</li>
          <li><strong>Immunosuppression in solid organ transplant</strong> — tacrolimus monitoring, mTOR inhibitor use, late rejection immunology, donor-specific antibody management</li>
          <li><strong>Drug allergy assessment</strong> — penicillin delabelling protocols, graded challenge procedures, drug provocation testing protocols</li>
          <li><strong>Immune-mediated adverse events of cancer immunotherapy</strong> — checkpoint inhibitor-induced pneumonitis, colitis, thyroiditis — immunology-specific CME expanding rapidly</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>European Academy of Allergy and Clinical Immunology (EAACI) Hybrid Congress</li>
          <li>American Academy of Allergy, Asthma and Immunology (AAAAI) Annual Meeting</li>
          <li>World Allergy Congress (WAC)</li>
          <li>Clinical Immunology Society (CIS) Annual Meeting</li>
          <li>Arab Society for Allergy and Immunology (ASAI) — GCC authority credited</li>
          <li>Gulf Society of Allergy, Asthma and Immunology (GSAAI) Congress</li>
          <li>IUIS (International Union of Immunological Societies) Congress</li>
        </ul>

        <h2>HAE and IEI: GCC-Specific Documentation Needs</h2>
        <p>Hereditary angioedema and primary immunodeficiencies are areas where GCC clinical immunologists face pressure to maintain CME documentation beyond the general country requirement. Patients with HAE or CVID on long-term biologics are often managed across multiple GCC countries as they travel or relocate — the immunologist must be current on international treatment protocols. QCHP and SCFHS both accept international specialty society webinar certificates (EAACI, AAAAI) as formal CME hours when accompanied by the accreditation certificate.</p>

        <h2>Track Your Clinical Immunology CME</h2>
        <p>Hayya Med Pro tracks CME credits per GCC country and per renewal cycle — useful for immunologists practising across the UAE, Qatar, and Saudi Arabia simultaneously. Upload EAACI, AAAAI, and GCC society certificates and let the platform calculate your gap against each authority&apos;s requirement.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
