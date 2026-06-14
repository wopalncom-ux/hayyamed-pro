import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cardiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for cardiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, interventional cardiology and heart failure CPD priorities, ACC/ESC conference CME, MRCP and FACC qualification recognition across GCC licensing authorities.",
  openGraph: {
    title: "Cardiologist CME GCC 2026 — QCHP, SCFHS, DHA Cardiology Guide",
    description:
      "CME guide for cardiologists in GCC countries: credit requirements by authority, interventional cardiology CPD, heart failure updates, atrial fibrillation management, cardiac imaging, ACC/ESC conference recognition, and MRCP/FACC qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cardiologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Cardiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Cardiology carries one of the highest disease burdens in the GCC. Cardiovascular disease is the leading cause of mortality across Qatar, Saudi Arabia, and the UAE. Cardiologists must maintain CME that spans interventional technique, heart failure management, arrhythmia, and cardiac imaging — across some of the most demanding regulatory frameworks in the region."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Cardiologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Cardiologists</h2>

        <h3>Interventional Cardiology</h3>
        <p>
          Interventional cardiology is a dominant subspecialty in GCC tertiary hospitals. CME priorities include:
        </p>
        <ul>
          <li>Percutaneous coronary intervention (PCI) — complex PCI techniques, left main PCI, chronic total occlusion (CTO) revascularisation</li>
          <li>Structural heart disease — TAVR/TAVI procedural updates, MitraClip technique, tricuspid interventions, WATCHMAN LAA closure</li>
          <li>Intravascular imaging — IVUS and OCT guidance for stent optimisation, interpretation of FFR/iFR</li>
          <li>Cardiogenic shock — mechanical circulatory support, Impella, ECMO — a rising priority across GCC cardiac centres</li>
          <li>Radial access techniques — adoption across GCC is high; updated technique and complication management</li>
        </ul>

        <h3>Heart Failure</h3>
        <ul>
          <li>HFrEF pharmacotherapy — updated four-pillar therapy (ACEI/ARB/ARNI, beta-blocker, MRA, SGLT2i) with GCC-specific adherence considerations</li>
          <li>HFpEF management — SGLT2 inhibitors (EMPEROR-Preserved, DELIVER trial outcomes), emerging therapies</li>
          <li>Advanced heart failure — criteria for LVAD implant, cardiac transplantation evaluation, palliative cardiology</li>
          <li>Remote haemodynamic monitoring — CardioMEMS and implantable pressure sensors</li>
          <li>Cardiac rehabilitation — structured exercise prescription, high burden of post-ACS patients in GCC</li>
        </ul>

        <h3>Arrhythmia and Electrophysiology</h3>
        <ul>
          <li>Atrial fibrillation — updated rhythm vs. rate control evidence, early rhythm control (EAST-AFNET), anticoagulation in CKD, GCC-specific stroke risk</li>
          <li>Catheter ablation — pulmonary vein isolation techniques, persistent AF ablation strategies, pulsed-field ablation (PFA)</li>
          <li>Ventricular arrhythmia — ICD programming updates, VT ablation, channelopathy management</li>
          <li>Cardiac implantable devices — subcutaneous ICD, conduction system pacing (His-Purkinje, LBBP)</li>
        </ul>

        <h3>Cardiac Imaging</h3>
        <ul>
          <li>Echocardiography — point-of-care echo, advanced diastology, strain imaging, structural heart procedural guidance</li>
          <li>Cardiac CT — coronary CTA, calcium scoring, CT-FFR, structural planning</li>
          <li>Cardiac MRI — myocardial characterisation, cardiomyopathy evaluation, tissue mapping</li>
        </ul>

        <h2>Best Cardiology Conferences for GCC CME</h2>

        <h3>ACC Annual Scientific Session (American College of Cardiology)</h3>
        <p>
          The ACC Annual Scientific Session (March, USA) generates AMA PRA Category 1 CME credits recognised by QCHP,
          DHA, DOH, SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest cardiology meeting — late-breaking
          trials (NEJM simultaneous publication), guideline sessions, and live case transmission.
        </p>

        <h3>ESC Congress (European Society of Cardiology)</h3>
        <p>
          ESC Congress (August/September, European cities) generates EACCME credits with CME credit transfer provisions
          for GCC authorities. The premier European cardiology conference — guideline launches, hotline sessions, and
          subspecialty hubs covering interventional, heart failure, EP, and imaging simultaneously.
        </p>

        <h3>Arab Heart Congress / Gulf Heart Association</h3>
        <p>
          The Gulf Heart Association Annual Conference and Arab Heart Congress generate QCHP and SCFHS-recognised CME
          credits directly. GCC-specific content — cardiovascular risk in Arab populations, diabetes-related heart
          disease, and local practice guidelines.
        </p>

        <h3>TCT (Transcatheter Cardiovascular Therapeutics)</h3>
        <p>
          TCT (October, USA) generates Category 1 CME. The most important interventional cardiology meeting globally —
          first presentations of major PCI, structural, and peripheral vascular trials. Essential for interventionalists
          practicing in GCC.
        </p>

        <h2>MRCP, FACC, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> Recognized by QCHP, DHA, DOH, and SCFHS as the standard internal medicine qualification gateway to cardiology credentialing. MRCP(UK) holders who completed cardiology specialty training are eligible for consultant-grade registration.</li>
          <li><strong>FACC (Fellow of the American College of Cardiology):</strong> Recognized across GCC as a mark of cardiology distinction. FACC status combined with subspecialty board certification (ABIM Cardiovascular Disease) is well-recognised by DHA, DOH, and SCFHS.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for cardiologists across QCHP, DHA, and DOH.</li>
          <li><strong>Arab Board in Cardiology:</strong> Recognized across all GCC countries; valued particularly in Saudi Arabia (SCFHS), Kuwait (MOH), and Qatar (QCHP).</li>
          <li><strong>FESC (Fellow of the European Society of Cardiology):</strong> Recognized in several GCC hospital credentialing systems as a specialist distinction award.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Cardiologist CME requirements vary by licensing authority and subspecialty. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
