export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="h-7 w-52 bg-[#e2e8f0] rounded-lg mb-2" />
          <div className="h-4 w-36 bg-[#e2e8f0] rounded" />
        </div>
        <div className="h-9 w-32 bg-[#e2e8f0] rounded-xl" />
      </div>

      {/* Banner placeholder */}
      <div className="h-14 bg-[#e2e8f0] rounded-xl mb-6" />

      {/* Profile completion card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-40 bg-[#e2e8f0] rounded" />
          <div className="h-4 w-8 bg-[#e2e8f0] rounded" />
        </div>
        <div className="w-full bg-[#f1f5f9] rounded-full h-2">
          <div className="h-2 w-2/3 bg-[#cbd5e1] rounded-full" />
        </div>
      </div>

      {/* Compliance ring card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-32 h-32 rounded-full bg-[#f1f5f9] flex-shrink-0" />
        <div className="flex-1 w-full space-y-3">
          <div className="h-5 w-48 bg-[#e2e8f0] rounded" />
          <div className="h-4 w-32 bg-[#e2e8f0] rounded" />
          <div className="h-3 w-full bg-[#f1f5f9] rounded-full" />
          <div className="h-3 w-3/4 bg-[#f1f5f9] rounded" />
        </div>
      </div>

      {/* 4-column stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="h-3 w-24 bg-[#e2e8f0] rounded mb-3" />
            <div className="h-8 w-20 bg-[#e2e8f0] rounded mb-2" />
            <div className="h-3 w-32 bg-[#f1f5f9] rounded" />
          </div>
        ))}
      </div>

      {/* Two content cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <div className="h-5 w-36 bg-[#e2e8f0] rounded mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-4 bg-[#f1f5f9] rounded" style={{ width: `${85 - j * 15}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <div className="h-5 w-40 bg-[#e2e8f0] rounded" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div>
              <div className="h-4 w-48 bg-[#e2e8f0] rounded mb-1.5" />
              <div className="h-3 w-32 bg-[#f1f5f9] rounded" />
            </div>
            <div className="h-5 w-14 bg-[#e2e8f0] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
