export default function BillingLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-40 bg-[#e2e8f0] rounded-lg mb-2" />
      <div className="h-4 w-64 bg-[#e2e8f0] rounded mb-6" />
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-4 w-24 bg-[#e2e8f0] rounded mb-2" />
            <div className="h-6 w-16 bg-[#e2e8f0] rounded-full" />
          </div>
          <div className="h-9 w-32 bg-[#e2e8f0] rounded-lg" />
        </div>
        <div className="h-px bg-[#e2e8f0] mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-[#e2e8f0] rounded mb-1" />
              <div className="h-5 w-32 bg-[#e2e8f0] rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="h-5 w-40 bg-[#e2e8f0] rounded mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#e2e8f0] last:border-0">
            <div>
              <div className="h-4 w-48 bg-[#e2e8f0] rounded mb-1" />
              <div className="h-3 w-28 bg-[#e2e8f0] rounded" />
            </div>
            <div className="h-5 w-20 bg-[#e2e8f0] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
