"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface LanguageSwitcherProps {
  /** Extra classes for the button wrapper */
  className?: string;
  /** "dark" for light-text variant (use on dark hero bg), "light" for dark-text */
  variant?: "dark" | "light";
}

export function LanguageSwitcher({ className = "", variant = "light" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggle = async () => {
    const next = locale === "en" ? "ar" : "en";
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => {
      router.refresh();
    });
  };

  const baseClasses =
    "text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:opacity-50 select-none";

  const variantClasses =
    variant === "dark"
      ? "border-white/20 text-white/75 hover:text-white hover:border-white/40 bg-white/5 hover:bg-white/10"
      : "border-[#e2e8f0] text-[#64748b] hover:text-[#1a56a0] hover:border-[#1a56a0]/30 bg-transparent";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {locale === "en" ? t("switch_to_arabic") : t("switch_to_english")}
    </button>
  );
}
