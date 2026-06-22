import DbExplorerClient from "./DbExplorerClient";

export const metadata = { title: "DB Explorer — Admin" };

export default function DbExplorerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">DB Record Manager</h1>
        <p className="text-[#64748b] mt-1">
          Read-only browser for all application tables. Click any row to inspect the full record.
        </p>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <span>⚠</span>
          <span>Read-only view — data cannot be modified from this panel. Use Supabase Studio for writes.</span>
        </div>
      </div>
      <DbExplorerClient />
    </div>
  );
}
