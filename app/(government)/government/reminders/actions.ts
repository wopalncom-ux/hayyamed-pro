"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAuthorityForUser, getJurisdictionProfessionals, type JurisdictionProfessional } from "@/lib/government/jurisdiction";
import { logAudit } from "@/lib/audit";

const MAX_RECIPIENTS = 5000;

export type ReminderResult = { ok: boolean; error?: string; queued?: number; audience?: number };

type Audience = "all" | "license_expired" | "license_critical" | "license_warning" | "compliant";

function selectAudience(pros: JurisdictionProfessional[], audience: Audience, employer: string | null): JurisdictionProfessional[] {
  let list = pros;
  if (employer) {
    list = employer === "__none__" ? list.filter((p) => !p.employer) : list.filter((p) => p.employer === employer);
  }
  switch (audience) {
    case "license_expired":
      return list.filter((p) => p.daysToExpiry !== null && p.daysToExpiry < 0);
    case "license_critical":
      return list.filter((p) => p.daysToExpiry !== null && p.daysToExpiry >= 0 && p.daysToExpiry < 30 && p.complianceStatus !== "compliant");
    case "license_warning":
      return list.filter((p) => p.daysToExpiry !== null && p.daysToExpiry >= 30 && p.daysToExpiry < 60 && p.complianceStatus !== "compliant");
    case "compliant":
      return list.filter((p) => p.complianceStatus === "compliant");
    case "all":
    default:
      return list;
  }
}

function emailHtml(message: string, authorityName: string): string {
  const safe = message
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  return `<!DOCTYPE html><html><body style="margin:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">
      <p style="font-size:12px;font-weight:600;color:#1a56a0;text-transform:uppercase;letter-spacing:.05em;margin:0 0 12px;">Regulatory Notice — ${authorityName}</p>
      <div style="font-size:15px;color:#111;line-height:1.6;">${safe}</div>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
      <p style="font-size:12px;color:#64748b;margin:0;">Sent via Hayya Med Pro on behalf of ${authorityName}. This is an official communication regarding your CME/licensing compliance.</p>
    </div>
  </div></body></html>`;
}

export async function sendReminder(formData: FormData): Promise<ReminderResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  // government_admin only
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();
  if (!member) return { ok: false, error: "Only authority admins can send reminders" };

  const authority = await getAuthorityForUser(user.id);
  if (!authority) return { ok: false, error: "Authority not found" };

  const audience = (formData.get("audience") as Audience) ?? "red_zone";
  const employer = (formData.get("employer") as string) || null;
  const subject = ((formData.get("subject") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();
  const sendEmail = formData.get("channel_email") === "on";
  const sendPush = formData.get("channel_push") === "on";

  if (!subject || subject.length < 3) return { ok: false, error: "Subject is required" };
  if (!message || message.length < 10) return { ok: false, error: "Message must be at least 10 characters" };
  if (!sendEmail && !sendPush) return { ok: false, error: "Select at least one channel" };

  const pros = await getJurisdictionProfessionals(authority, user.id);
  const recipients = selectAudience(pros, audience, employer);
  if (recipients.length === 0) return { ok: false, error: "No professionals match this audience" };

  const capped = recipients.slice(0, MAX_RECIPIENTS);
  const html = emailHtml(message, authority.orgName);
  const pushBody = message.length > 160 ? message.slice(0, 157) + "…" : message;

  const queueRows: Record<string, unknown>[] = [];
  for (const p of capped) {
    if (sendEmail && p.email) {
      queueRows.push({
        professional_id: p.professionalId,
        channel: "email",
        template_id: "authority_reminder",
        payload: { to: p.email, subject, html },
        status: "pending",
      });
    }
    if (sendPush) {
      queueRows.push({
        professional_id: p.professionalId,
        channel: "push",
        template_id: "authority_reminder",
        payload: { title: subject, body: pushBody, url: "/dashboard" },
        status: "pending",
      });
    }
  }

  // Insert in chunks to avoid oversized requests
  let queued = 0;
  for (let i = 0; i < queueRows.length; i += 500) {
    const chunk = queueRows.slice(i, i + 500);
    const { error } = await admin.from("notification_queue").insert(chunk);
    if (error) return { ok: false, error: `Failed to queue: ${error.message}`, queued };
    queued += chunk.length;
  }

  logAudit({
    actorAuthId: user.id,
    action: "government.reminder_sent",
    targetTable: "notification_queue",
    targetId: authority.organizationId,
    metadata: {
      jurisdiction: authority.jurisdictionCountry,
      authority: authority.authorityCode,
      audience, employer, subject,
      recipients: capped.length, queued,
      channels: [sendEmail && "email", sendPush && "push"].filter(Boolean),
      capped: recipients.length > MAX_RECIPIENTS,
    },
  });

  return { ok: true, queued, audience: capped.length };
}
