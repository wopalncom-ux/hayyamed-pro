import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for general surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, subspecialty CPD priorities (laparoscopic surgery, oncologic surgery, trauma, bariatric), FRCS and ABS recognition, and the top surgical conferences for GCC CME.",
  openGraph: {
    title: "General Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Complete Guide",
    description:
      "CME guide for general surgeons in GCC countries: per-authority credit requirements, laparoscopic and robotic surgery CPD, oncologic surgery updates, FRCS/FRCSEd and ABS board recognition in GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "General Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "CME requirements for general surgeons across GCC authorities in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do general surgeons need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "General surgeons in Qatar must complete 80 CPD credits per 2-year renewal cycle under QCHP — 40 per year minimum. The standard physician CPD framework applies.",
      },
    },
    {
      "@type": "Question",
      name: "Is the FRCS qualification recognized for general surgeons in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. FRCS (Fellow of the Royal College of Surgeons — England, Edinburgh, Glasgow, or Ireland) is recognized by QCHP, DHA, DOH, and SCFHS as the consultant-grade specialist qualification for surgeons.",
      },
    },
    {
      "@type": "Question",
      name: "Does the American College of Surgeons (ACS) conference count for GCC CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The ACS Clinical Congress (October) generates AMA PRA Category 1 CME credits accepted by all GCC licensing authorities including QCHP, DHA, DOH, and SCFHS.",
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
        title="General Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="General surgery in the GCC spans high-volume laparoscopic procedures, complex oncologic resections, emergency trauma surgery, and a rapidly growing bariatric surgery caseload driven by the region's high obesity prevalence. Structured CME must reflect this diversity."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC General Surgeon CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC General Surgeons</h2>

        <h3>Laparoscopic and Robotic Surgery</h3>
        <ul>
          <li>Advanced laparoscopic cholecystectomy — difficult gallbladder, intraoperative cholangiography, common bile duct exploration</li>
          <li>Laparoscopic hernia repair — TEP, TAPP, complex abdominal wall reconstruction</li>
          <li>Robotic-assisted surgery — da Vinci platform, robot-assisted colorectal, robotic inguinal hernia</li>
          <li>Single-incision laparoscopic surgery (SILS) and natural orifice techniques</li>
          <li>Laparoscopic common bile duct exploration and cholangiopancreatography</li>
        </ul>

        <h3>Colorectal Surgery</h3>
        <ul>
          <li>Laparoscopic colorectal resection — right hemicolectomy, sigmoid colectomy, anterior resection</li>
          <li>Total mesorectal excision (TME) for rectal cancer — technique updates, lateral lymph node dissection</li>
          <li>Enhanced recovery after surgery (ERAS) protocols in colorectal</li>
          <li>Transanal total mesorectal excision (TaTME) — patient selection, technique, learning curve</li>
          <li>Colorectal cancer screening and surveillance — updated GCC-specific protocols</li>
        </ul>

        <h3>Bariatric and Metabolic Surgery</h3>
        <p>
          The GCC has among the highest obesity prevalence globally, driving high bariatric surgery
          volumes. This is a priority CME area for GCC general surgeons.
        </p>
        <ul>
          <li>Laparoscopic sleeve gastrectomy — technique refinements, complication management</li>
          <li>Roux-en-Y gastric bypass — long-term outcomes, revision surgery</li>
          <li>One anastomosis gastric bypass (OAGB/MGB) — evidence update</li>
          <li>Bariatric surgery in type 2 diabetes — metabolic surgery indications, remission outcomes</li>
          <li>Revisional bariatric surgery — indications, technique, outcomes</li>
        </ul>

        <h3>Oncologic Surgery</h3>
        <ul>
          <li>Hepatocellular carcinoma resection — segment anatomy, intraoperative ultrasound, margin management</li>
          <li>Liver metastasectomy — colorectal liver metastases, patient selection, two-stage hepatectomy</li>
          <li>Pancreatic surgery — Whipple procedure, distal pancreatectomy, minimally invasive pancreatic resection</li>
          <li>Thyroid and parathyroid surgery — central compartment dissection, parathyroid autotransplantation</li>
          <li>Breast surgery — oncoplastic breast surgery, sentinel lymph node biopsy updates</li>
        </ul>

        <h3>Emergency and Trauma Surgery</h3>
        <ul>
          <li>Damage control surgery — laparotomy, packing, planned re-look</li>
          <li>Acute care surgery — acute appendicitis, SBO management, acute diverticulitis</li>
          <li>Abdominal compartment syndrome — management principles</li>
          <li>ATLS updates — trauma assessment and resuscitation in the surgical patient</li>
        </ul>

        <h2>Best Surgical Conferences for GCC CME</h2>

        <h3>ACS Clinical Congress (American College of Surgeons)</h3>
        <p>
          The ACS Clinical Congress (October, USA) is the premier annual surgical meeting globally.
          Generates AMA PRA Category 1 CME credits accepted by all GCC authorities. Comprehensive
          coverage across all general surgery subspecialties — laparoscopic, oncologic, bariatric,
          trauma, and colorectal surgery.
        </p>

        <h3>SAGES Annual Meeting (Society of American Gastrointestinal and Endoscopic Surgeons)</h3>
        <p>
          SAGES (April) is the leading minimally invasive surgery conference, generating AMA PRA
          Category 1 credits. Essential for GCC surgeons with a laparoscopic and robotic practice.
        </p>

        <h3>EAES (European Association for Endoscopic Surgery)</h3>
        <p>
          EAES annual meeting generates EACCME credits accepted by all GCC authorities. Strong
          European focus on advanced laparoscopic technique, robotic surgery, and NOTES procedures.
        </p>

        <h3>IFSO (International Federation for the Surgery of Obesity)</h3>
        <p>
          IFSO World Congress (annual) is the premier bariatric surgery meeting, generating EACCME
          credits. Given GCC obesity prevalence, this is a particularly high-value meeting for
          GCC general surgeons with a bariatric practice.
        </p>

        <h2>FRCS, ABS, and Arab Board Recognition</h2>
        <ul>
          <li><strong>FRCS (Fellow of the Royal College of Surgeons — England/Edinburgh/Glasgow/Ireland):</strong> Recognized by QCHP, DHA, DOH, and SCFHS as consultant-grade specialist qualification. Intercollegiate FRCS in General Surgery is the standard route.</li>
          <li><strong>American Board of Surgery (ABS):</strong> Recognized by GCC authorities as specialist qualification. ABS MOC activities count toward GCC CME renewal.</li>
          <li><strong>Arab Board in General Surgery:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia, Kuwait, and Qatar.</li>
          <li><strong>FACS (Fellow of the American College of Surgeons):</strong> Recognized as credential in GCC hospital credentialing; not a substitute for specialist licensing board certification.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> General surgeon CME requirements and surgical scope credentialing vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
