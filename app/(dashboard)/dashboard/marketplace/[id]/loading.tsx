export default function CourseDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 bg-[#e2e8f0] rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Provider + badges */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-20 bg-[#e2e8f0] rounded-full" />
            <div className="h-5 w-16 bg-[#e2e8f0] rounded-full" />
          </div>

          {/* Title */}
          <div>
            <div className="h-8 w-3/4 bg-[#e2e8f0] rounded mb-2" />
            <div className="h-8 w-1/2 bg-[#e2e8f0] rounded" />
          </div>

          {/* Meta row */}
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 w-24 bg-[#e2e8f0] rounded" />
            ))}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <div className="h-5 w-28 bg-[#e2e8f0] rounded mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-3 bg-[#e2e8f0] rounded"
                  style={{ width: `${100 - i * 8}%` }}
                />
              ))}
            </div>
          </div>

          {/* Learning objectives */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <div className="h-5 w-40 bg-[#e2e8f0] rounded mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#e2e8f0] rounded-full flex-shrink-0" />
                  <div className="h-3 bg-[#e2e8f0] rounded flex-1" style={{ width: `${80 - i * 10}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollment sidebar */}
        <div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 sticky top-4">
            <div className="h-6 w-20 bg-[#e2e8f0] rounded mb-4" />
            <div className="space-y-3 mb-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-20 bg-[#e2e8f0] rounded" />
                  <div className="h-3 w-16 bg-[#e2e8f0] rounded" />
                </div>
              ))}
            </div>
            <div className="h-11 w-full bg-[#e2e8f0] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
