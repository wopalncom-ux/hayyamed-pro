export default function NotificationsLoading() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="h-6 bg-[#e2e8f0] rounded w-36 mb-6" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl p-6 mb-4">
          <div className="h-4 bg-[#e2e8f0] rounded w-40 mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between py-2">
                <div className="h-3 bg-[#f1f5f9] rounded w-48" />
                <div className="h-5 w-10 bg-[#f1f5f9] rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
