import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function AdminOverviewLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="h-6 bg-[#e2e8f0] rounded w-48 mb-6 animate-pulse" />
      <AdminTableSkeleton rows={4} cols={4} />
    </div>
  );
}
