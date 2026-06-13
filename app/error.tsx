"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Wordmark */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="font-bold text-base text-[#111]">
            Hayya Med <span className="text-[#1a56a0]">Pro</span>
          </span>
        </Link>

        {/* Error card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 shadow-sm">
          <div className="w-12 h-12 bg-[#fef2f2] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>

          <h1 className="text-lg font-bold text-[#111] mb-2">Something went wrong</h1>
          <p className="text-sm text-[#64748b] mb-6">
            An unexpected error occurred. Your compliance data is safe — please try again or return to the dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Try again
            </button>
            <Link
              href="/dashboard"
              className="text-sm font-semibold border border-[#e2e8f0] text-[#374151] px-5 py-2.5 rounded-lg hover:bg-[#f8fafc] transition-colors"
            >
              Go to dashboard
            </Link>
          </div>

          {error.digest && (
            <p className="text-[10px] text-[#94a3b8] mt-4 font-mono">
              Error ref: {error.digest}
            </p>
          )}
        </div>

        <p className="text-xs text-[#94a3b8] mt-6">
          If this keeps happening, contact{" "}
          <a href="mailto:support@hayyamed.pro" className="hover:underline">
            support@hayyamed.pro
          </a>
        </p>
      </div>
    </div>
  );
}
