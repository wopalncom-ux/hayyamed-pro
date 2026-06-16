import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { checkMfaRateLimit } from "@/lib/rateLimit";

function generateCode(): string {
  // XXXX-XXXX format — 8 uppercase alphanumeric chars
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous 0/O/1/I
  let code = "";
  const buf = randomBytes(8);
  for (let i = 0; i < 8; i++) {
    code += chars[buf[i] % chars.length];
  }
  return code.slice(0, 4) + "-" + code.slice(4);
}

function hashCode(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

// GET — generate 8 fresh recovery codes (replaces any existing ones)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkMfaRateLimit(user.id, "regenerate");
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many code regeneration attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  const admin = createAdminClient();

  // Delete existing codes
  await admin.from("mfa_recovery_codes").delete().eq("professional_id", user.id);

  const codes = Array.from({ length: 8 }, generateCode);
  const rows = codes.map((c) => ({
    professional_id: user.id,
    code_hash: hashCode(c.replace("-", "")),
  }));

  const { error } = await admin.from("mfa_recovery_codes").insert(rows);
  if (error) {
    return NextResponse.json({ error: "Failed to generate recovery codes" }, { status: 500 });
  }

  return NextResponse.json({ codes });
}

// POST — use a recovery code (verifies, marks used, unenrolls TOTP factor)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkMfaRateLimit(user.id, "recover");
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many recovery attempts. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => ({}));
  const raw = typeof body.code === "string" ? body.code.replace(/[\s-]/g, "").toUpperCase() : "";
  if (raw.length !== 8) {
    return NextResponse.json({ error: "Invalid recovery code format" }, { status: 400 });
  }

  const admin = createAdminClient();
  const hash = hashCode(raw);

  // Find matching unused code
  const { data: match } = await admin
    .from("mfa_recovery_codes")
    .select("id")
    .eq("professional_id", user.id)
    .eq("code_hash", hash)
    .is("used_at", null)
    .single();

  if (!match) {
    return NextResponse.json({ error: "Invalid or already-used recovery code." }, { status: 400 });
  }

  // Mark used
  await admin
    .from("mfa_recovery_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", match.id);

  // Remove all TOTP factors via admin REST API so session becomes sufficient
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const totpFactor = factors?.totp?.[0];

  if (totpFactor) {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${user.id}/factors/${totpFactor.id}`,
      {
        method: "DELETE",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      }
    );
  }

  // Delete remaining recovery codes (they're now stale with MFA removed)
  await admin.from("mfa_recovery_codes").delete().eq("professional_id", user.id);

  return NextResponse.json({ success: true });
}
