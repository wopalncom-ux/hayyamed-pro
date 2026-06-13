export default function AnalyticsLoading() {
  return (
    <div className="animate-pulse">
      {/* Page header */}
      <div className="mb-6">
        <div className="h-7 w-32 bg-[#e2e8f0] rounded-lg mb-2" />
        <div className="h-4 w-72 bg-[#e2e8f0] rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="h-3 w-24 bg-[#e2e8f0] rounded mb-3" />
            <div className="h-8 w-20 bg-[#e2e8f0] rounded mb-1" />
            <div className="h-3 w-28 bg-[#e2e8f0] rounded" />
          </div>
        ))}
      </div>

      {/* Progress to renewal */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-40 bg-[#e2e8f0] rounded" />
          <div className="h-6 w-20 bg-[#e2e8f0] rounded-full" />
        </div>
        <div className="flex items-end gap-3 mb-3">
          <div className="h-10 w-16 bg-[#e2e8f0] rounded" />
          <div className="h-6 w-24 bg-[#e2e8f0] rounded" />
        </div>
        <div className="w-full bg-[#e2e8f0] rounded-full h-3 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-24 bg-[#e2e8f0] rounded mb-1.5" />
              <div className="h-5 w-32 bg-[#e2e8f0] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Monthly credits chart */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-36 bg-[#e2e8f0] rounded" />
          <div className="h-4 w-24 bg-[#e2e8f0] rounded" />
        </div>
        <div className="flex items-end gap-3 h-32">
          {[60, 40, 80, 30, 70, 50].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-[#e2e8f0] rounded-t-md"
                style={{ height: `${h}%` }}
              />
              <div className="h-3 w-8 bg-[#e2e8f0] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="h-5 w-40 bg-[#e2e8f0] rounded mb-5" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-3 w-24 bg-[#e2e8f0] rounded flex-shrink-0" />
              <div className="flex-1 bg-[#f1f5f9] rounded-full h-2">
                <div
                  className="bg-[#e2e8f0] h-2 rounded-full"
                  style={{ width: `${80 - i * 15}%` }}
                />
              </div>
              <div className="h-3 w-8 bg-[#e2e8f0] rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
