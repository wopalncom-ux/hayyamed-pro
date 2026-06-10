export default function EmployerLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex justify-between">
        <div>
          <div className="h-7 w-56 bg-[#e2e8f0] rounded-lg mb-2" />
          <div className="h-4 w-36 bg-[#e2e8f0] rounded" />
        </div>
        <div className="h-9 w-36 bg-[#e2e8f0] rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
            <div className="h-8 w-8 bg-[#e2e8f0] rounded mx-auto mb-2" />
            <div className="h-3 w-16 bg-[#e2e8f0] rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <div className="h-5 w-40 bg-[#e2e8f0] rounded" />
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="h-4 w-40 bg-[#e2e8f0] rounded mb-2" />
                <div className="h-3 w-28 bg-[#e2e8f0] rounded" />
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-[#e2e8f0] rounded" />
                <div className="h-6 w-20 bg-[#e2e8f0] rounded-full" />
                <div className="h-4 w-10 bg-[#e2e8f0] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
