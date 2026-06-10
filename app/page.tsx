import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

const SITE_URL = "https://pro.hayyamed.pro";
const TITLE = "Hayya Med PRO — CME Tracking & License Compliance for GCC Healthcare Professionals";
const DESCRIPTION =
  "Track CME credits, manage license renewals, and stay compliant with QCHP, SCFHS, DHA, and all GCC licensing authorities — free, on web and mobile. Built for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "CME tracking", "CPD Qatar", "QCHP renewal", "SCFHS CME", "DHA compliance",
    "GCC healthcare professionals", "medical license renewal", "CME credits",
    "healthcare compliance platform", "Hayya Med PRO",
  ],
  authors: [{ name: "Hayya Med", url: SITE_URL }],
  creator: "Hayya Med",
  publisher: "Hayya Med",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hayya Med PRO",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Hayya Med PRO — CME Tracking for GCC Healthcare Professionals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hayya Med PRO",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web, iOS, Android",
  url: SITE_URL,
  description: DESCRIPTION,
  offers: [
    {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "USD",
      description: "CME tracking, compliance dashboard, analytics — free forever.",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "49",
      priceCurrency: "USD",
      billingDuration: "P1Y",
      description: "PDF reports, AI compliance chat, license expiry alerts.",
    },
  ],
  audience: {
    "@type": "MedicalAudience",
    audienceType: "Healthcare Professional",
    geographicArea: {
      "@type": "AdministrativeArea",
      name: "Gulf Cooperation Council (GCC)",
    },
  },
  featureList: [
    "CME credit tracking",
    "License renewal management",
    "QCHP compliance",
    "SCFHS compliance",
    "DHA compliance",
    "AI compliance assistant",
    "PDF report generation",
    "Employer staff dashboard",
  ],
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
