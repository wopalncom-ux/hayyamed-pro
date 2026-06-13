export default function CourseDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-6 bg-[#e2e8f0] rounded w-64 mb-2" />
      <div className="h-3 bg-[#f1f5f9] rounded w-48 mb-6" />
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-[#e2e8f0] rounded w-28 mb-1.5" />
            <div className="h-10 bg-[#f1f5f9] rounded-lg" />
          </div>
        ))}
        <div className="h-10 bg-[#e2e8f0] rounded-lg w-32 mt-2" />
      </div>
    </div>
  );
}
