export default function ProviderCoursesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse">
      <div className="flex justify-between mb-6">
        <div className="h-6 bg-[#e2e8f0] rounded w-32" />
        <div className="h-9 bg-[#e2e8f0] rounded-lg w-28" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-4 flex gap-4 items-center">
            <div className="flex-1">
              <div className="h-4 bg-[#e2e8f0] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#f1f5f9] rounded w-1/2" />
            </div>
            <div className="h-6 bg-[#f1f5f9] rounded-full w-20" />
            <div className="h-8 bg-[#f1f5f9] rounded-lg w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
