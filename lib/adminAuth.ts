import { createClient, createAdminClient } from "@/lib/supabase/server";

/** Returns the authenticated User if they hold master_admin or super_admin role, otherwise null. */
export async function requireAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();

  return member ? user : null;
}
