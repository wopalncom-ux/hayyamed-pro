export default function Loading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 w-56 bg-[#e2e8f0] rounded animate-pulse mb-2" />
        <div className="h-4 w-80 bg-[#e2e8f0] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="h-3 w-24 bg-[#e2e8f0] rounded animate-pulse mb-3" />
            <div className="h-8 w-16 bg-[#e2e8f0] rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="h-3 w-28 bg-[#e2e8f0] rounded animate-pulse mb-3" />
            <div className="h-8 w-12 bg-[#e2e8f0] rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <div className="h-5 w-48 bg-[#e2e8f0] rounded animate-pulse mb-6" />
        <div className="h-24 bg-[#f1f5f9] rounded animate-pulse" />
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="h-5 w-56 bg-[#e2e8f0] rounded animate-pulse mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-40 bg-[#e2e8f0] rounded animate-pulse flex-shrink-0" />
              <div className="flex-1 h-2.5 bg-[#f1f5f9] rounded-full" />
              <div className="h-3 w-16 bg-[#e2e8f0] rounded animate-pulse flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
