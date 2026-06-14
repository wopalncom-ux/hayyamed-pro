import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cardiothoracic Surgery CPD Requirements in the GCC 2026 — QCHP, SCFHS, DHA",
  description:
    "CPD requirements for cardiothoracic surgeons in Qatar, Saudi Arabia, and UAE: per-authority credit requirements, subspecialty CME (CABG, valve surgery, VATS, transplantation), FRCS(CTh) and STS board recognition, and key cardiothoracic surgery conferences for GCC CME.",
  openGraph: {
    title: "Cardiothoracic Surgery CPD GCC 2026 — Cardiac Surgeon CME Guide",
    description:
      "CPD guide for cardiothoracic surgeons in the GCC: QCHP, SCFHS, DHA credit requirements, cardiac surgery subspecialty priorities, FRCS(CTh) and STS recognition, and the top conferences generating GCC-accepted CME.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cardiothoracic Surgery CPD Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "CPD requirements for cardiothoracic surgeons across GCC authorities in 2026.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Cardiothoracic Surgery CPD Requirements in the GCC 2026 — QCHP, SCFHS, DHA"
        description="Cardiothoracic surgery is among the highest-acuity specialties in GCC hospitals. From CABG and valve repair to thoracoscopic lung resections and heart transplantation, GCC cardiac centres perform procedures that demand continuous skills currency. Here is what each authority requires for CPD, and how to build a compliant portfolio without compromising clinical time."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Cardiothoracic Surgeon CPD Requirements</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>QCHP</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Qatar</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>80 CPD (40/year)</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>SCFHS</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Saudi Arabia</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40–60 CME</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Per renewal</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DHA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Dubai</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40 CME</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DOH</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Abu Dhabi</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>30–50 CPD</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>1–2 years</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>NHRA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Bahrain</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40 CPD</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>OMSB</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Oman</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40 CME</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
          </tbody>
        </table>

        <h2>Subspecialty CME Priorities for GCC Cardiothoracic Surgeons</h2>

        <h3>Coronary Artery Bypass Grafting (CABG)</h3>
        <p>
          CABG remains the highest-volume open cardiac procedure in GCC hospitals given the
          high prevalence of coronary artery disease in the region. CME priorities include:
        </p>
        <ul>
          <li>Off-pump CABG versus on-pump outcomes — evolving evidence base</li>
          <li>Arterial grafting strategies (bilateral IMA, radial artery) — latest evidence on graft patency</li>
          <li>CABG vs. PCI decision-making in complex multivessel disease (SYNTAX score updates)</li>
          <li>Hybrid coronary revascularization — robotic LIMA + PCI technique</li>
        </ul>

        <h3>Valve Surgery</h3>
        <ul>
          <li>TAVR (Transcatheter Aortic Valve Replacement) — expanding indications, patient selection for surgery vs TAVR</li>
          <li>Mitral valve repair techniques — edge-to-edge repair (MitraClip), ring annuloplasty</li>
          <li>Tricuspid valve surgery — increasingly performed alongside left-sided procedures</li>
          <li>Structural heart disease team — multidisciplinary decision-making frameworks</li>
        </ul>

        <h3>Thoracic Surgery</h3>
        <ul>
          <li>VATS and robotic lobectomy — techniques, patient selection, outcome data</li>
          <li>Lung cancer staging (8th edition TNM) and surgical management</li>
          <li>Esophageal surgery — minimally invasive esophagectomy techniques</li>
          <li>Pleural disease management — VATS pleurodesis, pleural mesothelioma staging</li>
          <li>Mediastinal tumours — thymoma resection, robotic approaches</li>
        </ul>

        <h3>Mechanical Circulatory Support and Transplantation</h3>
        <p>
          GCC academic centres — particularly King Faisal Specialist Hospital, HMC Heart
          Hospital, and Cleveland Clinic Abu Dhabi — perform LVAD implantation and cardiac
          transplantation. CME in this domain includes:
        </p>
        <ul>
          <li>LVAD implantation and management (HeartMate 3 updates, MOMENTUM 3 data)</li>
          <li>ECMO management in cardiogenic shock and post-cardiotomy failure</li>
          <li>Cardiac transplantation — donor management, recipient selection, immunosuppression</li>
          <li>Pediatric cardiac surgery — congenital heart disease repair techniques</li>
        </ul>

        <h2>Best Conferences for GCC Cardiothoracic Surgery CME</h2>

        <h3>STS (Society of Thoracic Surgeons) Annual Meeting</h3>
        <p>
          The STS Annual Meeting (January) is the premier cardiothoracic surgery conference
          in North America. Generates AMA PRA Category 1 CME credits accepted by all GCC
          authorities. The STS database presentations make this the most evidence-heavy
          cardiothoracic surgery meeting globally.
        </p>

        <h3>AATS (American Association for Thoracic Surgery) Annual Meeting</h3>
        <p>
          AATS (April/May) generates AMA PRA Category 1 credits. Historically the meeting
          where landmark cardiac surgery trials are first presented. Essential for cardiothoracic
          surgeons maintaining current evidence-based practice.
        </p>

        <h3>EACTS (European Association for Cardio-Thoracic Surgery) Annual Meeting</h3>
        <p>
          EACTS (October) generates EACCME credits recognized by QCHP, DHA, and SCFHS.
          The premier European cardiothoracic surgery conference; strong focus on valve
          surgery innovations and TAVI versus surgery evidence.
        </p>

        <h3>Arab Heart Congress</h3>
        <p>
          The Arab Heart Congress and affiliated GCC cardiac surgery meetings provide
          QCHP/DHA-accredited CME credits with GCC-relevant content — regional disease
          epidemiology, local centre outcomes, and regulatory environment. Efficient for
          GCC-based cardiothoracic surgeons.
        </p>

        <h2>FRCS(CTh) and STS Board Recognition in the GCC</h2>
        <ul>
          <li>
            <strong>FRCS(CTh) — Fellow of the Royal College of Surgeons (Cardiothoracic Surgery):</strong>
            Recognized by QCHP, DHA, DOH, and SCFHS as consultant-grade specialist qualification.
            The most common UK-pathway qualification among GCC cardiothoracic surgeons.
          </li>
          <li>
            <strong>STS Certified Thoracic Surgeon (ABTS):</strong> American Board of Thoracic
            Surgery certification recognized as specialist qualification by GCC authorities.
            ABTS MOC activities generate CME credit applicable to GCC renewal.
          </li>
          <li>
            <strong>Arab Board in Cardiac Surgery:</strong> Recognized across GCC countries.
          </li>
          <li>
            <strong>Fellowship training in leading GCC centres:</strong> Fellowship alumni
            from HMC, KFSH, and Cleveland Clinic Abu Dhabi are well-regarded in GCC
            credentialing processes.
          </li>
        </ul>

        <h2>Logbook and Outcomes Documentation as CPD</h2>
        <p>
          A unique feature of surgical specialty CPD is the expectation that surgeons maintain
          operative logbooks. In several GCC systems:
        </p>
        <ul>
          <li>
            <strong>QCHP:</strong> Surgical logbook review is part of specialist credentialing
            at renewal for surgical specialties. Procedure volume documentation demonstrates
            ongoing competency.
          </li>
          <li>
            <strong>DHA:</strong> Procedural competency documentation may be requested alongside
            CME certificates for surgical specialty license renewal.
          </li>
          <li>
            <strong>Morbidity and Mortality (M&M) conference participation:</strong> In-hospital
            M&M conferences at GCC centres are frequently accredited and count toward CPD hours.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Cardiothoracic surgery CPD requirements and procedural
          scope credentialing vary by authority and specialty classification. Verify current
          requirements with QCHP, SCFHS, DHA, DOH, NHRA, or OMSB before renewal.
        </p>
      </BlogPostLayout>
    </>
  );
}
