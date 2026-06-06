import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();

  if (!member) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-[#1a56a0] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-base font-bold text-white">Hayya Med PRO — Admin</span>
          <span className="text-xs text-blue-200 uppercase tracking-wide">{member.role.replace("_", " ")}</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
