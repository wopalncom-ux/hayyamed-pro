export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-[#e2e8f0] rounded w-48 mb-2" />
      <div className="h-4 bg-[#e2e8f0] rounded w-80 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5 h-20" />
        ))}
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] h-64" />
    </div>
  );
}
