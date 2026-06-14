"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

const FOOTER_EXCLUDED = [
  "/dashboard",
  "/onboarding",
  "/employer",
  "/provider",
  "/admin",
  "/university",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify",
  "/auth/",
  "/coming-soon",
];

export default function ConditionalFooter() {
  const pathname = usePathname();
  const excluded = FOOTER_EXCLUDED.some((p) => pathname.startsWith(p));
  if (excluded) return null;
  return <SiteFooter />;
}
