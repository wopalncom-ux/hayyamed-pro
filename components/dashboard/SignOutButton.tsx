"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps {
  /** "icon" = icon-only button for the nav header; "text" = text link for settings */
  variant?: "icon" | "text" | "full";
  className?: string;
}

export default function SignOutButton({ variant = "text", className }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        aria-label="Sign out"
        title="Sign out"
        suppressHydrationWarning
        className={cn(
          "p-2 rounded-lg text-[#64748b] hover:text-[#dc2626] hover:bg-red-50 transition-colors disabled:opacity-40",
          className
        )}
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        suppressHydrationWarning
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-[#dc2626] hover:bg-red-50 transition-colors disabled:opacity-50",
          className
        )}
      >
        <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>{loading ? "Signing out…" : "Sign out"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      suppressHydrationWarning
      className={cn("text-sm text-[#dc2626] hover:underline disabled:opacity-50", className)}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
