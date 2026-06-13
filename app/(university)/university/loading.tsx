export default function UniversityLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-[#e2e8f0] rounded w-64 mb-2" />
      <div className="h-4 bg-[#e2e8f0] rounded w-40 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-4">
            <div className="h-8 bg-[#e2e8f0] rounded mb-2" />
            <div className="h-3 bg-[#f1f5f9] rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] h-64" />
    </div>
  );
}
