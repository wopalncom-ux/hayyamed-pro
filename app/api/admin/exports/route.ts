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
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

const DATASETS: Record<string, string> = {
  users:          "professional_profiles",
  subscriptions:  "subscriptions",
  cme_activities: "cme_activities",
  organizations:  "organizations",
  audit_logs:     "audit_logs",
  ai_call_logs:   "ai_call_logs",
};

// GET /api/admin/exports?dataset=users&from=2026-01-01&to=2026-12-31
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dataset = req.nextUrl.searchParams.get("dataset") ?? "";
  const from    = req.nextUrl.searchParams.get("from") ?? null;
  const to      = req.nextUrl.searchParams.get("to") ?? null;

  if (!DATASETS[dataset]) {
    return NextResponse.json({ error: "Invalid dataset" }, { status: 400 });
  }

  const admin = createAdminClient();
  let query = admin.from(DATASETS[dataset]).select("*").order("created_at", { ascending: false }).limit(10000);
  if (from) query = query.gte("created_at", from);
  if (to)   query = query.lte("created_at", to + "T23:59:59Z");

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const csv = toCSV((data ?? []) as Record<string, unknown>[]);
  const filename = `hayyamed_${dataset}_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
