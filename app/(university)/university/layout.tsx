import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export default async function UniversityLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role, organizations(name, verified)")
    .eq("auth_id", user.id)
    .eq("role", "university_admin")
    .maybeSingle();

  if (!member) redirect("/university/register");

  const _orgs = member.organizations as { name: string; verified: boolean }[] | { name: string; verified: boolean } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string; verified: boolean } | null);
  const orgName = org?.name ?? "Your University";
  const isVerified = org?.verified ?? false;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/university" className="text-base font-bold text-[#1a56a0] hover:text-[#1547a0]">Hayya Med Pro</a>
            <span className="text-xs text-[#94a3b8]">University</span>
          </div>
          <div className="flex items-center gap-3">
            {!isVerified && (
              <span className="text-xs font-medium bg-[#fff7ed] text-[#d97706] px-2.5 py-1 rounded-full border border-[#fed7aa]">
                Pending verification
              </span>
            )}
            <span className="text-sm font-medium text-[#111] hidden sm:block">{orgName}</span>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-[#e2e8f0] px-6">
        <div className="max-w-5xl mx-auto flex gap-6 text-sm overflow-x-auto">
          {[
            { href: "/university",            label: "Dashboard" },
            { href: "/university/faculty",    label: "Faculty" },
            { href: "/university/analytics",  label: "Analytics" },
            { href: "/university/required-training", label: "Required Training" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="py-3 border-b-2 border-transparent hover:border-[#1a56a0] hover:text-[#1a56a0] text-[#64748b] transition-colors whitespace-nowrap"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
