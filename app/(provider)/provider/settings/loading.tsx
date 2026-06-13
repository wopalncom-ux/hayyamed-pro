export default function ProviderSettingsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-6 bg-[#e2e8f0] rounded w-36 mb-6" />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-[#e2e8f0] rounded w-32 mb-1.5" />
            <div className="h-10 bg-[#f1f5f9] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
