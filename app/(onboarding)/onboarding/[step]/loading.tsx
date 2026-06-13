export default function OnboardingStepLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center animate-pulse">
      <div className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl p-8">
        <div className="h-2 bg-[#e2e8f0] rounded-full w-3/4 mx-auto mb-8" />
        <div className="h-6 bg-[#e2e8f0] rounded w-48 mx-auto mb-2" />
        <div className="h-3 bg-[#f1f5f9] rounded w-64 mx-auto mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-[#e2e8f0] rounded w-28 mb-1.5" />
              <div className="h-10 bg-[#f1f5f9] rounded-lg w-full" />
            </div>
          ))}
        </div>
        <div className="h-10 bg-[#e2e8f0] rounded-lg w-full mt-6" />
      </div>
    </div>
  );
}
