import { createAdminClient } from "./supabase/server";
import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export type OwnerSession = {
  userId: string;
  email: string;
  role: string;
  name: string;
};

export async function requireOwnerAuth(): Promise<OwnerSession> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [roleRes, profileRes] = await Promise.all([
    admin
      .from("organization_members")
      .select("role")
      .eq("auth_id", user.id)
      .in("role", ["founder", "master_admin", "super_admin"])
      .maybeSingle(),
    admin
      .from("professional_profiles")
      .select("full_name")
      .eq("auth_id", user.id)
      .maybeSingle(),
  ]);

  if (!roleRes.data) redirect("/dashboard");

  return {
    userId: user.id,
    email: user.email ?? "",
    role: roleRes.data.role,
    name: profileRes.data?.full_name ?? user.email?.split("@")[0] ?? "Owner",
  };
}
