import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OB/GYN CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Obstetrics Guide",
  description:
    "CME requirements for obstetricians and gynaecologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, maternal-fetal medicine CME, reproductive endocrinology updates, gynaecologic oncology, MRCOG and ACOG recognition.",
  openGraph: {
    title: "OB/GYN CME GCC 2026 — Obstetrics and Gynaecology Complete Guide",
    description:
      "CME guide for obstetricians and gynaecologists in GCC countries: per-authority credit requirements, high-risk obstetrics, IVF, gynaecologic oncology, MRCOG and Arab Board recognition, and best OB/GYN conferences for GCC CME.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "OB/GYN CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do obstetricians need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Obstetricians and gynaecologists in Qatar must complete 80 CPD credits per 2-year cycle under QCHP — 40 per year minimum. The standard physician framework applies with no separate OB/GYN-specific credit split.",
      },
    },
    {
      "@type": "Question",
      name: "Is MRCOG recognized in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. MRCOG (Member of the Royal College of Obstetricians and Gynaecologists, UK) is recognized by QCHP, DHA, DOH, and SCFHS as the consultant-grade specialist qualification for obstetricians and gynaecologists.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BlogPostLayout
        title="OB/GYN CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Obstetrics Guide"
        description="Obstetrics and gynaecology in the GCC encompasses a diverse clinical landscape — from high-volume normal deliveries and complex high-risk pregnancies to laparoscopic and robotic gynaecologic surgery, fertility treatment, and gynaecologic oncology."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC OB/GYN CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC OB/GYN Specialists</h2>

        <h3>High-Risk Obstetrics and Maternal-Fetal Medicine</h3>
        <ul>
          <li>Preeclampsia and hypertensive disorders of pregnancy — updated ISSHP guidelines, low-dose aspirin prevention</li>
          <li>Gestational diabetes mellitus — updated diagnostic criteria, insulin management, fetal surveillance</li>
          <li>Preterm labour and premature rupture of membranes — updated management protocols</li>
          <li>Fetal growth restriction — surveillance protocols, umbilical artery Doppler interpretation</li>
          <li>Twin and higher-order pregnancies — TTTS management, monoamniotic twin surveillance</li>
          <li>Maternal sepsis — sepsis-3 criteria, Hour-1 bundle in obstetrics</li>
        </ul>
        <p>
          <strong>GCC note:</strong> Gestational diabetes and hypertensive disorders of pregnancy
          are particularly prevalent in GCC populations given underlying rates of type 2 diabetes
          and metabolic syndrome. Updated GDM management is a high-priority CME topic for all
          GCC obstetricians.
        </p>

        <h3>Reproductive Endocrinology and IVF</h3>
        <ul>
          <li>IVF stimulation protocols — GnRH antagonist, progestin-primed protocols, mild stimulation</li>
          <li>Preimplantation genetic testing (PGT-A, PGT-M) — updated evidence, counselling</li>
          <li>Endometriosis — updated ESHRE guidelines, surgical and medical management</li>
          <li>PCOS management — updated diagnosis criteria, ovulation induction, metabolic management</li>
          <li>Recurrent implantation failure — evaluation and evidence-based management</li>
        </ul>

        <h3>Gynaecologic Oncology</h3>
        <ul>
          <li>Cervical cancer — FIGO 2018 staging, sentinel lymph node mapping, fertility-sparing surgery</li>
          <li>Endometrial cancer — surgical staging, molecular classification (TCGA), immunotherapy updates</li>
          <li>Ovarian cancer — cytoreductive surgery, HIPEC, PARP inhibitor maintenance</li>
          <li>Vulvar cancer — updated management guidelines, sentinel node biopsy</li>
          <li>HPV vaccination — updated schedules, GCC national programmes</li>
        </ul>

        <h3>Minimally Invasive Gynaecologic Surgery</h3>
        <ul>
          <li>Laparoscopic hysterectomy — total laparoscopic hysterectomy (TLH), subtotal, vaginal-assisted</li>
          <li>Hysteroscopic procedures — submucous myomectomy, septum resection, office hysteroscopy</li>
          <li>Robotic gynaecologic surgery — platform updates, robotic myomectomy, robotic sacrocolpopexy</li>
          <li>Urogynecology — prolapse repair, sling procedures for SUI — updated IUGA guidelines</li>
        </ul>

        <h2>Best OB/GYN Conferences for GCC CME</h2>

        <h3>ACOG Annual Meeting (American College of Obstetricians and Gynecologists)</h3>
        <p>
          ACOG Annual (April/May, USA) generates AMA PRA Category 1 CME credits accepted by all
          GCC authorities. The world&apos;s largest OB/GYN conference — comprehensive coverage across
          obstetrics, reproductive endocrinology, gynaecologic oncology, and minimally invasive surgery.
        </p>

        <h3>FIGO World Congress (International Federation of Gynaecology and Obstetrics)</h3>
        <p>
          FIGO World Congress (biennial) generates EACCME credits. Global focus with particular
          relevance to resource settings and regional epidemiology — well-attended by GCC specialists.
        </p>

        <h3>ESHRE Annual Meeting (European Society of Human Reproduction and Embryology)</h3>
        <p>
          ESHRE Annual Meeting generates EACCME credits. The premier reproductive endocrinology
          and IVF conference — essential for GCC specialists working in fertility medicine.
        </p>

        <h2>MRCOG, ABOG, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCOG (Member of the Royal College of Obstetricians and Gynaecologists, UK):</strong> Recognized by QCHP, DHA, DOH, and SCFHS. The most common specialist qualification among UK-trained GCC OB/GYN specialists.</li>
          <li><strong>American Board of Obstetrics and Gynecology (ABOG):</strong> Recognized by GCC authorities. ABOG MOC activities count toward GCC CME renewal.</li>
          <li><strong>Arab Board in Obstetrics and Gynaecology:</strong> Recognized across all GCC countries; valued particularly in Saudi Arabia, Kuwait, and Qatar.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> OB/GYN CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}
