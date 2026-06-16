import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { checkMfaRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkMfaRateLimit(user.id, "unenroll");
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many unenroll attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => ({}));
  const factorId = typeof body.factorId === "string" ? body.factorId : null;
  if (!factorId) return NextResponse.json({ error: "factorId required" }, { status: 400 });

  // Use user's own session to unenroll (requires AAL2 or the factor being in 'unverified' state)
  const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
  if (unenrollError) {
    return NextResponse.json({ error: unenrollError.message }, { status: 400 });
  }

  // Delete all recovery codes for this user
  const admin = createAdminClient();
  await admin.from("mfa_recovery_codes").delete().eq("professional_id", user.id);

  return NextResponse.json({ success: true });
}
