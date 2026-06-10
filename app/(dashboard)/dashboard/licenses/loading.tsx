export default function LicensesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 bg-[#e2e8f0] rounded-lg mb-2" />
      <div className="h-4 w-64 bg-[#e2e8f0] rounded mb-6" />
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-28 bg-[#e2e8f0] rounded mb-2" />
              <div className="h-5 w-40 bg-[#e2e8f0] rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="h-5 w-32 bg-[#e2e8f0] rounded mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-[#e2e8f0] rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
