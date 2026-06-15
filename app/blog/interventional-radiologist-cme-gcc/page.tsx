import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interventional Radiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for interventional radiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, TACE and TARE for HCC, prostate artery embolisation, mechanical thrombectomy, Y-90 radioembolisation, and the best IR CME conferences.",
  openGraph: {
    title: "Interventional Radiologist CME GCC 2026 — QCHP, SCFHS, DHA IR Guide",
    description:
      "CME guide for interventional radiologists in GCC countries: credit requirements, TACE/TARE for HCC, PAE, mechanical thrombectomy, Y-90, and leading IR CME conferences.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Interventional Radiologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        category="specialty"
        title="Interventional Radiologist CME Requirements in the GCC 2026"
        description="Complete CME guide for interventional radiologists across Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman."
        publishedAt="2026-06-15"
        readingMinutes={12}
      >
        <h2>Interventional Radiology in the GCC: From Diagnostic Support to Procedural Specialty</h2>
        <p>
          Interventional radiology (IR) in the GCC has undergone a significant transformation over the
          past decade. What was once a largely diagnostic-support subspecialty has become a procedural
          discipline with dedicated wards, outpatient IR clinics, and clinical leadership roles in tumour
          boards and multidisciplinary teams. Hamad Medical Corporation&apos;s IR department in Qatar performs
          over 5,000 procedures annually including complex hepatic interventions, vascular access,
          and neurointervention. Saudi Arabia&apos;s KFSH&RC Riyadh has one of the region&apos;s busiest hepatic
          oncology IR programmes. Cleveland Clinic Abu Dhabi&apos;s IR service performs TIPS, complex embolisations,
          and Y-90 radioembolisation. The result is an IR CME demand that spans oncology, vascular,
          neurointerventional, and procedural training — all within a single specialty.
        </p>

        <h2>CME Credit Requirements by GCC Authority (2026)</h2>
        <ul>
          <li><strong>Qatar (QCHP/DHP-AS):</strong> 80 CPD credits per 2-year cycle. QCHP recognises IR CME from SIR (Society of Interventional Radiology), CIRSE (Cardiovascular and Interventional Radiological Society of Europe), ASNR (American Society of Neuroradiology), and ACR (American College of Radiology). HMC&apos;s radiology department organises quarterly QCHP-approved IR CME, including wet-lab procedural workshops.</li>
          <li><strong>Saudi Arabia (SCFHS):</strong> 60 CME credit hours per 3-year cycle. The Saudi Radiology Society (SRS) and SCFHS-approved IR workshops at KFSH&RC and King Abdulaziz Medical City are primary local CME sources. SCFHS recognises SIR, CIRSE, and ACR CME.</li>
          <li><strong>Dubai (DHA):</strong> 40 CME credits per 2-year cycle. Arab Health (February) includes interventional radiology streams. DHA recognises SIR, CIRSE, and ASNR CME.</li>
          <li><strong>Abu Dhabi (DOH):</strong> 40 CPD points per renewal cycle. Cleveland Clinic Abu Dhabi&apos;s radiology team organises DOH-approved IR CME. DOH recognises SIR and CIRSE international CME.</li>
          <li><strong>Kuwait (MOH Kuwait):</strong> 30 CME hours annually. Al Amiri Hospital and Kuwait Cancer Control Centre IR teams are primary local CME hubs. MOH Kuwait accepts SIR and CIRSE CME.</li>
          <li><strong>Bahrain (NHRA):</strong> 40 CPD credits per 2-year cycle. King Hamad University Hospital IR team is the primary CME hub. NHRA accepts SIR and CIRSE CME.</li>
          <li><strong>Oman (OMSB):</strong> 40 CME credits per 2-year cycle. Royal Hospital Oman&apos;s IR team and Sultan Qaboos University Hospital radiology department are the primary CME hubs. OMSB accepts SIR and CIRSE CME.</li>
        </ul>

        <h2>Hepatic Oncology Interventions: The Core GCC IR CME Priority</h2>
        <ul>
          <li><strong>TACE (Transarterial Chemoembolisation) for HCC:</strong> Conventional TACE (cTACE) and drug-eluting bead TACE (DEB-TACE) remain the most common locoregional therapies for intermediate-stage HCC in the GCC. The 2024 BCLC (Barcelona Clinic Liver Cancer) update revised intermediate stage sub-classification and the treatment algorithm for combined TACE + systemic therapy. CME covering patient selection (BCLC B sub-stages), technical TACE execution (selective vs. super-selective catheterisation, embolisation endpoints), response assessment using mRECIST criteria, and the emerging role of TACE as bridging or downstaging therapy for liver transplant is a core IR CME requirement for GCC hepatic oncology IR practitioners.</li>
          <li><strong>Y-90 Radioembolisation (TARE):</strong> Yttrium-90 radioembolisation (TARE) using TheraSphere (glass microspheres) and SIR-Spheres (resin microspheres) has expanded in the GCC following the DOSISPHERE-01 and EPOCH trials. The 2024 SIR/SNMMI/ASTRO joint clinical practice guideline on Y-90 radioembolisation updated dosimetry planning requirements (personalised dosimetry is now the recommended approach over standard dosing), lung shunt fraction thresholds, and post-treatment SPECT/CT assessment standards. CME covering the technical execution of Y-90, pre-treatment MAA scan interpretation, dosimetry calculation (personalised MIRD approach vs. partition model), and management of post-radioembolisation syndrome is essential for GCC IR practitioners with Y-90 programmes.</li>
          <li><strong>Percutaneous ablation (RFA, MWA, IRE):</strong> Microwave ablation (MWA) has largely replaced radiofrequency ablation (RFA) as the preferred thermal ablation modality at GCC centres for early HCC and CRLM — offering larger ablation zones, faster procedure times, and less heat-sink effect near vessels. The 2024 consensus guidelines from ESIR/CIRSE on percutaneous thermal ablation for liver tumours updated the technical parameters for MWA (power settings, antenna placement, multi-antenna protocols) and the criteria for complete ablation assessment on contrast-enhanced CT/MRI. GCC IR practitioners should have current CME on MWA technique, ablation margin requirements (5mm minimum for oncological adequacy), and the role of fusion guidance (US/CT fusion) for challenging tumour locations.</li>
        </ul>

        <h2>Vascular IR: Endovascular Aortic Repair and PE Management</h2>
        <ul>
          <li><strong>EVAR and FEVAR:</strong> Endovascular aortic repair (EVAR) for infrarenal AAA and fenestrated EVAR (FEVAR) for juxtarenal and pararenal aneurysms are increasingly performed by hybrid IR/vascular surgery teams in the GCC. The 2024 ESC/ESVS guidelines on aortic diseases updated the diameter thresholds for EVAR intervention (55mm in men, 50mm in women for infrarenal AAA), the evidence for FEVAR vs. EVAR+chimney vs. open repair for complex neck anatomy, and the post-EVAR surveillance protocol (CT angiography at 1 month, 12 months, then annually). CME covering EVAR device selection, access planning, deployment technique, and endoleak classification and management is critical for GCC IR practitioners in centres with aortic programmes.</li>
          <li><strong>Catheter-directed thrombolysis and mechanical thrombectomy for PE:</strong> The 2024 ESC guidelines on pulmonary embolism (updated from 2019) significantly revised the treatment pathway for intermediate-high and high-risk PE. Catheter-directed thrombolysis (CDT) and mechanical thrombectomy (FlowTriever, Indigo system) are now explicitly recommended for patients failing anticoagulation. CME covering the PE response team (PERT) model — which QChp and DHA accredited centres are adopting — IR procedural techniques for catheter-directed therapy, and patient selection (intermediate-high risk vs. massive PE, right heart strain parameters) is an urgent GCC IR CME priority.</li>
        </ul>

        <h2>Prostate Artery Embolisation and Genito-Urinary IR</h2>
        <ul>
          <li><strong>PAE for benign prostatic hyperplasia:</strong> Prostate artery embolisation (PAE) has emerged as a minimally invasive alternative to TURP for symptomatic BPH. The ROPE2 randomised trial comparing PAE to sham procedure and the WATER II trial comparing PAE to aquablation have provided level 1 evidence supporting PAE&apos;s clinical efficacy. PAE is now offered at select GCC centres (Hamad Medical Corporation, Cleveland Clinic Abu Dhabi). CME covering prostatic arterial anatomy (including anomalous origins from pudendal and obturator branches), PAE technical technique, non-target embolisation prevention, and patient selection criteria (IPSS score, prostate volume, CT angiography planning) is directly applicable for GCC IR practitioners developing PAE programmes.</li>
          <li><strong>Uterine fibroid embolisation (UFE):</strong> UFE is an established alternative to hysterectomy or myomectomy for symptomatic fibroids, with strong level 1 evidence from the EMMY trial and the REST trial. UFE demand in the GCC is growing as awareness among gynaecologists and patients increases. CME covering UAE technical execution (bilateral sequential vs. simultaneous, particle size selection), post-UFE syndrome management, fertility implications, and patient selection (excluding submucosal fibroids as primary UFE targets) is a growing GCC IR CME requirement.</li>
        </ul>

        <h2>High-Priority CME Events for GCC Interventional Radiologists</h2>
        <ul>
          <li><strong>SIR Annual Scientific Meeting</strong> — Annual (March, USA). Society of Interventional Radiology; 20–25 CME credits; comprehensive IR coverage across hepatic, vascular, neurointerventional, and women&apos;s health IR. SIR CME accepted by QCHP, DHA, and SCFHS.</li>
          <li><strong>CIRSE Annual Congress</strong> — Annual (September, Europe). Cardiovascular and Interventional Radiological Society of Europe; 15–20 EACCME CME credits; strong Y-90, TACE, PAE, and endovascular content. Accepted by QCHP and DHA.</li>
          <li><strong>Arab Health (IR/Radiology Stream)</strong> — Annual (February, Dubai). DHA-approved CME; increasingly strong IR content; essential for DHA-licensed IR practitioners for local credits.</li>
          <li><strong>GEST USA (Global Embolization Symposium and Technologies)</strong> — Annual (USA). Dedicated embolotherapy CME; strong Y-90, TACE, UFE, and PAE content; SIR-accredited. Accepted by QCHP, DHA, and SCFHS.</li>
          <li><strong>SIR Foundation Online Learning</strong> — Continuous (online). SIR on-demand CME modules on hepatic oncology IR, endovascular procedures, and new device training; accepted by QCHP, DHA, and SCFHS for self-directed CME.</li>
        </ul>

        <h2>Tracking IR CME with Hayya Med Pro</h2>
        <p>
          Interventional radiologists in the GCC draw CME from SIR, CIRSE, Arab Health, and local
          institutional workshops — each with different credit systems. Hayya Med Pro&apos;s multi-category
          CME wallet tracks each activity with accreditor, credit count, and procedure area, generating
          renewal-ready documentation for QCHP, SCFHS, DHA, or any GCC authority.
        </p>
        <p>
          <em>
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not
            replace official licensing authorities. Interventional radiologists must verify final requirements with
            QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or their relevant authority.
          </em>
        </p>
      </BlogPostLayout>
    </>
  );
}
