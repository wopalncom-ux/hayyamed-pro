import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function CountryRulesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="h-6 bg-[#e2e8f0] rounded w-40 mb-6 animate-pulse" />
      <AdminTableSkeleton rows={7} cols={4} />
    </div>
  );
}
