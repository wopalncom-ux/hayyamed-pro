"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAuthorityForUser } from "@/lib/government/jurisdiction";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export type AnnouncementResult = { ok: boolean; error?: string };

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();
  if (!member) return null;
  return user.id;
}

export async function createAuthorityAnnouncement(formData: FormData): Promise<AnnouncementResult> {
  const userId = await requireAdmin();
  if (!userId) return { ok: false, error: "Only authority admins can post announcements" };

  const authority = await getAuthorityForUser(userId);
  if (!authority) return { ok: false, error: "Authority not found" };

  const title = ((formData.get("title") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();
  const type = ((formData.get("type") as string) ?? "info");
  const ctaLabel = ((formData.get("cta_label") as string) ?? "").trim() || null;
  const ctaUrl = ((formData.get("cta_url") as string) ?? "").trim() || null;
  const endsAt = ((formData.get("ends_at") as string) ?? "").trim() || null;
  const attachmentUrl = ((formData.get("attachment_url") as string) ?? "").trim() || null;
  const attachmentName = ((formData.get("attachment_name") as string) ?? "").trim() || null;

  if (title.length < 3) return { ok: false, error: "Title is required" };
  if (message.length < 5) return { ok: false, error: "Message is required" };
  if (!["info", "warning", "success", "error"].includes(type)) return { ok: false, error: "Invalid type" };
  // Only accept attachment URLs from our own public bucket
  if (attachmentUrl && !attachmentUrl.includes("/storage/v1/object/public/announcement-files/")) {
    return { ok: false, error: "Invalid attachment" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("authority_announcements").insert({
    organization_id: authority.organizationId,
    jurisdiction_country: authority.jurisdictionCountry,
    title, message, type,
    cta_label: ctaLabel, cta_url: ctaUrl,
    attachment_url: attachmentUrl, attachment_name: attachmentName,
    ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    created_by: userId,
  });
  if (error) return { ok: false, error: error.message };

  logAudit({
    actorAuthId: userId,
    action: "government.announcement_created",
    targetTable: "authority_announcements",
    targetId: authority.organizationId,
    metadata: { jurisdiction: authority.jurisdictionCountry, title, type },
  });

  revalidatePath("/government/announcements");
  return { ok: true };
}

export async function toggleAuthorityAnnouncement(id: string, isActive: boolean): Promise<AnnouncementResult> {
  const userId = await requireAdmin();
  if (!userId) return { ok: false, error: "Forbidden" };
  const authority = await getAuthorityForUser(userId);
  if (!authority) return { ok: false, error: "Authority not found" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("authority_announcements")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("organization_id", authority.organizationId);
  if (error) return { ok: false, error: error.message };

  logAudit({
    actorAuthId: userId,
    action: isActive ? "government.announcement_activated" : "government.announcement_deactivated",
    targetTable: "authority_announcements",
    targetId: id,
  });
  revalidatePath("/government/announcements");
  return { ok: true };
}

export async function deleteAuthorityAnnouncement(id: string): Promise<AnnouncementResult> {
  const userId = await requireAdmin();
  if (!userId) return { ok: false, error: "Forbidden" };
  const authority = await getAuthorityForUser(userId);
  if (!authority) return { ok: false, error: "Authority not found" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("authority_announcements")
    .delete()
    .eq("id", id)
    .eq("organization_id", authority.organizationId);
  if (error) return { ok: false, error: error.message };

  logAudit({
    actorAuthId: userId,
    action: "government.announcement_deleted",
    targetTable: "authority_announcements",
    targetId: id,
  });
  revalidatePath("/government/announcements");
  return { ok: true };
}
