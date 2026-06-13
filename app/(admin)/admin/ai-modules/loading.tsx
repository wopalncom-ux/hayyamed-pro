export default function AIModulesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-[#e2e8f0] rounded-lg w-64 mb-2" />
      <div className="h-4 bg-[#e2e8f0] rounded w-96 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#e2e8f0] rounded-xl h-20" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-[#e2e8f0] rounded-2xl h-64" />
        ))}
      </div>
    </div>
  );
}
