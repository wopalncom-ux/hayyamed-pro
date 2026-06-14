import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

function generateCode(authId: string): string {
  // Deterministic 8-char code from UUID — replace hyphens, take first 8 chars uppercase
  return authId.replace(/-/g, "").slice(0, 8).toUpperCase();
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Idempotent: return existing code if already set
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("referral_code")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (profile?.referral_code) {
    return NextResponse.json({ code: profile.referral_code });
  }

  const code = generateCode(user.id);

  const { error } = await admin
    .from("professional_profiles")
    .update({ referral_code: code })
    .eq("auth_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }

  logAudit({
    actorAuthId: user.id,
    action: "referral.code_generated",
    targetTable: "professional_profiles",
    metadata: { code },
  });

  return NextResponse.json({ code });
}
