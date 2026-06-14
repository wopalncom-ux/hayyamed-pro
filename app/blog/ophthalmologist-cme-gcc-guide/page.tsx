import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ophthalmologist CME Requirements in the GCC 2026 — QCHP, DHA, SCFHS Deep Guide",
  description:
    "Detailed CME requirements for ophthalmologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, subspecialty CPD (retina, glaucoma, cataract surgery, cornea, paediatric ophthalmology), ICO board recognition, and top ophthalmology conferences for GCC CME.",
  openGraph: {
    title: "Ophthalmologist CME GCC 2026 — QCHP, DHA, SCFHS Complete Guide",
    description:
      "CME guide for ophthalmologists in GCC countries: per-authority credit requirements, surgical subspecialty CPD (vitreoretinal, glaucoma, cornea), AAO and ESCRS conference CME, and FRCOphth/ABOphth recognition.",
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do ophthalmologists need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ophthalmologists in Qatar must complete 80 CPD credits per 2-year renewal cycle under QCHP — 40 per year minimum. The standard physician CPD framework applies; there are no separate subspecialty credit requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Is the AAO Annual Meeting accepted for GCC ophthalmologist CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The American Academy of Ophthalmology (AAO) Annual Meeting generates AMA PRA Category 1 CME credits accepted by all GCC licensing authorities including QCHP, DHA, DOH, and SCFHS.",
      },
    },
    {
      "@type": "Question",
      name: "Is the FRCOphth qualification recognized in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. FRCOphth (Fellow of the Royal College of Ophthalmologists, UK) is recognized by QCHP, DHA, DOH, and SCFHS as the consultant-grade specialist qualification for ophthalmologists. It is the most common specialist qualification among GCC ophthalmologists trained in the UK.",
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
        title="Ophthalmologist CME Requirements in the GCC 2026 — QCHP, DHA, SCFHS Deep Guide"
        description="Ophthalmology in the GCC is a rapidly advancing specialty, from high-volume cataract surgery programmes to cutting-edge vitreoretinal procedures and refractive surgery. The demand for ophthalmological services in the region continues to grow, making structured CME critical for maintaining both licensure and clinical excellence."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Ophthalmologist CME Requirements by Authority</h2>

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
              ["DHA", "Dubai", "40", "2 years", "CME/CPD"],
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

        <h2>Subspecialty CME Priorities for GCC Ophthalmologists</h2>

        <h3>Cataract and Refractive Surgery</h3>
        <p>
          Cataract surgery is the highest-volume ophthalmic procedure in GCC hospitals.
          CPD priorities:
        </p>
        <ul>
          <li>Phacoemulsification technique updates — torsional ultrasound, bimanual microincision</li>
          <li>Premium IOL selection (toric, extended depth of focus, multifocal) — patient counselling and biometry</li>
          <li>LASER-assisted cataract surgery (LACS) — femtosecond platforms</li>
          <li>Refractive surgery updates — SMILE, LASIK, PRK surface ablation; patient selection and retreatment</li>
          <li>Keratoconus management — corneal cross-linking (CXL), DALK, topography-guided treatments</li>
        </ul>

        <h3>Vitreoretinal Surgery</h3>
        <ul>
          <li>Intravitreal injection technique and anti-VEGF therapy (ranibizumab, aflibercept, faricimab) for wAMD, DME, and RVO</li>
          <li>25G/27G vitrectomy — membrane peeling, retinal detachment repair</li>
          <li>Diabetic vitreoretinal surgery — tractional retinal detachment, vitreous haemorrhage</li>
          <li>OCT-A interpretation — retinal microvasculature imaging in AMD, diabetic retinopathy</li>
          <li>Gene therapy in inherited retinal dystrophies — emerging clinical protocols</li>
        </ul>
        <p>
          <strong>Regional note:</strong> Diabetic retinopathy is a high-priority subspecialty area in
          GCC ophthalmology given the extremely high prevalence of type 2 diabetes in the region —
          among the highest in the world. Updated diabetic eye disease screening and treatment
          protocols should be a CME priority for all GCC ophthalmologists.
        </p>

        <h3>Glaucoma</h3>
        <ul>
          <li>Minimally invasive glaucoma surgery (MIGS) — iStent, Hydrus, XEN gel stent</li>
          <li>Selective laser trabeculoplasty (SLT) as first-line treatment — LiGHT trial updates</li>
          <li>Glaucoma imaging — OCT nerve fibre layer, optic disc analysis interpretation</li>
          <li>Normal tension glaucoma — evidence-based management</li>
        </ul>

        <h3>Cornea and External Disease</h3>
        <ul>
          <li>DMEK and DSAEK endothelial keratoplasty technique updates</li>
          <li>Corneal cross-linking (CXL) protocols — paediatric keratoconus, accelerated CXL</li>
          <li>Dry eye disease — updated DEWS II grading and management; meibomian gland dysfunction</li>
          <li>Ocular surface disease in diabetic patients — a high-prevalence GCC concern</li>
        </ul>

        <h3>Paediatric Ophthalmology</h3>
        <ul>
          <li>Amblyopia management — updated patching and atropine penalisation protocols</li>
          <li>Strabismus surgery — adjustable sutures, paediatric anaesthesia considerations</li>
          <li>Retinopathy of prematurity (ROP) — anti-VEGF versus laser for Zone 1 disease</li>
          <li>Paediatric cataract management — lens choice and visual rehabilitation</li>
        </ul>

        <h2>Best Ophthalmology Conferences for GCC CME</h2>

        <h3>AAO (American Academy of Ophthalmology) Annual Meeting</h3>
        <p>
          The AAO Annual Meeting (October) is the world&apos;s largest ophthalmology conference.
          Generates AMA PRA Category 1 CME credits accepted by all GCC authorities — up to 20+
          credits available across dedicated tracks in retina, glaucoma, cornea, cataract, and
          paediatric ophthalmology.
        </p>

        <h3>ESCRS (European Society of Cataract and Refractive Surgeons) Annual Meeting</h3>
        <p>
          ESCRS (September, European cities) generates EACCME credits recognized by QCHP, DHA,
          and SCFHS. The premier cataract and refractive surgery conference globally; essential
          for GCC ophthalmologists with a surgical practice.
        </p>

        <h3>EURETINA Annual Meeting</h3>
        <p>
          EURETINA (September) is the leading European retina conference, generating EACCME credits.
          Strong focus on AMD, diabetic retinopathy, and retinal imaging — highly relevant for
          GCC ophthalmologists given regional diabetic eye disease burden.
        </p>

        <h3>Gulf Eye Forum / Arab Ophthalmological Congress</h3>
        <p>
          Regional ophthalmology meetings provide QCHP/DHA-accredited CME with GCC-specific
          content — retinal disease in diabetic patients, keratoconus management in young patients,
          and high-volume cataract surgery programme management.
        </p>

        <h2>FRCOphth, ABOphth, and Arab Board Recognition in GCC</h2>
        <ul>
          <li>
            <strong>FRCOphth (Fellow of the Royal College of Ophthalmologists, UK):</strong>
            Recognized by QCHP, DHA, DOH, and SCFHS as consultant-grade specialist qualification.
            The most common specialist qualification among UK-trained GCC ophthalmologists.
          </li>
          <li>
            <strong>American Board of Ophthalmology (ABOphth):</strong> Recognized as specialist
            qualification by GCC authorities. ABOphth MOC activities count toward GCC CME renewal.
          </li>
          <li>
            <strong>Arab Board in Ophthalmology:</strong> Recognized across all GCC countries;
            particularly valued in Saudi Arabia and Kuwait.
          </li>
          <li>
            <strong>ICO (International Council of Ophthalmology) Fellowship:</strong> ICO-recognized
            training and examinations are accepted references for specialist credentialing by
            GCC authorities.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Ophthalmologist CME requirements and surgical scope credentialing
          vary by licensing authority. Verify current requirements directly with QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
