import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function CountryRuleDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 bg-[#e2e8f0] rounded w-24" />
        <div className="h-3 bg-[#e2e8f0] rounded w-2" />
        <div className="h-4 bg-[#e2e8f0] rounded w-40" />
      </div>
      <AdminTableSkeleton rows={6} cols={5} />
    </div>
  );
}
