import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colorectal Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for colorectal and general surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, accepted conferences, endoscopy training, and renewal timelines.",
  openGraph: {
    title: "Colorectal Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for colorectal surgeons practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Colorectal Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Colorectal Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Colorectal surgery is a technically demanding subspecialty with a significant cancer burden in the GCC region. Surgeons in this field must maintain current CME compliance for both license renewal and surgical privileges at accredited facilities."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Colorectal Surgeon CME Requirements by Authority</h2>

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
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Surgical specialty board track"],
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

        <h2>Why CME Is Critical for Colorectal Surgeons</h2>
        <p>Colorectal surgery has undergone significant evolution — laparoscopic and robotic approaches, transanal total mesorectal excision (TaTME), enhanced recovery after surgery (ERAS) protocols, and multidisciplinary oncological management have all changed practice substantially. GCC licensing authorities require colorectal surgeons to demonstrate they are keeping pace through formal CME. Hospital accreditation bodies (JCI, CBAHI) additionally require that surgical staff maintain current competency documentation.</p>

        <h2>Key CME Topics for Colorectal Surgeons</h2>
        <ul>
          <li><strong>Laparoscopic and robotic colorectal surgery</strong> — TaTME, SILS, robotic platform updates</li>
          <li><strong>Colorectal cancer management</strong> — TNM staging updates, neoadjuvant therapy, total neoadjuvant treatment</li>
          <li><strong>Inflammatory bowel disease</strong> — Crohn&apos;s surgery, ulcerative colitis, pouch surgery</li>
          <li><strong>Pelvic floor disorders</strong> — incontinence, prolapse repair, nerve-preserving surgery</li>
          <li><strong>Enhanced recovery after surgery (ERAS)</strong> — colorectal-specific protocols</li>
          <li><strong>Endoscopy in surgical practice</strong> — colonoscopy, endoscopic mucosal resection</li>
          <li><strong>Stoma care and reversal</strong> — patient selection, surgical technique, complications</li>
          <li><strong>Colorectal cancer screening</strong> — GCC-specific population screening updates</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>American Society of Colon and Rectal Surgeons (ASCRS) Annual Scientific Meeting</li>
          <li>European Society of Coloproctology (ESCP) Annual Meeting</li>
          <li>Arab Surgeons Association Conferences</li>
          <li>Saudi Surgical Society Annual Meeting</li>
          <li>Arab Health — surgery-relevant CME sessions</li>
        </ul>

        <h2>Documentation and Renewal</h2>
        <p>All GCC authorities require original certificates showing activity name, date, credit value, and accrediting body. QCHP uses its online practitioner portal; SCFHS uses Mumaris+. Colorectal surgeons practising across multiple jurisdictions must track compliance separately in each system. Hayya Med Pro provides cross-country CME tracking with automated gap analysis for each authority.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
