import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

const Schema = z.object({
  score:   z.number().int().min(0).max(10),
  comment: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { score, comment } = parsed.data;

  const admin = createAdminClient();

  // One response per professional per 365-day window
  const yearAgo = new Date(Date.now() - 365 * 86400_000).toISOString();
  const { data: recent } = await admin
    .from("nps_responses")
    .select("id")
    .eq("professional_id", user.id)
    .gte("created_at", yearAgo)
    .maybeSingle();

  if (recent) {
    return NextResponse.json({ error: "Already submitted within the last year" }, { status: 409 });
  }

  const { error } = await admin.from("nps_responses").insert({
    professional_id: user.id,
    score,
    comment: comment?.trim() || null,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }

  logAudit({
    actorAuthId: user.id,
    action: "nps.submitted",
    targetTable: "nps_responses",
    metadata: { score, has_comment: !!(comment?.trim()) },
  });

  // Alert admin on detractors (score 0–6) — fire and forget
  if (score <= 6) {
    try {
      const { sendAdminNpsAlertEmail } = await import("@/lib/email");
      const { data: profile } = await admin
        .from("professional_profiles")
        .select("full_name, email, profession, country_of_residence")
        .eq("auth_id", user.id)
        .maybeSingle();
      if (profile?.email) {
        const adminEmail = process.env.ADMIN_EMAIL ?? "admin@hayyamed.pro";
        await sendAdminNpsAlertEmail({
          to: adminEmail,
          score,
          comment: comment?.trim() || null,
          professionalName: profile.full_name ?? "Unknown",
          profession: profile.profession ?? null,
          country: profile.country_of_residence ?? null,
        });
      }
    } catch {
      // Non-critical — don't fail the request
    }
  }

  return NextResponse.json({ ok: true });
}
