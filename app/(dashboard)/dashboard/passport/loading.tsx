export default function PassportLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-[#e2e8f0] rounded-lg w-48" />
      <div className="h-4 bg-[#e2e8f0] rounded w-80" />
      <div className="h-52 bg-[#e2e8f0] rounded-2xl" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-[#e2e8f0] rounded-xl" />
        ))}
      </div>
      <div className="h-48 bg-[#e2e8f0] rounded-xl" />
      <div className="h-48 bg-[#e2e8f0] rounded-xl" />
    </div>
  );
}
