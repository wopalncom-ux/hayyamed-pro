"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";

export async function addCmeActivity({
  walletId,
  title,
  provider,
  activityDate,
  credits,
  certificateUrl,
  category,
}: {
  walletId: string;
  title: string;
  provider: string | null;
  activityDate: string;
  credits: number;
  certificateUrl: string | null;
  category?: string | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  // Enforce Free tier activity cap server-side — never rely on client-side only
  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    const { count } = await admin
      .from("cme_activities")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id);

    if ((count ?? 0) >= FREE_ACTIVITY_LIMIT) {
      return { error: "FREE_LIMIT_REACHED" };
    }

    // Free users cannot store certificates — strip it
    certificateUrl = null;
  }

  const { data, error } = await admin.from("cme_activities").insert({
    wallet_id: walletId,
    professional_id: user.id,
    title,
    provider: provider || null,
    activity_date: activityDate,
    credits,
    certificate_url: certificateUrl,
    category: category || null,
  }).select("id").single();

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "cme_activity.created",
    targetTable: "cme_activities",
    targetId: data?.id,
    metadata: { title, credits, provider, category, hasCertificate: !!certificateUrl, plan },
  });

  revalidatePath("/dashboard/cme");
  return { error: null };
}
