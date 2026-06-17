import type { Metadata } from "next";
import DemoClient from "./DemoClient";

export const metadata: Metadata = {
  title: "Live Demo — Hayya Med Pro | CME Tracking & License Compliance",
  description:
    "Explore a live interactive demo of Hayya Med Pro — see your CME wallet, license countdown, compliance reports, and AI gap analysis. No login required.",
  alternates: { canonical: "https://hayyamed.pro/demo" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Live Demo — Hayya Med Pro",
    description: "See exactly what Hayya Med Pro looks like inside — live demo, no sign-up required.",
    url: "https://hayyamed.pro/demo",
    type: "website",
  },
};

export default function DemoPage() {
  return <DemoClient />;
}
