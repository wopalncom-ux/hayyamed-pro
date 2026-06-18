import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oral & Maxillofacial Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for oral and maxillofacial surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, dual dental/medical licensing, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Oral & Maxillofacial Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for oral and maxillofacial surgeons practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Oral & Maxillofacial Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Oral & Maxillofacial Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Oral and maxillofacial surgery spans both medical and dental licensing — a unique complexity in the GCC. Surgeons in this specialty must navigate dual professional registration requirements alongside standard CME obligations for license renewal."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC OMFS CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; dental + medical tracks"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Dental or medical specialty board"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting; dental license"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "Classified by scope of practice"],
              ["MOH Kuwait", "Kuwait", "30 CME", "1 year", "Annual renewal"],
              ["NHRA", "Bahrain", "40 CPD", "2 years", "Verified activities"],
              ["OMSB", "Oman", "40 CME", "2 years", "Dental + medical registration"],
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

        <h2>The Dual Licensing Challenge for OMFS in the GCC</h2>
        <p>Oral and maxillofacial surgery is unique in requiring both a medical degree and a dental degree in most training pathways. In the GCC, many authorities register OMFS practitioners under both their medical council and dental council. This means CME obligations may technically apply to both registrations. Qatar&apos;s QCHP handles this within a single practitioner portal, while Saudi Arabia&apos;s SCFHS may require OMFS surgeons to hold recognition under both medical and dental specialty committees. Always verify with the specific authority which registration pathway applies to your qualifications.</p>

        <h2>Key CME Topics for Oral and Maxillofacial Surgeons</h2>
        <ul>
          <li><strong>Head and neck oncology</strong> — surgical approaches, reconstruction, neck dissection techniques, multidisciplinary tumour board management</li>
          <li><strong>Orthognathic surgery</strong> — virtual surgical planning, skeletal Class III correction, distraction osteogenesis</li>
          <li><strong>Facial trauma</strong> — panfacial fractures, orbital reconstruction, mandibular fixation</li>
          <li><strong>Salivary gland disease</strong> — parotid surgery, sialendoscopy, pleomorphic adenoma management</li>
          <li><strong>Temporomandibular joint</strong> — arthroscopy, total joint replacement, condylar pathology</li>
          <li><strong>Cleft lip and palate</strong> — primary repair, alveolar bone grafting, speech outcomes</li>
          <li><strong>Implant surgery</strong> — bone grafting, immediate placement, complex implant rehabilitation</li>
          <li><strong>Anaesthesia in OMFS</strong> — sedation protocols, airway management, day-case surgery standards</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>International Association of Oral and Maxillofacial Surgeons (IAOMS) World Congress</li>
          <li>British Association of Oral and Maxillofacial Surgeons (BAOMS) Annual Scientific Meeting</li>
          <li>American Association of Oral and Maxillofacial Surgeons (AAOMS) Annual Meeting</li>
          <li>Gulf Dentistry Conference — OMFS sessions</li>
          <li>Arab Health — surgical and dental CME sessions</li>
          <li>Saudi Dental Society Annual Meeting — OMFS track</li>
        </ul>

        <h2>Surgical Skills Courses and Simulation</h2>
        <p>Skills laboratories covering facial trauma plating, orthognathic osteotomies, and reconstructive flap techniques are accepted as formal CME by most GCC authorities when delivered by accredited institutions. Virtual surgical planning workshops are increasingly recognised as structured learning activities. Ensure you obtain an attendance certificate with credit value confirmed by the organising body.</p>

        <h2>Track Your OMFS CME</h2>
        <p>Hayya Med Pro lets you track CME credits across multiple professional registrations and countries with automated gap alerts before each renewal deadline.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
