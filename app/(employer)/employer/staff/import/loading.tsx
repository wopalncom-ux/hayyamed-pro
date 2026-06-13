export default function Loading() {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="h-8 w-40 bg-[#e2e8f0] rounded animate-pulse" />
      <div className="h-40 bg-white rounded-xl border border-[#e2e8f0] animate-pulse" />
      <div className="h-64 bg-white rounded-xl border border-[#e2e8f0] animate-pulse" />
    </div>
  );
}
