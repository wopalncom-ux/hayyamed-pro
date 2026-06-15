import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { pingCronMonitor } from "@/lib/cronMonitor";
import { dispatchWebhook } from "@/lib/webhooks/dispatch";

export const runtime = "nodejs";

/**
 * GET /api/cron/license-expiry
 *
 * Runs daily at 08:45 GST. Dispatches `license.expiring` webhooks to employer
 * organizations when a linked professional's license is 30 or 7 days from expiry.
 *
 * Email and push notifications for license expiry are handled by the
 * `license-reminders` cron (08:15 GST) which covers 90/60/30/14/7-day thresholds,
 * respects user preferences, and supports the multi-license wallet — keeping
 * this cron focused solely on the employer-facing webhook signal.
 *
 * Covers:
 *   - professional_profiles.license_expiry   (primary license)
 *   - professional_licenses.expiry_date      (multi-license wallet)
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date();
  const targets = [30, 7];
  let webhooksDispatched = 0;

  for (const days of targets) {
    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + days);
    const dateStr = targetDate.toISOString().slice(0, 10);

    // ── Source 1: professional_profiles.license_expiry ───────────────────────
    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, license_expiry")
      .eq("license_expiry", dateStr);

    if (profiles?.length) {
      const profIds = profiles.map((p) => p.auth_id);

      // Batch-fetch all approved employer links for these professionals
      const { data: links } = await admin
        .from("employer_link_requests")
        .select("professional_id, organization_id")
        .in("professional_id", profIds)
        .eq("status", "approved");

      // Group organization_ids per professional
      const linkMap: Record<string, string[]> = {};
      for (const l of links ?? []) {
        linkMap[l.professional_id] = linkMap[l.professional_id] ?? [];
        linkMap[l.professional_id].push(l.organization_id);
      }

      for (const profile of profiles) {
        for (const orgId of linkMap[profile.auth_id] ?? []) {
          dispatchWebhook(orgId, "license.expiring", {
            professional_id: profile.auth_id,
            license_expiry: profile.license_expiry as string,
            days_remaining: days,
            source: "profile",
          }).catch(() => {});
          webhooksDispatched++;
        }
      }
    }

    // ── Source 2: professional_licenses.expiry_date (multi-license wallet) ───
    const { data: secLicenses } = await admin
      .from("professional_licenses")
      .select("professional_id, license_number, licensing_authority, country_code, expiry_date")
      .eq("expiry_date", dateStr);

    if (secLicenses?.length) {
      const secProfIds = [...new Set(secLicenses.map((l) => l.professional_id as string))];

      const { data: secLinks } = await admin
        .from("employer_link_requests")
        .select("professional_id, organization_id")
        .in("professional_id", secProfIds)
        .eq("status", "approved");

      const secLinkMap: Record<string, string[]> = {};
      for (const l of secLinks ?? []) {
        secLinkMap[l.professional_id] = secLinkMap[l.professional_id] ?? [];
        secLinkMap[l.professional_id].push(l.organization_id);
      }

      for (const license of secLicenses) {
        const pid = license.professional_id as string;
        for (const orgId of secLinkMap[pid] ?? []) {
          dispatchWebhook(orgId, "license.expiring", {
            professional_id: pid,
            license_number: license.license_number as string,
            licensing_authority: license.licensing_authority as string,
            country_code: license.country_code as string,
            license_expiry: license.expiry_date as string,
            days_remaining: days,
            source: "multi_license_wallet",
          }).catch(() => {});
          webhooksDispatched++;
        }
      }
    }
  }

  await pingCronMonitor("license-expiry");
  return NextResponse.json({ ok: true, webhooks_dispatched: webhooksDispatched });
}
