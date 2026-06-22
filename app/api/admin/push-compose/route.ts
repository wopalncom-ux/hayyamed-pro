import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

type Segment = "all" | "free" | "pro" | "country" | "profession" | "churn_risk" | "incomplete_onboarding";

async function resolveSegment(
  admin: ReturnType<typeof createAdminClient>,
  segment: Segment,
  filter: string
): Promise<string[]> {
  const now = new Date();
  const day30 = new Date(now.getTime() - 30 * 86400000).toISOString();

  if (segment === "all") {
    const { data } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true);
    return (data ?? []).map((r) => r.auth_id);
  }

  if (segment === "country") {
    const { data } = await admin.from("professional_profiles").select("auth_id")
      .eq("onboarding_complete", true).ilike("country_of_residence", filter);
    return (data ?? []).map((r) => r.auth_id);
  }

  if (segment === "profession") {
    const { data } = await admin.from("professional_profiles").select("auth_id")
      .eq("onboarding_complete", true).ilike("profession", filter);
    return (data ?? []).map((r) => r.auth_id);
  }

  if (segment === "incomplete_onboarding") {
    const { data } = await admin.from("professional_profiles").select("auth_id")
      .eq("onboarding_complete", false);
    return (data ?? []).map((r) => r.auth_id);
  }

  if (segment === "pro") {
    const { data } = await admin.from("subscriptions").select("auth_id")
      .in("status", ["active", "trialing"]).in("plan", ["pro", "employer", "university", "government"]);
    return (data ?? []).map((r) => r.auth_id);
  }

  if (segment === "free") {
    const { data: all } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true);
    const { data: subs } = await admin.from("subscriptions").select("auth_id").in("status", ["active", "trialing"]);
    const subIds = new Set((subs ?? []).map((s) => s.auth_id));
    return (all ?? []).filter((r) => !subIds.has(r.auth_id)).map((r) => r.auth_id);
  }

  if (segment === "churn_risk") {
    const { data: onboarded } = await admin.from("professional_profiles").select("auth_id").eq("onboarding_complete", true);
    const { data: active } = await admin.from("cme_activities").select("auth_id").gte("created_at", day30);
    const activeIds = new Set((active ?? []).map((a) => a.auth_id));
    return (onboarded ?? []).filter((r) => !activeIds.has(r.auth_id)).map((r) => r.auth_id);
  }

  return [];
}

// POST /api/admin/push-compose
// Body: { title, body, url, icon?, segment, filter? }
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, body, url, icon, segment, filter = "" } = await req.json();
  if (!title || !body) return NextResponse.json({ error: "title and body required" }, { status: 400 });
  if (!segment)        return NextResponse.json({ error: "segment required" }, { status: 400 });

  const admin = createAdminClient();
  const targetIds = await resolveSegment(admin, segment as Segment, filter);

  if (!targetIds.length) {
    return NextResponse.json({ queued: 0, message: "No users match this segment." });
  }

  // Check which target users have active push subscriptions
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("auth_id")
    .in("auth_id", targetIds);

  const subscribedIds = (subs ?? []).map((s: { auth_id: string }) => s.auth_id);

  if (!subscribedIds.length) {
    return NextResponse.json({
      queued: 0,
      target_count: targetIds.length,
      message: `${targetIds.length} users match but none have push enabled.`,
    });
  }

  // Insert into notification_queue for each subscribed user
  const payload = subscribedIds.map((auth_id: string) => ({
    auth_id,
    title,
    body,
    data: {
      url: url || "/dashboard",
      icon: icon || "/icons/icon-192x192.png",
      source: "admin_broadcast",
      sent_by: user.id,
    },
  }));

  const { error } = await admin.from("notification_queue").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Audit log
  await admin.from("audit_logs").insert({
    actor_id: user.id,
    actor_role: "master_admin",
    action: "admin.push.broadcast",
    target_type: "segment",
    target_id: segment,
    metadata: { title, body, segment, filter, target_count: targetIds.length, queued: subscribedIds.length },
  }).then(() => {});

  return NextResponse.json({
    queued: subscribedIds.length,
    target_count: targetIds.length,
    message: `${subscribedIds.length} notifications queued (${targetIds.length} matched, ${subscribedIds.length} have push enabled).`,
  });
}

// GET /api/admin/push-compose?segment=all&filter=Qatar — preview count without sending
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const segment = (req.nextUrl.searchParams.get("segment") ?? "all") as Segment;
  const filter  = req.nextUrl.searchParams.get("filter") ?? "";

  const admin = createAdminClient();
  const targetIds = await resolveSegment(admin, segment, filter);

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("auth_id")
    .in("auth_id", targetIds.length ? targetIds : ["__none__"]);

  return NextResponse.json({
    target_count: targetIds.length,
    push_enabled: (subs ?? []).length,
  });
}
