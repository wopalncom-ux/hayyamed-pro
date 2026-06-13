import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const admin = createAdminClient();

  const [subsRes, countsRes] = await Promise.all([
    admin
      .from("subscriptions")
      .select(`
        id, plan, status, billing_interval, employer_tier,
        current_period_end, cancel_at_period_end, created_at,
        professional_profiles!professional_id ( full_name, email, profession )
      `)
      .neq("plan", "free")
      .order("created_at", { ascending: false })
      .limit(200),

    Promise.all([
      admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("plan", "pro").eq("status", "active"),
      admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("plan", "employer").eq("status", "active"),
      admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
      admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "canceled"),
    ]),
  ]);

  const [proActive, empActive, pastDue, canceled] = countsRes;

  return NextResponse.json({
    subscriptions: subsRes.data ?? [],
    stats: {
      pro_active:       proActive.count  ?? 0,
      employer_active:  empActive.count  ?? 0,
      past_due:         pastDue.count    ?? 0,
      canceled:         canceled.count   ?? 0,
    },
  });
}
