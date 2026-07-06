import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import GovernmentAIFloating from "@/components/government/GovernmentAIFloating";
import SignOutButton from "@/components/dashboard/SignOutButton";

export default async function GovernmentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role, organization_id, organizations(name, verified)")
    .eq("auth_id", user.id)
    .in("role", ["government_admin", "government_staff"])
    .limit(1)
    .maybeSingle();

  if (!member) redirect("/government/register");

  const _orgs = member.organizations as { name: string; verified: boolean }[] | { name: string; verified: boolean } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string; verified: boolean } | null);
  const orgName = org?.name ?? "Your Authority";
  const isVerified = org?.verified ?? false;
  const isAdmin = member.role === "government_admin";
  const orgId = member.organization_id as string;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/government" className="text-base font-bold text-[#1a56a0] hover:text-[#1547a0]">
              Hayya Med Pro
            </a>
            <span className="text-xs bg-[#e8f0fe] text-[#1a56a0] px-2 py-0.5 rounded font-medium">
              Regulatory Authority
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!isVerified && (
              <span className="text-xs font-medium bg-[#fff7ed] text-[#d97706] px-2.5 py-1 rounded-full border border-[#fed7aa]">
                Pending verification
              </span>
            )}
            <span className="text-sm font-medium text-[#111] hidden sm:block">{orgName}</span>
            <SignOutButton
              variant="text"
              className="text-[#64748b] hover:text-[#dc2626] hover:no-underline font-medium border border-[#e2e8f0] rounded-lg px-3 py-1.5 hover:border-[#fecaca] hover:bg-red-50 transition-colors"
            />
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-[#e2e8f0] px-6">
        <div className="max-w-6xl mx-auto flex gap-6 text-sm overflow-x-auto">
          {[
            { href: "/government",                  label: "Dashboard",     adminOnly: false },
            { href: "/government/registry",         label: "Registry",      adminOnly: false },
            { href: "/government/education",        label: "Education",     adminOnly: false },
            { href: "/government/reports",          label: "Reports",       adminOnly: false },
            { href: "/government/reminders",        label: "Reminders",     adminOnly: true  },
            { href: "/government/announcements",    label: "Announcements", adminOnly: true  },
          ].filter((item) => !item.adminOnly || isAdmin).map(({ href, label }) => (
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
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <GovernmentAIFloating organizationId={orgId} />
    </div>
  );
}
