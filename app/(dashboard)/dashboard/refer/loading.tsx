export default function ReferLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 bg-[#e2e8f0] rounded-lg mb-2" />
      <div className="h-4 w-72 bg-[#e2e8f0] rounded mb-8" />
      {/* Referral code card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 mb-6">
        <div className="h-4 w-32 bg-[#e2e8f0] rounded mb-4" />
        <div className="flex items-center gap-3">
          <div className="h-11 flex-1 bg-[#f1f5f9] rounded-lg" />
          <div className="h-11 w-24 bg-[#e2e8f0] rounded-lg" />
        </div>
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-center">
            <div className="h-8 w-12 bg-[#e2e8f0] rounded mx-auto mb-2" />
            <div className="h-3 w-24 bg-[#f1f5f9] rounded mx-auto" />
          </div>
        ))}
      </div>
      {/* How it works */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
        <div className="h-5 w-32 bg-[#e2e8f0] rounded mb-5" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-[#e2e8f0] rounded mb-2" />
                <div className="h-3 w-64 bg-[#f1f5f9] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
