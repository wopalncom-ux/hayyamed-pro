import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geriatrician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for geriatricians and general physicians with elderly care practice in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, frailty assessment, dementia management, polypharmacy, falls prevention, IAGG/BGS conference CME recognition.",
  openGraph: {
    title: "Geriatrician CME GCC 2026 — QCHP, SCFHS, DHA Geriatric Medicine Guide",
    description:
      "CME guide for geriatricians in GCC countries: frailty clinical frailty scale, dementia (lecanemab/donanemab), polypharmacy deprescribing, falls and bone health, delirium, IAGG/BGS conference CME, and MRCP/geriatric medicine specialty recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Geriatrician CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Geriatrician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Geriatric medicine is one of the fastest-growing clinical specialties in the GCC. The Gulf population is ageing rapidly — Saudi Arabia's population over 65 is projected to triple by 2040, and Qatar's older population is growing at an even faster rate driven by long-term residents. The GCC's historically high rates of diabetes, obesity, cardiovascular disease, and hypertension mean that the region's older population carries a particularly high burden of multimorbidity, frailty, and functional decline. Geriatricians and physicians caring for older adults face a uniquely complex CME landscape."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Geriatrician CME Requirements by Authority</h2>

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

        <h2>CME Priorities for GCC Geriatricians and Elderly Care Physicians</h2>

        <h3>Frailty Assessment and Management</h3>
        <ul>
          <li>Clinical Frailty Scale (CFS) — updated validation studies; application in ED triage, ICU admission decisions, elective surgery risk stratification; electronic CFS documentation in EPR systems</li>
          <li>Comprehensive Geriatric Assessment (CGA) — structured multidisciplinary CGA protocols; integration into GCC hospital admission workflows; evidence base (CRISIS randomised trial)</li>
          <li>Frailty interventions — exercise prescription (resistance + aerobic); protein supplementation (1.2–1.6g/kg/day); sarcopenia treatment; testosterone therapy evidence and safety</li>
          <li>Preoperative geriatric optimization — prehabilitation protocols; cognitive screening pre-surgery; anaesthetic risk in frail older adults; postoperative delirium prevention</li>
        </ul>

        <h3>Dementia</h3>
        <ul>
          <li>Disease-modifying therapy — lecanemab (CLARITY AD trial, FDA approved Jan 2023); donanemab (TRAILBLAZER-ALZ 2 trial); amyloid PET and CSF biomarkers for patient selection; ARIA (amyloid-related imaging abnormalities) monitoring; availability in GCC centres</li>
          <li>Alzheimer&apos;s disease diagnosis — updated IWG/NIA-AA 2023 diagnostic criteria; blood biomarkers (plasma p-tau 217, Aβ42/40 ratio) — moving dementia diagnosis to a blood test</li>
          <li>Vascular dementia — updated post-stroke cognitive impairment screening; CADASIL; aggressive cardiovascular risk factor management</li>
          <li>Dementia care in GCC context — extended family caregiving norms; Arabic-language cognitive screening tools; Islamic ethical dimensions of capacity assessment and advance care planning</li>
          <li>BPSD (behavioural and psychological symptoms of dementia) — non-pharmacological management; when to use antipsychotics; brexpiprazole (REXULTI) FDA approval for Alzheimer&apos;s agitation</li>
        </ul>

        <h3>Polypharmacy and Deprescribing</h3>
        <ul>
          <li>Anticholinergic burden — ACB scale, Beers Criteria 2023 update; anticholinergic drug associations with cognitive decline, falls, and urinary retention in older adults</li>
          <li>STOPP/START criteria v3 (2023) — the definitive European tool for inappropriate prescribing in older adults; applying STOPP/START in GCC clinical contexts</li>
          <li>Deprescribing protocols — proton pump inhibitors, statins in very elderly, antihypertensives in frail older adults (SPRINT vs. ACCORD age-stratified analyses)</li>
          <li>Diabetes management in older adults — glycaemic targets (HbA1c 7–8% in older frail patients vs. 7% in robust); sulfonylurea/insulin hypoglycaemia risk; CGM in nursing home residents</li>
        </ul>

        <h3>Falls, Bone Health, and Rehabilitation</h3>
        <ul>
          <li>Falls prevention — multifactorial falls assessment; NICE CG161 updated; vitamin D supplementation evidence; exercise programs (OTAGO, Tai Chi); anticholinergic medication review</li>
          <li>Hip fracture pathway — updated NICE quality standard; orthogeriatric co-management; anti-osteoporosis therapy initiation post-fracture; secondary fracture prevention</li>
          <li>Osteoporosis in older adults — romosozumab in very-high-risk patients; denosumab holiday (rebound fracture risk); anabolic → antiresorptive sequencing</li>
          <li>Rehabilitation geriatrics — updated WHO rehabilitation guidelines; cognitive rehabilitation; GCC elder care infrastructure development</li>
        </ul>

        <h3>Delirium and Acute Care for Elders (ACE)</h3>
        <ul>
          <li>Delirium prevention — HELP programme (Hospital Elder Life Program); 4AT screening tool; sleep protocol, orientation, early mobilisation, hydration</li>
          <li>Acute delirium management — melatonin evidence; low-dose haloperidol for hyperactive delirium; avoiding benzodiazepines; delirium duration and long-term cognitive outcomes</li>
          <li>ACE units — comprehensive geriatric assessment inpatient unit evidence; ACE unit development in GCC hospitals</li>
        </ul>

        <h2>Best Geriatric Medicine Conferences for GCC CME</h2>

        <h3>IAGG World Congress (International Association of Geriatrics and Gerontology)</h3>
        <p>
          IAGG World Congress (held triennially) generates internationally recognised CME. The world&apos;s largest
          geriatrics meeting — global ageing policy, dementia disease-modification, frailty interventions,
          and cultural aspects of elder care.
        </p>

        <h3>BGS Spring/Autumn Meeting (British Geriatrics Society)</h3>
        <p>
          BGS meetings generate RCPE/RCP(UK) CPD credits directly recognised by QCHP and other GCC authorities.
          The most influential geriatric medicine conference for MRCP-trained physicians — falls, frailty, dementia,
          delirium, and comprehensive geriatric assessment.
        </p>

        <h3>Gulf Association of Geriatric and Gerontology Annual Meeting</h3>
        <p>
          The Gulf geriatrics society generates QCHP and SCFHS-recognised CME directly. GCC-specific content: ageing
          population projections in the Gulf, elder care policy, multimorbidity management in GCC older adults, and
          Islamic perspectives on dementia care and advance care planning.
        </p>

        <h2>MRCP with Geriatric Medicine Specialty Certification and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP with SCE in Geriatric Medicine (UK):</strong> The standard specialist credentialing pathway for geriatricians across QCHP, DHA, DOH, and SCFHS. The Speciality Certificate Examination (SCE) in Geriatric Medicine is sat after MRCP(UK) and recognised at consultant level.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for geriatricians across QCHP, DHA, and DOH.</li>
          <li><strong>Board Certification in Geriatrics (ABIM, USA):</strong> Recognized by DHA, DOH, and several private hospital credentialing systems across the GCC.</li>
          <li><strong>Arab Board in Geriatric Medicine:</strong> A relatively new Arab Board specialty; recognized in Saudi Arabia (SCFHS) and other GCC countries as the specialty develops infrastructure across the region.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Geriatrician and elderly care physician CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
