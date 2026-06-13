export default function AdminTableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      {/* Stat cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <div className="h-3 bg-[#e2e8f0] rounded w-20 mb-3" />
            <div className="h-7 bg-[#e2e8f0] rounded w-14" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f1f5f9] flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-3 bg-[#e2e8f0] rounded flex-1" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 border-b border-[#f1f5f9] last:border-0 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-3 bg-[#f1f5f9] rounded flex-1"
                style={{ width: `${60 + ((r + c) % 3) * 15}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
