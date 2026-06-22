import { createAdminClient } from "@/lib/supabase/server";
import ChangelogClient from "./ChangelogClient";

export const metadata = { title: "Changelog — Admin" };
export const dynamic = "force-dynamic";

export default async function ChangelogPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("changelog_entries").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Changelog Manager</h1>
        <p className="text-[#64748b] mt-1">
          Publish release notes visible in the user dashboard as a "What&apos;s New" widget.
        </p>
      </div>
      <ChangelogClient initial={data ?? []} />
    </div>
  );
}
