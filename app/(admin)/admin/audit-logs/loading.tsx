import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function AuditLogsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="h-6 bg-[#e2e8f0] rounded w-36 mb-2 animate-pulse" />
      <div className="h-3 bg-[#f1f5f9] rounded w-64 mb-6 animate-pulse" />
      {/* filter bar skeleton */}
      <div className="flex gap-3 mb-6 animate-pulse">
        <div className="h-9 bg-[#e2e8f0] rounded-lg w-48" />
        <div className="h-9 bg-[#e2e8f0] rounded-lg w-36" />
      </div>
      <AdminTableSkeleton rows={10} cols={5} />
    </div>
  );
}
