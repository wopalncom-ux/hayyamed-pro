import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { COUNTRY_SLUGS } from "@/lib/data/countries";

const BASE = "https://hayyamed.pro";

// Stable dates prevent Googlebot from seeing every page as "updated"
// on every deploy, which wastes crawl budget.
const D_CONTENT = new Date("2026-06-19"); // most content pages
const D_LEGAL   = new Date("2026-06-01"); // legal / auth — rarely change
const D_TODAY   = new Date();             // genuinely dynamic pages

function getBlogSlugs(): string[] {
  try {
    const blogDir = path.join(process.cwd(), "app", "blog");
    return fs
      .readdirSync(blogDir)
      .filter((name) => {
        if (name.endsWith(".tsx") || name.endsWith(".ts")) return false;
        const pagePath = path.join(blogDir, name, "page.tsx");
        return fs.existsSync(pagePath);
      });
  } catch {
    return [];
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = getBlogSlugs().map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: D_CONTENT,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [
    // ── Core product ────────────────────────────────────────────────────────
    { url: BASE,                      lastModified: D_TODAY,   changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/demo`,            lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/pricing`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/register`,        lastModified: D_CONTENT, changeFrequency: "yearly",  priority: 0.8 },
    { url: `${BASE}/how-it-works`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/features`,        lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/security`,        lastModified: D_CONTENT, changeFrequency: "yearly",  priority: 0.85 },
    { url: `${BASE}/changelog`,       lastModified: D_TODAY,   changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/request-demo`,    lastModified: D_CONTENT, changeFrequency: "yearly",  priority: 0.7 },

    // ── Legal / auth ────────────────────────────────────────────────────────
    { url: `${BASE}/login`,           lastModified: D_LEGAL, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/forgot-password`, lastModified: D_LEGAL, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/about`,           lastModified: D_LEGAL, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/contact`,         lastModified: D_LEGAL, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/help`,            lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`,           lastModified: D_LEGAL, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/privacy`,         lastModified: D_LEGAL, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/legal/dpa`,       lastModified: D_LEGAL, changeFrequency: "yearly",  priority: 0.2 },

    // ── B2B / audience pages ────────────────────────────────────────────────
    { url: `${BASE}/employers`,        lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/for-hospitals`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/for-providers`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/for-universities`, lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/for-government`,   lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/professionals`,    lastModified: D_TODAY,   changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/courses`,          lastModified: D_TODAY,   changeFrequency: "weekly",  priority: 0.95 },

    // ── GCC licensing authorities ───────────────────────────────────────────
    { url: `${BASE}/qchp`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/scfhs`,        lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dha`,          lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/doh`,          lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/moh-kuwait`,   lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/nhra`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/omsb`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },

    // ── Renewal guides ──────────────────────────────────────────────────────
    { url: `${BASE}/qchp-renewal`,             lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/scfhs-renewal`,            lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dha-renewal`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/doh-renewal`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/nhra-renewal`,             lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/omsb-renewal`,             lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/moh-kuwait-renewal`,       lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/gcc-medical-license-renewal`, lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },

    // ── Profession pages ────────────────────────────────────────────────────
    { url: `${BASE}/physician-cme`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/nurse-cpd`,        lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pharmacist-cme`,   lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dentist-cme`,      lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/allied-health-cpd`, lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },

    // ── GCC / regional requirements ─────────────────────────────────────────
    { url: `${BASE}/gcc-cme-requirements`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/global-cme-requirements`, lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/countries`,               lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/egypt-cme`,               lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/jordan-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/gmc-cpd`,                 lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ahpra-cpd`,               lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/nmc-india-cme`,           lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/cme-vs-cpd`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },

    // ── Specialty CME pages ─────────────────────────────────────────────────
    { url: `${BASE}/cardiology-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/internal-medicine-cme`,       lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/emergency-medicine-cme`,      lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/surgery-cme`,                 lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pediatrics-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/radiology-cme`,               lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/psychiatry-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/obstetrics-gynecology-cme`,   lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/anesthesia-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/orthopedics-cme`,             lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/family-medicine-cme`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/dermatology-cme`,             lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/neurology-cme`,               lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/nephrology-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ophthalmology-cme`,           lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/oncology-cme`,                lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/gastroenterology-cme`,        lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/endocrinology-cme`,           lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/urology-cme`,                 lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/infectious-disease-cme`,      lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pulmonology-cme`,             lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/rheumatology-cme`,            lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/ent-cme`,                     lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/hematology-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/geriatrics-cme`,              lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pathology-cme`,               lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/neurosurgery-cme`,            lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/plastic-surgery-cme`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/physical-medicine-cme`,       lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/vascular-surgery-cme`,        lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/critical-care-cme`,           lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/occupational-medicine-cme`,   lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/neonatology-cme`,             lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/allergy-immunology-cme`,      lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/nuclear-medicine-cme`,        lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/sports-medicine-cme`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/interventional-radiology-cme`, lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/aesthetic-medicine-cme`,      lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/palliative-care-cme`,         lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/cardiothoracic-surgery-cme`,  lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },

    // ── Tools & calculators ─────────────────────────────────────────────────
    { url: `${BASE}/cme-tracker`,       lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/cpd-tracker`,       lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/cme-calculator`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/tools/compare-cme`, lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/tools/cme-events`,  lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },

    // ── Other content pages ─────────────────────────────────────────────────
    { url: `${BASE}/healthcare-compliance-software`, lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/cme-compliance-report`,          lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },

    // ── Guides ─────────────────────────────────────────────────────────────
    { url: `${BASE}/guides/qatar-cme-guide`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/guides/gcc-compliance`,     lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/guides/license-renewal`,    lastModified: D_CONTENT, changeFrequency: "monthly", priority: 0.9 },

    // ── Global country pages (26 countries × 3 sub-pages) ──────────────────
    ...COUNTRY_SLUGS.flatMap((slug) => [
      { url: `${BASE}/${slug}`,                  lastModified: D_CONTENT, changeFrequency: "monthly" as const, priority: 0.9 },
      { url: `${BASE}/${slug}/cme`,              lastModified: D_CONTENT, changeFrequency: "monthly" as const, priority: 0.9 },
      { url: `${BASE}/${slug}/license-renewal`,  lastModified: D_CONTENT, changeFrequency: "monthly" as const, priority: 0.9 },
    ]),

    // ── Blog ────────────────────────────────────────────────────────────────
    { url: `${BASE}/blog`, lastModified: D_TODAY, changeFrequency: "weekly", priority: 0.85 },
    ...blogEntries,
  ];
}
