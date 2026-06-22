import { createAdminClient } from "@/lib/supabase/server";
import AnnouncementsClient from "./AnnouncementsClient";

export const metadata = { title: "Announcements — Admin" };
export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("platform_announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Platform Announcements</h1>
        <p className="text-[#64748b] mt-1">
          Publish banners shown in the user dashboard — maintenance notices, new features, compliance reminders.
        </p>
      </div>
      <AnnouncementsClient initial={data ?? []} />
    </div>
  );
}
