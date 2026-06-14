import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nephrologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for nephrologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, CKD and ESRD management CPD priorities, dialysis and transplant updates, ISN/ERA conference CME recognition, and MRCP qualification recognition across GCC authorities.",
  openGraph: {
    title: "Nephrologist CME GCC 2026 — QCHP, SCFHS, DHA Nephrology Guide",
    description:
      "CME guide for nephrologists in GCC countries: credit requirements by authority, CKD progression, dialysis access and adequacy, renal transplant, diabetic kidney disease, ISN/ERA conference recognition, and MRCP/FASN qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Nephrologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Nephrologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Diabetic kidney disease and hypertensive nephropathy drive one of the highest CKD and ESRD burdens globally in the GCC. Nephrologists practicing across Qatar, Saudi Arabia, the UAE, and wider Gulf states must maintain structured CME covering CKD management, dialysis, transplant, and rapidly evolving pharmacotherapy — particularly SGLT2 inhibitors and endothelin antagonists."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Nephrologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Nephrologists</h2>

        <h3>CKD Progression and Nephroprotection</h3>
        <p>
          CKD prevalence in the GCC, driven by type 2 diabetes and hypertension, makes nephroprotection
          the highest-priority CME topic for nephrologists in the region:
        </p>
        <ul>
          <li>SGLT2 inhibitors in CKD — CREDENCE, DAPA-CKD, EMPA-KIDNEY trial outcomes; updated KDIGO CKD guidelines for SGLT2 use in non-diabetic CKD</li>
          <li>Finerenone (FIDELIO-DKD, FIGARO-DKD) — non-steroidal MRA for diabetic kidney disease; landmark trials and clinical implementation</li>
          <li>ACEi/ARB combination with SGLT2i and finerenone — the emerging four-pillar nephroprotection strategy</li>
          <li>Anaemia of CKD — hypoxia-inducible factor prolyl hydroxylase inhibitors (HIF-PHIs); updated ESA management with updated KDIGO targets</li>
          <li>CKD-mineral and bone disorder (CKD-MBD) — updated management of hyperphosphataemia, secondary hyperparathyroidism, and vascular calcification</li>
        </ul>

        <h3>Dialysis — Haemodialysis and Peritoneal Dialysis</h3>
        <ul>
          <li>Haemodialysis adequacy — updated URR and Kt/V targets, high-flux vs. high-volume haemodiafiltration</li>
          <li>Vascular access — arteriovenous fistula creation and maintenance, tunnelled catheter management, buttonhole cannulation technique</li>
          <li>Peritoneal dialysis — incremental PD, APD vs. CAPD selection, catheter placement, peritonitis prevention and management</li>
          <li>Home dialysis — home HD and PD promotion; GCC home dialysis programmes are expanding, particularly in UAE and Qatar</li>
          <li>Intradialytic complications — haemodynamic instability, muscle cramps, intradialytic hypertension management</li>
        </ul>

        <h3>Renal Transplantation</h3>
        <ul>
          <li>Immunosuppression protocols — calcineurin inhibitor sparing, mTOR inhibitors, belatacept; updated KDIGO transplant guidelines</li>
          <li>Antibody-mediated rejection — updated diagnostic criteria (Banff classification), treatment with IVIg, rituximab, plasmapheresis</li>
          <li>Living donor evaluation — medical and psychosocial assessment, GCC-specific living donor frameworks</li>
          <li>Post-transplant complications — BK nephropathy, CMV, post-transplant lymphoproliferative disorder (PTLD)</li>
          <li>Long-term graft surveillance — protocol biopsies, eGFR trajectory monitoring, donor-specific antibody (DSA) monitoring</li>
        </ul>

        <h3>Glomerular Disease and Acute Kidney Injury</h3>
        <ul>
          <li>IgA nephropathy — STOP-IgAN, TESTING trials; sparsentan (PROTECT trial); budesonide targeted-release (NEFIGAN/NefIgArd)</li>
          <li>Membranous nephropathy — anti-PLA2R antibody monitoring, rituximab vs. cyclophosphamide/chlorambucil</li>
          <li>FSGS — identification of secondary causes, genetic testing, sparsentan in primary FSGS</li>
          <li>Acute kidney injury (AKI) — KDIGO AKI guidelines, AKI-CKD transition risk, hospital AKI bundle implementation</li>
          <li>Lupus nephritis — updated ACR/EULAR/ERA guidelines; voclosporin (AURORA) and belimumab (BLISS-LN) in LN</li>
        </ul>

        <h2>Best Nephrology Conferences for GCC CME</h2>

        <h3>ERA Congress (European Renal Association)</h3>
        <p>
          ERA Congress (June, European cities) generates EACCME credits with transfer provisions for GCC authorities.
          The premier European nephrology meeting — CKD, dialysis, transplant, and glomerular disease content
          with live case transmissions and hands-on workshops.
        </p>

        <h3>ASN Kidney Week (American Society of Nephrology)</h3>
        <p>
          ASN Kidney Week (October/November, USA) generates AMA PRA Category 1 CME credits recognised by QCHP,
          DHA, DOH, SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest nephrology meeting — late-breaking
          clinical trials, basic science, and clinical practice sessions across all nephrology subspecialties.
        </p>

        <h3>ISN World Congress of Nephrology</h3>
        <p>
          The International Society of Nephrology (ISN) World Congress generates internationally recognised CME
          credits. Held biennially, with strong representation of GCC and MENA nephrologists. ISN is the
          highest-profile global nephrology meeting for non-USA and non-European practitioners.
        </p>

        <h2>MRCP, FASN, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> The standard internal medicine qualification prerequisite for nephrology specialist credentialing across QCHP, DHA, DOH, and SCFHS. MRCP with nephrology specialty training (SCE in Renal Medicine or equivalent) is required for consultant-grade registration.</li>
          <li><strong>FASN (Fellow of the American Society of Nephrology):</strong> Recognized as a distinction mark by DHA, DOH, and several private hospital credentialing systems across the GCC.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for nephrologists across QCHP, DHA, and DOH.</li>
          <li><strong>Arab Board in Nephrology:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS), Kuwait (MOH), and Qatar (QCHP) for candidates trained in GCC institutions.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Nephrologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
