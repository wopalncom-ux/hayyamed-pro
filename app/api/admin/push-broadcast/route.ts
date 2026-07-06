import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendPushNotification } from "@/lib/push";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(250),
  url: z.string().default("/dashboard"),
  segment: z.enum(["all", "pro", "at_risk"]).default("all"),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .limit(1)
    .maybeSingle();
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { title, body, url, segment } = parsed.data;

  let subsQuery = admin.from("push_subscriptions").select("professional_id, endpoint, p256dh, auth");

  if (segment === "pro") {
    const { data: proSubs } = await admin
      .from("subscriptions")
      .select("professional_id")
      .in("plan", ["pro", "employer"])
      .in("status", ["active", "trialing"]);
    const proIds = (proSubs ?? []).map((s) => s.professional_id);
    if (!proIds.length) return NextResponse.json({ sent: 0, failed: 0, segment });
    subsQuery = subsQuery.in("professional_id", proIds);
  } else if (segment === "at_risk") {
    const { data: atRiskWallets } = await admin
      .from("cme_wallets")
      .select("professional_id")
      .in("compliance_status", ["at_risk", "non_compliant"]);
    const atRiskIds = (atRiskWallets ?? []).map((w) => w.professional_id);
    if (!atRiskIds.length) return NextResponse.json({ sent: 0, failed: 0, segment });
    subsQuery = subsQuery.in("professional_id", atRiskIds);
  }

  const { data: subs } = await subsQuery;
  if (!subs?.length) return NextResponse.json({ sent: 0, failed: 0, segment });

  let sent = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      const result = await sendPushNotification(sub, { title, body, url });
      if (result.expired) {
        expiredEndpoints.push(sub.endpoint);
        failed++;
      } else if (result.error) {
        failed++;
      } else {
        sent++;
      }
    })
  );

  // Clean up expired subscriptions
  if (expiredEndpoints.length) {
    await admin.from("push_subscriptions").delete().in("endpoint", expiredEndpoints);
  }

  await logAudit({
    actorAuthId: user.id,
    action: "admin.push_broadcast",
    targetTable: "push_subscriptions",
    metadata: { title, segment, sent, failed, total: subs.length },
  });

  return NextResponse.json({ sent, failed, total: subs.length, segment });
}
