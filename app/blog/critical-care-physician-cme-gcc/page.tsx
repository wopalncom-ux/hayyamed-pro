import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Critical Care Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for intensivists and critical care physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, mechanical ventilation and sepsis bundle CPD priorities, ARDS and ECMO updates, SCCM/ESICM conference CME recognition, and FCCP/EDIC qualification recognition.",
  openGraph: {
    title: "Critical Care Physician CME GCC 2026 — QCHP, SCFHS, DHA Intensivist Guide",
    description:
      "CME guide for critical care physicians and intensivists in GCC countries: credit requirements by authority, mechanical ventilation lung-protective strategies, sepsis management, ARDS, ECMO, SCCM/ESICM conference recognition, and FCCP/EDIC qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Critical Care Physician CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Critical Care Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="ICUs across the GCC — particularly in Qatar (Hamad Medical Corporation), Saudi Arabia (National Guard Health Affairs, KAMC), and UAE (Cleveland Clinic Abu Dhabi, Sheikh Khalifa Medical City) — operate at international standards with significant ECMO capability, complex multi-organ support, and high post-operative cardiac and surgical ICU volumes. CME for intensivists must reflect this clinical complexity."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Critical Care Physician CME Requirements by Authority</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Term</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["QCHP", "Qatar", "80 (40/year)", "2 years", "CPD"],
              ["SCFHS", "Saudi Arabia", "40–60", "Per renewal", "CME"],
              ["DHA", "Dubai", "40", "2 years", "CME"],
              ["DOH", "Abu Dhabi", "30–50", "1–2 years", "CPD"],
              ["NHRA", "Bahrain", "40", "2 years", "CPD"],
              ["MOH Kuwait", "Kuwait", "30", "Annual", "CME"],
              ["OMSB", "Oman", "40", "2 years", "CME"],
            ].map(([auth, country, credits, cycle, term], i) => (
              <tr key={auth} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{auth}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{country}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{cycle}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{term}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Subspecialty CME Priorities for GCC Intensivists</h2>

        <h3>Mechanical Ventilation and Respiratory Failure</h3>
        <p>
          Lung-protective ventilation and liberation from mechanical ventilation are core competencies
          with rapidly evolving evidence:
        </p>
        <ul>
          <li>Lung-protective ventilation — low tidal volume (6 ml/kg IBW), driving pressure limitation, individualised PEEP titration (EIT, oesophageal pressure)</li>
          <li>ARDS management — updated Berlin definition, prone positioning protocols (&gt;16 hours), neuromuscular blockade (ACURASYS/ROSE trial interpretation), awake prone positioning post-COVID evidence</li>
          <li>High-flow nasal cannula (HFNC) — patient selection, failure prediction (ROX index), interface with NIV</li>
          <li>Liberation from mechanical ventilation — spontaneous awakening and breathing trial (SAT-SBT) protocol, P-SILI identification, extubation criteria</li>
          <li>Ventilator-associated pneumonia (VAP) prevention — updated bundle components, de-escalation antibiotic strategies</li>
        </ul>

        <h3>Sepsis and Septic Shock</h3>
        <ul>
          <li>Surviving Sepsis Campaign (SSC) 2024 bundle — updated 1-hour bundle: lactate measurement, blood cultures before antibiotics, broad-spectrum antibiotics, crystalloid resuscitation, vasopressors for MAP ≥65</li>
          <li>Fluid resuscitation controversy — SMART trial (balanced crystalloids vs. normal saline), PLUS trial, restrictive vs. liberal fluid strategies post-resuscitation</li>
          <li>Vasopressor selection — noradrenaline first-line, vasopressin timing, angiotensin II (ATHOS-3 trial), corticosteroids in refractory shock (APROCCHSS, ADRENAL)</li>
          <li>Source control — timing of surgical source control, drain placement, antibiotic stewardship in ICU</li>
          <li>Biomarkers in sepsis — procalcitonin-guided therapy, ferritin in HLH, presepsin</li>
        </ul>

        <h3>ECMO and Advanced Organ Support</h3>
        <ul>
          <li>VV-ECMO for respiratory failure — patient selection criteria (Murray score, Respiratory ECMO Survival Prediction — RESP score), cannulation strategies, management during ECMO</li>
          <li>VA-ECMO for cardiogenic shock — indications, peripheral vs. central cannulation, LV venting (Impella + ECMO), weaning</li>
          <li>ECPELLA (Impella + VA-ECMO) — emerging combination MCS strategy in high-volume GCC cardiac centres</li>
          <li>Continuous renal replacement therapy (CRRT) — modality selection, dose prescription (25–30 ml/kg/h), anticoagulation (citrate vs. heparin), membrane selection</li>
          <li>Therapeutic plasma exchange and immunomodulation — indications in TTP, HLH, severe autoimmune disease</li>
        </ul>

        <h3>Neurocritical Care</h3>
        <ul>
          <li>Traumatic brain injury (TBI) — updated Brain Trauma Foundation guidelines, ICP monitoring thresholds, CPP targets, decompressive craniectomy indications</li>
          <li>Subarachnoid haemorrhage — vasospasm prevention (nimodipine), delayed cerebral ischaemia, EVD management</li>
          <li>Status epilepticus — updated treatment protocols (benzodiazepine → levetiracetam/valproate → general anaesthesia), refractory SE management</li>
          <li>Post-cardiac arrest care — targeted temperature management (TTM2 trial outcomes — 37.5°C vs. 33°C), neuroprognostication</li>
        </ul>

        <h2>Best Critical Care Conferences for GCC CME</h2>

        <h3>SCCM Congress (Society of Critical Care Medicine)</h3>
        <p>
          The SCCM Annual Congress (February, USA) generates AMA PRA Category 1 CME credits recognised by QCHP,
          DHA, DOH, SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest critical care meeting — keynote
          lectures, oral abstract presentations, simulation labs, and the FCCP examination.
        </p>

        <h3>ESICM LIVES Congress (European Society of Intensive Care Medicine)</h3>
        <p>
          ESICM LIVES Congress (October, European cities) generates EACCME credits with transfer provisions for GCC
          authorities. The premier European critical care meeting — strong ARDS, sepsis, ECMO, and neurocritical
          care content with live case discussions from leading European ICUs.
        </p>

        <h3>Arab Congress of Intensive Care Medicine</h3>
        <p>
          The Arab Congress of Intensive Care Medicine and related GCC critical care symposia generate QCHP and
          SCFHS-recognised CME directly. Content tailored to GCC ICU practice — MERS-CoV management protocols,
          heat stroke and heat-related illness (relevant in GCC summer), and desert trauma.
        </p>

        <h2>FCCP, EDIC, and Arab Board Recognition</h2>
        <ul>
          <li><strong>FCCP (Fellow of the American College of Chest Physicians):</strong> One of the most widely held critical care and pulmonology fellowship awards among GCC intensivists. Recognized by QCHP, DHA, DOH, and SCFHS as a specialist distinction, with CHEST annual conference CME well-regarded across GCC authorities.</li>
          <li><strong>EDIC (European Diploma in Intensive Care):</strong> Recognized by QCHP, DHA, DOH, and several private hospital credentialing systems across the GCC. The pan-European critical care specialist diploma — increasingly held by GCC-trained intensivists with European training backgrounds.</li>
          <li><strong>FCCM (Fellow of the Society of Critical Care Medicine):</strong> Recognized in hospital credentialing systems across the GCC as a distinction award for intensivists with significant SCCM engagement.</li>
          <li><strong>Arab Board in Critical Care:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
          <li><strong>MRCP with specialty training in Intensive Care Medicine (UK):</strong> Recognized by QCHP, DHA, and DOH for intensivists with UK specialty training backgrounds.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Critical care physician CME requirements vary by licensing authority and specialty background. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
