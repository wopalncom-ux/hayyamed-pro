import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendComplianceReminderEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const ReminderSchema = z.object({
  professional_id: z.string().uuid(),
  message: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = ReminderSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { professional_id, message } = parsed.data;
  const orgId = member.organization_id;
  const orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = Array.isArray(orgs) ? orgs[0]?.name : (orgs as { name: string } | null)?.name ?? "Your Organization";

  const { data: link } = await admin
    .from("employer_link_requests")
    .select("id")
    .eq("organization_id", orgId)
    .eq("professional_id", professional_id)
    .eq("status", "approved")
    .maybeSingle();

  if (!link) return NextResponse.json({ error: "Staff member not linked to your organization" }, { status: 404 });

  const { data: notif } = await admin
    .from("employer_notifications")
    .insert({
      organization_id: orgId,
      recipient_id: professional_id,
      sender_id: user.id,
      type: "compliance_reminder",
      subject: `Compliance reminder from ${orgName}`,
      message,
      sent_via_email: false,
    })
    .select("id")
    .single();

  const [profileRes, walletRes] = await Promise.all([
    admin.from("professional_profiles").select("email, full_name, license_expiry").eq("auth_id", professional_id).maybeSingle(),
    admin.from("cme_wallets").select("completed_credits, required_credits").eq("professional_id", professional_id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
  ]);

  const email = profileRes.data?.email;
  const name = profileRes.data?.full_name;
  const licenseExpiry = profileRes.data?.license_expiry ?? null;
  const daysToExpiry = licenseExpiry
    ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
    : null;

  let emailSent = false;
  if (email && name) {
    await sendComplianceReminderEmail({
      to: email,
      staffName: name,
      senderOrgName: orgName,
      message,
      creditsCompleted: walletRes.data?.completed_credits ?? null,
      creditsRequired: walletRes.data?.required_credits ?? null,
      daysToExpiry,
    });
    emailSent = true;
    if (notif?.id) {
      await admin.from("employer_notifications").update({ sent_via_email: true }).eq("id", notif.id);
    }
  }

  await logAudit({
    actorAuthId: user.id,
    action: "employer_reminder_sent",
    targetTable: "professional_profiles",
    targetId: professional_id,
    metadata: { organization_id: orgId, email_sent: emailSent },
  });

  return NextResponse.json({ success: true, email_sent: emailSent });
}
