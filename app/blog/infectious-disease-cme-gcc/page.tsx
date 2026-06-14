import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infectious Disease Specialist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for infectious disease specialists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, antimicrobial stewardship and HIV CPD priorities, COVID-19 and MERS-CoV updates, IDSA/ECCMID conference CME recognition, and MRCP/ABIM qualification recognition.",
  openGraph: {
    title: "Infectious Disease Specialist CME GCC 2026 — QCHP, SCFHS, DHA ID Guide",
    description:
      "CME guide for infectious disease specialists in GCC countries: credit requirements by authority, antimicrobial stewardship programme leadership, HIV management, COVID-19 and MERS-CoV, TB, IDSA/ECCMID conference recognition, and MRCP/ABIM qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Infectious Disease Specialist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Infectious Disease Specialist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Infectious disease specialists in the GCC sit at the intersection of antimicrobial stewardship, pandemic preparedness, travel medicine, and transplant infectious disease. The region&apos;s unique epidemiology — MERS-CoV enzootic in Saudi Arabia and Qatar, high TB burden among the expatriate workforce, Hajj-related infectious disease in Saudi Arabia, and emerging multidrug-resistant organism (MDRO) challenges — creates a distinctive CME mandate."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Infectious Disease Specialist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Infectious Disease Specialists</h2>

        <h3>Antimicrobial Stewardship</h3>
        <p>
          Infectious disease specialists lead antimicrobial stewardship programmes (ASPs) across GCC hospitals.
          SCFHS, DHA, DOH, and QCHP increasingly expect formal AMS competency as part of specialist credentialing:
        </p>
        <ul>
          <li>ASP programme governance — multidisciplinary team structure, formulary restriction, prospective audit and feedback</li>
          <li>Carbapenem-resistant Enterobacteriaceae (CRE) management — ceftazidime-avibactam, cefiderocol, meropenem-vaborbactam, aztreonam combinations</li>
          <li>MRSA management — vancomycin AUC/MIC monitoring (replacing trough-only dosing), daptomycin and linezolid indications, ceftaroline use</li>
          <li>Extended-spectrum beta-lactamase (ESBL) producing organisms — oral step-down therapy, pivmecillinam, nitrofurantoin</li>
          <li>Antifungal stewardship — azole resistance in Aspergillus, Candida auris outbreak management, echinocandin stewardship</li>
          <li>Antibiotic de-escalation — short-course therapy evidence for common infections (CAP, UTI, intra-abdominal infection)</li>
        </ul>

        <h3>HIV and Sexually Transmitted Infections</h3>
        <ul>
          <li>HIV treatment — updated WHO guidelines, preferred first-line regimens (dolutegravir-based), two-drug regimens (DTG/3TC), long-acting injectable cabotegravir + rilpivirine</li>
          <li>HIV pre-exposure prophylaxis (PrEP) — expanding GCC access, long-acting injectable cabotegravir PrEP (HPTN 083/084 trial), lenacapavir for prevention</li>
          <li>Opportunistic infections — updated prophylaxis thresholds, management of PCP, toxoplasmosis, CMV retinitis, MAC</li>
          <li>HIV and COVID-19 — immune reconstitution considerations, vaccination schedules in PLWH</li>
          <li>STI management — updated IUSTI/CDC syphilis treatment guidelines (benzathine penicillin supply issues), gonorrhoea resistance and cefixime resistance management</li>
        </ul>

        <h3>COVID-19, MERS-CoV, and Emerging Infections</h3>
        <ul>
          <li>COVID-19 antivirals — nirmatrelvir/ritonavir (Paxlovid), remdesivir indications, molnupiravir; post-COVID prescribing context</li>
          <li>Long COVID — definition, pathophysiology theories, management approach; emerging GCC-specific data</li>
          <li>MERS-CoV — enzootic in dromedary camels across Qatar, Saudi Arabia, and UAE; human case management, IPC measures in hospitals, occupational exposure protocols</li>
          <li>Monkeypox (mpox) — JYNNEOS vaccination, GCC case management, contact tracing protocols</li>
          <li>Pandemic preparedness — WHO IHR (International Health Regulations) obligations, GCC early warning systems, hospital surge capacity planning</li>
        </ul>

        <h3>Tuberculosis</h3>
        <ul>
          <li>TB diagnosis — GeneXpert MTB/RIF Ultra, IGRA vs. TST in expatriate workforce (high GCC relevance), chest CT patterns</li>
          <li>Drug-sensitive TB treatment — updated WHO 6-month regimen, shorter regimens (4-month RIFAQUIN regimen for drug-sensitive TB)</li>
          <li>Drug-resistant TB — MDR-TB and XDR-TB management; BPaL regimen (bedaquiline + pretomanid + linezolid)</li>
          <li>Latent TB infection (LTBI) treatment — 1-month INH + rifapentine (1HP), 3-month INH + rifampicin (3HR); GCC occupational health screening mandates</li>
          <li>TB in immunocompromised hosts — transplant recipients, anti-TNF therapy, HIV co-infection</li>
        </ul>

        <h3>Transplant Infectious Disease</h3>
        <ul>
          <li>CMV management post-transplant — prophylaxis vs. pre-emptive therapy, letermovir for prophylaxis (SOLID transplant), maribavir for refractory CMV (MareSolid trial)</li>
          <li>BK polyomavirus nephropathy — monitoring, immunosuppression reduction strategies</li>
          <li>Invasive fungal infections in transplant — isavuconazole, voriconazole, TDM monitoring; Candida auris in transplant ICUs</li>
          <li>Vaccination in solid organ transplant recipients — timing around transplant, inactivated vs. live vaccines</li>
        </ul>

        <h2>Best Infectious Disease Conferences for GCC CME</h2>

        <h3>IDWeek (IDSA Annual Meeting)</h3>
        <p>
          IDWeek (October, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA, DOH, SCFHS, NHRA,
          MOH Kuwait, and OMSB. Jointly organised by IDSA, SHEA, HIVMA, and PIDS — the most comprehensive ID meeting
          globally, covering AMS, HIV, transplant ID, epidemiology, and emerging infections.
        </p>

        <h3>ECCMID (European Congress of Clinical Microbiology and Infectious Diseases)</h3>
        <p>
          ECCMID (April, European cities) generates EACCME credits with transfer provisions for GCC authorities.
          The premier European ID and microbiology meeting — strong antimicrobial resistance, hospital infection
          prevention, and outbreak management content.
        </p>

        <h3>CROI (Conference on Retroviruses and Opportunistic Infections)</h3>
        <p>
          CROI (February/March, USA) generates AMA PRA Category 1 CME credits. The most important HIV and viral
          hepatitis conference globally — essential for ID specialists managing HIV, HCV, and HBV in GCC,
          where expatriate populations carry significant viral hepatitis burden.
        </p>

        <h3>Gulf Infectious Diseases Society (GIDS) Annual Congress</h3>
        <p>
          GIDS generates QCHP and SCFHS-recognised CME credits directly. Content focused on GCC-specific
          infectious disease challenges — MERS-CoV, Hajj medicine, MDRO patterns in Gulf hospitals, and
          infection control in GCC healthcare settings.
        </p>

        <h2>MRCP, ABIM, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> The standard internal medicine qualification prerequisite for infectious disease specialist credentialing across QCHP, DHA, DOH, and SCFHS. MRCP with ID specialty training (SCE in Infectious Diseases and/or Medical Microbiology) is recognized for consultant-grade registration.</li>
          <li><strong>ABIM Infectious Disease (American Board of Internal Medicine — ID):</strong> Recognized by DHA, DOH, and several private hospital credentialing systems across the GCC. ABIM ID diplomates with subspecialty certification are well-regarded in GCC specialist credentialing.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for ID specialists across QCHP, DHA, and DOH.</li>
          <li><strong>Arab Board in Infectious Diseases:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
          <li><strong>DTM&H (Diploma in Tropical Medicine and Hygiene — LSTM or RCPSG):</strong> Recognized as a valued additional qualification by GCC authorities for ID specialists with travel and tropical medicine remit.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Infectious disease specialist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
