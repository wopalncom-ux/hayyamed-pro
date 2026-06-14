import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orthopaedic Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for orthopaedic surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, arthroplasty and sports medicine CPD priorities, trauma updates, AAOS/EFORT conference CME recognition, and FRCS(Orth)/ABOS qualification recognition across GCC licensing authorities.",
  openGraph: {
    title: "Orthopaedic Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Orthopaedics Guide",
    description:
      "CME guide for orthopaedic surgeons in GCC countries: credit requirements by authority, arthroplasty and revision surgery, sports medicine and ACL reconstruction, trauma and spine, AAOS/EFORT conference recognition, and FRCS(Orth)/ABOS qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Orthopaedic Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Orthopaedic Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Orthopaedic surgery is one of the highest-volume surgical specialties across GCC tertiary hospitals. The combination of a young, sports-active population, a high obesity burden driving arthroplasty demand, and a significant trauma caseload (road traffic accidents, occupational injuries) creates a wide CME mandate spanning arthroplasty, sports medicine, trauma, and spine."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Orthopaedic Surgeon CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Orthopaedic Surgeons</h2>

        <h3>Arthroplasty — Hip and Knee Replacement</h3>
        <p>
          Arthroplasty demand is growing rapidly across the GCC driven by obesity-related osteoarthritis and
          an ageing expatriate workforce. CME priorities include:
        </p>
        <ul>
          <li>Total knee arthroplasty (TKA) — updated implant selection, robotically-assisted TKA (Mako, ROSA), updated alignment philosophies (kinematic vs. mechanical alignment)</li>
          <li>Total hip arthroplasty (THA) — anterior approach THA, dual-mobility cups, periprosthetic joint infection (PJI) prevention and management</li>
          <li>Revision arthroplasty — complex revision techniques, bone loss management (tantalum augments, structural allograft), modular revision systems</li>
          <li>Unicompartmental knee arthroplasty (UKA) — patient selection, updated outcomes data</li>
          <li>Enhanced recovery after surgery (ERAS) — multimodal analgesia, tranexamic acid protocols, rapid mobilisation; perioperative optimisation in diabetic patients (high GCC relevance)</li>
        </ul>

        <h3>Sports Medicine and Arthroscopy</h3>
        <ul>
          <li>ACL reconstruction — updated graft selection (hamstring vs. patellar tendon vs. quadriceps tendon), additional anterolateral ligament (ALL) reconstruction, return-to-sport criteria</li>
          <li>Meniscal surgery — meniscal preservation philosophy, meniscal repair techniques (inside-out, all-inside), meniscal root repair</li>
          <li>Shoulder arthroscopy — rotator cuff repair techniques, SLAP repair, Bankart/Latarjet for shoulder instability</li>
          <li>Cartilage restoration — microfracture, OATS, ACI/MACI — updated GCC hospital capability and patient selection</li>
          <li>Foot and ankle arthroscopy — hindfoot arthroscopy, subtalar arthroscopy, growing subspecialty in GCC centres</li>
        </ul>

        <h3>Trauma</h3>
        <ul>
          <li>Polytrauma management — damage control orthopaedics (DCO), timing of definitive fixation, fat embolism prevention</li>
          <li>Hip fractures in the elderly — early surgical treatment within 36 hours, anaesthetic considerations, post-operative rehabilitation; high mortality risk in GCC elderly population</li>
          <li>Fracture fixation — updated nail designs for femoral and tibial fractures, locking plate systems, minimally invasive approaches</li>
          <li>Paediatric orthopaedics trauma — physeal injuries, supracondylar fractures, forearm fractures in children</li>
        </ul>

        <h3>Spine</h3>
        <ul>
          <li>Degenerative spine — updated evidence for surgical vs. conservative management of lumbar stenosis, disc herniation, and adjacent segment disease</li>
          <li>Minimally invasive spine surgery (MISS) — TLIF, PLIF, percutaneous pedicle screw systems</li>
          <li>Spinal deformity — adult degenerative scoliosis, complex realignment procedures</li>
          <li>Spinal cord injury — ASIA classification updates, acute management and rehabilitation coordination</li>
        </ul>

        <h2>Best Orthopaedic Conferences for GCC CME</h2>

        <h3>AAOS Annual Meeting (American Academy of Orthopaedic Surgeons)</h3>
        <p>
          The AAOS Annual Meeting (March, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA,
          DOH, SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest orthopaedic meeting — instructional
          course lectures (ICLs), technical skills labs, and symposia across all subspecialties.
        </p>

        <h3>EFORT Congress (European Federation of National Associations of Orthopaedics and Traumatology)</h3>
        <p>
          EFORT Congress (May/June, European cities) generates EACCME credits with transfer provisions for GCC
          authorities. Strong arthroplasty, trauma, and basic science content — particularly relevant for
          surgeons trained in UK/European systems.
        </p>

        <h3>ISAKOS Congress (International Society of Arthroscopy, Knee Surgery and Orthopaedic Sports Medicine)</h3>
        <p>
          ISAKOS (held biennially) generates EACCME credits. The premier sports medicine and arthroscopy meeting
          globally — essential for GCC orthopaedic surgeons with significant sports medicine caseloads.
        </p>

        <h2>FRCS(Orth), ABOS, and Arab Board Recognition</h2>
        <ul>
          <li><strong>FRCS(Orth) (Fellow of the Royal College of Surgeons — Trauma and Orthopaedic Surgery, UK/Ireland):</strong> Recognized by QCHP, DHA, DOH, and SCFHS as the consultant-grade specialist qualification for orthopaedic surgeons. One of the most widely held specialist qualifications among GCC orthopaedic consultants.</li>
          <li><strong>ABOS (American Board of Orthopaedic Surgery):</strong> Recognized by DHA, DOH, and several private hospital credentialing systems. ABOS diplomates with subspecialty Certificates of Added Qualification (CAQ) are well-regarded in GCC specialist credentialing.</li>
          <li><strong>Arab Board in Orthopaedic Surgery:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
          <li><strong>FEBOT (Fellow of the European Board of Orthopaedics and Traumatology):</strong> Recognized in several GCC hospital credentialing systems as a specialist distinction.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Orthopaedic surgeon CME requirements vary by licensing authority and subspecialty. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
