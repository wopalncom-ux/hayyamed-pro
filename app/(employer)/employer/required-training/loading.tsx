export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-[#e2e8f0] rounded animate-pulse" />
      <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#e2e8f0]">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-56 bg-[#e2e8f0] rounded animate-pulse" />
              <div className="h-3 w-40 bg-[#f1f5f9] rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-[#e2e8f0] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
