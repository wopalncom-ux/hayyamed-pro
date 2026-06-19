export default function ReflectionsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-44 bg-[#e2e8f0] rounded-lg mb-2" />
      <div className="h-4 w-80 bg-[#e2e8f0] rounded mb-8" />
      {/* New reflection input placeholder */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 mb-6">
        <div className="h-4 w-36 bg-[#e2e8f0] rounded mb-3" />
        <div className="h-24 bg-[#f1f5f9] rounded-lg mb-3" />
        <div className="flex gap-3">
          <div className="h-4 w-32 bg-[#f1f5f9] rounded" />
          <div className="ml-auto h-9 w-24 bg-[#e2e8f0] rounded-lg" />
        </div>
      </div>
      {/* Reflection list */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="h-4 w-48 bg-[#e2e8f0] rounded" />
              <div className="h-3 w-24 bg-[#f1f5f9] rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-[#f1f5f9] rounded" />
              <div className="h-3 w-5/6 bg-[#f1f5f9] rounded" />
              <div className="h-3 w-3/4 bg-[#f1f5f9] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
