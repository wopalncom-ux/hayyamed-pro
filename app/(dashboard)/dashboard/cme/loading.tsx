export default function CmeLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-36 bg-[#e2e8f0] rounded-lg mb-2" />
      <div className="h-4 w-72 bg-[#e2e8f0] rounded mb-6" />
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-4 w-48 bg-[#e2e8f0] rounded mb-2" />
            <div className="h-4 w-40 bg-[#e2e8f0] rounded" />
          </div>
          <div className="h-6 w-24 bg-[#e2e8f0] rounded-full" />
        </div>
        <div className="h-9 w-32 bg-[#e2e8f0] rounded mb-2" />
        <div className="w-full bg-[#e2e8f0] rounded-full h-2 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#f8fafc] rounded-lg p-3">
              <div className="h-3 w-16 bg-[#e2e8f0] rounded mb-2" />
              <div className="h-6 w-10 bg-[#e2e8f0] rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-4 flex items-center justify-between">
            <div>
              <div className="h-4 w-48 bg-[#e2e8f0] rounded mb-2" />
              <div className="h-3 w-32 bg-[#e2e8f0] rounded" />
            </div>
            <div className="h-6 w-16 bg-[#e2e8f0] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
