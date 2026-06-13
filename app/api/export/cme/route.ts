import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";
import { checkAndLogRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

function escapeCsv(val: unknown): string {
  const s = val == null ? "" : String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvRow(values: unknown[]): string {
  return values.map(escapeCsv).join(",");
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const rl = await checkAndLogRateLimit({ action: "cme_export", userId: user.id, maxPerHour: 20 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });
  }

  const { searchParams } = new URL(request.url);
  const walletId = searchParams.get("wallet_id");

  const admin = createAdminClient();

  // If wallet_id provided, validate it belongs to this user
  if (walletId) {
    const { data: wallet } = await admin
      .from("cme_wallets")
      .select("id, country")
      .eq("id", walletId)
      .eq("professional_id", user.id)
      .maybeSingle();
    if (!wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  }

  let query = admin
    .from("cme_activities")
    .select("title, activity_date, credits, provider, category, verification_status")
    .eq("professional_id", user.id)
    .order("activity_date", { ascending: false });

  if (walletId) query = query.eq("wallet_id", walletId);

  const { data: activities, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = activities ?? [];

  const headers = ["title", "date", "credits", "provider", "category", "status"];
  const lines: string[] = [headers.join(",")];

  for (const a of rows) {
    lines.push(
      toCsvRow([
        a.title,
        a.activity_date,
        a.credits,
        a.provider ?? "",
        a.category ?? "",
        a.verification_status,
      ])
    );
  }

  const csv = lines.join("\r\n");
  const filename = `CME-Export-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
