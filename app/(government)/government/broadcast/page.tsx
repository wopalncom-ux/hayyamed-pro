import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BroadcastClient from "@/components/government/BroadcastClient";

export const metadata = { title: "Broadcast Message — Hayya Med Pro" };

export default async function BroadcastPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) redirect("/government");

  const { data: govSettings } = await admin
    .from("government_settings")
    .select("authority_code, jurisdiction_country")
    .eq("organization_id", member.organization_id)
    .maybeSingle();

  const { data: countryRule } = await admin
    .from("country_compliance_rules")
    .select("cycle_months, credits_required")
    .eq("country_code", govSettings?.jurisdiction_country ?? "QA")
    .limit(1)
    .maybeSingle();

  const cycleMonths = (countryRule as { cycle_months: number; credits_required: number } | null)?.cycle_months ?? 24;
  const creditsRequired = (countryRule as { cycle_months: number; credits_required: number } | null)?.credits_required ?? 50;
  const daysUntilCycleEnd = Math.max(1, Math.round(cycleMonths * 30.44));

  return (
    <BroadcastClient
      organizationId={member.organization_id}
      authorityCode={govSettings?.authority_code ?? "AUTHORITY"}
      cycleMonths={cycleMonths}
      creditsRequired={creditsRequired}
      daysUntilCycleEnd={daysUntilCycleEnd}
    />
  );
}
