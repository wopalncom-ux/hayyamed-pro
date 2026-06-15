import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Palliative Care Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for palliative care physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, pain management, advance care planning, cultural context, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Palliative Care Physician CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for palliative care physicians practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Palliative Care Physician CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Palliative Care Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Palliative care is one of the fastest-growing medical specialties across the GCC, driven by ageing populations, increasing cancer incidence, and national health strategies that explicitly prioritise quality of life and dignity at end of life. Qatar, Saudi Arabia, and the UAE have all launched dedicated palliative care frameworks — and the physicians leading these services face specific CME expectations that blend clinical symptom management with cultural competency in a GCC context."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Palliative Care Physician CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; National Palliative Care Programme"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Palliative care recognised subspecialty"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting portal"],
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

        <h2>Palliative Care in the GCC: Rapid Formalisation</h2>
        <p>Qatar&apos;s National Palliative Care Programme, launched under the MOPH, has established a structured pathway for inpatient palliative care at Hamad Medical Corporation and home-based palliative care through the Primary Health Care Corporation (PHCC). Saudi Arabia&apos;s Ministry of Health National Program for Palliative Care includes accredited training programmes and a palliative care unit mandate for tertiary hospitals. The UAE&apos;s Abu Dhabi Healthcare Authority (SEHA) launched its Palliative Care programme at Sheikh Khalifa Medical City and Tawam Hospital; Dubai Health Authority has a dedicated palliative and supportive care track. All GCC countries have signed the World Health Assembly resolution on palliative care integration — the clinical infrastructure is now catching up with the political commitment. Palliative care physicians must understand both the international evidence base and the specific cultural, religious, and legal framework governing end-of-life care in each GCC country.</p>

        <h2>Key CME Topics for Palliative Care Physicians</h2>
        <ul>
          <li><strong>Pain management</strong> — opioid prescribing in GCC regulatory frameworks, rotational analgesia, opioid-induced constipation (OIC) management, ketamine for refractory pain, opioid availability challenges in LMIC-adjacent systems</li>
          <li><strong>Dyspnoea management</strong> — low-dose opioids for breathlessness, high-flow nasal oxygen, clinical evidence update (OPTIFLOW trial), fan therapy, palliative NIV decisions</li>
          <li><strong>Advance care planning (ACP) in GCC context</strong> — Islamic perspectives on withdrawal of treatment, do-not-attempt-resuscitation (DNAR) decisions, family-centred vs patient-centred decision-making, surrogate consent frameworks by country</li>
          <li><strong>Nausea and vomiting</strong> — malignant bowel obstruction management (conservative vs surgical), octreotide use, dexamethasone antiemesis, total parenteral nutrition decisions</li>
          <li><strong>Palliative sedation</strong> — international frameworks (EAPC recommendations), proportionate vs deep continuous sedation, GCC institutional protocols, documentation and consent</li>
          <li><strong>Communication skills</strong> — breaking bad news in family-present models (common in GCC), truth-telling norms, interpreter-mediated prognostic conversations, cultural humility in Arabic/Urdu/Bengali-speaking families</li>
          <li><strong>Paediatric palliative care</strong> — neonatal palliative care, perinatal bereavement, transition from paediatric to adult palliative services, congenital condition trajectories</li>
          <li><strong>Psychosocial and spiritual care</strong> — psychological distress screening in palliative populations, Islamic chaplaincy integration, bereavement follow-up, carer support structures</li>
          <li><strong>Non-cancer palliative care</strong> — end-stage heart failure, COPD, renal failure (conservative kidney management, AKD vs HD decisions), dementia end-of-life care</li>
          <li><strong>Palliative care in ICU</strong> — goals of care meetings in critical care, family communication protocols, withdrawal of life-sustaining treatment — standards by GCC institution</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>International Association for Hospice and Palliative Care (IAHPC) World Congress</li>
          <li>European Association for Palliative Care (EAPC) World Congress</li>
          <li>American Academy of Hospice and Palliative Medicine (AAHPM) Annual Assembly</li>
          <li>Middle East Cancer Consortium (MECC) — Palliative Care sessions</li>
          <li>Gulf Palliative Care Forum — QCHP and SCFHS credited</li>
          <li>Saudi Oncology Society Annual Meeting — Palliative Care track</li>
          <li>Hamad Medical Corporation Palliative Care Conference (Doha) — QCHP credited</li>
        </ul>

        <h2>Islamic Bioethics and GCC-Specific CME</h2>
        <p>Palliative care physicians in the GCC face a unique CME dimension: Islamic bioethics governing end-of-life decisions. The position of the Islamic Fiqh Academy (Majma&apos; al-Fiqh al-Islami) on withdrawal of mechanical ventilation, artificial nutrition, and resuscitation directly influences institutional protocols in Saudi Arabia, Qatar, Kuwait, and the UAE. CME courses covering Islamic medical ethics in palliative contexts are accepted by GCC authorities as formal CPD hours — and are increasingly required for hospital credentialing in palliative care roles at government hospitals. Practitioners from non-Muslim backgrounds working in GCC palliative care services should prioritise this CME area.</p>

        <h2>Track Your Palliative Care CME</h2>
        <p>Hayya Med Pro tracks CME credits per GCC authority and per renewal cycle with automated gap analysis. Upload IAHPC, EAPC, AAHPM and GCC conference certificates — all stored securely with full renewal history.</p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}
