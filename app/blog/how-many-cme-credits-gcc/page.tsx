import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

const APP_URL = "https://hayyamed.pro";
const SLUG = "how-many-cme-credits-gcc";

export const metadata: Metadata = {
  title: "How Many CME Credits Do I Need? GCC Complete Guide 2026 | Hayya Med Pro",
  description:
    "Exact CME and CPD credit requirements for every GCC healthcare authority in 2026. QCHP Qatar (80 CPD/2yr), SCFHS Saudi Arabia (30–60/yr), DHA Dubai (40/2yr), DOH Abu Dhabi, Kuwait, Bahrain, Oman.",
  keywords: [
    "how many CME credits do I need GCC",
    "CME requirements GCC 2026",
    "CPD credits healthcare GCC",
    "QCHP CPD credits required",
    "SCFHS CME credits per year",
    "DHA CME requirements",
    "GCC CME comparison",
    "healthcare professional CME GCC",
    "how many CPD points Qatar",
    "CME credits by country GCC",
  ],
  openGraph: {
    title: "How Many CME Credits Do I Need? GCC Complete Guide 2026",
    description: "Exact CME and CPD credit requirements for QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, and OMSB — compared in one place.",
    url: `${APP_URL}/blog/${SLUG}`,
    type: "article",
    publishedTime: "2026-06-13",
    authors: ["Hayya Med Pro Editorial"],
  },
  twitter: { card: "summary_large_image", title: "How Many CME Credits Do I Need? GCC 2026", description: "CME and CPD credit requirements for every GCC healthcare authority — QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB." },
  alternates: { canonical: `${APP_URL}/blog/${SLUG}` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Many CME Credits Do I Need? GCC Complete Guide 2026",
  description: "Exact CME and CPD credit requirements for every GCC healthcare authority in 2026.",
  datePublished: "2026-06-13",
  dateModified: "2026-06-13",
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
      name: "How many CME credits do I need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP (Qatar Council for Healthcare Practitioners) requires 80 CPD credits per 2-year license cycle, with a minimum of 40 CPD credits per year. This applies to all healthcare professions — physicians, nurses, pharmacists, dentists, and allied health professionals.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits do I need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS (Saudi Commission for Health Specialties) requires CME credits annually, with the amount varying by profession: physicians, pharmacists, and dentists need 60 CME credits per year; nurses and allied health professionals need 30 CME credits per year. Up to 50% of these can be earned through online activities.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits do I need in Dubai (DHA)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA (Dubai Health Authority) requires 40 CME credits per 2-year license renewal cycle. This applies to all DHA-licensed healthcare professionals.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC country has the strictest CME requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Saudi Arabia (SCFHS) has the most demanding CME requirement for physicians and pharmacists at 60 credits per year (annual renewal cycle). Qatar (QCHP) requires 80 CPD credits over 2 years (effectively 40/year). Dubai (DHA) has the most modest requirement at 40 CME credits per 2-year cycle.",
      },
    },
    {
      "@type": "Question",
      name: "Do CME credits from one GCC country count in another?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the accreditor, not the country. An activity accredited by AMA-PRA, EACCME, or a Royal College may count toward multiple GCC authorities simultaneously, since most GCC authorities recognize the same major international accreditors. However, you must log the activity separately in each authority's portal and track each license independently.",
      },
    },
  ],
};

export default function HowManyCmeCreditsGcc() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogPostLayout
        title="How Many CME Credits Do I Need? GCC Complete Guide 2026"
        description="Exact CME and CPD credit requirements for every GCC healthcare authority in 2026 — QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, and OMSB — compared in one place."
        publishedAt="2026-06-13"
        category="guide"
        readingMinutes={7}
        relatedLinks={[
          { label: "CME calculator", href: "/cme-calculator" },
          { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
          { label: "CME vs CPD explained", href: "/blog/cme-vs-cpd-gcc" },
          { label: "QCHP renewal guide", href: "/blog/qchp-renewal-guide-2026" },
          { label: "SCFHS CME guide", href: "/blog/scfhs-cme-requirements-2026" },
        ]}
      >
        <h2>Quick answer: CME/CPD credits by GCC authority</h2>
        <p>
          The most searched question among GCC healthcare professionals renewing their license: <em>how many CME credits do I actually need?</em> The answer depends on which authority licenses you — and in some cases, which profession you practice.
        </p>

        <table>
          <thead>
            <tr>
              <th>Authority</th>
              <th>Country</th>
              <th>Credits required</th>
              <th>Cycle</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>QCHP / DHP-AS</strong></td>
              <td>Qatar</td>
              <td><strong>80 CPD credits total</strong> (min. 40/year)</td>
              <td>2 years</td>
              <td>CPD</td>
            </tr>
            <tr>
              <td><strong>SCFHS</strong></td>
              <td>Saudi Arabia</td>
              <td><strong>60/yr</strong> (physicians, pharmacists, dentists)<br /><strong>30/yr</strong> (nurses, allied health)</td>
              <td>Annual</td>
              <td>CME</td>
            </tr>
            <tr>
              <td><strong>DHA</strong></td>
              <td>UAE (Dubai)</td>
              <td><strong>40 CME credits total</strong></td>
              <td>2 years</td>
              <td>CME</td>
            </tr>
            <tr>
              <td><strong>DOH</strong></td>
              <td>UAE (Abu Dhabi)</td>
              <td><strong>30–50 CPD credits total</strong> (by profession)</td>
              <td>2 years</td>
              <td>CPD</td>
            </tr>
            <tr>
              <td><strong>MOH Kuwait</strong></td>
              <td>Kuwait</td>
              <td><strong>30 CME credits/year</strong></td>
              <td>Annual</td>
              <td>CME</td>
            </tr>
            <tr>
              <td><strong>NHRA</strong></td>
              <td>Bahrain</td>
              <td><strong>40 CPD credits total</strong></td>
              <td>2 years</td>
              <td>CPD</td>
            </tr>
            <tr>
              <td><strong>OMSB</strong></td>
              <td>Oman</td>
              <td><strong>40 CME credits total</strong></td>
              <td>2 years</td>
              <td>CME</td>
            </tr>
          </tbody>
        </table>

        <h2>Breaking it down by authority</h2>

        <h3>Qatar (QCHP) — 80 CPD per 2 years</h3>
        <p>
          QCHP requires <strong>80 CPD credits per 2-year license cycle</strong>, with a minimum of 40 credits in each individual year. You cannot bank credits from year 1 to cover year 2 if you fall short of the annual minimum.
        </p>
        <p>
          This applies to all QCHP-licensed professions equally — physicians, nurses, pharmacists, dentists, and allied health professionals all face the same 80-credit biennial requirement. QCHP uses the term "CPD" (Continuing Professional Development), not "CME."
        </p>
        <p>
          <strong>Effective rate:</strong> 40 CPD credits per year, or roughly 3–4 credits per month.
        </p>
        <p>
          <strong>Compared to other GCC countries:</strong> QCHP's requirement is moderate — more demanding than DHA Dubai (40/2yr) but less intensive than SCFHS Saudi Arabia for physicians (60/yr).
        </p>

        <h3>Saudi Arabia (SCFHS) — 30–60 CME per year</h3>
        <p>
          SCFHS has the most nuanced CME structure in the GCC because requirements vary by profession and the renewal cycle is annual:
        </p>
        <ul>
          <li><strong>Physicians (all specialties):</strong> 60 CME credits/year</li>
          <li><strong>Pharmacists:</strong> 60 CME credits/year</li>
          <li><strong>Dentists:</strong> 60 CME credits/year</li>
          <li><strong>Nurses:</strong> 30 CME credits/year</li>
          <li><strong>Allied health professionals:</strong> 30 CME credits/year</li>
        </ul>
        <p>
          SCFHS also enforces a <strong>50% online cap</strong> — no more than half your annual CME can come from online activities. For a physician (60 credits/year), that means a maximum of 30 online credits.
        </p>
        <p>
          <strong>Why SCFHS is the most demanding:</strong> Physicians need 60 credits per year on an annual cycle. Compared to QCHP (40/year equivalent) or DHA (20/year equivalent), SCFHS places the highest continuing education burden on licensed physicians in the GCC.
        </p>

        <h3>Dubai (DHA) — 40 CME per 2 years</h3>
        <p>
          DHA requires <strong>40 CME credits per 2-year biennial cycle</strong>. There is no strict per-year minimum — you can technically earn all 40 in a single year, though DHA encourages ongoing professional development throughout the cycle.
        </p>
        <p>
          <strong>Effective rate:</strong> 20 CME credits per year, or roughly 1–2 credits per month.
        </p>
        <p>
          DHA is the most accessible CME requirement in the GCC for most professions, making it relatively manageable for even the busiest clinicians.
        </p>

        <h3>Abu Dhabi (DOH) — 30–50 CPD per 2 years</h3>
        <p>
          The Department of Health (DOH) Abu Dhabi requires <strong>30–50 CPD credits per 2-year cycle</strong>, with the exact amount varying by profession. DOH uses "CPD" rather than "CME." Physicians and surgical specialties tend to face the higher end of this range.
        </p>
        <p>
          Note: DHA (Dubai) and DOH (Abu Dhabi) are entirely separate licensing authorities. Holding a DHA license does not satisfy a DOH requirement and vice versa — if you practice in both emirates, you hold and must renew both licenses independently.
        </p>

        <h3>Kuwait (MOH) — 30 CME per year</h3>
        <p>
          Kuwait Ministry of Health requires <strong>30 CME credits per year</strong> on an annual renewal cycle. Like SCFHS, Kuwait requires annual renewal — meaning you cannot carry credits from one year to the next.
        </p>

        <h3>Bahrain (NHRA) — 40 CPD per 2 years</h3>
        <p>
          Bahrain's National Health Regulatory Authority requires <strong>40 CPD credits per 2-year cycle</strong>. NHRA uses "CPD" rather than "CME." The biennial requirement is the same as DHA Dubai — 20 credits/year equivalent.
        </p>

        <h3>Oman (OMSB) — 40 CME per 2 years</h3>
        <p>
          The Oman Medical Specialty Board requires <strong>40 CME credits per 2-year biennial cycle</strong>. OMSB uses "CME" terminology. Like NHRA, the effective rate is 20 credits/year.
        </p>

        <h2>Which country has the strictest CME requirements?</h2>
        <p>
          By raw numbers, <strong>SCFHS Saudi Arabia is the most demanding</strong> for physicians, pharmacists, and dentists at 60 CME credits per year on an annual cycle. A physician licensed with SCFHS must earn 120 CME credits over the same 2-year period that a DHA-licensed physician only needs 40.
        </p>
        <p>
          For nurses and allied health professionals, SCFHS (30/year) is comparable to QCHP Qatar (40 equivalent/year) and more demanding than DHA Dubai (20 equivalent/year).
        </p>

        <h2>Do credits count across GCC countries?</h2>
        <p>
          GCC licensing authorities do not have a unified CME transfer system — there is no automatic cross-recognition of credits. However, because most GCC authorities accept the same major international accreditors (AMA-PRA, EACCME, Royal Colleges), an activity accredited by one of these bodies can count toward <em>multiple</em> GCC licenses simultaneously.
        </p>
        <p>
          For example: a physician with both a QCHP license and an SCFHS license attends an AMA-PRA accredited cardiology conference (15 AMA PRA Category 1 Credits™). They can log that same certificate in both the QCHP portal and the SCFHS portal — crediting 15 CPD points toward their Qatar requirement and 15 CME credits toward their Saudi requirement.
        </p>
        <p>
          The key is tracking each license separately in each authority's system — there is no automatic syncing. A platform like Hayya Med Pro handles this by letting you assign a single logged activity to multiple authority wallets simultaneously.
        </p>

        <h2>What happens if you don't meet the requirements?</h2>
        <table>
          <thead>
            <tr>
              <th>Authority</th>
              <th>Consequence of non-compliance</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>QCHP (Qatar)</td><td>License renewal denied. Cannot practice until CME deficit is addressed and renewal approved.</td></tr>
            <tr><td>SCFHS (Saudi Arabia)</td><td>Annual license not renewed. Practicing without a valid SCFHS license is a regulatory violation.</td></tr>
            <tr><td>DHA (Dubai)</td><td>License expiry — cannot practice in Dubai. Reinstatement requires additional documentation.</td></tr>
            <tr><td>DOH (Abu Dhabi)</td><td>License expiry — license reinstatement process required.</td></tr>
            <tr><td>MOH Kuwait</td><td>Annual license not renewed. Cannot practice in Kuwait.</td></tr>
            <tr><td>NHRA (Bahrain)</td><td>License renewal denied.</td></tr>
            <tr><td>OMSB (Oman)</td><td>License renewal denied.</td></tr>
          </tbody>
        </table>
        <p>
          In all GCC countries, practicing healthcare without a valid current license is a serious legal and regulatory violation that can result in fines, deportation, or permanent bar from practicing in that country.
        </p>

        <h2>How to track your CME across multiple GCC licenses</h2>
        <p>
          If you hold licenses in more than one GCC country, manual tracking becomes error-prone fast. Different cycle lengths, different annual minimums, different accreditor lists, and different portals all create a complex administrative burden.
        </p>
        <p>
          Hayya Med Pro tracks CME/CPD requirements across all 7 GCC authorities simultaneously. Log an activity once — assign it to multiple wallets if it's recognized by more than one authority. Each wallet shows your progress toward its specific target, with renewal alerts timed to each license's expiry date.
        </p>
        <p>
          The platform is free to start. The Pro plan adds the PDF compliance report — a document you can reference during any GCC authority renewal process to demonstrate your completed CME history.
        </p>
      </BlogPostLayout>
    </>
  );
}
