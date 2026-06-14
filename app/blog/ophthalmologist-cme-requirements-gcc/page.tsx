import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ophthalmologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA, DOH",
  description:
    "CME requirements for ophthalmologists practicing in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, subspecialty CME, FRCOphth and AAO fellowship recognition, and key ophthalmic conferences accepted in the GCC.",
  openGraph: {
    title: "Ophthalmologist CME GCC 2026 — QCHP, SCFHS, DHA Requirements",
    description:
      "How much CME do ophthalmologists need in GCC countries? Per-authority guide covering QCHP, SCFHS, DHA, and DOH requirements, subspecialty CPD (retina, cornea, glaucoma, paediatric), and how to maximize AAO meeting CME in the GCC context.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Ophthalmologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "CME requirements for ophthalmologists across GCC authorities in 2026.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Ophthalmologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA, DOH"
        description="Ophthalmology is one of the most technically dynamic medical specialties — new surgical techniques, diagnostic imaging modalities, and pharmacological treatments emerge continuously. GCC licensing authorities mandate CME across the renewal cycle; here is what ophthalmologists need to know for each authority."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Ophthalmologist CME Requirements by Authority</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits Required</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Terminology</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>QCHP</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Qatar</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>80 (40/year)</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CPD</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>SCFHS</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Saudi Arabia</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40–60</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Per renewal</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CME</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DHA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Dubai</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CME/CPD</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DOH</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Abu Dhabi</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>30–50</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>1–2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CPD</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>NHRA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Bahrain</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CPD</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>OMSB</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Oman</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CME</td>
            </tr>
          </tbody>
        </table>

        <h2>Subspecialty CME Priorities for GCC Ophthalmologists</h2>
        <p>
          GCC health authorities do not mandate subspecialty-specific CME categories for
          ophthalmologists (unlike some countries that require a minimum proportion in your
          declared specialty). However, professional standards and QCHP/SCFHS credentialing
          for subspecialty practice effectively require subspecialty-relevant continuing education.
        </p>

        <h3>Retina</h3>
        <ul>
          <li>Anti-VEGF therapy updates (new agents, treat-and-extend protocols)</li>
          <li>OCT angiography interpretation advances</li>
          <li>Retinal detachment surgical techniques (vitrectomy, scleral buckle)</li>
          <li>Diabetic retinopathy management — high priority given high diabetes prevalence in GCC</li>
          <li>Retinal gene therapy developments</li>
        </ul>

        <h3>Cornea and Anterior Segment</h3>
        <ul>
          <li>DALK, DSAEK, DMEK technique updates</li>
          <li>Corneal crosslinking for keratoconus (high prevalence in GCC)</li>
          <li>Refractive surgery: SMILE, LASEK, PRK updates</li>
          <li>Dry eye disease management and meibomian gland dysfunction</li>
        </ul>

        <h3>Glaucoma</h3>
        <ul>
          <li>Minimally invasive glaucoma surgery (MIGS) — rapidly evolving with new devices</li>
          <li>IOP monitoring technology (digital tonometry, continuous monitoring)</li>
          <li>Neuroprotection strategies in glaucoma management</li>
        </ul>

        <h3>Paediatric Ophthalmology</h3>
        <ul>
          <li>Retinopathy of prematurity screening and treatment</li>
          <li>Amblyopia management updates</li>
          <li>Strabismus surgical technique updates</li>
        </ul>

        <h3>Oculoplastics</h3>
        <ul>
          <li>Orbital disease management — updated surgical approaches</li>
          <li>Eyelid surgery and periocular aesthetics</li>
          <li>Lacrimal system disorders and dacryocystorhinostomy</li>
        </ul>

        <h2>Key Ophthalmology Conferences Accepted in the GCC</h2>

        <h3>American Academy of Ophthalmology (AAO) Annual Meeting</h3>
        <p>
          The AAO Annual Meeting is the most widely attended ophthalmology conference globally
          and generates AMA PRA Category 1 CME credits — accepted by all GCC licensing
          authorities. The annual meeting generates up to 30+ Category 1 credits, making it
          one of the most efficient single conferences for GCC ophthalmologist CME accumulation.
        </p>

        <h3>European Society of Ophthalmology (SOE) Congress</h3>
        <p>
          SOE generates EACCME credits — recognized by QCHP, DHA, and SCFHS for GCC CME
          purposes. Biennial congress with high attendance from GCC ophthalmologists.
        </p>

        <h3>Arab Ophthalmology Council (AOC) Congress</h3>
        <p>
          The Arab Ophthalmology Council organizes regional conferences with accreditation
          recognized by GCC authorities, particularly QCHP and SCFHS. An important regional
          source of GCC-relevant CME (local disease patterns, epidemiology, practice environment).
        </p>

        <h3>ESCRS (European Society of Cataract and Refractive Surgeons) Annual Congress</h3>
        <p>
          ESCRS generates EACCME credits and is the premier cataract and refractive surgery
          meeting globally. Highly relevant for cornea and refractive specialists.
        </p>

        <h3>World Ophthalmology Congress (WOC)</h3>
        <p>
          Organized by the International Council of Ophthalmology, WOC generates internationally
          recognized CME credits. Held every 4 years.
        </p>

        <h3>Gulf Eye Center Dubai — Regional Conferences</h3>
        <p>
          Dubai-based ophthalmic institutions and conference organizers (Gulf Eye Center,
          Moorfields Eye Hospital Dubai) organize accredited regional conferences with DHA
          CME accreditation — efficient for UAE-based ophthalmologists.
        </p>

        <h2>FRCOphth and American Board of Ophthalmology (ABO) Recognition</h2>
        <p>
          GCC licensing authorities recognize major ophthalmology postgraduate qualifications
          for specialty classification and credentialing:
        </p>
        <ul>
          <li>
            <strong>FRCOphth (Royal College of Ophthalmologists UK):</strong> Recognized as
            specialist qualification by QCHP, DHA, DOH, and SCFHS. FRCOphth holders are
            typically classified at specialist or consultant grade.
          </li>
          <li>
            <strong>ABO Certification (American Board of Ophthalmology):</strong> Recognized
            as specialist qualification. ABO Maintenance of Certification (MOC) requirements
            generate CME credit that overlaps with GCC requirements.
          </li>
          <li>
            <strong>Arab Board in Ophthalmology:</strong> Recognized across GCC countries as
            a regional specialist qualification.
          </li>
        </ul>
        <p>
          ABO MOC activities and FRCOphth CPD requirements can be submitted to your GCC
          licensing authority to satisfy CME renewal requirements — you do not need to
          complete separate activities for each system.
        </p>

        <h2>Managing CME at a GCC Academic Ophthalmology Centre</h2>
        <p>
          Ophthalmologists at academic centres (Hamad Medical Corporation, King Khaled Eye
          Specialist Hospital, Moorfields Eye Hospital UAE) have access to structured in-hospital
          CME through grand rounds, surgical case conferences, and resident teaching that is
          accredited and accepted at renewal. Check with your institution&apos;s CME coordinator
          for the credit categories and maximums that apply.
        </p>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Ophthalmologist CME requirements vary by licensing
          authority, specialty classification, and renewal cycle. Verify current requirements
          directly with your authority (QCHP, SCFHS, DHA, DOH, NHRA, or OMSB) before renewal.
        </p>
      </BlogPostLayout>
    </>
  );
}
