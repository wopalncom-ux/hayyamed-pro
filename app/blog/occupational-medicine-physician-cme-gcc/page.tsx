import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Occupational Medicine Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for occupational medicine and occupational health physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, heat stress training, industrial health conferences, and renewal timelines.",
  openGraph: {
    title: "Occupational Medicine Physician CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "A complete guide to CME and CPD requirements for occupational medicine physicians practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Occupational Medicine Physician CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Occupational Medicine Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Occupational medicine is a specialty of growing strategic importance across the GCC, where large industrial, construction, oil and gas, and migrant workforce sectors create a high demand for workplace health services. CME compliance is a mandatory requirement for maintaining a license to practice."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Occupational Medicine CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year minimum; 5 domains"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Preventive medicine specialty track"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Community/occupational medicine track"],
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

        <h2>The Role of Occupational Medicine in the GCC</h2>
        <p>
          The GCC hosts the highest proportion of migrant workers of any region globally. Occupational medicine physicians serve as the frontline health interface between workers and employers — conducting pre-employment assessments, managing work-related illness and injury, and advising on workplace hazard mitigation. International scrutiny of labour conditions in Qatar and the UAE has elevated the profile and responsibility of occupational medicine practitioners.
        </p>

        <h2>Qatar — QCHP Detail</h2>
        <p>
          Occupational medicine physicians registered with QCHP must accumulate 80 CPD points per two-year cycle with at least 40 in each year. Practitioners are classified under Internal Medicine or Community and Preventive Medicine depending on board certification. CME must be QCHP-accredited or internationally recognised with clear documentation of the accrediting body and credit value.
        </p>

        <h2>Saudi Arabia — SCFHS Detail</h2>
        <p>
          SCFHS classifies occupational medicine under preventive medicine sub-specialties, with requirements of 40–60 hours per cycle. Category A activities (direct clinical and occupational health education) receive priority weighting. Saudi Arabia&apos;s Vision 2030 workforce initiatives and NEOM project health standards have increased the demand for occupational medicine specialists.
        </p>

        <h2>UAE Detail</h2>
        <p>
          DHA requires 40 CME hours over two years for community and occupational medicine specialists. DOH requires 30–50 credits per cycle. Both accept BOHS, ACOEM, and GCC industrial health conference activities. ACOEM (American College of Occupational and Environmental Medicine) e-learning is accepted as Category B by both authorities.
        </p>

        <h2>Core CME Topics for Occupational Medicine Physicians</h2>
        <ul>
          <li><strong>Heat stress and heat illness</strong> — essential in GCC outdoor work; updated WHO and GCC protocols</li>
          <li><strong>Silica and dust exposure</strong> — construction sector hazard; spirometry, radiological surveillance</li>
          <li><strong>Pre-employment and periodic health assessments</strong> — GCC ministry standards and legal frameworks</li>
          <li><strong>Fitness for duty evaluations</strong> — safety-critical workers, high-risk environments</li>
          <li><strong>Occupational musculoskeletal disorders</strong> — ergonomic assessment, return-to-work programmes</li>
          <li><strong>Mental health in the workplace</strong> — increasingly recognised across GCC employer frameworks</li>
          <li><strong>Noise-induced hearing loss</strong> — audiometric surveillance, hearing conservation programmes</li>
          <li><strong>Chemical and hazardous materials exposure</strong> — oil and gas, petrochemical sector</li>
          <li><strong>Migrant worker health</strong> — pre-arrival screening, communicable disease surveillance</li>
          <li><strong>Regulatory updates</strong> — Qatar Labour Law, UAE OSH regulations, Saudi OSHA equivalents</li>
        </ul>

        <h2>Key Accepted Conferences and Programmes</h2>
        <ul>
          <li>IOHA (International Occupational Hygiene Association) Congress</li>
          <li>EPICOH (International Conference on Epidemiology in Occupational Health)</li>
          <li>ACOEM Annual Meeting and e-learning programmes</li>
          <li>BOHS (British Occupational Hygiene Society) Certificates</li>
          <li>Gulf Occupational Medicine Society meetings</li>
          <li>QCHP-accredited workplace health seminars (Qatar)</li>
        </ul>

        <h2>Employer-Funded CME</h2>
        <p>
          In the GCC, large employers with dedicated occupational health departments often fund CME for their medical staff — particularly in oil and gas, where additional certifications such as Offshore Medical qualifications or HAZMAT training may also be required. These employer-specific requirements do not replace QCHP or SCFHS CME obligations but should be tracked alongside them.
        </p>
        <p>
          Hayya Med Pro&apos;s employer dashboard lets occupational health departments track CME compliance across their entire medical team, with automated alerts when any staff member&apos;s compliance falls below the required threshold.
        </p>

        <h2>Track Your CME with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro allows occupational medicine physicians to upload certificates, assign them to the correct authority and category, and track compliance status against renewal deadlines — all in one place, across every GCC jurisdiction where they practice.
        </p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
