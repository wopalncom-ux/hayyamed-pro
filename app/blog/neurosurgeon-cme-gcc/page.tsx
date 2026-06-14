import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neurosurgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for neurosurgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, awake craniotomy, robotic spine surgery, endovascular neurosurgery, intracranial tumour management, AANS/WFNS conference CME recognition, and FRCS(Neuro Surg)/EANS qualification recognition.",
  openGraph: {
    title: "Neurosurgeon CME GCC 2026 — QCHP, SCFHS, DHA Neurosurgery Guide",
    description:
      "CME guide for neurosurgeons in GCC countries: minimally invasive spine surgery, awake craniotomy and fluorescence-guided tumour resection, neuroendovascular (thrombectomy, flow diverters), skull base surgery, AANS/WFNS conference CME, and FRCS(Neuro Surg)/EANS qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Neurosurgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Neurosurgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Neurosurgery in the GCC is evolving rapidly at a pace matching global centres of excellence. Hamad Medical Corporation's neurosurgery programme handles the full spectrum — cranial, spine, vascular, paediatric, and functional neurosurgery. KFSH&RC in Riyadh, Cleveland Clinic Abu Dhabi, and King Khalid University Hospital are regional leaders in advanced neuroendovascular technique, neuro-oncology surgery, and robotic-assisted spine surgery. Neurosurgeons in the GCC must maintain CME in a specialty where technology and technique evolve continuously."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Neurosurgeon CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Neurosurgeons</h2>

        <h3>Neuro-Oncology Surgery</h3>
        <ul>
          <li>Fluorescence-guided resection — 5-ALA (5-aminolevulinic acid, Gliolan) fluorescence in high-grade glioma surgery; updated STUPS-ALA trial outcomes; near-infrared fluorescence (second-window ICG); iMRI intraoperative MRI guidance</li>
          <li>Awake craniotomy — speech and motor mapping protocol; asleep-awake-asleep technique; anaesthetic approach; patient selection and preparation; cortical mapping with direct electrical stimulation</li>
          <li>Glioblastoma — updated EANO/SNO guidelines; temozolomide + radiation (Stupp protocol); IDH mutation and MGMT methylation clinical significance; tumour treating fields (Optune); bevacizumab — when to use</li>
          <li>Spinal cord tumours — intramedullary tumour surgery (ependymoma, astrocytoma); neurophysiological monitoring (MEP, SSEP, D-wave); gross total resection vs. subtotal resection strategies</li>
          <li>Brain metastases — stereotactic radiosurgery (SRS) vs. surgical resection; SRS dose and fractionation; surgical technique for resection cavity SRS; whole brain vs. SRS (QUARTZ, QUALITY trial outcomes)</li>
        </ul>

        <h3>Spine Surgery</h3>
        <ul>
          <li>Minimally invasive spine surgery (MISS) — tubular retractor systems; MIS-TLIF, MIS-PLIF; lateral transpsoas access (XLIF/LLIF); percutaneous pedicle screws; unilateral biportal endoscopic (UBE) spine surgery</li>
          <li>Robotic-assisted spine surgery — Mazor X, ROSA Spine, Globus Excelsius GPS; pedicle screw accuracy; navigation systems (O-arm, Brainlab); learning curve data</li>
          <li>Cervical spine — updated AO Spine guidelines for degenerative myelopathy; anterior cervical discectomy and fusion (ACDF) vs. arthroplasty (disc replacement); posterior cervical decompression and instrumented fusion</li>
          <li>Adult spinal deformity — updated SRS/ISSG guidelines; coronal and sagittal balance; osteotomies (PSO, VCR); proximal junctional failure prevention</li>
          <li>Spinal cord injury — updated AO Spine guidelines; timing of decompression in cervical SCI (STASCIS data); neuroprotective strategies; methylprednisolone controversy</li>
        </ul>

        <h3>Cerebrovascular Neurosurgery</h3>
        <ul>
          <li>Intracranial aneurysm — microsurgical clipping vs. endovascular coiling (ISAT long-term outcomes); flow diverter devices (Pipeline, Surpass Streamline) — updated indications; Woven EndoBridge (WEB) for wide-neck bifurcation aneurysms</li>
          <li>AVM management — updated Spetzler-Martin grading; radiosurgery vs. microsurgery vs. embolization in ruptured and unruptured AVM; ARUBA trial ongoing debate</li>
          <li>Cavernous malformations — updated natural history; surgical resection of symptomatic brainstem cavernomas; radiosurgery for deep-seated cavernomas</li>
          <li>Mechanical thrombectomy collaboration — neurosurgical backup for endovascular thrombectomy; hemicraniectomy for malignant MCA infarction (DESTINY-II, HAMLET); decompressive surgery thresholds</li>
        </ul>

        <h3>Functional and Paediatric Neurosurgery</h3>
        <ul>
          <li>Deep brain stimulation (DBS) — updated DBS for Parkinson&apos;s disease, essential tremor, dystonia, OCD; directional leads; closed-loop adaptive DBS; postoperative programming CME</li>
          <li>Epilepsy surgery — updated ILAE guidelines; stereoelectroencephalography (SEEG) for epilepsy mapping; laser interstitial thermal therapy (LITT) for mesial temporal lobe epilepsy; responsive neurostimulation (RNS)</li>
          <li>Paediatric neurosurgery — hydrocephalus (endoscopic third ventriculostomy, choroid plexus coagulation); craniosynostosis (endoscopic vs. open); myelomeningocele repair; childhood brain tumours</li>
        </ul>

        <h2>Best Neurosurgery Conferences for GCC CME</h2>

        <h3>AANS Annual Scientific Meeting (American Association of Neurological Surgeons)</h3>
        <p>
          AANS Annual Meeting (April, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest neurosurgery meeting — live surgery sessions,
          late-breaking clinical trials, and subspecialty-specific symposia covering all areas of neurosurgery.
        </p>

        <h3>EANS Annual Congress (European Association of Neurosurgical Societies)</h3>
        <p>
          EANS Annual Congress (September, European cities) generates EACCME credits with GCC recognition. Comprehensive
          European neurosurgery meeting — neuro-oncology, spine, vascular, functional, and paediatric neurosurgery content,
          including workshops and hands-on cadaver courses.
        </p>

        <h3>WFNS World Congress of Neurosurgery</h3>
        <p>
          WFNS World Congress (held every 4 years, most recent in Cape Town 2023) generates internationally recognised CME.
          The most prestigious global neurosurgery gathering — covers neurosurgery in low- and middle-income country contexts
          as well as leading-edge technique updates.
        </p>

        <h2>FRCS(Neuro Surg), EANS Certification, and Arab Board Recognition</h2>
        <ul>
          <li><strong>FRCS(Neuro Surg) (Fellow of the Royal College of Surgeons in Neurosurgery, UK):</strong> The most widely held neurosurgery specialist qualification among GCC neurosurgeons. Recognized by QCHP, DHA, DOH, and SCFHS for consultant-grade credentialing. The FRCS(Neuro Surg) intercollegiate examination is one of the most demanding specialty examinations in surgery.</li>
          <li><strong>EANS Certification in Neurosurgery (European):</strong> EANS offers a European neurosurgery training and examination framework recognized by DHA and DOH. Subspecialty EANS courses in spine, skull base, and neuro-oncology generate CPD credits.</li>
          <li><strong>ABNS Board Certification (American Board of Neurological Surgery):</strong> Recognized by DHA, DOH, and several private hospital credentialing systems in the GCC. Particularly valued at American university-affiliated centres.</li>
          <li><strong>Arab Board in Neurosurgery:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC and Arab country neurosurgery programmes.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Neurosurgeon CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
