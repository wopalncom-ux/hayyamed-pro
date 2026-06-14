import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paediatric Nurse CPD Requirements in the GCC 2026 — QCHP, DHA, SCFHS Guide",
  description:
    "CPD requirements for paediatric and children's nurses in Qatar, UAE, Saudi Arabia, Kuwait, Bahrain, and Oman: per-authority credit requirements, mandatory PALS/BLS certifications, neonatal and PICU nursing CPD, and best online CPD resources for paediatric nurses in the GCC.",
  openGraph: {
    title: "Paediatric Nurse CPD GCC 2026 — Children's Nursing CME Guide",
    description:
      "Complete CPD guide for paediatric nurses in GCC countries: QCHP, DHA, SCFHS credit requirements, PALS/BLS/STABLE certifications, paediatric and neonatal nursing CPD priorities, and the best platforms for children's nursing CE in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Paediatric Nurse CPD Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "CPD requirements for paediatric nurses in GCC countries in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is PALS required for paediatric nurses in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. PALS (Paediatric Advanced Life Support) is effectively mandatory for paediatric nurses in GCC hospitals through JCI accreditation requirements and hospital credentialing policies. All nurses working in paediatric wards, PICU, NICU, or paediatric emergency settings should hold current PALS.",
      },
    },
    {
      "@type": "Question",
      name: "What is the STABLE program and is it accepted for GCC CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "STABLE (Sugar, Temperature, Airway, Blood pressure, Lab work, Emotional support) is a neonatal stabilization program widely used in GCC NICUs. STABLE course completion certificates are accepted for CPD credit by GCC nursing licensing authorities when offered by QCHP/DHA-recognized providers.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BlogPostLayout
        title="Paediatric Nurse CPD Requirements in the GCC 2026 — QCHP, DHA, SCFHS Guide"
        description="Paediatric nursing in the GCC spans everything from NICU care for premature infants to PICU management of critically ill children and general paediatric ward nursing. The clinical diversity demands a broad CPD portfolio covering neonatal, critical care, and developmental nursing competencies."
        category="profession"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={7}
      >
        <h2>GCC Paediatric Nurse CPD Requirements by Authority</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Key additional requirement</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["QCHP", "Qatar", "80 (40/year)", "2 years", "BLS required; PALS for paediatric settings"],
              ["SCFHS", "Saudi Arabia", "40–60", "Per renewal", "BLS + PALS for paediatric units"],
              ["DHA", "Dubai", "40", "2 years", "BLS required; PALS recommended for PICU/NICU"],
              ["DOH", "Abu Dhabi", "30–50", "1–2 years", "BLS required"],
              ["MOH Kuwait", "Kuwait", "30", "Annual", "BLS mandatory"],
              ["NHRA", "Bahrain", "40", "2 years", "BLS required"],
              ["OMSB", "Oman", "40", "2 years", "BLS required"],
            ].map(([auth, country, credits, cycle, req], i) => (
              <tr key={auth} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{auth}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{country}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{cycle}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{req}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Mandatory Certifications for GCC Paediatric Nurses</h2>

        <h3>PALS (Paediatric Advanced Life Support)</h3>
        <p>
          PALS is the most important certification for paediatric nurses working in GCC hospitals.
          AHA-certified PALS (or RCUK/ERC equivalent) is the accepted standard. PALS is valid for
          2 years and should be renewed before license renewal to avoid a gap.
        </p>

        <h3>NRP (Neonatal Resuscitation Program)</h3>
        <p>
          For NICU and delivery room nurses, NRP certification is effectively mandatory. NRP
          (7th edition) is the global standard accepted by all GCC licensing authorities. Valid
          for 2 years; recertification involves an online assessment and skills station.
        </p>

        <h3>STABLE Program</h3>
        <p>
          The STABLE Program (pre-transport/post-resuscitation neonatal stabilisation) is widely
          used in GCC NICUs — particularly at Sidra Medicine Qatar, King Faisal Specialist Hospital,
          and Cleveland Clinic Abu Dhabi. STABLE courses from accredited providers count as CPD.
        </p>

        <h2>CPD Topics for GCC Paediatric Nurses</h2>

        <h3>Neonatal Nursing</h3>
        <ul>
          <li>Extremely low birth weight (ELBW) infant care — thermoregulation, skin integrity, infection prevention</li>
          <li>Non-invasive respiratory support in neonates — CPAP, high-flow nasal cannula</li>
          <li>Neonatal pain assessment and non-pharmacological management</li>
          <li>Family-centred developmental care — kangaroo care, positioning, sensory support</li>
          <li>Neonatal jaundice — phototherapy protocols, exchange transfusion indication</li>
        </ul>

        <h3>Paediatric Critical Care (PICU)</h3>
        <ul>
          <li>Paediatric sepsis recognition and hour-1 bundle — PICU nursing implementation</li>
          <li>Mechanical ventilation in children — lung protective strategy, paediatric parameters</li>
          <li>Congenital heart disease post-operative care — single-ventricle physiology nursing</li>
          <li>Paediatric sedation and analgesia — PICU comfort assessment tools (COMFORT-B scale)</li>
          <li>Delirium in the PICU — assessment (pCAM-ICU, CAPD) and prevention</li>
        </ul>

        <h3>General Paediatric Nursing</h3>
        <ul>
          <li>Paediatric medication safety — weight-based dosing, double-check protocols</li>
          <li>Child safeguarding — GCC-specific child protection frameworks</li>
          <li>Diabetes management in children — type 1 diabetes, insulin pump therapy, school liaison</li>
          <li>Paediatric oncology nursing — chemotherapy safety, central line care</li>
          <li>Developmental and behavioural paediatrics — autism spectrum support in clinical settings</li>
        </ul>

        <h2>Best CPD Resources for GCC Paediatric Nurses</h2>

        <h3>SPN (Society of Pediatric Nurses) — USA</h3>
        <p>
          SPN CE activities are ANCC-accredited, accepted by all GCC nursing licensing authorities.
          SPN&apos;s annual conference and online CE library cover neonatal, paediatric, and adolescent
          nursing comprehensively.
        </p>

        <h3>NANN (National Association of Neonatal Nurses)</h3>
        <p>
          For NICU nurses, NANN is the premier resource — ANCC-accredited CE covering neonatal
          physiology, developmental care, and advanced neonatal nursing practice. NANN&apos;s RNC-NIC
          specialty certification (Registered Nurse Certified in Neonatal Intensive Care) is
          recognized by GCC authorities as specialist qualification for senior NICU roles.
        </p>

        <h3>AACN Paediatric and Neonatal CE</h3>
        <p>
          AACN&apos;s library includes PICU-specific ANCC-accredited CE activities suitable for
          paediatric critical care nurses. CCRN-P (Paediatric Critical Care Registered Nurse
          certification) is recognized by GCC authorities for PICU nursing specialists.
        </p>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Paediatric nurse CPD requirements vary by licensing authority,
          subspecialty, and renewal cycle. Verify current requirements directly with QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
