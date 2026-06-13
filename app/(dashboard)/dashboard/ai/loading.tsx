export default function AiLoading() {
  return (
    <div className="animate-pulse">
      {/* Page header */}
      <div className="mb-6">
        <div className="h-7 w-36 bg-[#e2e8f0] rounded-lg mb-2" />
        <div className="h-4 w-64 bg-[#e2e8f0] rounded" />
      </div>

      {/* AI recommendations / gap cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#e2e8f0] rounded-lg flex-shrink-0" />
              <div className="h-4 w-28 bg-[#e2e8f0] rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-[#e2e8f0] rounded" />
              <div className="h-3 w-3/4 bg-[#e2e8f0] rounded" />
            </div>
            <div className="mt-3 h-2 w-full bg-[#e2e8f0] rounded-full" />
          </div>
        ))}
      </div>

      {/* Chat interface */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e2e8f0]">
          <div className="w-8 h-8 bg-[#e2e8f0] rounded-lg" />
          <div>
            <div className="h-4 w-24 bg-[#e2e8f0] rounded mb-1" />
            <div className="h-3 w-36 bg-[#e2e8f0] rounded" />
          </div>
        </div>

        {/* Chat messages */}
        <div className="px-5 py-4 space-y-4" style={{ minHeight: 240 }}>
          {/* Assistant message */}
          <div className="flex gap-3 max-w-lg">
            <div className="w-7 h-7 bg-[#e2e8f0] rounded-full flex-shrink-0 mt-0.5" />
            <div className="bg-[#f8fafc] rounded-2xl rounded-tl-sm px-4 py-3 flex-1">
              <div className="space-y-2">
                <div className="h-3 w-full bg-[#e2e8f0] rounded" />
                <div className="h-3 w-5/6 bg-[#e2e8f0] rounded" />
                <div className="h-3 w-4/5 bg-[#e2e8f0] rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat input */}
        <div className="px-4 py-3 border-t border-[#e2e8f0]">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl" />
            <div className="w-10 h-10 bg-[#e2e8f0] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
