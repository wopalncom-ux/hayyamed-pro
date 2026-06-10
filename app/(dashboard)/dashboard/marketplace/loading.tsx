export default function MarketplaceLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-52 bg-[#e2e8f0] rounded-lg mb-2" />
        <div className="h-4 w-80 bg-[#e2e8f0] rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex justify-between mb-3">
              <div className="h-5 w-20 bg-[#e2e8f0] rounded-full" />
              <div className="h-5 w-20 bg-[#e2e8f0] rounded-full" />
            </div>
            <div className="h-5 w-full bg-[#e2e8f0] rounded mb-1" />
            <div className="h-5 w-3/4 bg-[#e2e8f0] rounded mb-1" />
            <div className="h-3 w-32 bg-[#e2e8f0] rounded mb-3" />
            <div className="h-3 w-full bg-[#e2e8f0] rounded mb-1" />
            <div className="h-3 w-2/3 bg-[#e2e8f0] rounded mb-4" />
            <div className="flex justify-between pt-3 border-t border-[#f1f5f9]">
              <div className="h-4 w-20 bg-[#e2e8f0] rounded" />
              <div className="h-4 w-12 bg-[#e2e8f0] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
