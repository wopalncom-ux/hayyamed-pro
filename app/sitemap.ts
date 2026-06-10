import { MetadataRoute } from "next";

const BASE = "https://pro.hayyamed.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                      lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/pricing`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/register`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.8 },
    { url: `${BASE}/login`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/forgot-password`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/privacy`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
