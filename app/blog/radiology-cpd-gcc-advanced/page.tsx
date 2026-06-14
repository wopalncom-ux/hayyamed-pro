import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Radiology CPD Requirements in the GCC 2026 — Diagnostic and Interventional Radiology CME",
  description:
    "Advanced CPD guide for radiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, subspecialty CME priorities (interventional radiology, neuroradiology, breast imaging, AI in radiology), FRCR and ABR recognition, and top radiology conferences for GCC CME.",
  openGraph: {
    title: "Radiology CPD GCC 2026 — Diagnostic and IR Radiologist CME Guide",
    description:
      "CME and CPD guide for diagnostic and interventional radiologists in the GCC: authority-by-authority credit requirements, subspecialty CPD priorities, AI in radiology CME, FRCR and ABR recognition, and the top RSNA/ECR/CIRSE conferences for GCC radiology CME.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Radiology CPD Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "Advanced CPD guide for radiologists across GCC authorities in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do radiologists need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Radiologists in Qatar must complete 80 CPD credits per 2-year renewal cycle under QCHP — 40 per year minimum. The standard physician CPD framework applies; there are no separate radiology-specific credit requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Does RSNA Annual Meeting count as CME for GCC radiologists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The RSNA Annual Meeting generates AMA PRA Category 1 CME credits accepted by all GCC licensing authorities including QCHP, DHA, DOH, and SCFHS. RSNA is one of the highest credit-generating conferences for radiologists globally.",
      },
    },
    {
      "@type": "Question",
      name: "Is FRCR recognized for radiology licensing in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. FRCR (Fellow of the Royal College of Radiologists, UK) is recognized by QCHP, DHA, DOH, and SCFHS as the consultant-grade specialist qualification for radiologists. It is the most common specialist qualification among GCC radiologists trained in the UK.",
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
        title="Radiology CPD Requirements in the GCC 2026 — Diagnostic and Interventional Radiology CME"
        description="Radiology is undergoing the most significant transformation of any medical specialty, with AI-assisted diagnosis, advanced cross-sectional imaging, and expanding interventional procedures reshaping practice. GCC radiologists must maintain CPD portfolios that reflect these rapid changes while meeting their specific authority requirements."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Radiologist CPD Requirements by Authority</h2>

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

        <h2>Subspecialty CPD Priorities for GCC Radiologists</h2>

        <h3>AI in Radiology — The Defining CPD Topic of 2026</h3>
        <p>
          Artificial intelligence is transforming radiology faster than any other medical
          specialty. GCC radiologists must include AI-specific CPD in their portfolio:
        </p>
        <ul>
          <li>AI-assisted chest X-ray triage — pneumothorax, pleural effusion, nodule detection</li>
          <li>CT AI applications — pulmonary embolism detection, coronary artery calcium scoring, stroke CT perfusion analysis</li>
          <li>MRI AI — prostate cancer PI-RADS automated scoring, breast MRI lesion characterization</li>
          <li>AI workflow integration — PACS integration, radiologist-AI collaboration model, workflow prioritization</li>
          <li>Regulatory and medico-legal aspects of AI in radiology — who is responsible for AI errors?</li>
        </ul>
        <p>
          <strong>Key resource:</strong> The European Society of Radiology (ESR) and RSNA both
          offer dedicated AI in radiology CPD pathways that generate EACCME and AMA PRA Category 1
          credits respectively — accepted by all GCC authorities.
        </p>

        <h3>Interventional Radiology (IR)</h3>
        <ul>
          <li>Uterine fibroid embolisation (UFE) — patient selection, technique updates, outcomes</li>
          <li>TIPS (Transjugular Intrahepatic Portosystemic Shunt) — updated indications, Viatorr TIPS</li>
          <li>Hepatocellular carcinoma — TACE, SIRT (Y-90), ablation (RFA, MWA) — updated BCLC staging</li>
          <li>Peripheral arterial disease — PAD endovascular techniques, drug-coated balloon evidence</li>
          <li>Venous interventions — venous stenting for May-Thurner, iliofemoral DVT thrombolysis</li>
          <li>Oncologic IR — tumour ablation (renal, hepatic, pulmonary), arterial embolisation</li>
        </ul>

        <h3>Neuroradiology</h3>
        <ul>
          <li>Stroke imaging — CT perfusion, advanced MRI diffusion techniques, mechanical thrombectomy patient selection</li>
          <li>Brain tumour imaging — updated WHO CNS tumour classification 2021, radiogenomics</li>
          <li>Spine imaging — updated disc classification, post-surgical spine evaluation</li>
          <li>Neurointerventional radiology — aneurysm coiling, flow diverters, mechanical thrombectomy technique</li>
        </ul>

        <h3>Breast Imaging</h3>
        <ul>
          <li>Tomosynthesis (3D mammography) — interpretation updates, recall rate data</li>
          <li>Breast MRI — screening indication updates, abbreviated MRI protocols</li>
          <li>Contrast-enhanced mammography (CEM) — when to use, interpretation framework</li>
          <li>Breast ultrasound — BI-RADS updates, elastography</li>
          <li>AI-assisted mammography reading — CAD systems, AI triage in screening programmes</li>
        </ul>

        <h3>Nuclear Medicine and Molecular Imaging</h3>
        <ul>
          <li>PSMA PET-CT for prostate cancer — staging, recurrence detection, theranostics</li>
          <li>DOTATATE PET-CT for neuroendocrine tumours</li>
          <li>FDG PET-CT updated cancer staging protocols</li>
          <li>Cardiac PET — myocardial perfusion, sarcoidosis, cardiac amyloidosis</li>
          <li>Lu-177 PSMA and Lu-177 DOTATATE radionuclide therapy — clinical management aspects</li>
        </ul>

        <h2>Best Radiology Conferences for GCC CME</h2>

        <h3>RSNA (Radiological Society of North America) Annual Meeting</h3>
        <p>
          RSNA (November/December, Chicago) is the world&apos;s largest radiology conference.
          Generates AMA PRA Category 1 CME credits — up to 40+ credits available with dedicated
          learning paths. The definitive conference for AI in radiology, cross-sectional imaging,
          and interventional radiology updates.
        </p>

        <h3>ECR (European Congress of Radiology)</h3>
        <p>
          ECR (February/March, Vienna) generates EACCME credits accepted by all GCC authorities.
          The European counterpart to RSNA with particularly strong AI radiology content and
          European imaging guideline presentations. Large virtual attendance option generates
          full EACCME credit.
        </p>

        <h3>CIRSE (Cardiovascular and Interventional Radiology Society of Europe)</h3>
        <p>
          CIRSE (September, European cities) is the premier interventional radiology conference,
          generating EACCME credits. Essential for GCC IR radiologists — covers vascular,
          oncologic, and non-vascular IR comprehensively.
        </p>

        <h3>Arab Congress of Radiology (ACR)</h3>
        <p>
          The Arab Congress of Radiology provides QCHP/DHA-accredited CME with regionally
          relevant content — population-specific disease prevalence, local imaging protocols,
          and regulatory context.
        </p>

        <h2>FRCR, ABR, and Arab Board Recognition</h2>
        <ul>
          <li>
            <strong>FRCR (Fellow of the Royal College of Radiologists, UK):</strong> Recognized
            by QCHP, DHA, DOH, and SCFHS as consultant-grade specialist qualification. Most
            common specialist qualification among UK-trained GCC radiologists.
          </li>
          <li>
            <strong>American Board of Radiology (ABR):</strong> Recognized by GCC authorities as
            specialist qualification. ABR MOC activities generate CME credit applicable to GCC renewal.
          </li>
          <li>
            <strong>Arab Board in Radiology and Medical Imaging:</strong> Recognized across all
            GCC countries; valued particularly in Saudi Arabia, Kuwait, and Qatar.
          </li>
          <li>
            <strong>EBIR (European Board of Interventional Radiology, CIRSE):</strong> Increasingly
            recognized in GCC as a specialist credential for IR radiologists.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Radiology CPD requirements and subspecialty scope credentialing
          vary by licensing authority. Verify current requirements directly with QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
