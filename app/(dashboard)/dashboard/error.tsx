"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
      <div className="w-12 h-12 bg-[#fef2f2] rounded-full flex items-center justify-center mb-4">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-[#111] mb-2">Something went wrong</h2>
      <p className="text-sm text-[#64748b] mb-6 max-w-sm">
        An unexpected error occurred. Your data is safe — please try again.
      </p>
      <button
        onClick={reset}
        className="bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1648872] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
