import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { PWARegister } from "@/components/PWARegister";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hayya Med Pro",
  description: "Healthcare professional CME tracking, licensing, and compliance platform for Qatar and the GCC.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hayya Med Pro",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a56a0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {children}
        <PWARegister />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
