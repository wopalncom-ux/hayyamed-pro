export default function ProviderLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-6 bg-[#e2e8f0] rounded w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <div className="h-3 bg-[#e2e8f0] rounded w-24 mb-3" />
            <div className="h-7 bg-[#e2e8f0] rounded w-12" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-[#f1f5f9] last:border-0 flex gap-4">
            <div className="h-3 bg-[#f1f5f9] rounded flex-1" />
            <div className="h-3 bg-[#f1f5f9] rounded w-20" />
            <div className="h-3 bg-[#f1f5f9] rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
