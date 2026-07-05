import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members").select("role")
    .eq("auth_id", user.id).in("role", ["founder", "master_admin", "super_admin"]).maybeSingle();
  return member ? user : null;
}

// GET /api/admin/user-actions?search=...   search by name or auth_id
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("search") ?? "";
  if (search.length < 2) return NextResponse.json({ users: [] });

  const admin = createAdminClient();

  // Search by auth_id (UUID) or full_name
  const isUUID = /^[0-9a-f-]{36}$/i.test(search);
  let query = admin
    .from("professional_profiles")
    .select("auth_id, full_name, profession, country_of_residence, onboarding_complete, onboarding_step, profile_completion_pct, created_at")
    .limit(10);

  query = isUUID
    ? query.eq("auth_id", search)
    : query.ilike("full_name", `%${search}%`);

  const { data: profiles } = await query;
  if (!profiles?.length) return NextResponse.json({ users: [] });

  // Enrich with subscription + CME count
  const ids = profiles.map((p) => p.auth_id);
  const [{ data: subs }, { data: cmeRows }, { data: wallets }] = await Promise.all([
    admin.from("subscriptions").select("auth_id, plan, status").in("auth_id", ids),
    admin.from("cme_activities").select("auth_id").in("auth_id", ids),
    admin.from("cme_wallets").select("auth_id, completed_credits, required_credits, compliance_status").in("auth_id", ids),
  ]);

  const subMap  = Object.fromEntries((subs   ?? []).map((s) => [s.auth_id, s]));
  const walletMap = Object.fromEntries((wallets ?? []).map((w) => [w.auth_id, w]));
  const cmeCount: Record<string, number> = {};
  for (const r of (cmeRows ?? [])) cmeCount[r.auth_id] = (cmeCount[r.auth_id] ?? 0) + 1;

  const users = profiles.map((p) => ({
    ...p,
    subscription: subMap[p.auth_id] ?? null,
    wallet: walletMap[p.auth_id] ?? null,
    cme_count: cmeCount[p.auth_id] ?? 0,
  }));

  return NextResponse.json({ users });
}

// POST /api/admin/user-actions  body: { auth_id, action, ...params }
export async function POST(req: NextRequest) {
  const adminUser = await assertAdmin();
  if (!adminUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { auth_id, action, params = {} } = await req.json();
  if (!auth_id || !action) return NextResponse.json({ error: "auth_id and action required" }, { status: 400 });

  const admin = createAdminClient();

  // Verify user exists
  const { data: profile } = await admin.from("professional_profiles").select("auth_id, full_name").eq("auth_id", auth_id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const audit = (metadata: Record<string, unknown>) =>
    admin.from("audit_logs").insert({
      actor_id: adminUser.id, actor_role: "master_admin",
      action: `admin.user.${action}`, target_type: "professional_profile", target_id: auth_id, metadata,
    }).then(() => {});

  if (action === "complete_onboarding") {
    const { error } = await admin.from("professional_profiles")
      .update({ onboarding_complete: true, onboarding_step: 7 }).eq("auth_id", auth_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await audit({ full_name: profile.full_name });
    return NextResponse.json({ success: true, message: `Onboarding marked complete for ${profile.full_name}` });
  }

  if (action === "send_email") {
    const { subject, html_body, text_body } = params as { subject: string; html_body: string; text_body?: string };
    if (!subject || !html_body) return NextResponse.json({ error: "subject and html_body required" }, { status: 400 });
    if (!process.env.POSTMARK_SERVER_TOKEN) return NextResponse.json({ error: "Postmark not configured" }, { status: 503 });

    // Get email from Supabase Auth
    const { data: authData } = await admin.auth.admin.getUserById(auth_id);
    const email = authData?.user?.email;
    if (!email) return NextResponse.json({ error: "User has no email address" }, { status: 400 });

    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN },
      body: JSON.stringify({
        From: process.env.POSTMARK_FROM_EMAIL ?? "noreply@hayyamed.pro",
        To: email, Subject: subject, HtmlBody: html_body,
        TextBody: text_body ?? subject, MessageStream: "outbound",
      }),
    });
    if (!res.ok) { const j = await res.json() as { Message?: string }; return NextResponse.json({ error: j.Message }, { status: 502 }); }
    await audit({ email, subject });
    return NextResponse.json({ success: true, message: `Email sent to ${email}` });
  }

  if (action === "export_data") {
    const [profRes, cmeRes, subRes, walletRes, auditRes] = await Promise.all([
      admin.from("professional_profiles").select("*").eq("auth_id", auth_id).maybeSingle(),
      admin.from("cme_activities").select("*").eq("auth_id", auth_id).order("created_at", { ascending: false }),
      admin.from("subscriptions").select("*").eq("auth_id", auth_id),
      admin.from("cme_wallets").select("*").eq("auth_id", auth_id).maybeSingle(),
      admin.from("audit_logs").select("*").eq("actor_id", auth_id).order("created_at", { ascending: false }).limit(100),
    ]);
    const exportData = {
      exported_at: new Date().toISOString(),
      exported_by: adminUser.id,
      profile: profRes.data,
      cme_wallet: walletRes.data,
      cme_activities: cmeRes.data ?? [],
      subscriptions: subRes.data ?? [],
      recent_audit_logs: auditRes.data ?? [],
    };
    await audit({ full_name: profile.full_name, record_count: (cmeRes.data?.length ?? 0) + (subRes.data?.length ?? 0) });
    return NextResponse.json({ data: exportData });
  }

  if (action === "reset_onboarding") {
    const { error } = await admin.from("professional_profiles")
      .update({ onboarding_complete: false, onboarding_step: 1 }).eq("auth_id", auth_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await audit({ full_name: profile.full_name });
    return NextResponse.json({ success: true, message: `Onboarding reset to step 1 for ${profile.full_name}` });
  }

  if (action === "grant_trial") {
    const { days = 7 } = params as { days?: number };
    const ends = new Date(Date.now() + days * 86400000).toISOString();
    const { error } = await admin.from("subscriptions").upsert({
      auth_id, plan: "pro", status: "trialing", trial_ends_at: ends,
    }, { onConflict: "auth_id" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await audit({ full_name: profile.full_name, days, trial_ends_at: ends });
    return NextResponse.json({ success: true, message: `${days}-day Pro trial granted to ${profile.full_name}` });
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
}
