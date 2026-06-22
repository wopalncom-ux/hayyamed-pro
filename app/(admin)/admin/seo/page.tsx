import { createAdminClient } from "@/lib/supabase/server";
import SeoEditorClient from "./SeoEditorClient";

export const metadata = { title: "SEO Manager — Admin" };

export default async function SeoPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("page_seo_settings")
    .select("*")
    .order("page_key");

  if (!data || data.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] mb-2">SEO Manager</h1>
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2e8f0]">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No SEO settings yet</h3>
          <p className="text-[#64748b] text-sm">Run migration 075 to seed default page SEO settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">SEO Manager</h1>
        <p className="text-[#64748b] mt-1">
          Edit meta titles, descriptions, Open Graph tags, and JSON-LD for every page.
          Changes are saved to the database and applied on the next page load.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-semibold text-green-800">✓ Live pages wired</p>
            <p className="text-xs text-green-700 mt-0.5">Landing page reads SEO from DB</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-800">⚡ Tip: Optimal Title</p>
            <p className="text-xs text-amber-700 mt-0.5">Keep meta titles 50-60 characters</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold text-blue-800">ℹ Test your changes</p>
            <p className="text-xs text-blue-700 mt-0.5">
              <a
                href="https://search.google.com/test/rich-results"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Google Rich Results Test ↗
              </a>
            </p>
          </div>
        </div>
      </div>

      <SeoEditorClient initial={data} />
    </div>
  );
}
