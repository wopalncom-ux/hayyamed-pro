import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Allow the employer registration and setup pages through without org membership check
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isRegisterPage = pathname.endsWith("/employer/register") || pathname.includes("/employer/register");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role, organizations(name, verified, brand_color, brand_logo_url, brand_name_override)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!isRegisterPage && !member) redirect("/employer/register");

  // Register page: minimal layout without nav (user has no org yet)
  if (isRegisterPage || !member) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </div>
    );
  }

  const _orgs = member.organizations as {
    name: string; verified: boolean;
    brand_color?: string | null; brand_logo_url?: string | null; brand_name_override?: string | null;
  }[] | {
    name: string; verified: boolean;
    brand_color?: string | null; brand_logo_url?: string | null; brand_name_override?: string | null;
  } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as typeof _orgs extends (infer T)[] ? T : typeof _orgs);
  const orgName         = org?.name ?? "Your Organization";
  const isVerified      = org?.verified ?? false;
  const brandColor      = (org as { brand_color?: string | null })?.brand_color ?? null;
  const brandLogoUrl    = (org as { brand_logo_url?: string | null })?.brand_logo_url ?? null;
  const brandNameOverride = (org as { brand_name_override?: string | null })?.brand_name_override ?? null;
  const displayName     = brandNameOverride ?? orgName;
  const headerBg        = brandColor ?? "#ffffff";
  const isCustomBrand   = !!brandColor;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header
        className="px-6 py-3 border-b"
        style={{
          backgroundColor: headerBg,
          borderColor: isCustomBrand ? `${headerBg}33` : "#e2e8f0",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandLogoUrl} alt={displayName} className="h-7 max-w-[120px] object-contain" />
            ) : (
              <a
                href="/employer"
                className="text-base font-bold hover:opacity-80 transition-opacity"
                style={{ color: isCustomBrand ? "#ffffff" : "#1a56a0" }}
              >
                {displayName}
              </a>
            )}
            {brandLogoUrl && (
              <a
                href="/employer"
                className="text-sm font-semibold hidden sm:block hover:opacity-80 transition-opacity"
                style={{ color: isCustomBrand ? "#ffffff" : "#1a56a0" }}
              >
                {displayName}
              </a>
            )}
            {!isCustomBrand && <span className="text-xs text-[#64748b]">Employer</span>}
          </div>
          <div className="flex items-center gap-3">
            {!isVerified && (
              <span className="text-xs font-medium bg-[#fff7ed] text-[#d97706] px-2.5 py-1 rounded-full border border-[#fed7aa]">
                Pending verification
              </span>
            )}
            {isCustomBrand && (
              <span className="text-xs font-medium hidden sm:block" style={{ color: "rgba(255,255,255,0.7)" }}>
                Powered by Hayya Med Pro
              </span>
            )}
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-[#e2e8f0] px-6">
        <div className="max-w-5xl mx-auto flex gap-6 text-sm overflow-x-auto">
          {[
            { href: "/employer",                   label: "Dashboard" },
            { href: "/employer/staff/import",      label: "Import Staff" },
            { href: "/employer/required-training", label: "Required Training" },
            { href: "/employer/analytics",         label: "Analytics" },
            { href: "/employer/webhooks",          label: "Webhooks" },
            { href: "/employer/api-keys",          label: "API Keys" },
            { href: "/employer/integration",       label: "Integration" },
            { href: "/employer/ai-analyzer",       label: "AI Insights" },
            { href: "/employer/settings",          label: "Settings" },
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
