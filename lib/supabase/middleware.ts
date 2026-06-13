import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Routes that require authentication. Everything else is public by default.
// This "allow-by-default" approach means new public pages (SEO, marketing,
// legal) are automatically accessible without updating this list.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/employer",
  "/provider",
  "/admin",
  "/university",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() also refreshes the access token and writes updated cookies via setAll above.
  // This is the primary reason middleware exists — server components cannot write cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // API routes handle their own auth — never redirect them
  if (pathname.startsWith("/api/")) return supabaseResponse;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // Forward the current pathname as a header so server-component layouts
  // can detect which route is active (e.g., to skip auth guards for /register pages).
  supabaseResponse.headers.set("x-pathname", pathname);

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Pass the original path as ?next= so LoginForm can redirect back after auth.
    // Only include pathname+search (never a full URL) to prevent open redirect.
    const next = pathname + request.nextUrl.search;
    url.search = `?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
