import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscription";
import PricingClient from "@/components/pricing/PricingClient";
import type { Plan } from "@/lib/planUtils";
import { isQPayConfigured } from "@/lib/qpay";
import { getPageSeo } from "@/lib/cms";
import type { Metadata } from "next";

const DEFAULT_TITLE = "Pricing — Hayya Med Pro";
const DEFAULT_DESCRIPTION = "Simple pricing for healthcare professionals and employers. Start free. Upgrade when you need PDF exports, AI compliance tools, and team management.";
const DEFAULT_OG_IMAGE = "https://hayyamed.pro/api/og?t=Pricing+%E2%80%94+Hayya+Med+Pro&s=Free+forever+%C2%B7+Pro+from+%246%2Fmo+%C2%B7+Employer+from+%2450%2Fmo&a=%F0%9F%92%B3+Plans&k=Pricing";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("pricing");
  const title = seo?.meta_title || DEFAULT_TITLE;
  const description = seo?.meta_description || DEFAULT_DESCRIPTION;
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;
  const noIndex = seo?.robots_directive?.includes("noindex") ?? false;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: "https://hayyamed.pro/pricing",
      type: "website",
      images: [{ url: seo?.og_image_url || DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
    alternates: { canonical: seo?.canonical_url || "https://hayyamed.pro/pricing" },
    robots: { index: !noIndex, follow: true },
  };
}

const pricingFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does Hayya Med Pro cost?",
      acceptedAnswer: { "@type": "Answer", text: "The Free plan is always free. The Pro plan is $6/month (or $61.20/year — 15% off). Employer plans start at $50/month for up to 10 staff." },
    },
    {
      "@type": "Question",
      name: "Is there a free trial?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. New accounts receive a 14-day Pro trial automatically after completing onboarding — no credit card required." },
    },
    {
      "@type": "Question",
      name: "What is included in the Pro plan?",
      acceptedAnswer: { "@type": "Answer", text: "Pro includes unlimited CME activity tracking, PDF compliance report download, AI-powered gap analysis (Gemini), compliance chatbot, certificate storage, multi-license tracking, and priority support." },
    },
    {
      "@type": "Question",
      name: "Can I cancel my subscription at any time?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You can cancel at any time from Dashboard → Settings → Manage Billing. Your Pro access continues until the end of the current billing period, then your account moves to the free plan. Your CME data is always preserved." },
    },
    {
      "@type": "Question",
      name: "What payment methods are accepted?",
      acceptedAnswer: { "@type": "Answer", text: "We accept all major credit and debit cards through Paddle, our payment processor. Cards issued in Qatar, UAE, Saudi Arabia, and other GCC countries are supported." },
    },
  ],
};

export default async function PricingPage() {
  let userPlan: Plan | null = null;
  let trialDaysLeft: number | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const admin = createAdminClient();
      const [plan, profileRes] = await Promise.all([
        getUserPlan(user.id),
        admin.from("professional_profiles")
          .select("pro_trial_ends_at")
          .eq("auth_id", user.id)
          .maybeSingle(),
      ]);
      userPlan = plan;

      if (plan === "trialing" && profileRes.data?.pro_trial_ends_at) {
        trialDaysLeft = Math.max(0, Math.ceil(
          (new Date(profileRes.data.pro_trial_ends_at).getTime() - Date.now()) / 86400000
        ));
      }
    }
  } catch {
    // Not logged in or error — show public pricing
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqLd) }}
      />
      <PricingClient userPlan={userPlan} trialDaysLeft={trialDaysLeft} qpayEnabled={isQPayConfigured()} />
    </>
  );
}
