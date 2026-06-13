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
          <span className="text-base font-bold text-white">Hayya Med Pro — Admin</span>
          <span className="text-xs text-blue-200 uppercase tracking-wide">{member.role.replace("_", " ")}</span>
        </div>
      </header>
      <nav className="bg-white border-b border-[#e2e8f0] px-6 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex gap-6 text-sm whitespace-nowrap">
          {[
            { href: "/admin",                label: "Overview" },
            { href: "/admin/link-requests",  label: "Link Requests" },
            { href: "/admin/cme-activities", label: "CME Activities" },
            { href: "/admin/organizations",  label: "Organizations" },
            { href: "/admin/professionals",  label: "Professionals" },
            { href: "/admin/revenue",        label: "Revenue" },
            { href: "/admin/subscriptions",  label: "Subscriptions" },
            { href: "/admin/discounts",      label: "Discounts" },
            { href: "/admin/partners",       label: "Partners" },
            { href: "/admin/training-providers", label: "Providers" },
            { href: "/admin/courses",            label: "Courses" },
            { href: "/admin/country-rules",    label: "Country Rules" },
            { href: "/admin/nps",              label: "NPS Survey" },
            { href: "/admin/audit-logs",       label: "Audit Log" },
            { href: "/admin/settings",         label: "⚙ Settings" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="py-3 border-b-2 border-transparent hover:border-[#1a56a0] hover:text-[#1a56a0] text-[#64748b] transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
