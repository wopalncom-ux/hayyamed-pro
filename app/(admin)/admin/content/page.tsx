import { createAdminClient } from "@/lib/supabase/server";
import ContentEditorClient from "./ContentEditorClient";

export const metadata = { title: "CMS Content Editor — Admin" };

export default async function ContentPage() {
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("platform_content")
    .select("*")
    .order("page_key")
    .order("section_key")
    .order("field_key");

  const all = rows ?? [];
  const pages = [...new Set(all.map((r) => r.page_key))].sort((a, b) => {
    const order = ["landing", "about", "pricing", "specialties", "contact", "help", "global"];
    const ai = order.indexOf(a), bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">CMS Content Editor</h1>
        <p className="text-[#64748b] mt-1">
          Edit website text, headlines, CTAs, and copy across all pages — no code deployment needed.
        </p>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <strong>Note:</strong> Changes are saved to the database immediately. Pages that read from the CMS will reflect changes on next page load.
          Pages not yet wired to the CMS show the default hardcoded text.
        </div>
      </div>

      {all.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2e8f0]">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No content yet</h3>
          <p className="text-[#64748b] text-sm">Run migration 075 to seed default content fields.</p>
        </div>
      ) : (
        <ContentEditorClient initial={all} pages={pages} />
      )}
    </div>
  );
}
