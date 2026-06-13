"use client";

import { track } from "@/lib/analytics";

export default function UpgradeLink({ source }: { source: string }) {
  return (
    <a
      href={`/pricing?source=${source}`}
      onClick={() => track("upgrade_clicked", { source })}
      className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors"
    >
      Upgrade for PDF export ↗
    </a>
  );
}
