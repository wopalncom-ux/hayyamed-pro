import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neonatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for neonatologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, NRP recognition, NRP/HOT TOPICS conferences, simulation training, and renewal timelines.",
  openGraph: {
    title: "Neonatologist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "A complete guide to CME and CPD requirements for neonatologists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Neonatologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Neonatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Neonatology is a field where clinical protocols evolve quickly and clinical currency is directly linked to patient outcomes. Neonatologists practising across the GCC must maintain their licenses through regular CME participation aligned with the latest evidence in neonatal medicine."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Neonatologist CME Requirements by Authority</h2>

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
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Paediatrics specialty board"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual activity reporting"],
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

        <h2>Why CME Is Critical in Neonatology</h2>
        <p>
          Surfactant therapy, non-invasive respiratory support, therapeutic hypothermia, and management of extremely preterm infants have all undergone significant evidence-based updates in recent years. Neonatologists who do not engage with ongoing education risk falling behind practices that directly affect neonatal survival and neurodevelopmental outcomes.
        </p>
        <p>
          GCC countries have invested heavily in NICU infrastructure with level III NICUs operating in Doha, Riyadh, Abu Dhabi, and Dubai. JCI and CBAHI accreditation standards require neonatologists in these units to demonstrate active CME participation as part of the facility&apos;s clinical governance framework.
        </p>

        <h2>Qatar — QCHP Detail</h2>
        <p>
          Neonatologists in Qatar are licensed under QCHP&apos;s Paediatric Medicine sub-specialties track. The requirement is 80 CPD points per two-year cycle with a minimum of 40 points in each year. Sidra Medicine and HMC&apos;s WWRC run QCHP-accredited Grand Rounds, case conferences, and CME days that count toward the CPD cycle.
        </p>

        <h2>Saudi Arabia — SCFHS Detail</h2>
        <p>
          SCFHS classifies neonatology under the Paediatric Medicine specialty board, requiring 40–60 hours per cycle with Category A activities (simulation, surgical skills, clinical conferences) weighted more highly than Category B. All activities must be logged on Mumaris+ before renewal.
        </p>

        <h2>UAE Detail</h2>
        <p>
          DHA requires 40 CME hours per two-year cycle; DOH requires 30–50 credits. Both accept international neonatology conferences and accredited paediatrics society activities. The annual Neonatology Congress held in the UAE is recognised by both DHA and DOH.
        </p>

        <h2>Core CME Topics for Neonatologists</h2>
        <ul>
          <li><strong>Respiratory support in the newborn</strong> — CPAP, high-flow nasal cannula, NIPPV, surfactant protocols</li>
          <li><strong>Therapeutic hypothermia</strong> — patient selection, protocol updates, neurodevelopmental outcome data</li>
          <li><strong>Extremely preterm infant care</strong> — viability thresholds, antenatal counselling, periviable management</li>
          <li><strong>Neonatal sepsis</strong> — antibiotic stewardship, early vs late onset infection, culture-negative sepsis</li>
          <li><strong>Necrotising enterocolitis (NEC)</strong> — prevention, surgical vs medical management</li>
          <li><strong>Neonatal neurology</strong> — HIE management beyond cooling, MRI interpretation, seizure management</li>
          <li><strong>Retinopathy of prematurity (ROP)</strong> — screening, anti-VEGF therapy, laser treatment</li>
          <li><strong>Neonatal nutrition</strong> — human milk banking, parenteral nutrition optimisation</li>
          <li><strong>Point-of-care ultrasound in the NICU</strong> — lung, cranial, cardiac applications</li>
          <li><strong>Family-integrated care</strong> — parental involvement, skin-to-skin, psychological support</li>
          <li><strong>Quality improvement in the NICU</strong> — bundles, benchmarking, Vermont Oxford Network</li>
        </ul>

        <h2>Key Accepted Conferences</h2>
        <ul>
          <li>Hot Topics in Neonatology (USA) — one of the highest-value annual neonatology meetings</li>
          <li>European Society for Neonatology (ESN) Congress</li>
          <li>Pediatric Academic Societies (PAS) Annual Meeting</li>
          <li>GCC Neonatology Congress</li>
          <li>Saudi Neonatology Society Annual Meeting</li>
          <li>Vermont Oxford Network Annual Quality Congress</li>
        </ul>

        <h2>Simulation and Skills Training</h2>
        <p>
          Simulation-based education is particularly important in neonatology, where procedures such as endotracheal intubation, umbilical line placement, and chest drain insertion are high-stakes and low-frequency. GCC authorities increasingly recognise simulation as high-value CME:
        </p>
        <ul>
          <li>NRP (Neonatal Resuscitation Program) — mandatory for most NICUs; accepted for CME credit by all GCC authorities</li>
          <li>S.T.A.B.L.E. programme — pre-transport stabilisation simulation</li>
          <li>High-fidelity NICU simulation at Sidra Medicine and UAE medical education centres</li>
        </ul>

        <h2>Documentation and Renewal Preparation</h2>
        <p>
          Neonatologists should maintain certificates for all CME activities throughout the renewal cycle, including NRP refresher completions, conference attendance records, and simulation participation letters. All GCC authorities accept digital certificates if the accreditation body, credit value, and activity date are clearly visible.
        </p>

        <h2>Track Your Neonatology CME with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro allows neonatologists to upload and organise certificates, track accumulated credits by category and authority, and receive alerts when compliance falls below the level required for renewal. Gap analysis shows exactly which activities still need to be completed before the cycle closes.
        </p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
