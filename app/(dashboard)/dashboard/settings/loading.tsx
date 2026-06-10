export default function SettingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-32 bg-[#e2e8f0] rounded-lg mb-6" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <div className="h-5 w-36 bg-[#e2e8f0] rounded mb-4" />
            <div className="space-y-3">
              {[...Array(i === 1 ? 5 : 2)].map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                  <div className="h-4 w-40 bg-[#e2e8f0] rounded" />
                  <div className="h-5 w-9 bg-[#e2e8f0] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
