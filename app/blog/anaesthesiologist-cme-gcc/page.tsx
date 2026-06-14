import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anaesthesiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for anaesthesiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, regional anaesthesia and ultrasound-guided blocks CPD, critical care and sedation updates, FRCA and Arab Board recognition, and best anaesthesia conferences for GCC CME.",
  openGraph: {
    title: "Anaesthesiologist CME GCC 2026 — QCHP, SCFHS, DHA Anaesthesia Guide",
    description:
      "CME guide for anaesthesiologists in GCC countries: credit requirements, regional anaesthesia and ultrasound-guided nerve block CPD, perioperative medicine, FRCA and ABA board recognition, and the best anaesthesia conferences for GCC CME.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Anaesthesiologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Anaesthesiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Anaesthesiology in the GCC spans high-volume surgical anaesthesia across cardiovascular, bariatric, obstetric, and neurosurgical specialties, alongside a significant critical care and pain medicine component. Structured CME must cover this clinical breadth."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Anaesthesiologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Anaesthesiologists</h2>

        <h3>Regional Anaesthesia and Ultrasound-Guided Nerve Blocks</h3>
        <p>
          Regional anaesthesia is a rapidly evolving area with significant patient benefit. GCC
          anaesthesiologists should prioritise:
        </p>
        <ul>
          <li>Ultrasound-guided peripheral nerve blocks — interscalene, supraclavicular, infraclavicular, axillary, femoral, popliteal sciatic, adductor canal, erector spinae plane (ESP)</li>
          <li>Fascial plane blocks — ESP, PECS I/II, serratus anterior, quadratus lumborum, TAP block variants</li>
          <li>Continuous peripheral nerve block catheters — technique, management, troubleshooting</li>
          <li>Regional anaesthesia for bariatric surgery — high-volume procedure in GCC; multimodal analgesic strategies, ESP blocks</li>
          <li>Obstetric regional anaesthesia — epidural management, CSE technique, labour analgesia</li>
        </ul>

        <h3>Perioperative Medicine</h3>
        <ul>
          <li>Preoperative risk assessment — updated ASA classification, cardiopulmonary exercise testing</li>
          <li>Enhanced recovery after surgery (ERAS) — protocol implementation, anaesthetic role, opioid-sparing strategies</li>
          <li>High-risk surgical patient management — major abdominal, cardiac, thoracic, and vascular anaesthesia</li>
          <li>Blood conservation — cell salvage, antifibrinolytics (TXA), patient blood management programmes</li>
          <li>Airway management updates — video laryngoscopy (GlideScope, C-MAC), supraglottic airway devices, difficult airway algorithms</li>
        </ul>

        <h3>Critical Care Anaesthesia</h3>
        <ul>
          <li>ICU management of post-operative patients — ventilation, haemodynamic monitoring</li>
          <li>Sepsis management — updated Surviving Sepsis Campaign guidelines, vasopressor use</li>
          <li>Point-of-care ultrasound (POCUS) for anaesthesiologists — cardiac, lung, vascular</li>
          <li>Coagulation management in critical care — viscoelastic testing (ROTEM/TEG), massive haemorrhage protocol</li>
        </ul>

        <h3>Cardiac and Thoracic Anaesthesia</h3>
        <ul>
          <li>Transoesophageal echocardiography (TOE/TEE) for anaesthesiologists — basic perioperative TOE</li>
          <li>Cardiac anaesthesia updates — cardioprotection, TAVI anaesthetic support</li>
          <li>One-lung ventilation — updated management, lung protection during thoracic procedures</li>
        </ul>

        <h3>Pain Medicine</h3>
        <ul>
          <li>Chronic pain management — updated mechanisms, multimodal pharmacotherapy</li>
          <li>Interventional pain procedures — spinal cord stimulation, intrathecal drug delivery, radiofrequency ablation</li>
          <li>Acute pain service development — opioid stewardship, PCA management, multimodal analgesia</li>
        </ul>

        <h2>Best Anaesthesia Conferences for GCC CME</h2>

        <h3>ASA Annual Meeting (American Society of Anesthesiologists)</h3>
        <p>
          The ASA Annual Meeting (October, USA) generates AMA PRA Category 1 CME credits. The world&apos;s
          largest anaesthesiology conference — comprehensive content across all subspecialties with
          significant hands-on simulation and ultrasound workshops.
        </p>

        <h3>Euroanaesthesia (European Society of Anaesthesiology and Intensive Care)</h3>
        <p>
          Euroanaesthesia (June, European cities) generates EACCME credits. The premier European
          anaesthesia meeting — strong regional anaesthesia, perioperative medicine, and critical
          care content.
        </p>

        <h3>ESRA Annual Congress (European Society of Regional Anaesthesia)</h3>
        <p>
          ESRA Annual Congress generates EACCME credits. The specialist regional anaesthesia
          conference — essential for GCC anaesthesiologists building an ultrasound-guided
          regional practice.
        </p>

        <h2>FRCA, ABA, and Arab Board Recognition</h2>
        <ul>
          <li><strong>FRCA (Fellow of the Royal College of Anaesthetists, UK):</strong> Recognized by QCHP, DHA, DOH, and SCFHS as the consultant-grade specialist qualification for anaesthesiologists.</li>
          <li><strong>American Board of Anesthesiology (ABA):</strong> Recognized by GCC authorities. ABA MOCA activities count toward GCC CME renewal.</li>
          <li><strong>Arab Board in Anaesthesiology:</strong> Recognized across all GCC countries; valued particularly in Saudi Arabia, Kuwait, and Qatar.</li>
          <li><strong>EDAIC (European Diploma in Anaesthesiology and Intensive Care):</strong> Recognized as an advanced qualification in several GCC hospital credentialing systems.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Anaesthesiologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
