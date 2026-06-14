import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Urologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for urologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, prostate cancer (PSMA PET, novel ARPIs), urological robotics, kidney stone management, overactive bladder, EAU/AUA conference CME recognition, and FRCS(Urol)/FEBU qualification recognition.",
  openGraph: {
    title: "Urologist CME GCC 2026 — QCHP, SCFHS, DHA Urology Guide",
    description:
      "CME guide for urologists in GCC countries: prostate cancer PSMA diagnostics and novel ARPIs, robotic urological surgery, kidney stone management, bladder dysfunction, EAU/AUA conference CME, and FRCS(Urol)/FEBU qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Urologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Urologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Urology in the GCC is shaped by a high prevalence of urolithiasis (kidney stones — endemic in the high-heat, low-fluid-intake Gulf environment), a rising prostate cancer incidence driven by population ageing and expanding PSA screening programmes, and significant BPH burden in the older male population. Robotic urological surgery is established at tertiary centres including Hamad Medical Corporation, KFSH&RC, Tawam Hospital, and Cleveland Clinic Abu Dhabi, generating a high demand for robotic surgery CME."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Urologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Urologists</h2>

        <h3>Prostate Cancer</h3>
        <ul>
          <li>PSMA PET-CT imaging — gallium-68 PSMA PET (Ga68-PSMA) and fluorine-18 PSMA (18F-DCFPyL/PSMA-1007); staging, biochemical recurrence detection, theranostics; availability at KFSH&RC, Hamad, Cleveland Clinic Abu Dhabi</li>
          <li>Novel androgen receptor pathway inhibitors (ARPIs) — enzalutamide, apalutamide, darolutamide in nmCRPC; abiraterone + prednisone in mHSPC and mCRPC; olaparib (PARP inhibitor) in BRCA1/2 mCRPC</li>
          <li>Radical prostatectomy — robotic-assisted radical prostatectomy (RARP) technique updates; nerve-sparing outcomes; extended pelvic lymphadenectomy; functional outcomes reporting</li>
          <li>PSMA-targeted radioligand therapy — lutetium-177 PSMA-617 (Pluvicto/VISION trial); eligibility criteria, dosimetry, multidisciplinary team protocols</li>
          <li>Active surveillance — updated EAU guidelines for low-risk prostate cancer; MRI-targeted biopsy (fusion biopsy, in-bore MRI biopsy); AS triggers and exit criteria</li>
        </ul>

        <h3>Urolithiasis</h3>
        <ul>
          <li>Flexible ureteroscopy (fURS) — updated technique, single-use scope (LithoVue) vs. reusable; laser lithotripsy (thulium fibre laser vs. holmium YAG); "dusting" vs. "fragmentation" strategies</li>
          <li>Percutaneous nephrolithotomy (PCNL) — mini/ultra-mini/micro-PCNL evolution; prone vs. supine positioning; tubeless and totally tubeless protocols</li>
          <li>Metabolic stone workup — 24-hour urine analysis protocol; dietary modification; medical expulsive therapy; genetic hypercalciuric stone disease</li>
          <li>SWL updates — updated patient selection, stone density (HU) threshold, success rate predictors; BiLateral ureteral stents</li>
          <li>Prevention in GCC context — hydration strategies in extreme heat; dietary purine restriction; kidney stone disease epidemiology in Gulf populations</li>
        </ul>

        <h3>Functional Urology</h3>
        <ul>
          <li>Overactive bladder (OAB) — antimuscarinic vs. beta-3 agonist (mirabegron, vibegron) therapy; combination therapy; botulinum toxin intravesical injection; sacral neuromodulation (InterStim)</li>
          <li>BPH and LUTS — holmium laser enucleation of the prostate (HoLEP) — the emerging gold standard; rezum water vapour therapy; iTind; robotic simple prostatectomy for very large glands</li>
          <li>Female pelvic floor — updated IUGA/ICS guidelines on pelvic organ prolapse; mesh controversies and current evidence; autologous sling for stress urinary incontinence</li>
          <li>Neurogenic bladder — urodynamic studies interpretation; clean intermittent catheterisation (CIC); intravesical botulinum toxin; augmentation cystoplasty</li>
        </ul>

        <h3>Oncological Urology — Bladder and Kidney</h3>
        <ul>
          <li>Bladder cancer — updated EAU guidelines; BCG shortage management (BCG-unresponsive disease: pembrolizumab, nadofaragene firadenovec); TURBT technique (en bloc resection); radical cystectomy with enhanced recovery (ERAS)</li>
          <li>Renal cell carcinoma — updated IMDC risk stratification; combination immunotherapy (nivolumab + ipilimumab, pembrolizumab + axitinib/lenvatinib); partial nephrectomy vs. radical; cytoreductive nephrectomy in 2026</li>
          <li>Upper tract urothelial carcinoma (UTUC) — updated EORTC risk stratification; instillation therapy (mitomycin C pyeloperfusion via ureteral catheter)</li>
        </ul>

        <h2>Best Urology Conferences for GCC CME</h2>

        <h3>EAU Annual Congress (European Association of Urology)</h3>
        <p>
          EAU Annual Congress (March, European cities) generates EACCME credits recognised by GCC authorities.
          The world&apos;s largest urology meeting — live surgery demonstrations, late-breaking oncology trials, and
          the comprehensive EAU guidelines update sessions. Robotics and endourology sub-speciality sessions are
          particularly relevant for GCC urologists.
        </p>

        <h3>AUA Annual Meeting (American Urological Association)</h3>
        <p>
          AUA Annual Meeting (May, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, and OMSB. The premier North American urology meeting — prostate cancer PSMA
          imaging, ARPI trials, and endourology innovations.
        </p>

        <h3>Gulf Urology Society Annual Congress</h3>
        <p>
          The Gulf Urology Society Congress generates QCHP and SCFHS-recognised CME directly. GCC-specific topics:
          urolithiasis in the Gulf climate, robotic surgery programme development in GCC centres, and Arab Health
          pre-conference urology workshops.
        </p>

        <h2>FRCS(Urol), FEBU, and Arab Board Recognition</h2>
        <ul>
          <li><strong>FRCS(Urol) (Fellow of the Royal College of Surgeons in Urology, UK):</strong> The most widely held urology specialist qualification among GCC urologists — recognized by QCHP, DHA, DOH, and SCFHS for consultant-grade credentialing.</li>
          <li><strong>FEBU (Fellow of the European Board of Urology):</strong> Recognized by DHA and DOH as a specialist qualification. The EBU oral examination is held annually in European cities and online.</li>
          <li><strong>ABMS Board Certification in Urology (American Board of Urology):</strong> Recognized by DHA, DOH, and several private hospital credentialing systems. Particularly valued at American university-affiliated hospitals in the GCC.</li>
          <li><strong>Arab Board in Urology:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in Arab country institutions.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Urologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
