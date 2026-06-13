import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

const SITE_URL = "https://hayyamed.pro";
const TITLE = "Hayya Med Pro â€” CME Tracking & License Compliance for GCC Healthcare Professionals";
const DESCRIPTION =
  "Track CME credits, manage license renewals, and stay compliant with QCHP, SCFHS, DHA, and all GCC licensing authorities â€” free, on web and mobile. Built for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "CME tracking", "CPD Qatar", "QCHP renewal", "SCFHS CME", "DHA compliance",
    "GCC healthcare professionals", "medical license renewal", "CME credits",
    "healthcare compliance platform", "Hayya Med Pro",
  ],
  authors: [{ name: "Hayya Med", url: SITE_URL }],
  creator: "Hayya Med",
  publisher: "Hayya Med",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Hayya Med Pro",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Hayya Med Pro â€” CME Tracking for GCC Healthcare Professionals",
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
  name: "Hayya Med Pro",
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
      description: "CME tracking, compliance dashboard, analytics â€” free forever.",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "6",
      priceCurrency: "USD",
      billingDuration: "P1M",
      description: "PDF reports, AI compliance chat, license expiry alerts.",
    },
    {
      "@type": "Offer",
      name: "Pro Plan (Annual)",
      price: "61.20",
      priceCurrency: "USD",
      billingDuration: "P1Y",
      description: "Pro plan billed annually â€” 15% off vs monthly.",
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

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hayya Med",
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  description: "Healthcare compliance technology company â€” CME tracking, licensing readiness, and workforce compliance for GCC healthcare professionals.",
  foundingLocation: {
    "@type": "Place",
    addressCountry: "QA",
    addressLocality: "Doha",
  },
  areaServed: [
    { "@type": "Country", name: "Qatar" },
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Kuwait" },
    { "@type": "Country", name: "Bahrain" },
    { "@type": "Country", name: "Oman" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@hayyamed.pro",
  },
  sameAs: [],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Hayya Med Pro free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Free plan is free forever â€” it includes CME activity tracking, a compliance dashboard, and analytics. The Pro plan ($6/month or $61.20/year â€” 15% off) unlocks PDF compliance reports, AI-powered gap analysis, unlimited activity entries, and license expiry alerts.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free trial for the Pro plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes â€” every new account automatically receives a 14-day Pro trial. No credit card required. You can explore every Pro feature before you pay anything.",
      },
    },
    {
      "@type": "Question",
      name: "Is Hayya Med Pro recognised by QCHP, SCFHS, or DHA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro is a compliance tracking tool, not a licensing authority. Your official compliance record remains with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait. Our PDF reports are formatted to match what these authorities require, making submission faster â€” but you must always verify final requirements directly with your authority.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries and licensing authorities are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro supports Qatar (QCHP), Saudi Arabia (SCFHS), UAE Dubai (DHA), UAE Abu Dhabi (DOH), Kuwait (MOH), Bahrain (NHRA), and Oman (OMSB). Additional countries are added regularly.",
      },
    },
    {
      "@type": "Question",
      name: "Can my employer or hospital see my CME records?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only if you explicitly approve the connection. Your profile is private by default. Privacy settings give you full control over what information â€” if any â€” is visible to your employer.",
      },
    },
    {
      "@type": "Question",
      name: "What if I practise in multiple countries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Pro plan supports multiple country wallets. Track your QCHP and SCFHS compliance requirements simultaneously from a single dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "Is my healthcare data stored securely in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All data is hosted on GCP infrastructure in Doha, Qatar, encrypted at rest and in transit, and processed under Qatar's Personal Data Protection Law (PDPL). Your data never leaves the GCC region.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI compliance assistant work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The AI compliance assistant (Pro feature) answers questions about your country's CME requirements, identifies gaps in your compliance profile, and suggests activities to close those gaps. It is powered by Claude AI integrated with Hayya Med Pro's compliance rule database, and always recommends verifying final requirements with your licensing authority.",
      },
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
