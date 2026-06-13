import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/employer/", "/provider/", "/onboarding/", "/api/"],
    },
    sitemap: "https://hayyamed.pro/sitemap.xml",
  };
}
