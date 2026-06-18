import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ENT Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for ENT surgeons (Otolaryngologists) in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, accepted conferences, documentation standards, and renewal timelines.",
  openGraph: {
    title: "ENT Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "A complete guide to CME and CPD requirements for ENT / Otolaryngology surgeons practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "ENT Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="ENT Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Ear, Nose and Throat surgery is a high-demand specialty across the GCC. ENT surgeons practising in Qatar, Saudi Arabia, the UAE, and other GCC countries must renew their licenses periodically and demonstrate ongoing professional development through CME or CPD activities."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC ENT Surgeon CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40 per year minimum"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Category A/B split required"],
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

        <h2>Why CME Is Essential for ENT Surgeons</h2>
        <p>
          ENT surgery encompasses a wide scope — paediatric ENT, cochlear implantation, head and neck oncology, skull base surgery, and rhinology. GCC licensing authorities require ENT specialists to engage with CME across their full scope of practice. Surgical privileges at GCC hospitals are tied to license status, meaning a lapsed license directly interrupts the right to operate.
        </p>

        <h2>Qatar — QCHP Detail</h2>
        <p>
          ENT surgeons in Qatar must earn 80 CPD points per two-year cycle with a minimum of 40 points in each year. QCHP accepts QCHP-accredited ENT conferences, AOOS (Arabian Otolaryngology Society) annual meetings, subspecialty workshops in skull base or cochlear implant surgery, simulation labs, and structured online learning. Self-directed learning is capped at 20% of the total.
        </p>

        <h2>Saudi Arabia — SCFHS Detail</h2>
        <p>
          SCFHS classifies Otolaryngology under surgical specialties, requiring 40–60 CME hours per cycle split between Category A (direct clinical education) and Category B (research, teaching, publishing). All activities must be logged on Mumaris+ before renewal submission. Activities not logged in Mumaris+ are not eligible regardless of their quality.
        </p>

        <h2>UAE — DHA and DOH Detail</h2>
        <p>
          DHA requires 40 CME hours per two-year cycle; DOH requires 30–50 credits. Both accept the Gulf Otolaryngology Congress, internationally recognised ENT society meetings, and ACCME-accredited online learning. The Gulf Otolaryngology Congress is particularly well-regarded for DHA credit.
        </p>

        <h2>High-Value CME Topics for ENT Surgeons</h2>
        <ul>
          <li><strong>Endoscopic sinus surgery and rhinology</strong> — FESS advances, balloon sinuplasty, allergy management</li>
          <li><strong>Otology</strong> — cochlear implant updates, stapedectomy outcomes, tympanoplasty</li>
          <li><strong>Head and neck oncology</strong> — thyroid surgery, laryngeal cancer, neck dissection protocols</li>
          <li><strong>Paediatric ENT</strong> — adenotonsillectomy, choanal atresia, neonatal hearing screening</li>
          <li><strong>Skull base surgery</strong> — endoscopic approaches, lateral skull base, pituitary surgery</li>
          <li><strong>Voice and laryngology</strong> — phonosurgery, laryngeal framework surgery</li>
          <li><strong>Obstructive sleep apnoea</strong> — surgical management, CPAP alternatives, multilevel surgery</li>
          <li><strong>Robotic surgery in ENT</strong> — TORS (transoral robotic surgery) applications</li>
        </ul>

        <h2>Key Accepted Conferences</h2>
        <ul>
          <li>Arabian Otolaryngology Society (AOOS) Annual Meeting</li>
          <li>Gulf Otolaryngology Congress</li>
          <li>American Academy of Otolaryngology — Head and Neck Surgery (AAO-HNS) Annual Meeting</li>
          <li>European Academy of Otology and Neuro-Otology (EAONO) Congress</li>
          <li>Arab Health — ENT-relevant CME sessions</li>
          <li>Saudi ENT Society Annual Meeting</li>
          <li>Emirates Otolaryngology Society Meeting</li>
        </ul>

        <h2>Documentation Standards</h2>
        <p>
          ENT surgeons must retain original certificates for every CME activity showing the activity name, date, credit value, and accrediting body. For surgical workshops and cadaveric courses, a letter of participation from the organising institution may also be required. QCHP and SCFHS have both rejected renewals where documentation was incomplete, even when the activity itself was legitimate.
        </p>

        <h2>Track Your ENT CME with Hayya Med Pro</h2>
        <p>
          Many ENT surgeons in the GCC practice across multiple jurisdictions. Hayya Med Pro tracks CME compliance per country and per cycle, with gap analysis showing exactly what each authority still needs before your renewal date.
        </p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
