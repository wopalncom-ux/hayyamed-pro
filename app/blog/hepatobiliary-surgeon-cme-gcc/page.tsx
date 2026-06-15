import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hepatobiliary Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for hepatobiliary surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, robotic HPB surgery, ALPPS and staged hepatectomy, ERCP advances, liver transplantation, cholangiocarcinoma surgery, and the best HPB CME conferences for GCC surgeons.",
  openGraph: {
    title: "Hepatobiliary Surgeon CME GCC 2026 — QCHP, SCFHS, DHA HPB Surgery Guide",
    description:
      "CME guide for hepatobiliary surgeons in GCC countries: credit requirements, robotic HPB surgery, ALPPS staged hepatectomy, liver transplant, cholangiocarcinoma surgery, and leading HPB conferences.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hepatobiliary Surgeon CME Requirements in the GCC 2026",
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
        title="Hepatobiliary Surgeon CME Requirements in the GCC 2026"
        description="Complete CME guide for hepatobiliary and pancreatic surgeons across Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman."
        publishedAt="2026-06-15"
        readingMinutes={12}
      >
        <h2>HPB Surgery in the GCC: Growing Demand, Concentrated Expertise</h2>
        <p>
          Hepatobiliary and pancreatic (HPB) surgery is among the most technically demanding surgical
          subspecialties, and the GCC is investing heavily in building domestic HPB capacity. Hamad Medical
          Corporation&apos;s hepatology and liver transplant programme, Sidra Medicine&apos;s paediatric liver
          programme, King Faisal Specialist Hospital &amp; Research Centre&apos;s liver transplant and HPB unit
          (one of the region&apos;s highest-volume transplant programmes), Cleveland Clinic Abu Dhabi&apos;s
          digestive disease centre, and Oman&apos;s Sultan Qaboos University Hospital HPB unit all represent
          significant GCC HPB surgical infrastructure.
        </p>
        <p>
          Non-alcoholic fatty liver disease (NAFLD/MASLD) — driven by the GCC&apos;s epidemic of obesity and
          type 2 diabetes — is creating rising demand for HPB surgical expertise: more patients are
          progressing to cirrhosis, hepatocellular carcinoma, and requiring liver resection or
          transplantation. Colorectal cancer liver metastasis resection, cholangiocarcinoma surgery, and
          complex biliary reconstruction are all increasing in volume. For HPB surgeons in the GCC,
          maintaining current CME is inseparable from maintaining surgical safety.
        </p>

        <h2>CME Credit Requirements by GCC Authority (2026)</h2>
        <ul>
          <li><strong>Qatar (QCHP/DHP-AS):</strong> 80 CPD credits per 2-year cycle. HPB surgery CME from IHPBA (International Hepato-Pancreato-Biliary Association), ESSO (European Society of Surgical Oncology), SAGES, and IASGO (International Association of Surgeons, Gastroenterologists, and Oncologists) are accepted by QCHP as international CME. Hamad Medical Corporation organises quarterly HPB surgical CME events generating QCHP-approved hours. The Qatar Surgical Society runs annual events with HPB streams.</li>
          <li><strong>Saudi Arabia (SCFHS):</strong> 60 CME credit hours per 3-year cycle (surgical specialty track). The Saudi Surgical Society&apos;s annual scientific meetings include dedicated HPB sessions. SCFHS recognises IHPBA, SAGES, ACS (American College of Surgeons), and ESSO CME. KFSH&RC Riyadh and Jeddah both organise SCFHS-approved HPB surgical workshops and wet-lab training events.</li>
          <li><strong>Dubai (DHA):</strong> 40 CME credits per 2-year cycle. DHA recognises IHPBA, ESSO, SAGES, ACS, and EAHPBA (European Association for the Study of the Liver HPB section) CME. Arab Health (February Dubai) includes surgical oncology and HPB sessions each year generating DHA-approved CME.</li>
          <li><strong>Abu Dhabi (DOH):</strong> 40 CPD points per renewal cycle. DOH has similar international CME recognition to DHA. Cleveland Clinic Abu Dhabi&apos;s surgery department organises DOH-approved HPB surgical CME, including both didactic and simulation-based events.</li>
          <li><strong>Kuwait (MOH Kuwait):</strong> 30 CME hours annually. The Kuwait National Guard Hospital and Mubarak Al-Kabeer Hospital HPB units are the primary CME hubs. MOH Kuwait accepts IHPBA, ACS, and SAGES CME. Kuwait&apos;s liver transplant programme is growing, with increasing demand for HPB CME.</li>
          <li><strong>Bahrain (NHRA):</strong> 40 CPD credits per 2-year cycle. King Hamad University Hospital and Salmaniya Medical Complex provide the primary HPB surgical CME in Bahrain. NHRA accepts IHPBA, ACS, and ESSO international CME.</li>
          <li><strong>Oman (OMSB):</strong> 40 CME credits per 2-year cycle. Sultan Qaboos University Hospital&apos;s HPB unit organises OMSB-approved CME. OMSB recognises IHPBA, ESSO, and ACS international HPB CME.</li>
        </ul>

        <h2>Robotic and Minimally Invasive HPB Surgery</h2>
        <p>
          The transition from open to minimally invasive HPB surgery is the single most consequential
          technical development for GCC HPB surgeons in 2024–2026:
        </p>
        <ul>
          <li><strong>Robotic hepatectomy:</strong> The 2023 OSLO-COMET randomised controlled trial validating laparoscopic liver resection for colorectal metastases established the evidence base for minimally invasive liver surgery. Robotic hepatectomy (using da Vinci Xi and the newer SP robot) has expanded rapidly — the 2024 international consensus conference on robotic liver surgery (Southampton consensus) defined standardised techniques for robotic right and left hepatectomy, trisectionectomy, and posterosuperior segment resections. GCC centres including Hamad Medical Corporation and KFSH&RC are expanding robotic HPB programmes. CME covering robotic hepatectomy credentialling, standardised technique, and the specific challenges of posterosuperior segment lesions is an urgent HPB CME priority.</li>
          <li><strong>Robotic pancreatic surgery:</strong> The LEOPARD-2 trial and subsequent large institutional series have established robotic pancreaticoduodenectomy (Whipple) as safe and reproducible in high-volume centres. The robotic approach for distal pancreatectomy (robotic DP) has demonstrated advantages over open DP in spleen preservation rate and blood loss. CME covering the learning curve for robotic pancreatectomy (generally considered 40–80 cases for competency), patient selection criteria, and management of robotic HPB complications is directly relevant for GCC HPB surgeons at centres introducing robotic pancreatic surgery.</li>
          <li><strong>Single-incision and reduced-port laparoscopic cholecystectomy:</strong> Increasingly relevant for GCC surgeons at high-volume cholecystectomy centres — including the management of difficult gallbladder (acute cholecystitis, Mirizzi syndrome, empyema) via minimally invasive approaches. The 2024 WSES (World Society of Emergency Surgery) and SAGES guidelines on difficult cholecystectomy — particularly the critical view of safety and bailout techniques — are essential CME for all GCC surgeons performing cholecystectomy.</li>
        </ul>

        <h2>Liver Transplantation: Technical and Immunological Advances</h2>
        <ul>
          <li><strong>Machine perfusion in liver transplantation:</strong> Normothermic machine perfusion (NMP, METRA trial, OCS Liver) and hypothermic oxygenated perfusion (HOPE, D-HOPE) have changed the paradigm for marginal graft utilisation, organ assessment, and ischaemia-reperfusion injury reduction. The 2024 ILTS (International Liver Transplantation Society) consensus guidelines on machine perfusion — covering indications, technical protocols, and assessment criteria for graft acceptance or rejection after NMP — are must-know CME for GCC transplant HPB surgeons. KFSH&RC has adopted NMP for extended criteria donors, directly applicable CME for the GCC context.</li>
          <li><strong>Living donor liver transplantation (LDLT):</strong> LDLT remains the dominant transplant modality in the GCC due to lower deceased donor organ availability. The 2024 ILTS consensus on LDLT technical standardisation — covering donor hepatectomy techniques, bile duct reconstruction, venous outflow optimisation, and small-for-size syndrome prevention — represents essential CME for GCC HPB transplant surgeons. Saudi Arabia and Qatar both have active LDLT programmes with specific technical challenges related to recipient demographics (metabolic syndrome, NASH cirrhosis) and donor pool characteristics.</li>
          <li><strong>Post-transplant immunosuppression and HCC recurrence:</strong> mTOR inhibitors (everolimus, sirolimus) in the post-transplant setting — both for their immunosuppressive properties and potential anti-tumour effect in HCC transplant recipients — require HPB surgeons and hepatologists to be current on the 2024 ELTR (European Liver Transplant Registry) evidence on HCC recurrence risk and immunosuppression minimisation strategies.</li>
        </ul>

        <h2>Cholangiocarcinoma and HPB Oncological Surgery</h2>
        <ul>
          <li><strong>FGFR2 inhibitors and the surgical implications:</strong> Pemigatinib and infigratinib (FGFR2 inhibitors) have changed the management of FGFR2-fusion-positive intrahepatic cholangiocarcinoma (iCCA). For HPB surgeons, the emerging role of neoadjuvant FGFR inhibitor therapy — converting initially unresectable iCCA to resectable — and the criteria for patient selection (FGFR2 fusion testing, tumour biology, vessel involvement) require current CME. The 2024 ESMO clinical practice guidelines for biliary tract cancer updated the surgical management recommendations in the context of the new systemic therapy landscape.</li>
          <li><strong>Portal vein embolisation and ALPPS for borderline resectable HCC and CRLM:</strong> Associating liver partition and portal vein ligation for staged hepatectomy (ALPPS) generates rapid liver hypertrophy and has expanded the surgical pool for bilateral colorectal liver metastases and primary liver tumours with marginal future liver remnant (FLR). The 2024 ALPPS registry analysis updated the evidence on patient selection (ideal future liver remnant target, kinetic growth rate prediction), perioperative risk stratification, and the comparison with conventional two-stage hepatectomy plus PVE. CME on ALPPS indications, surgical technique, and the evidence comparison with PVE + two-stage hepatectomy is an important HPB CME topic for GCC surgeons managing complex liver tumour cases.</li>
          <li><strong>Gallbladder cancer: T-staging and radical surgery:</strong> The management of incidentally discovered gallbladder cancer (post-cholecystectomy pathology) — particularly the decision between observation and re-resection for pT1b disease, and the extent of re-resection for pT2 and pT3 disease — is one of the most clinically challenging decisions in HPB oncology. The 2024 IHPBA consensus on incidental gallbladder cancer management provides the most current evidence-based guidance. CME on gallbladder cancer staging, surgical indications, and the survival implications of port-site excision has direct practice relevance in the GCC where gallstone disease is prevalent.</li>
        </ul>

        <h2>High-Priority CME Events for GCC HPB Surgeons</h2>
        <ul>
          <li><strong>IHPBA World Congress</strong> — Biennial (even years, international). International Hepato-Pancreato-Biliary Association; the definitive HPB surgery CME event globally; 20–25 CME hours; covers liver, pancreas, biliary, and transplant surgery. IHPBA CME accepted by QCHP, DHA, and SCFHS.</li>
          <li><strong>EASL International Liver Congress</strong> — Annual (June, Europe). European Association for the Study of the Liver; surgical and interventional content relevant to HPB surgeons; EACCME-accredited; 15–20 CME hours. Accepted by QCHP and DHA.</li>
          <li><strong>Americas HPB Association Annual Meeting (AHPBA)</strong> — Annual (February, USA). Americas Hepato-Pancreato-Biliary Association; 15–20 CME credits; strong oncological HPB content. AMA PRA CME accepted by QCHP, DHA, and SCFHS.</li>
          <li><strong>SAGES Annual Meeting</strong> — Annual (spring, USA). Society of American Gastrointestinal and Endoscopic Surgeons; minimally invasive HPB content including robotic hepatectomy and distal pancreatectomy. AMA PRA CME accepted by QCHP, DHA, and SCFHS.</li>
          <li><strong>Arab Health (HPB/Surgical Oncology Stream)</strong> — Annual (February, Dubai). DHA-approved CME; regional network access; GCC-specific case presentations. Essential for DHA-licensed HPB surgeons for local CME credits.</li>
          <li><strong>IHPBA e-Learning Platform</strong> — Continuous (online). IHPBA on-demand CME modules on robotic surgery, transplant, and oncological HPB procedures; accepted by QCHP and DHA for self-directed CME.</li>
        </ul>

        <h2>Tracking HPB Surgery CME with Hayya Med Pro</h2>
        <p>
          HPB surgeons in the GCC typically draw CME from IHPBA, AHPBA, EASL, SAGES, and local
          institutional events — each with different credit denominators and renewal requirements.
          Hayya Med Pro&apos;s multi-category CME wallet tracks each activity with accreditor, credit type,
          and procedure category, generating renewal-ready documentation for QCHP, SCFHS, DHA, or any
          other GCC authority.
        </p>
        <p>
          <em>
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not
            replace official licensing authorities. HPB surgeons must verify final requirements with
            QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or their relevant authority.
          </em>
        </p>
      </BlogPostLayout>
    </>
  );
}
