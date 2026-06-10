import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role, organizations(name)")
    .eq("auth_id", user.id)
    .in("role", ["employer_admin"])
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Your Organization";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-[#1a56a0]">Hayya Med PRO</span>
            <span className="text-sm text-[#64748b] ml-3">Employer Dashboard</span>
          </div>
          <span className="text-sm font-medium text-[#111]">{orgName}</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
