import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

export default function ProfessionalsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="h-6 bg-[#e2e8f0] rounded w-40 mb-6 animate-pulse" />
      <AdminTableSkeleton rows={10} cols={6} />
    </div>
  );
}
