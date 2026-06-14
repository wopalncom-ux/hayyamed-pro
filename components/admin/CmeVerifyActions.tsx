"use client";

// Thin wrapper — delegates to the existing CmeActivityActions which handles all verify/reject logic.
// Kept for backwards-compat with any future reference; use CmeActivityActions directly in new pages.
export { default } from "@/components/admin/CmeActivityActions";
