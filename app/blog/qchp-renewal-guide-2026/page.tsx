import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

const APP_URL = "https://hayyamed.pro";
const SLUG = "qchp-renewal-guide-2026";

export const metadata: Metadata = {
  title: "Complete QCHP License Renewal Guide 2026 | Hayya Med Pro",
  description:
    "Step-by-step guide to renewing your QCHP healthcare license in Qatar in 2026. 80 CPD requirements, accepted activities, submission timeline, and common mistakes to avoid.",
  keywords: [
    "QCHP renewal 2026",
    "QCHP license renewal guide",
    "Qatar healthcare license renewal",
    "QCHP CPD requirements",
    "how to renew QCHP license",
    "Qatar medical license renewal",
    "QCHP DHP renewal",
  ],
  openGraph: {
    title: "Complete QCHP License Renewal Guide 2026",
    description: "Everything you need to renew your QCHP healthcare license in Qatar. 80 CPD, accepted activities, timeline, and common mistakes.",
    url: `${APP_URL}/blog/${SLUG}`,
    type: "article",
    publishedTime: "2026-06-10",
    authors: ["Hayya Med Pro Editorial"],
  },
  twitter: { card: "summary_large_image", title: "Complete QCHP License Renewal Guide 2026", description: "How to renew your QCHP healthcare license in Qatar. CPD requirements, accepted activities, and step-by-step process." },
  alternates: { canonical: `${APP_URL}/blog/${SLUG}` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Complete QCHP License Renewal Guide 2026",
  description: "Step-by-step guide to renewing your QCHP healthcare license in Qatar in 2026.",
  datePublished: "2026-06-10",
  dateModified: "2026-06-10",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: APP_URL },
  publisher: { "@type": "Organization", name: "Hayya Med AI", url: APP_URL },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${APP_URL}/blog/${SLUG}` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need to renew my QCHP license?",
      acceptedAnswer: { "@type": "Answer", text: "You need 80 CPD credits per 2-year renewal cycle, with a minimum of 40 credits in each year. This applies to all healthcare professionals licensed by QCHP in Qatar." },
    },
    {
      "@type": "Question",
      name: "What activities count as CPD for QCHP renewal?",
      acceptedAnswer: { "@type": "Answer", text: "QCHP accepts: attending conferences and workshops, completing online courses from accredited providers, publishing journal articles, teaching and academic activities, and professional development training. Activities must be accredited by QCHP-recognized bodies including AMA-PRA, EACCME, Royal Colleges, and QCHP-accredited local providers." },
    },
    {
      "@type": "Question",
      name: "When should I start tracking CPD for QCHP renewal?",
      acceptedAnswer: { "@type": "Answer", text: "Start tracking from the first day of your license cycle. QCHP renewal cycles are 2 years, and you need 40 credits per year minimum. Starting late means catching up — many professionals find themselves scrambling in the final 3 months of their cycle." },
    },
  ],
};

export default function QchpRenewalGuide2026() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogPostLayout
        title="Complete QCHP License Renewal Guide 2026"
        description="Step-by-step guide to renewing your QCHP healthcare license in Qatar. 80 CPD requirements, accepted activities, submission timeline, and the most common mistakes that delay renewal."
        publishedAt="2026-06-10"
        category="country"
        readingMinutes={8}
        relatedLinks={[
          { label: "QCHP authority guide", href: "/qchp" },
          { label: "QCHP renewal page", href: "/qchp-renewal" },
          { label: "CME calculator", href: "/cme-calculator" },
          { label: "Physician CME requirements", href: "/physician-cme" },
          { label: "CME vs CPD explained", href: "/blog/cme-vs-cpd-gcc" },
        ]}
      >
        <h2>What is QCHP and why does renewal matter?</h2>
        <p>
          The Qatar Council for Healthcare Practitioners (QCHP), operating under the Department of Healthcare Professionals (DHP-AS) within the Ministry of Public Health, is the national authority responsible for licensing all healthcare professionals practicing in Qatar.
        </p>
        <p>
          Without a valid QCHP license, you cannot legally practice healthcare in Qatar. Failure to renew on time can result in your license expiring — which means you must stop seeing patients until renewal is complete. For hospital-employed professionals, this creates serious HR implications.
        </p>

        <h2>CPD requirements at a glance</h2>
        <p>QCHP uses the term <strong>CPD (Continuing Professional Development)</strong> rather than CME, though the two terms refer to the same concept for licensing purposes.</p>
        <ul>
          <li><strong>Total credits required:</strong> 80 CPD credits per 2-year license cycle</li>
          <li><strong>Annual minimum:</strong> 40 CPD credits per year (you cannot front-load or back-load)</li>
          <li><strong>Applies to:</strong> all healthcare professions — physicians, nurses, pharmacists, dentists, allied health, and all others licensed by QCHP</li>
          <li><strong>Cycle:</strong> 2 years, aligned to your license expiry date</li>
        </ul>

        <h2>What activities count as CPD for QCHP?</h2>
        <p>QCHP accepts a wide range of CPD activities, broadly categorized as:</p>

        <h3>Category 1: Educational activities</h3>
        <ul>
          <li>Attending accredited conferences, seminars, and workshops</li>
          <li>Completing online courses from QCHP-recognized accreditors</li>
          <li>Attending grand rounds and hospital-based educational sessions (when formally accredited)</li>
          <li>Journal reading programs with assessment</li>
        </ul>

        <h3>Category 2: Professional activities</h3>
        <ul>
          <li>Teaching medical students, residents, or colleagues (formal teaching with documented hours)</li>
          <li>Clinical supervision of trainees</li>
          <li>Mentoring programs</li>
        </ul>

        <h3>Category 3: Academic and research activities</h3>
        <ul>
          <li>Publishing peer-reviewed research articles (as first or co-author)</li>
          <li>Presenting research at conferences</li>
          <li>Contributing to clinical guideline development</li>
          <li>Textbook authorship or editorship</li>
        </ul>

        <h2>Which accreditors does QCHP recognize?</h2>
        <p>QCHP recognizes CME credits from a wide range of international and regional bodies, including:</p>
        <ul>
          <li><strong>AMA-PRA</strong> (American Medical Association Physician Recognition Award) — 1 AMA PRA Category 1 Credit™ = 1 QCHP CPD point</li>
          <li><strong>EACCME</strong> (European Accreditation Council for Continuing Medical Education)</li>
          <li><strong>Royal College of Physicians and Surgeons of Canada</strong></li>
          <li><strong>UK Royal Colleges</strong> (RCP, RCN, RCS, RCPsych, etc.)</li>
          <li><strong>QCHP-accredited local providers</strong> in Qatar (check the QCHP provider directory)</li>
          <li><strong>Joint Accreditation</strong> for Interprofessional Continuing Education</li>
        </ul>
        <p>Activities from unaccredited providers do not count toward your QCHP CPD requirement, regardless of quality.</p>

        <h2>Step-by-step: How to renew your QCHP license</h2>

        <h3>Step 1: Track CPD from day one of your cycle</h3>
        <p>
          Do not wait until the renewal period opens. Your 2-year clock starts from your license issue or last renewal date. Every accredited activity you complete from that date is eligible — log it immediately, including the date, activity name, accreditor, and credit hours.
        </p>

        <h3>Step 2: Keep your certificates</h3>
        <p>
          For every CPD activity, retain the original certificate. QCHP may request evidence during the renewal process or in a random audit. Certificates should show: your name, the activity name, date, accreditor, and credit hours awarded.
        </p>

        <h3>Step 3: Log activities on the QCHP portal</h3>
        <p>
          QCHP has a professional portal where you can log CPD activities during your cycle. Do not leave this until renewal — add activities as you complete them. This makes renewal submission significantly faster.
        </p>

        <h3>Step 4: Apply for renewal when your license is due</h3>
        <p>
          QCHP typically opens the renewal window 90 days before your license expiry date. You will receive a notification from QCHP to your registered email. Log in to the QCHP portal and submit your renewal application with:
        </p>
        <ul>
          <li>Your 80 CPD points documented in the portal</li>
          <li>Current employment information</li>
          <li>Any required specialty-specific documents</li>
          <li>Renewal fee payment</li>
        </ul>

        <h3>Step 5: Pay the renewal fee</h3>
        <p>QCHP charges a renewal fee (amounts vary by profession — check the current QCHP fee schedule on their official website). Payment is made online through the portal.</p>

        <h3>Step 6: Receive your renewed license</h3>
        <p>Once approved, your new license is issued digitally through the QCHP portal. Standard processing takes 5–15 working days if your CPD documentation is complete and your application is correct.</p>

        <h2>Common mistakes that delay QCHP renewal</h2>
        <ul>
          <li><strong>Waiting until the final month to log CPD.</strong> You may find you don't have enough credits and cannot complete the required activities in time.</li>
          <li><strong>Using unaccredited activities.</strong> A popular conference that isn't QCHP-recognized does not count, no matter how many hours you attended.</li>
          <li><strong>Not meeting the 40/year minimum.</strong> Completing 70 credits in year 2 and only 10 in year 1 is not compliant — each year requires at least 40.</li>
          <li><strong>Lost certificates.</strong> If you can't produce evidence, QCHP may not credit the activity. Keep digital backups of every certificate.</li>
          <li><strong>Outdated contact information.</strong> QCHP renewal notifications go to your registered email. If it's wrong, you miss the notification.</li>
          <li><strong>Employment information not updated.</strong> If you changed hospitals or clinics, update your employer information in the QCHP portal before renewal.</li>
        </ul>

        <h2>How much CPD should you earn per month?</h2>
        <p>To hit 40 credits per year comfortably, aim for roughly <strong>3–4 CPD credits per month</strong>. This is achievable by:</p>
        <ul>
          <li>Attending 1 accredited workshop or webinar per month (typically 3–6 credits)</li>
          <li>Completing 1–2 online CME modules per month (1–2 credits each)</li>
          <li>Attending an annual professional conference (typically 15–25 credits for 2–3 day events)</li>
        </ul>

        <h2>Tracking your QCHP CPD with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro is a CME/CPD tracking platform built specifically for GCC healthcare professionals, including QCHP requirements. You can log every activity, upload certificates, and see your real-time progress toward the 80-credit target — with automated reminders before your renewal deadline.
        </p>
        <p>
          The platform is free to start, with a Pro plan that adds PDF compliance report generation (ready to reference during your QCHP renewal) and AI-powered gap analysis.
        </p>

        <h2>Key QCHP contacts and resources</h2>
        <ul>
          <li><strong>QCHP official website:</strong> qchp.org.qa</li>
          <li><strong>QCHP professional portal:</strong> for license management and CPD logging</li>
          <li><strong>QCHP contact center:</strong> +974 4406 0000</li>
          <li><strong>Email:</strong> info@qchp.org.qa</li>
        </ul>
        <p>
          Always verify current fees, accepted accreditors, and any policy changes directly with QCHP. Rules can change between cycles.
        </p>
      </BlogPostLayout>
    </>
  );
}
