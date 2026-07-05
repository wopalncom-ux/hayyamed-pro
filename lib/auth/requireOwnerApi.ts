import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * API-route auth check for /api/owner/* routes (server components use
 * requireAdminUser() from lib/adminAuth.ts instead). Returns the user id if
 * they hold founder/master_admin/super_admin, or null otherwise.
 */
export async function requireOwnerApiAuth(): Promise<{ userId: string } | null> {
  const user = await getRequestUser(await headers());
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return { userId: user.id };
}
