export default function LoadingProfessionalDetail() {
  return (
    <div className="max-w-5xl animate-pulse">
      <div className="h-4 w-32 bg-[#e2e8f0] rounded mb-4" />
      <div className="h-8 w-64 bg-[#e2e8f0] rounded mb-2" />
      <div className="h-4 w-48 bg-[#f1f5f9] rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <div className="h-4 w-24 bg-[#e2e8f0] rounded mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-20 bg-[#f1f5f9] rounded mb-1" />
                  <div className="h-4 w-32 bg-[#e2e8f0] rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 h-40" />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 h-48" />
          <div className="bg-white rounded-xl border border-[#e2e8f0] h-48" />
        </div>
      </div>
    </div>
  );
}
