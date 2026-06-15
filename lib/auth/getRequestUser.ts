import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Resolves the authenticated user from a server-side context.
 *
 * Priority:
 * 1. Authorization: Bearer {access_token} header (React Native / mobile API calls)
 * 2. Supabase session cookie (web / PWA)
 *
 * Non-negotiable mobile rule: mobile clients must not rely on cookies.
 * This helper makes every API route that calls it automatically mobile-compatible.
 *
 * Usage in Route Handlers:
 *   import { headers } from "next/headers";
 *   const user = await getRequestUser(await headers());
 *   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 */
export async function getRequestUser(
  headersList: Headers | ReadonlyHeaders,
): Promise<User | null> {
  const authHeader = headersList.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) {
      const admin = createAdminClient();
      const { data: { user }, error } = await admin.auth.getUser(token);
      if (!error && user) return user;
    }
  }

  // Fall back to cookie-based session (web/PWA)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

// Allow both the native Headers type and the ReadonlyHeaders type from next/headers
type ReadonlyHeaders = {
  get: (name: string) => string | null;
};
