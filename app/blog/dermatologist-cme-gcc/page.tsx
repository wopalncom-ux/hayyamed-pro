import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dermatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for dermatologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, subspecialty CPD (aesthetic, dermatopathology, paediatric derm), FRCP/AAD board recognition, and the best dermatology conferences for GCC CME.",
  openGraph: {
    title: "Dermatologist CME GCC 2026 — QCHP, SCFHS, DHA Requirements",
    description:
      "How much CME do dermatologists need in GCC countries? Complete per-authority guide with QCHP, SCFHS, DHA, and DOH credit requirements, aesthetic dermatology CPD, and top conferences for GCC dermatologist CME.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Dermatologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "CME requirements for dermatologists across GCC authorities in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do dermatologists need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dermatologists in Qatar must complete 80 CPD credits per 2-year renewal cycle under QCHP, which equates to a minimum of 40 credits per year. There is no separate subspecialty requirement — the standard physician CPD framework applies.",
      },
    },
    {
      "@type": "Question",
      name: "Do aesthetic dermatology procedures count as CME in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aesthetic dermatology training courses (injectables, laser training, chemical peels) count as CME when offered by accredited providers. Hands-on workshops with accreditation certificates from QCHP, DHA, or SCFHS recognized providers are accepted.",
      },
    },
    {
      "@type": "Question",
      name: "Is the American Academy of Dermatology (AAD) Annual Meeting accepted for GCC CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The AAD Annual Meeting generates AMA PRA Category 1 CME credits, which are accepted by all GCC licensing authorities including QCHP, DHA, and SCFHS.",
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
        title="Dermatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Dermatology in the GCC spans medical, surgical, and aesthetic practice in one of the world's most demanding cosmetic markets. From chronic skin disease management to cutting-edge laser procedures, GCC dermatologists must maintain broad CME portfolios. Here is what each authority requires."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Dermatologist CME Requirements by Authority</h2>

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

        <h2>Dermatology Subspecialty CME Priorities in the GCC</h2>

        <h3>Medical Dermatology</h3>
        <p>
          Medical dermatology carries the highest CME priority for GCC-licensed dermatologists
          because of the unique disease profile in the region:
        </p>
        <ul>
          <li>
            <strong>Psoriasis and atopic dermatitis:</strong> Biologic therapy updates are
            the single most impactful CME category — IL-17, IL-23, JAK inhibitor options
            and patient selection criteria evolve rapidly. GCC dermatologists managing
            psoriasis or atopic dermatitis on biologics should complete targeted CME annually.
          </li>
          <li>
            <strong>Hyperpigmentation and melasma:</strong> Higher prevalence in darker
            skin phototypes common in GCC patient populations. Updated treatment protocols
            (oral tranexamic acid, combination topical therapy, laser parameters for skin
            types IV–VI) are key CPD topics.
          </li>
          <li>
            <strong>Acne management:</strong> Dietary factors, antibiotic resistance,
            isotretinoin monitoring protocols, and biologic options for severe refractory acne.
          </li>
          <li>
            <strong>Hair disorders:</strong> Alopecia areata and androgenetic alopecia management
            has evolved significantly with JAK inhibitor approval for alopecia areata.
          </li>
        </ul>

        <h3>Aesthetic and Procedural Dermatology</h3>
        <p>
          The GCC is one of the world&apos;s most active aesthetic medicine markets. Dermatologists
          practicing aesthetic procedures should prioritize CPD in:
        </p>
        <ul>
          <li>Botulinum toxin injection techniques — facial anatomy updates, new formulations</li>
          <li>Hyaluronic acid filler — volumization, lip augmentation, tear trough management, complication prevention</li>
          <li>Laser and energy-based devices — Q-switched, fractional CO2, IPL, radiofrequency for GCC skin types</li>
          <li>Chemical peels — protocol selection for phototypes IV–VI (prevalent GCC skin types)</li>
          <li>Body contouring — cryolipolysis, HIFU, radiofrequency body treatments</li>
        </ul>
        <p>
          <strong>Regulatory note:</strong> Aesthetic procedures in the GCC require specific
          credentialing in addition to CME. QCHP, DHA, and DOH issue separate aesthetic
          medicine scope extensions for certain procedures. Ensure your CME includes
          formal training certificates for the specific devices and techniques you perform.
        </p>

        <h3>Surgical Dermatology</h3>
        <ul>
          <li>Mohs micrographic surgery technique updates (limited but growing in GCC specialist centres)</li>
          <li>Dermoscopy and reflectance confocal microscopy for melanoma diagnosis</li>
          <li>Non-melanoma skin cancer management — surgical excision margins, reconstruction</li>
          <li>Skin cancer in darker skin phototypes — often present at more advanced stages</li>
        </ul>

        <h3>Dermatopathology</h3>
        <ul>
          <li>Digital pathology integration and AI-assisted dermatopathology</li>
          <li>Cutaneous lymphoma updates — new WHO classification</li>
          <li>Immunodermatology — bullous diseases, connective tissue disorders</li>
        </ul>

        <h2>Best Dermatology Conferences for GCC CME</h2>

        <h3>American Academy of Dermatology (AAD) Annual Meeting</h3>
        <p>
          The AAD Annual Meeting (March, typically Las Vegas or Washington DC) is the world&apos;s
          largest dermatology conference. Generates AMA PRA Category 1 CME credits accepted
          by all GCC authorities — up to 25+ credits available. Essential for dermatologists
          seeking comprehensive CME in a single trip.
        </p>

        <h3>European Academy of Dermatology and Venereology (EADV) Congress</h3>
        <p>
          EADV (October, European cities) generates EACCME credits recognized by QCHP,
          DHA, and SCFHS. Strong focus on European dermatology and venereology; excellent
          for psoriasis, atopic dermatitis, and immunodermatology updates.
        </p>

        <h3>IMCAS World Congress (International Master Course on Aging Science)</h3>
        <p>
          IMCAS (Paris, January) is the premier aesthetic dermatology and plastic surgery
          conference. Generates CME credits with EACCME accreditation. Indispensable for
          GCC aesthetic dermatologists — features master classes on injectables, lasers,
          and non-surgical body contouring.
        </p>

        <h3>Gulf Dermatology Congress</h3>
        <p>
          The Gulf Dermatology Congress provides DHA or QCHP-accredited CME credits and
          focuses on GCC-relevant topics — high prevalence skin conditions, skin types IV–VI,
          and the regulatory environment. The most convenient regional option for GCC dermatologists.
        </p>

        <h3>Arab Health Dermatology Sessions (Dubai)</h3>
        <p>
          Arab Health includes dermatology device and aesthetic medicine sessions with
          DHA-accredited CME. The co-located AMWC Middle East (Aesthetic and Anti-Aging
          Medicine World Congress) is particularly relevant for aesthetic dermatologists.
        </p>

        <h2>FRCP(Derm), AAD ABIM Board Certification, and GCC Recognition</h2>
        <ul>
          <li>
            <strong>MRCP(UK) with dermatology specialty training + CCT Dermatology:</strong>
            UK consultant dermatologist qualification — fully recognized by QCHP, DHA,
            DOH, and SCFHS at consultant grade.
          </li>
          <li>
            <strong>American Board of Dermatology (ABD) certification:</strong> Recognized
            as specialist qualification by GCC authorities. ABD MOC activities count toward
            GCC CME requirements.
          </li>
          <li>
            <strong>Arab Board in Dermatology:</strong> Recognized across all GCC countries;
            valued particularly in Saudi Arabia and Qatar.
          </li>
          <li>
            <strong>Fellowship of the Royal College of Physicians (Dermatology):</strong>
            FRCP recognized as senior specialist/consultant qualification.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Dermatologist CME and aesthetic medicine scope requirements
          vary by authority, specialty classification, and procedure type. Verify current CME
          requirements and procedural scope eligibility directly with QCHP, DHA, DOH, SCFHS,
          NHRA, or OMSB before renewal.
        </p>
      </BlogPostLayout>
    </>
  );
}
