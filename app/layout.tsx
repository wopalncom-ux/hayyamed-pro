import type { Metadata, Viewport } from "next";
import { PWARegister } from "@/components/PWARegister";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PostHogProvider } from "@/components/PostHogProvider";
import CookieConsent from "@/components/CookieConsent";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#1a56a0] focus:text-white focus:rounded-lg focus:font-semibold focus:text-sm focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <CookieConsent />
        <PWARegister />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
