import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles email confirmation and password recovery links.
// Uses token_hash (verifyOtp) instead of PKCE code exchange — works across any browser,
// no code_verifier cookie required (the old /auth/callback route requires the cookie
// from the same browser session that initiated the flow, which breaks email clients).
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "signup"
    | "recovery"
    | "email_change"
    | "invite"
    | "magiclink"
    | null;

  const rawNext = searchParams.get("next") ?? "";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });

    if (!error) {
      const dest = type === "recovery" ? "/reset-password" : next;
      return NextResponse.redirect(`${APP_URL}${dest}`);
    }
  }

  return NextResponse.redirect(`${APP_URL}/login?error=verification-failed`);
}
