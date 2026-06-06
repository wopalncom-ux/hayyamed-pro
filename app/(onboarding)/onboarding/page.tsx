import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("onboarding_step, onboarding_complete")
    .eq("auth_id", user.id)
    .single();

  if (profile?.onboarding_complete) redirect("/dashboard");

  const step = profile?.onboarding_step ?? 1;
  redirect(`/onboarding/${step}`);
}
