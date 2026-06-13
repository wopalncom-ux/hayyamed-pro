export default function SettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-6 bg-[#e2e8f0] rounded w-40 mb-6" />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-[#f1f5f9] last:border-0">
            <div className="h-3 bg-[#e2e8f0] rounded w-40" />
            <div className="h-8 bg-[#e2e8f0] rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
