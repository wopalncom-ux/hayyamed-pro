import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CPD Requirements for Allied Health Professionals in GCC 2026 | Hayya Med Pro",
  description:
    "CPD requirements for physiotherapists, radiographers, occupational therapists, dietitians, medical lab scientists, and other allied health professionals in Qatar (QCHP), Saudi Arabia (SCFHS), Dubai (DHA), and all GCC authorities.",
  keywords: [
    "allied health CPD GCC",
    "physiotherapist CPD Qatar",
    "QCHP CPD allied health",
    "SCFHS CME allied health",
    "radiographer CPD GCC",
    "occupational therapist CPD GCC",
    "dietitian CME GCC",
    "medical lab scientist CPD GCC",
    "allied health professional licensing GCC",
    "paramedicine CPD GCC",
  ],
  openGraph: {
    title: "CPD Requirements for Allied Health Professionals in GCC 2026",
    description: "Complete guide to CPD and CME requirements for physiotherapists, radiographers, OTs, dietitians, and all allied health professions across all 7 GCC licensing authorities.",
    url: `${APP_URL}/blog/allied-health-cpd-requirements-gcc-2026`,
    type: "article",
  },
  alternates: { canonical: `${APP_URL}/blog/allied-health-cpd-requirements-gcc-2026` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CPD Requirements for Allied Health Professionals in GCC 2026",
  description: "Complete guide to CPD and CME requirements for allied health professionals across all 7 GCC licensing authorities.",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: APP_URL },
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  url: `${APP_URL}/blog/allied-health-cpd-requirements-gcc-2026`,
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do allied health professionals need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allied health professionals licensed by QCHP (DHP-AS) in Qatar require 80 CPD credits per 2-year renewal cycle, with a minimum of 40 CPD credits per year. This requirement applies uniformly to all licensed allied health categories — physiotherapists, radiographers, occupational therapists, dietitians, medical lab scientists, and others.",
      },
    },
    {
      "@type": "Question",
      name: "What CPD accreditors are recognized for physiotherapists in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For physiotherapists, the primary recognized accreditors in GCC are: WCPT (World Confederation for Physical Therapy) endorsed events, APTA (American Physical Therapy Association — accredited CE), CSP (Chartered Society of Physiotherapy — UK CPD), MACP and other specialist physiotherapy groups. ACCME-accredited events with physiotherapy content and EACCME-accredited rehabilitation conferences are also recognized.",
      },
    },
    {
      "@type": "Question",
      name: "Do online CPD courses count for allied health in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Online CPD is accepted by all major GCC authorities for allied health professionals. Key online platforms include profession-specific e-learning from APTA, ISRRT (radiographers), WFOT (occupational therapy), and ASCLS (medical lab). The same accreditor-recognition rule applies: the accreditor on the certificate matters more than where or how the activity was delivered.",
      },
    },
    {
      "@type": "Question",
      name: "How many CPD credits do allied health professionals need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allied health professionals licensed by SCFHS require 30 CME credits per year — the same as nurses and pharmacists, and lower than the 60 required for physicians. SCFHS uses an annual renewal cycle for allied health.",
      },
    },
  ],
};

const relatedLinks = [
  { label: "Allied health CPD tracker", href: "/allied-health-cpd" },
  { label: "QCHP CPD requirements", href: "/qchp" },
  { label: "SCFHS CME requirements", href: "/scfhs" },
  { label: "Nurse CPD requirements GCC", href: "/blog/nurse-cme-requirements-gcc-2026" },
  { label: "CME credit calculator", href: "/cme-calculator" },
];

const PROFESSIONS = [
  {
    title: "Physiotherapists",
    accreditors: "WCPT-endorsed, APTA CE, CSP (UK), MACP, ACAPT",
    context: "Qatar has expanded physiotherapy significantly — Hamad Medical Corporation, PHCC, and private hospital physio departments. Sports physiotherapy has grown with Qatar National Sports Medicine Programme and club-based physios.",
    cpd: ["Musculoskeletal and manual therapy courses", "Neurological rehabilitation (stroke, SCI)", "Sports physiotherapy and performance", "Paediatric physiotherapy", "Aquatic therapy", "Practice management and clinical reasoning"],
  },
  {
    title: "Radiographers & Medical Imaging Professionals",
    accreditors: "ISRRT-recognized, ARRT CE (US), SCoR CPD (UK), EFRS-accredited",
    context: "GCC has invested heavily in imaging infrastructure. Hamad Medical Corporation has one of the most advanced radiology departments in the region. AI-assisted radiology is expanding, making technology-specific CPD increasingly relevant.",
    cpd: ["CT and MRI advanced technique", "AI in radiology and image interpretation", "Interventional radiology support", "Radiation protection and safety", "Paediatric and oncologic imaging", "Quality management in imaging"],
  },
  {
    title: "Occupational Therapists",
    accreditors: "WFOT-accredited, AOTA CE (US), RCOT (UK), COTEC (Europe)",
    context: "OT in GCC has expanded through rehabilitation centres, paediatric OT programs, and hospital-based work hardening units. QCHP registers a significant number of OTs from the Philippines, India, UK, and Australia.",
    cpd: ["Paediatric OT (sensory integration, ASD)", "Hand therapy and splinting", "Mental health OT", "Return to work rehabilitation", "Assistive technology and seating", "Home modification assessments"],
  },
  {
    title: "Dietitians & Nutritionists",
    accreditors: "CDR (Commission on Dietetic Registration — US), BDA (UK), DAA (Australia)",
    context: "GCC has the world's highest rates of Type 2 diabetes and obesity — dietitians are in acute clinical demand. Hamad Medical Corporation, King Faisal Specialist Hospital, and private diabetes centres employ large dietitian teams.",
    cpd: ["Clinical nutrition in ICU and critical care", "Diabetes medical nutrition therapy", "Bariatric nutrition and surgery support", "Renal nutrition and dialysis", "Paediatric nutrition and failure to thrive", "Sports and performance nutrition"],
  },
  {
    title: "Medical Laboratory Scientists",
    accreditors: "ASCLS CE (US), IBMS CPD (UK), ASCP CM Maintenance",
    context: "Clinical lab services in GCC range from major reference labs (HMC Central Laboratory, KFSH) to private hospital labs. ISO 15189 accreditation drives ongoing CPD requirements for lab quality standards.",
    cpd: ["Point-of-care testing and validation", "Molecular diagnostics and PCR", "Blood banking and transfusion medicine", "Laboratory quality management (ISO 15189)", "Haematology and coagulation", "Clinical chemistry and immunoassay"],
  },
  {
    title: "Speech Therapists & Audiologists",
    accreditors: "ASHA CE (US), RCSLT (UK), SAA (Australia), IALP-affiliated",
    context: "Speech therapy and audiology have grown significantly in GCC through paediatric programmes, cochlear implant programmes (HMC, KFSH), and stroke rehabilitation units.",
    cpd: ["Dysphagia assessment and management", "Paediatric language and AAC", "Voice disorders and laryngology", "Cochlear implant mapping and rehabilitation", "Stuttering and fluency", "Cognitive communication in TBI"],
  },
];

export default function AlliedHealthCpdRequirementsGcc() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <BlogPostLayout
        title="CPD Requirements for Allied Health Professionals in GCC 2026"
        description="Complete guide to CPD and CME requirements for physiotherapists, radiographers, OTs, dietitians, and all allied health professions across all 7 GCC licensing authorities."
        category="guide"
        publishedAt="June 14, 2026"
        readingMinutes={10}
        relatedLinks={relatedLinks}
      >
        <p>
          Allied health professionals make up a large proportion of every GCC hospital&apos;s licensed workforce — physiotherapists, radiographers, occupational therapists, dietitians, medical laboratory scientists, speech therapists, and dozens of other regulated professions. Yet CPD guidance specific to allied health is often even harder to find than guidance for nurses or physicians. This guide covers what GCC-licensed allied health professionals need to know in 2026.
        </p>

        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-5 my-6">
          <p className="text-sm font-semibold text-[#1e40af] mb-2">Allied health CPD: the key rule</p>
          <p className="text-sm text-[#1e40af]">
            All major GCC authorities apply the same <strong>CPD credit target to all allied health professions</strong> — the same target as nurses and pharmacists, not the higher target for physicians. The accreditor requirements differ by profession, but the credit count is consistent within each authority.
          </p>
        </div>

        <h2>CPD requirements for allied health — all 7 GCC authorities</h2>

        <div className="overflow-x-auto my-6">
          <table>
            <thead>
              <tr>
                <th>Authority</th>
                <th>Country</th>
                <th>Allied health CPD requirement</th>
                <th>Cycle</th>
                <th>Term</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>QCHP (DHP-AS)</strong></td>
                <td>Qatar</td>
                <td>80 CPD / 2 years (40/yr min)</td>
                <td>Biennial</td>
                <td>CPD</td>
              </tr>
              <tr>
                <td><strong>SCFHS</strong></td>
                <td>Saudi Arabia</td>
                <td>30 CME / year</td>
                <td>Annual</td>
                <td>CME</td>
              </tr>
              <tr>
                <td><strong>DHA</strong></td>
                <td>Dubai, UAE</td>
                <td>40 CME / 2 years</td>
                <td>Biennial</td>
                <td>CME</td>
              </tr>
              <tr>
                <td><strong>DOH</strong></td>
                <td>Abu Dhabi, UAE</td>
                <td>30 CPD / 2 years</td>
                <td>Biennial</td>
                <td>CPD</td>
              </tr>
              <tr>
                <td><strong>MOH Kuwait</strong></td>
                <td>Kuwait</td>
                <td>30 CME / year</td>
                <td>Annual</td>
                <td>CME</td>
              </tr>
              <tr>
                <td><strong>NHRA</strong></td>
                <td>Bahrain</td>
                <td>40 CPD / 2 years</td>
                <td>Biennial</td>
                <td>CPD</td>
              </tr>
              <tr>
                <td><strong>OMSB</strong></td>
                <td>Oman</td>
                <td>40 CME / 2 years</td>
                <td>Biennial</td>
                <td>CME</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Profession-by-profession CPD guide</h2>
        <p>
          While the credit targets are consistent across allied health professions within each authority, the accreditors and CPD topics differ significantly by profession. Below is a guide for the major allied health professions in GCC:
        </p>

        {PROFESSIONS.map((p) => (
          <div key={p.title}>
            <h3>{p.title}</h3>
            <p className="text-sm text-[#64748b] mb-2"><strong>Recognized accreditors:</strong> {p.accreditors}</p>
            <p>{p.context}</p>
            <p className="font-semibold mt-3 mb-1">High-priority CPD areas:</p>
            <ul>
              {p.cpd.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Universal CPD sources for all allied health professions in GCC</h2>
        <ul>
          <li><strong>Hospital in-service education:</strong> Most major GCC hospitals (HMC, KFSH, Cleveland Clinic Abu Dhabi, Aster, Mediclinic) run allied health education programs — often carrying QCHP, DHA, or SCFHS accreditation directly. Always request a certificate</li>
          <li><strong>ACCME-accredited interprofessional education:</strong> Many GCC authorities accept ACCME-accredited events for allied health professionals where the content is clinically relevant to their practice. Confirm with your authority</li>
          <li><strong>AHA BLS and resuscitation training:</strong> Basic and advanced life support training carries CE credits recognized for all allied health professions in GCC</li>
          <li><strong>Infection prevention and control:</strong> APIC-accredited IPC training carries CE credits recognized across GCC for all allied health professions — often a mandatory renewal component</li>
          <li><strong>Patient safety training:</strong> Joint Commission International (JCI), ISQUA, and IHI patient safety courses carry internationally recognized accreditation for all clinical professions</li>
        </ul>

        <h2>Common mistakes allied health professionals make with GCC CPD</h2>
        <ul>
          <li><strong>Not knowing which accreditor your authority accepts:</strong> QCHP, DHA, and SCFHS each publish lists of accepted accreditors for allied health. Check your authority&apos;s portal before registering for an expensive CPD event to confirm it will count</li>
          <li><strong>Assuming hospital employment means CPD is handled:</strong> Many allied health professionals assume their employer manages their CPD compliance. In GCC, CPD is the individual professional&apos;s responsibility — not the employer&apos;s — even if the employer funds the training</li>
          <li><strong>Not tracking informal CPD:</strong> Peer review, journal club participation, case conferences, and clinical supervision may qualify as CPD for some GCC authorities — check your authority&apos;s CPD portfolio guidelines</li>
        </ul>

        <h2>Frequently asked questions</h2>
        {faqLd.mainEntity.map((faq) => (
          <div key={faq.name}>
            <h3>{faq.name}</h3>
            <p>{faq.acceptedAnswer.text}</p>
          </div>
        ))}
      </BlogPostLayout>
    </>
  );
}
