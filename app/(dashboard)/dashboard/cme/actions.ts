"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";
import { sendAdminActivityPendingEmail, sendFirstActivityEmail } from "@/lib/email";

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

  // Verify the wallet belongs to this user before inserting (admin client bypasses RLS)
  const { data: walletCheck } = await admin
    .from("cme_wallets")
    .select("id")
    .eq("id", walletId)
    .eq("professional_id", user.id)
    .single();
  if (!walletCheck) return { error: "Invalid wallet" };

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

  // Fire-and-forget — never block the user's submission on email delivery
  Promise.all([
    admin.from("professional_profiles").select("email, full_name").eq("auth_id", user.id).maybeSingle(),
    admin.from("cme_activities").select("id", { count: "exact", head: true })
      .eq("professional_id", user.id).eq("verification_status", "pending"),
    admin.from("cme_activities").select("id", { count: "exact", head: true })
      .eq("professional_id", user.id),
  ]).then(([profileRes, pendingRes, totalRes]) => {
    const professionalName = (profileRes.data as { email?: string; full_name?: string } | null)?.full_name ?? "Unknown";
    const userEmail = (profileRes.data as { email?: string; full_name?: string } | null)?.email;
    const totalCount = totalRes.count ?? 1;

    sendAdminActivityPendingEmail({
      activityTitle: title,
      professionalName,
      credits,
      activityDate,
      pendingCount: pendingRes.count ?? 1,
    }).catch(() => {});

    // First-activity milestone email — only when total count is exactly 1 (this insert)
    if (userEmail && totalCount === 1) {
      sendFirstActivityEmail({
        to: userEmail,
        name: professionalName,
        activityTitle: title,
        credits,
        isPro: isPro(plan),
      }).catch(() => {});
    }
  }).catch(() => {});

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

export async function deleteCmeActivity(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { data: activity } = await admin
    .from("cme_activities")
    .select("id, verification_status")
    .eq("id", id)
    .eq("professional_id", user.id)
    .single();

  if (!activity) return { error: "Activity not found" };
  if (activity.verification_status === "verified") return { error: "Verified activities cannot be deleted" };

  const { error } = await admin
    .from("cme_activities")
    .delete()
    .eq("id", id)
    .eq("professional_id", user.id);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "cme_activity.deleted",
    targetTable: "cme_activities",
    targetId: id,
    metadata: { previous_status: activity.verification_status },
  });

  revalidatePath("/dashboard/cme");
  return {};
}

export interface ImportRow {
  title: string;
  activityDate: string;
  credits: number;
  provider: string | null;
  category: string | null;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
}

export async function importCmeActivities(
  rows: ImportRow[],
  walletId: string
): Promise<ImportResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { imported: 0, skipped: 0, errors: [{ row: -1, reason: "Not authenticated" }] };

  const admin = createAdminClient();

  // Verify wallet belongs to this user
  const { data: walletCheck } = await admin
    .from("cme_wallets")
    .select("id")
    .eq("id", walletId)
    .eq("professional_id", user.id)
    .single();
  if (!walletCheck) return { imported: 0, skipped: 0, errors: [{ row: -1, reason: "Invalid wallet" }] };

  const plan = await getUserPlan(user.id);
  const proUser = isPro(plan);
  let capacity = Infinity;

  if (!proUser) {
    const { count } = await admin
      .from("cme_activities")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id);
    const used = count ?? 0;
    capacity = Math.max(0, FREE_ACTIVITY_LIMIT - used);
  }

  const VALID_CATEGORIES = new Set([
    "conference", "online", "workshop", "journal",
    "teaching", "simulation", "mandatory", "patient_safety", "other",
  ]);

  const errors: ImportResult["errors"] = [];
  const toInsert: typeof rows = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r.title?.trim()) { errors.push({ row: i + 1, reason: "Title is required" }); continue; }
    if (!r.activityDate) { errors.push({ row: i + 1, reason: "Date is required" }); continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.activityDate)) { errors.push({ row: i + 1, reason: "Date must be YYYY-MM-DD" }); continue; }
    if (!r.credits || r.credits <= 0 || r.credits > 100) { errors.push({ row: i + 1, reason: "Credits must be 0.5–100" }); continue; }
    if (r.category && !VALID_CATEGORIES.has(r.category)) { errors.push({ row: i + 1, reason: `Unknown category: ${r.category}` }); continue; }
    toInsert.push(r);
  }

  const eligible = toInsert.slice(0, capacity);
  const skipped = toInsert.length - eligible.length;

  if (eligible.length === 0) {
    return { imported: 0, skipped, errors };
  }

  const inserts = eligible.map((r) => ({
    wallet_id: walletId,
    professional_id: user.id,
    title: r.title.trim(),
    provider: r.provider?.trim() || null,
    activity_date: r.activityDate,
    credits: r.credits,
    certificate_url: null,
    category: r.category || null,
    verification_status: "pending",
  }));

  const { error } = await admin.from("cme_activities").insert(inserts);
  if (error) return { imported: 0, skipped, errors: [...errors, { row: -1, reason: error.message }] };

  await logAudit({
    actorAuthId: user.id,
    action: "cme_activity.bulk_imported",
    targetTable: "cme_activities",
    metadata: { count: eligible.length, wallet_id: walletId, plan },
  });

  revalidatePath("/dashboard/cme");
  return { imported: eligible.length, skipped, errors };
}

export async function editCmeActivity(
  id: string,
  updates: { title: string; provider: string | null; activity_date: string; credits: number; category: string | null }
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!updates.title.trim()) return { error: "Title is required" };
  if (updates.credits <= 0 || updates.credits > 100) return { error: "Credits must be between 0 and 100" };

  const admin = createAdminClient();
  const { data: activity } = await admin
    .from("cme_activities")
    .select("id, verification_status")
    .eq("id", id)
    .eq("professional_id", user.id)
    .single();

  if (!activity) return { error: "Activity not found" };
  if (activity.verification_status === "verified") return { error: "Verified activities cannot be edited" };

  const { error } = await admin
    .from("cme_activities")
    .update({
      title: updates.title.trim(),
      provider: updates.provider?.trim() || null,
      activity_date: updates.activity_date,
      credits: updates.credits,
      category: updates.category || null,
      verification_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("professional_id", user.id);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "cme_activity.edited",
    targetTable: "cme_activities",
    targetId: id,
    metadata: updates,
  });

  revalidatePath("/dashboard/cme");
  return {};
}
