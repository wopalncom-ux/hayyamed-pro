import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vascular Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for vascular surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, endovascular aortic repair (EVAR/TEVAR), carotid revascularisation, critical limb ischaemia, diabetic foot, SVS/ESVS conference CME recognition, and FRCS(Vasc)/FEBVS qualification recognition.",
  openGraph: {
    title: "Vascular Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Vascular Surgery Guide",
    description:
      "CME guide for vascular surgeons in GCC countries: EVAR/TEVAR endovascular aortic repair, carotid stenting, critical limb-threatening ischaemia (CLTI), diabetic foot (extremely high GCC burden), SVS/ESVS conference CME, and FRCS(Vasc)/FEBVS qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Vascular Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Vascular Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Vascular surgery in the GCC carries a uniquely heavy disease burden. The combination of the world's highest rates of diabetes, hypertension, dyslipidaemia, and tobacco use — alongside a rapidly ageing population — creates an outsized vascular disease burden. Diabetic foot disease is endemic in the Gulf, with amputation rates 4–5 times higher than in Western Europe. Critical limb-threatening ischaemia (CLTI), abdominal aortic aneurysm (AAA), and carotid artery disease are managed at all major GCC tertiary centres. Vascular surgeons must maintain CME currency in an increasingly endovascular-dominant specialty."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Vascular Surgeon CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Vascular Surgeons</h2>

        <h3>Aortic Disease — EVAR and TEVAR</h3>
        <ul>
          <li>EVAR (endovascular aortic repair) — late results of EVAR-1 and DREAM trials (long-term reinterventions); EVAR vs. open repair in anatomy-unfavorable necks; EVAR surveillance protocol; EVAR-related type II endoleak management</li>
          <li>TEVAR (thoracic endovascular aortic repair) — descending thoracic aneurysm, type B aortic dissection; spinal cord protection (CSF drainage); TEVAR in complicated type B dissection; STABILISE technique</li>
          <li>Complex aortic anatomy — fenestrated EVAR (FEVAR), branched EVAR (BEVAR) for juxtarenal and thoracoabdominal aneurysm; CHIMNEY/SNORKEL technique; hybrid procedures</li>
          <li>Open aortic surgery — remaining indications; hostile abdomen; aorto-enteric fistula repair; mycotic aneurysm</li>
        </ul>

        <h3>Carotid Disease</h3>
        <ul>
          <li>Symptomatic carotid stenosis — ACST-2 trial (CEA vs. CAS updated evidence); updated ASA/AHA/ESC guidelines; timing of revascularisation (urgent for TIA/minor stroke)</li>
          <li>Carotid artery stenting (CAS) — transfemoral vs. transcarotid (TCAR); ENROUTE stent and embolic protection; patient selection; dual antiplatelet therapy protocol</li>
          <li>Asymptomatic carotid stenosis — SPACE-2, CREST-2 trials; optimal medical therapy vs. intervention; ACST-1 long-term outcomes; risk-stratification for intervention</li>
          <li>Intraoperative monitoring — TCD, EEG, cerebral oximetry, awake CEA; shunting decisions</li>
        </ul>

        <h3>Critical Limb-Threatening Ischaemia (CLTI) and Diabetic Foot</h3>
        <ul>
          <li>CLTI — updated Global Vascular Guidelines (GVG 2019, update 2024); WIfI classification; wound/ischaemia/foot infection scoring; bypass vs. endovascular first (BEST-CLI trial outcomes)</li>
          <li>Diabetic foot — extremely high burden in GCC (UAE, Kuwait, Saudi Arabia have diabetic foot amputation rates among world&apos;s highest); MDT diabetic foot team structure; wound bed preparation; revascularisation thresholds in the diabetic foot</li>
          <li>Below-knee endovascular techniques — drug-eluting balloons (DCB) in tibial arteries; atherectomy devices; foot perfusion imaging (Angiosome concept)</li>
          <li>Wound care — negative pressure wound therapy (NPWT); bioengineered skin substitutes; hyperbaric oxygen therapy evidence in diabetic foot</li>
          <li>Minor amputation and wound closure — technique, timing, wound management for healing; major amputation decision and rehabilitation</li>
        </ul>

        <h3>Venous and Lymphatic Disease</h3>
        <ul>
          <li>Varicose vein treatment — EVLA vs. UGFS vs. RFA vs. foam sclerotherapy vs. mechanochemical ablation (MOCA); updated NICE CG168; VenaSeal cyanoacrylate closure</li>
          <li>DVT — catheter-directed thrombolysis (CDT) in ilio-femoral DVT; CDT vs. anticoagulation (ATTRACT trial 5-year outcomes); inferior vena cava filter — indications, retrieval</li>
          <li>Chronic venous insufficiency — CEAP classification update; compression therapy; subfascial endoscopic perforator surgery (SEPS)</li>
          <li>Lymphoedema — complex decongestive therapy; lymphovenous anastomosis; vascularised lymph node transfer; liposuction in fibrotic lymphoedema</li>
        </ul>

        <h2>Best Vascular Surgery Conferences for GCC CME</h2>

        <h3>ESVS Annual Meeting (European Society for Vascular Surgery)</h3>
        <p>
          ESVS Annual Meeting (September, European cities) generates EACCME credits with transfer provisions for GCC authorities.
          The premier European vascular surgery meeting — EVAR outcomes, complex aortic reconstruction, carotid revascularisation,
          and CLTI management updates.
        </p>

        <h3>SVS VascularAnnual Meeting (Society for Vascular Surgery)</h3>
        <p>
          SVS Annual Meeting (June, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA, DOH, SCFHS, NHRA,
          MOH Kuwait, and OMSB. Largest North American vascular meeting — live case transmissions, late-breaking aortic trial
          data, and endovascular skills workshops.
        </p>

        <h3>Arab Vascular Society Annual Congress</h3>
        <p>
          The Arab Vascular Society Congress generates QCHP and SCFHS-recognised CME directly. GCC-specific vascular content:
          diabetic foot amputation prevention programmes, regional CLTI burden, and GCC vascular surgery training programme outcomes.
        </p>

        <h2>FRCS(Vasc), FEBVS, and Arab Board Recognition</h2>
        <ul>
          <li><strong>FRCS(Vasc) (Fellow of the Royal College of Surgeons in Vascular Surgery, UK):</strong> The most widely held vascular surgery specialist qualification among GCC vascular surgeons. Recognized by QCHP, DHA, DOH, and SCFHS for consultant-grade credentialing.</li>
          <li><strong>FEBVS (Fellow of the European Board of Vascular Surgery):</strong> Recognized by DHA and DOH as a specialist qualification. The ESVS-supervised oral examination is the definitive European vascular surgery board certification.</li>
          <li><strong>RPVI (Registered Physician in Vascular Interpretation) or RVT (Registered Vascular Technologist):</strong> Relevant for vascular surgeons with duplex ultrasound reporting responsibilities. Recognized in DHA credentialing for duplex sonography privileges.</li>
          <li><strong>Arab Board in Vascular Surgery:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Vascular surgeon CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
