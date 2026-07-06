import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

// Columns emitted in every CSV row
const CSV_HEADERS = [
  "timestamp",
  "staff_name",
  "profession",
  "event",
  "credits_change",
  "compliance_status",
  "details",
];

function escapeCsv(v: string | number | null | undefined): string {
  const s = v === null || v === undefined ? "" : String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toRow(cols: (string | number | null | undefined)[]): string {
  return cols.map(escapeCsv).join(",");
}

export async function GET(request: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const orgId = searchParams.get("orgId");
  const months = Math.min(parseInt(searchParams.get("months") ?? "12", 10), 24);

  if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

  const rl = await checkAndLogRateLimit({ action: "employer_audit_export", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfterSeconds ?? 3600) },
    });
  }

  const admin = createAdminClient();

  // Verify employer_admin membership for this org
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("organization_id", orgId)
    .eq("role", "employer_admin")
    .limit(1)
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Organization";

  const since = new Date();
  since.setMonth(since.getMonth() - months);

  // Get all approved staff
  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const staffIds = (approved ?? []).map((r) => r.professional_id);
  if (staffIds.length === 0) {
    return NextResponse.json({ error: "No staff linked" }, { status: 404 });
  }

  // Fetch profiles and wallets in parallel
  const [profilesRes, walletsRes, activitiesRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession")
      .in("auth_id", staffIds),
    admin.from("cme_wallets")
      .select("professional_id, compliance_status, completed_credits, required_credits")
      .in("professional_id", staffIds),
    admin.from("cme_activities")
      .select("professional_id, title, credits, activity_date, verification_status, category, created_at")
      .in("professional_id", staffIds)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  // Build CSV rows
  const rows: string[] = [toRow(CSV_HEADERS)];

  for (const activity of activitiesRes.data ?? []) {
    const profile = profileMap[activity.professional_id];
    const wallet = walletMap[activity.professional_id];
    if (!profile) continue;

    rows.push(toRow([
      activity.created_at ? new Date(activity.created_at).toISOString() : "",
      profile.full_name ?? "Unknown",
      profile.profession ?? "—",
      `CME activity ${activity.verification_status}: ${activity.title ?? "Untitled"}`,
      activity.verification_status === "verified" ? activity.credits : 0,
      wallet?.compliance_status ?? "unknown",
      `Category: ${activity.category ?? "uncategorized"} · Date: ${activity.activity_date ?? ""}`,
    ]));
  }

  // Append current compliance snapshot for each staff member
  rows.push(""); // blank separator
  rows.push(toRow(["--- CURRENT COMPLIANCE SNAPSHOT ---", "", "", "", "", "", ""]));
  rows.push(toRow(["staff_name", "profession", "completed_credits", "required_credits", "compliance_status", "generated_at", ""]));
  for (const id of staffIds) {
    const profile = profileMap[id];
    const wallet = walletMap[id];
    if (!profile) continue;
    rows.push(toRow([
      profile.full_name ?? "Unknown",
      profile.profession ?? "—",
      wallet?.completed_credits ?? 0,
      wallet?.required_credits ?? 0,
      wallet?.compliance_status ?? "unknown",
      new Date().toISOString(),
      "",
    ]));
  }

  const csv = rows.join("\r\n");
  const safeOrgName = orgName.replace(/[\r\n\t"]/g, "").replace(/\s+/g, "-").slice(0, 50) || "Org";
  const filename = `${safeOrgName}-Audit-${new Date().toISOString().slice(0, 10)}.csv`;

  await logAudit({
    actorAuthId: user.id,
    action: "employer.audit_export",
    targetTable: "cme_activities",
    targetId: orgId,
    metadata: { orgId, months, staffCount: staffIds.length, rowCount: rows.length },
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
