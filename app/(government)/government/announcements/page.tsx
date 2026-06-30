import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAuthorityForUser } from "@/lib/government/jurisdiction";
import AuthorityAnnouncementManager from "@/components/government/AuthorityAnnouncementManager";

export const metadata = { title: "Announcements — Hayya Med Pro" };

export default async function GovernmentAnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const authority = await getAuthorityForUser(user.id);
  if (!authority) redirect("/government/register");

  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("authority_announcements")
    .select("id, title, message, type, is_active, cta_label, cta_url, starts_at, ends_at, created_at")
    .eq("organization_id", authority.organizationId)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Announcements</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Post a banner shown to every Hayya Med Pro user in {authority.jurisdictionCountry}. It will not appear to users in other countries.
        </p>
      </div>
      <AuthorityAnnouncementManager
        announcements={(rows ?? []).map((r) => ({
          id: r.id, title: r.title, message: r.message, type: r.type,
          isActive: r.is_active, ctaLabel: r.cta_label, ctaUrl: r.cta_url,
          startsAt: r.starts_at, endsAt: r.ends_at,
        }))}
        jurisdiction={authority.jurisdictionCountry}
      />
    </div>
  );
}
