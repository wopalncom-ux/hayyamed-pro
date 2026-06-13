import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// This middleware runs on every non-static request. Its primary job is to
// call supabase.auth.getUser() so the Supabase SSR client can refresh the
// access token and write updated cookies back to the browser. Without it,
// sessions expire after ~1 hour and users are silently logged out.
//
// Auth redirects (unauthenticated → /login, authenticated → /dashboard)
// are also handled here for a faster, flash-free experience.

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files.
    // This regex is the official Supabase SSR recommendation.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
};
