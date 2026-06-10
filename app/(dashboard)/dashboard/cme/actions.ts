"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";

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
    metadata: { title, credits, provider, category, hasCertificate: !!certificateUrl },
  });

  revalidatePath("/dashboard/cme");
  return { error: null };
}
