"use client";

import { useState, useTransition } from "react";
import { updatePrivacySetting } from "@/app/(dashboard)/dashboard/settings/actions";

export default function PublicDirectoryToggle({ initial }: { initial: boolean }) {
  const [enabled, setEnabled] = useState(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setError(null);
    start(async () => {
      const result = await updatePrivacySetting("public_directory_opt_in", next);
      if (result.error) {
        setEnabled(!next);
        setError(result.error);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <p className="text-sm font-medium text-[#111]">List me in the public professional directory</p>
          <p className="text-xs text-[#64748b] mt-0.5">
            Your name, profession, specialty, and country will appear on the{" "}
            <a href="/professionals" target="_blank" rel="noopener noreferrer" className="text-[#1a56a0] hover:underline">
              /professionals
            </a>{" "}
            public page, linking to your public profile. License numbers and contact details are never shown.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={pending}
          onClick={toggle}
          className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${enabled ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"}`}
        >
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-0.5"}`} />
          <span className="sr-only">{enabled ? "Listed in directory" : "Not listed in directory"}</span>
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[#dc2626]">{error}</p>}
    </div>
  );
}
