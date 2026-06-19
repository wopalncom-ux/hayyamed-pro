import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase PKCE auth callback — exchanges the one-time code for a session cookie.
// emailRedirectTo and OAuth providers should point here, not to /verify-email directly.
// Without this route the code exchange happens client-side (fragile: race conditions,
// JS failures, SSR hydration mismatches before the cookie is written).
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Validate `next` to prevent open redirect — must be a local path, never a full URL.
  const rawNext = searchParams.get("next") ?? "";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/verify-email";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${APP_URL}${next}`);
    }
  }

  // Code missing or exchange failed — send to login with an error hint.
  return NextResponse.redirect(`${APP_URL}/login?error=verification-failed`);
}
