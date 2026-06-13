import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";
import { renderToBuffer } from "@react-pdf/renderer";
import { CmeReportDocument } from "@/components/pdf/CmeReportDocument";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import React from "react";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkAndLogRateLimit({ action: "pdf_cme_report", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const admin = createAdminClient();
  const [{ data: profile }, { data: wallet }, { data: allActivities }] = await Promise.all([
    admin.from("professional_profiles").select("full_name, profession, specialty, license_number, licensing_authority, license_expiry, country_of_residence").eq("auth_id", user.id).single(),
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
    admin.from("cme_activities").select("*").eq("professional_id", user.id).in("verification_status", ["verified", "pending"]).order("activity_date", { ascending: false }),
  ]);

  const activities = (allActivities ?? []).filter((a) => a.verification_status === "verified");
  const pendingActivities = (allActivities ?? []).filter((a) => a.verification_status === "pending");

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(CmeReportDocument, {
      profile: profile ?? {},
      wallet: wallet ?? {},
      activities,
      pendingActivities,
      generatedAt: new Date().toISOString(),
    }) as any
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="CME-Report-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
