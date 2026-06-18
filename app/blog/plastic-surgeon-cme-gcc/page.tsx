import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plastic Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for plastic and reconstructive surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, accepted conferences, documentation, and renewal deadlines.",
  openGraph: {
    title: "Plastic Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "A complete guide to CME and CPD requirements for plastic and reconstructive surgeons practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Plastic Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Plastic Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Plastic and reconstructive surgery is one of the fastest-evolving surgical specialties in the GCC. For plastic surgeons, staying current through Continuing Medical Education is not optional — it is a licensing requirement enforced by every major GCC authority."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Plastic Surgery CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year minimum"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "By certificate level"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "By classification"],
              ["NHRA", "Bahrain", "40 CPD", "2 years", "Verified activities only"],
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

        <h2>Why CME Matters for Plastic Surgeons</h2>
        <p>
          Plastic surgery techniques evolve rapidly — microsurgical reconstruction, fat grafting, facial rejuvenation, and burn management protocols all see regular evidence-based updates. GCC licensing authorities require plastic surgeons to demonstrate they are keeping pace with these advances through formal CME participation.
        </p>
        <p>
          Hospitals seeking JCI or CBAHI accreditation must also demonstrate that all surgical staff maintain current CME compliance. Plastic surgery departments are among the most scrutinised because of the elective nature of many procedures and the patient safety standards required.
        </p>

        <h2>Qatar — QCHP / DHP-AS Detail</h2>
        <p>
          Under the Ministry of Public Health&apos;s DHP-AS framework, plastic surgeons must accumulate 80 CPD points per two-year cycle with at least 40 points in each year. Acceptable activities include QCHP-accredited conferences, international plastic surgery society meetings (ISAPS, IPRAS), peer-reviewed journal clubs, simulation training, and structured online learning. A maximum of 20% may come from self-directed reading.
        </p>

        <h2>Saudi Arabia — SCFHS Detail</h2>
        <p>
          SCFHS governs plastic surgery CME through the Mumaris+ platform. Requirements range from 40 to 60 CME hours per cycle depending on certificate level. A defined proportion must be Category A — direct clinical activities such as surgical skills workshops, cadaveric training, and SCFHS-accredited conferences. Category B includes research, publications, and teaching.
        </p>

        <h2>UAE — DHA and DOH Detail</h2>
        <p>
          DHA (Dubai) requires 40 CME hours per two-year cycle. DOH (Abu Dhabi) applies 30–50 credits per cycle depending on professional classification. Both accept ISAPS, ESPRAS, and major aesthetic medicine congresses. DHA additionally requires documentation of competency updates for new techniques introduced into practice.
        </p>

        <h2>High-Value CME Topics for Plastic Surgeons</h2>
        <ul>
          <li><strong>Microsurgery and flap reconstruction</strong> — perforator flap advances, free tissue transfer</li>
          <li><strong>Burn management</strong> — acute resuscitation, surgical reconstruction, scar management</li>
          <li><strong>Craniofacial and cleft surgery</strong> — essential for paediatric plastic surgeons</li>
          <li><strong>Aesthetic surgery updates</strong> — rhinoplasty, body contouring, minimally invasive procedures</li>
          <li><strong>Hand surgery</strong> — combined plastic and orthopaedic scope</li>
          <li><strong>Patient safety in elective surgery</strong> — anaesthesia, DVT prophylaxis, infection prevention</li>
          <li><strong>Emerging technologies</strong> — 3D bioprinting, AI in surgical planning, robotic assistance</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>ISAPS (International Society of Aesthetic Plastic Surgery) Annual Congress</li>
          <li>IPRAS (International Confederation for Plastic Reconstructive and Aesthetic Surgery)</li>
          <li>ESPRAS European Congress</li>
          <li>ASPS (American Society of Plastic Surgeons) Annual Meeting</li>
          <li>Arabic Plastic Surgery Society Congresses</li>
          <li>Arab Health — CME sessions relevant to plastic surgery</li>
        </ul>

        <h2>Documentation and Renewal</h2>
        <p>
          All GCC authorities require original certificates showing the activity name, date, credit value, and accrediting body. QCHP uses its online practitioner portal; SCFHS uses Mumaris+; DHA and DOH each have their own portals. Plastic surgeons practising across multiple GCC jurisdictions must maintain compliance separately in each system.
        </p>

        <h2>Track Your CME with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro tracks CME compliance per country, authority, and cycle — with automated gap analysis showing exactly what is still needed in each jurisdiction before the renewal date. Start building your plastic surgery CME portfolio today.
        </p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
