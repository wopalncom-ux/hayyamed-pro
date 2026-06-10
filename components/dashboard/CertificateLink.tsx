"use client";

import { useState } from "react";

export default function CertificateLink({ certificatePath }: { certificatePath: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleView() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/certificates?path=${encodeURIComponent(certificatePath)}`);
      const data = await res.json();
      if (!res.ok) {
        setError("Could not load");
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Could not load");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-1">
      <button
        onClick={handleView}
        disabled={loading}
        className="text-xs text-[#1a56a0] hover:underline disabled:opacity-50 transition-opacity"
      >
        {loading ? "Loading…" : "View certificate →"}
      </button>
      {error && <span className="text-xs text-[#dc2626]">{error}</span>}
    </span>
  );
}
