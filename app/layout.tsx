import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { PWARegister } from "@/components/PWARegister";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PostHogProvider } from "@/components/PostHogProvider";
import CookieConsent from "@/components/CookieConsent";
import ConditionalFooter from "@/components/ConditionalFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro"),
  title: "Hayya Med Pro",
  description: "Healthcare professional CME tracking, licensing, and compliance platform for Qatar and the GCC.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hayya Med Pro",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a56a0",
  width: "device-width",
  initialScale: 1,
};

async function resolveLocale() {
  const cookieStore = await cookies();
  return cookieStore.get("NEXT_LOCALE")?.value === "ar" ? "ar" : "en";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await resolveLocale();
  // Explicit imports so bundler can statically analyse both files
  const messages =
    locale === "ar"
      ? (await import("@/messages/ar.json")).default
      : (await import("@/messages/en.json")).default;

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#1a56a0] focus:text-white focus:rounded-lg focus:font-semibold focus:text-sm focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </PostHogProvider>
        <ConditionalFooter />
        <CookieConsent />
        <PWARegister />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
