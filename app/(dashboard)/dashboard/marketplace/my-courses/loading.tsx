export default function MyCoursesLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 w-32 bg-[#e2e8f0] rounded-lg mb-2" />
        <div className="h-4 w-56 bg-[#e2e8f0] rounded" />
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 w-16 bg-[#e2e8f0] rounded-full" />
                  <div className="h-5 w-20 bg-[#e2e8f0] rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-[#e2e8f0] rounded mb-1.5" />
                <div className="h-3 w-32 bg-[#e2e8f0] rounded mb-3" />
                <div className="h-2 w-full bg-[#e2e8f0] rounded-full mb-1" />
                <div className="h-3 w-24 bg-[#e2e8f0] rounded" />
              </div>
              <div className="flex-shrink-0">
                <div className="h-9 w-24 bg-[#e2e8f0] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
