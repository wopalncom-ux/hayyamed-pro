import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/subscription";
import PricingClient from "@/components/pricing/PricingClient";
import type { Plan } from "@/lib/planUtils";

export const metadata = {
  title: "Pricing â€” Hayya Med Pro",
  description: "Simple pricing for healthcare professionals and employers. Start free. Upgrade when you need PDF exports, AI compliance tools, and team management.",
  openGraph: {
    title: "Pricing â€” Hayya Med Pro",
    description: "Free for individual professionals. Pro from $6/month. Employer plans from $50/month. 14-day free trial included.",
    url: "https://hayyamed.pro/pricing",
    type: "website",
    images: [
      {
        url: "https://hayyamed.pro/api/og?t=Pricing+%E2%80%94+Hayya+Med+Pro&s=Free+forever+%C2%B7+Pro+from+%246%2Fmo+%C2%B7+Employer+from+%2450%2Fmo&a=%F0%9F%92%B3+Plans&k=Pricing",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Pricing â€” Hayya Med Pro",
    description: "Free for individual professionals. Pro from $6/month. 14-day trial â€” no credit card required.",
  },
};

const pricingFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does Hayya Med Pro cost?",
      acceptedAnswer: { "@type": "Answer", text: "The Free plan is always free. The Pro plan is $6/month (or $61.20/year â€” 15% off). Employer plans start at $50/month for up to 10 staff." },
    },
    {
      "@type": "Question",
      name: "Is there a free trial?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. New accounts receive a 14-day Pro trial automatically after completing onboarding â€” no credit card required." },
    },
    {
      "@type": "Question",
      name: "What is included in the Pro plan?",
      acceptedAnswer: { "@type": "Answer", text: "Pro includes unlimited CME activity tracking, PDF compliance report download, AI-powered gap analysis (Claude), compliance chatbot, certificate storage, multi-license tracking, and priority support." },
    },
    {
      "@type": "Question",
      name: "Can I cancel my subscription at any time?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You can cancel at any time from Dashboard â†’ Settings â†’ Manage Billing. Your Pro access continues until the end of the current billing period, then your account moves to the free plan. Your CME data is always preserved." },
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
    // Not logged in or error â€” show public pricing
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqLd) }}
      />
      <PricingClient userPlan={userPlan} trialDaysLeft={trialDaysLeft} />
    </>
  );
}
