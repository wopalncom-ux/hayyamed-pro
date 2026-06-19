export default function CertificatesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-48 bg-[#e2e8f0] rounded-lg mb-2" />
      <div className="h-4 w-72 bg-[#e2e8f0] rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#f1f5f9]" />
              <div className="h-5 w-16 bg-[#e2e8f0] rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-[#e2e8f0] rounded mb-2" />
            <div className="h-4 w-1/2 bg-[#f1f5f9] rounded mb-4" />
            <div className="h-8 w-full bg-[#f1f5f9] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
