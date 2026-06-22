import { createAdminClient } from "@/lib/supabase/server";
import MediaLibraryClient from "./MediaLibraryClient";

export const metadata = { title: "Media Library — Admin" };

export default async function MediaPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Media Library</h1>
        <p className="text-[#64748b] mt-1">
          Upload and manage photos, logos, and banners used across the website and app.
        </p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <strong>Setup required:</strong> Ensure the <code>media-library</code> bucket exists in your Supabase project
          with <strong>Public</strong> access enabled. Files are served via the Supabase CDN.
        </div>
      </div>

      <MediaLibraryClient initial={data ?? []} />
    </div>
  );
}
