import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

/**
 * GET /api/cron/compliance-snapshot
 *
 * Runs daily at 23:30 GST. Takes a point-in-time compliance snapshot
 * for every organization that has at least one approved staff link.
 *
 * Uses worst-case compliance across all wallets per professional
 * (multi-country professionals: non_compliant > at_risk > unknown > compliant).
 *
 * Results written to organization_compliance_snapshots (upsert on date).
 * Powers the 30-day compliance trend in the employer analytics page.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  // Get all orgs with at least one approved staff link
  const { data: links } = await admin
    .from("employer_link_requests")
    .select("organization_id, professional_id")
    .eq("status", "approved");

  if (!links?.length) {
    await pingCronMonitor("compliance-snapshot");
    return NextResponse.json({ ok: true, organizations_snapshotted: 0 });
  }

  // Group staff by org
  const orgStaffMap: Record<string, string[]> = {};
  for (const l of links) {
    const oid = l.organization_id as string;
    orgStaffMap[oid] = orgStaffMap[oid] ?? [];
    orgStaffMap[oid].push(l.professional_id as string);
  }

  const allStaffIds = [...new Set(links.map((l) => l.professional_id as string))];

  // Fetch all wallets for all linked staff in a single query
  const { data: wallets } = await admin
    .from("cme_wallets")
    .select("professional_id, compliance_status")
    .in("professional_id", allStaffIds);

  // Build worst-case compliance map per professional
  const RANK: Record<string, number> = {
    non_compliant: 3,
    at_risk:       2,
    unknown:       1,
    compliant:     0,
  };

  const worstStatus: Record<string, string> = {};
  for (const w of wallets ?? []) {
    const pid = w.professional_id as string;
    const curr = (w.compliance_status as string) ?? "unknown";
    const prev = worstStatus[pid];
    if (!prev || (RANK[curr] ?? 0) > (RANK[prev] ?? 0)) {
      worstStatus[pid] = curr;
    }
  }

  // Build and upsert a snapshot for each org
  const snapshots = Object.entries(orgStaffMap).map(([orgId, staffIds]) => {
    let compliant    = 0;
    let at_risk      = 0;
    let non_compliant = 0;
    let unknown      = 0;

    for (const pid of staffIds) {
      const s = worstStatus[pid] ?? "unknown";
      if (s === "compliant")     compliant++;
      else if (s === "at_risk")  at_risk++;
      else if (s === "non_compliant") non_compliant++;
      else                       unknown++;
    }

    return {
      organization_id: orgId,
      snapshot_date:   today,
      total_staff:     staffIds.length,
      compliant,
      at_risk,
      non_compliant,
      unknown,
    };
  });

  // Upsert — idempotent: safe to run multiple times on the same day
  const { error } = await admin
    .from("organization_compliance_snapshots")
    .upsert(snapshots, { onConflict: "organization_id,snapshot_date" });

  if (error) {
    console.error("[compliance-snapshot] upsert error:", error.message);
  }

  await pingCronMonitor("compliance-snapshot");
  return NextResponse.json({
    ok: true,
    organizations_snapshotted: snapshots.length,
    date: today,
  });
}
