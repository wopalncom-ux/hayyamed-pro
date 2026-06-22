import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members").select("role")
    .eq("auth_id", user.id).in("role", ["master_admin", "super_admin"]).maybeSingle();
  return member ? user : null;
}

type Segment = "all" | "free" | "pro" | "country" | "profession" | "churn_risk" | "incomplete_onboarding";

async function resolveSegment(admin: ReturnType<typeof createAdminClient>, segment: Segment, filter: string): Promise<string[]> {
  const day30 = new Date(Date.now() - 30 * 86400000).toISOString();
  if (segment === "all") {
    const { data } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true);
    return (data ?? []).map((r) => r.auth_id);
  }
  if (segment === "country") {
    const { data } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true).ilike("country_of_residence", filter);
    return (data ?? []).map((r) => r.auth_id);
  }
  if (segment === "profession") {
    const { data } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true).ilike("profession", filter);
    return (data ?? []).map((r) => r.auth_id);
  }
  if (segment === "incomplete_onboarding") {
    const { data } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", false);
    return (data ?? []).map((r) => r.auth_id);
  }
  if (segment === "pro") {
    const { data } = await admin.from("subscriptions").select("auth_id").in("status", ["active", "trialing"]).in("plan", ["pro", "employer", "university", "government"]);
    return (data ?? []).map((r) => r.auth_id);
  }
  if (segment === "free") {
    const { data: all } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true);
    const { data: subs } = await admin.from("subscriptions").select("auth_id").in("status", ["active", "trialing"]);
    const paid = new Set((subs ?? []).map((s) => s.auth_id));
    return (all ?? []).filter((r) => !paid.has(r.auth_id)).map((r) => r.auth_id);
  }
  if (segment === "churn_risk") {
    const { data: onboarded } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true);
    const { data: active } = await admin.from("cme_activities").select("auth_id").gte("created_at", day30);
    const activeIds = new Set((active ?? []).map((a) => a.auth_id));
    return (onboarded ?? []).filter((r) => !activeIds.has(r.auth_id)).map((r) => r.auth_id);
  }
  return [];
}

// GET /api/admin/email-campaigns?segment=all&filter=
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const segment = (req.nextUrl.searchParams.get("segment") ?? "all") as Segment;
  const filter  = req.nextUrl.searchParams.get("filter") ?? "";
  const admin = createAdminClient();
  const ids = await resolveSegment(admin, segment, filter);
  return NextResponse.json({ target_count: ids.length });
}

// POST /api/admin/email-campaigns
export async function POST(req: NextRequest) {
  const adminUser = await assertAdmin();
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.POSTMARK_SERVER_TOKEN) return NextResponse.json({ error: "POSTMARK_SERVER_TOKEN not configured" }, { status: 503 });

  const { subject, from_name, html_body, text_body, segment, filter = "" } = await req.json();
  if (!subject || !html_body || !segment) return NextResponse.json({ error: "subject, html_body, segment required" }, { status: 400 });

  const admin = createAdminClient();
  const targetIds = await resolveSegment(admin, segment as Segment, filter);
  if (!targetIds.length) return NextResponse.json({ sent: 0, failed: 0, target_count: 0, message: "No users match this segment." });

  // Collect emails from Supabase Auth (paginated)
  const emailMap: Record<string, string> = {};
  let page = 1;
  while (true) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (!data?.users?.length) break;
    for (const u of data.users) {
      if (u.email && targetIds.includes(u.id)) emailMap[u.id] = u.email;
    }
    if (data.users.length < 1000) break;
    page++;
  }

  const recipients = Object.entries(emailMap);
  if (!recipients.length) return NextResponse.json({ sent: 0, failed: 0, target_count: targetIds.length, message: "No email addresses found for this segment." });

  const fromEmail = process.env.POSTMARK_FROM_EMAIL ?? "noreply@hayyamed.pro";
  const fromFull  = from_name ? `${from_name} <${fromEmail}>` : fromEmail;

  let sent = 0; let failed = 0;
  // Postmark batch: max 500 per call
  const BATCH = 500;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH).map(([, email]) => ({
      From: fromFull, To: email, Subject: subject,
      HtmlBody: html_body, TextBody: text_body || subject,
      MessageStream: "outbound",
    }));
    const res = await fetch("https://api.postmarkapp.com/email/batch", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN! },
      body: JSON.stringify(batch),
    });
    if (res.ok) {
      const results = await res.json() as Array<{ ErrorCode: number }>;
      sent   += results.filter((r) => r.ErrorCode === 0).length;
      failed += results.filter((r) => r.ErrorCode !== 0).length;
    } else {
      failed += batch.length;
    }
  }

  // Audit log
  await admin.from("audit_logs").insert({
    actor_id: adminUser.id, actor_role: "master_admin",
    action: "admin.email.campaign", target_type: "segment", target_id: segment,
    metadata: { subject, segment, filter, target_count: targetIds.length, sent, failed },
  }).then(() => {});

  return NextResponse.json({ sent, failed, target_count: targetIds.length, message: `${sent} emails sent, ${failed} failed.` });
}
