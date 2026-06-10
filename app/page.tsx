import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hayya Med Pro — CME Tracking & License Compliance for GCC Healthcare Professionals",
  description:
    "Track your CME credits, manage license renewals, and stay compliant with QCHP, SCFHS, and DHA — all in one platform built for healthcare professionals in Qatar and the GCC.",
  openGraph: {
    title: "Hayya Med Pro",
    description: "CME tracking and license compliance for GCC healthcare professionals.",
    url: "https://pro.hayyamed.com",
    siteName: "Hayya Med Pro",
    locale: "en_US",
    type: "website",
  },
};

const FEATURES = [
  {
    icon: "📋",
    title: "CME Wallet",
    desc: "Log every conference, workshop, and online course. Track credits by category with automatic cap enforcement.",
  },
  {
    icon: "🏥",
    title: "License Wallet",
    desc: "Visual countdown to your license expiry. Get alerts at 90, 30, and 7 days — before it becomes urgent.",
  },
  {
    icon: "✦",
    title: "Compliance AI",
    desc: "Ask \"Am I on track for renewal?\" and get an instant, personalised answer based on your actual activities.",
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "See your monthly credit pace, projected completion date, and whether you're on track — at a glance.",
  },
  {
    icon: "🏢",
    title: "Employer Dashboard",
    desc: "Hospitals and clinics can view staff compliance in real time — with each professional in full control of their privacy settings.",
  },
  {
    icon: "📄",
    title: "PDF Reports",
    desc: "Generate a QCHP-ready compliance PDF in one click. Perfect for license renewal submissions.",
  },
];

const COUNTRIES = [
  { code: "QA", name: "Qatar", body: "QCHP", cycle: "1-year · 50 CME credits" },
  { code: "SA", name: "Saudi Arabia", body: "SCFHS", cycle: "1-year · 50 CME credits" },
  { code: "AE", name: "UAE (Dubai)", body: "DHA", cycle: "2-year · 40 CME credits" },
  { code: "AE", name: "UAE (Abu Dhabi)", body: "DOH", cycle: "2-year · 40 CPD credits" },
  { code: "KW", name: "Kuwait", body: "MOH Kuwait", cycle: "1-year · 30 CME credits" },
  { code: "BH", name: "Bahrain", body: "NHRA", cycle: "2-year · 40 CPD credits" },
  { code: "OM", name: "Oman", body: "OMSB", cycle: "2-year · 40 CME credits" },
];

const STEPS = [
  { n: "1", title: "Create your account", desc: "Sign up free in under 2 minutes. No credit card required." },
  {
    n: "2",
    title: "Complete your profile",
    desc: "Tell us your profession, licensing authority, and renewal cycle. We configure your wallet automatically.",
  },
  {
    n: "3",
    title: "Log activities & stay compliant",
    desc: "Add CME activities as you complete them. The dashboard tracks caps, gaps, and your renewal timeline in real time.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-[#1a56a0] font-bold text-lg tracking-tight">
            Hayya Med <span className="text-[#111]">PRO</span>
          </a>
          <nav className="hidden sm:flex items-center gap-8 text-sm text-[#64748b]">
            <a href="#features" className="hover:text-[#111] transition-colors">Features</a>
            <a href="#countries" className="hover:text-[#111] transition-colors">Coverage</a>
            <a href="/pricing" className="hover:text-[#111] transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm text-[#64748b] hover:text-[#111] transition-colors hidden sm:block"
            >
              Sign in
            </a>
            <a
              href="/register"
              className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1547a0] transition-colors"
            >
              Get started free
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-[#f0f6ff] to-white px-6 pt-20 pb-24 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#e8f0fe] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] animate-pulse" />
            Built for QCHP, SCFHS, DHA &amp; all GCC authorities
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-[#111] leading-tight tracking-tight mb-6">
            Your CME compliance,
            <br />
            <span className="text-[#1a56a0]">sorted.</span>
          </h1>

          <p className="text-xl text-[#64748b] max-w-xl mx-auto mb-10 leading-relaxed">
            Track CME credits, manage license renewals, and generate QCHP-ready reports —
            all in one platform designed for healthcare professionals across Qatar and the GCC.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/register"
              className="bg-[#1a56a0] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#1547a0] transition-all shadow-lg shadow-blue-900/15"
            >
              Start tracking for free
            </a>
            <a
              href="/pricing"
              className="border border-[#e2e8f0] text-[#374151] px-8 py-4 rounded-xl font-semibold text-base hover:border-[#1a56a0] hover:text-[#1a56a0] transition-all"
            >
              View pricing
            </a>
          </div>

          <p className="text-sm text-[#94a3b8] mt-4">
            Free forever. No credit card required.
          </p>
        </div>

        {/* Dashboard preview card */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-2xl shadow-blue-900/8 p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-[#64748b]">Renewal cycle: 2025-01-01 → 2025-12-31</p>
                <p className="text-xs text-[#64748b]">Medicine • Cardiology • QA</p>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#dcfce7] text-[#16a34a]">
                ON TRACK
              </span>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-[#1a56a0]">38</span>
              <span className="text-lg text-[#64748b] mb-0.5">/ 50 credits</span>
              <span className="text-sm text-[#94a3b8] mb-0.5 ml-auto">76%</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-2.5">
              <div className="bg-[#1a56a0] h-2.5 rounded-full" style={{ width: "76%" }} />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: "Activities", val: "14" },
                { label: "Avg/month", val: "4.2 credits" },
                { label: "Days left", val: "204" },
              ].map(({ label, val }) => (
                <div key={label} className="bg-[#f8fafc] rounded-lg p-3">
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm font-semibold text-[#111]">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#111] tracking-tight mb-3">
              Everything you need for renewal readiness
            </h2>
            <p className="text-[#64748b] max-w-xl mx-auto">
              Purpose-built for GCC healthcare professionals who can&apos;t afford to miss a renewal deadline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0] hover:border-[#1a56a0]/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center text-lg mb-4">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-[#111] mb-2">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f8fafc] border-y border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#111] tracking-tight mb-3">
              Up and running in minutes
            </h2>
            <p className="text-[#64748b]">No complex setup. No IT department required.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#1a56a0] text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {n}
                </div>
                <h3 className="text-base font-semibold text-[#111] mb-2">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Country coverage ────────────────────────────── */}
      <section id="countries" className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#111] tracking-tight mb-3">
              GCC-wide compliance rules, built in
            </h2>
            <p className="text-[#64748b] max-w-xl mx-auto">
              Each authority has its own cycle length, credit requirements, and category caps. We handle all of it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COUNTRIES.map(({ name, body, cycle }) => (
              <div
                key={`${name}-${body}`}
                className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#1a56a0]/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#111]">{name}</p>
                  <span className="text-xs font-semibold text-[#1a56a0] bg-[#e8f0fe] px-2.5 py-1 rounded-full">
                    {body}
                  </span>
                </div>
                <p className="text-xs text-[#64748b]">{cycle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ──────────────────────────────── */}
      <section className="px-6 py-20 bg-[#f0f6ff]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111] tracking-tight mb-4">
            Start free. Upgrade when you need more.
          </h2>
          <p className="text-[#64748b] mb-10 text-lg">
            CME tracking and your compliance dashboard are free, forever.
            Upgrade to Pro for PDF exports and automated renewal alerts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-7 text-left">
              <p className="text-sm font-medium text-[#64748b] mb-1">Free</p>
              <p className="text-3xl font-bold text-[#111] mb-1">$0</p>
              <p className="text-xs text-[#94a3b8] mb-5">Forever free</p>
              <ul className="space-y-2 text-sm text-[#374151]">
                {["CME tracking & wallet", "Compliance dashboard", "Analytics & charts", "Employer linking"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#16a34a]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/register"
                className="block w-full text-center border border-[#e2e8f0] text-[#374151] py-3 rounded-xl font-semibold text-sm hover:bg-[#f8fafc] transition-colors mt-6"
              >
                Get started free
              </a>
            </div>

            <div className="bg-[#1a56a0] rounded-2xl p-7 text-left">
              <p className="text-sm font-medium text-white/70 mb-1">Pro</p>
              <p className="text-3xl font-bold text-white mb-1">$49<span className="text-lg font-normal text-white/70">/year</span></p>
              <p className="text-xs text-white/50 mb-5">≈ $4/month · billed annually</p>
              <ul className="space-y-2 text-sm text-white/90">
                {["Everything in Free", "PDF compliance reports", "License expiry alerts", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-300">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/pricing"
                className="block w-full text-center bg-white text-[#1a56a0] py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors mt-6"
              >
                Get Pro — $49/year
              </a>
            </div>
          </div>

          <a href="/pricing" className="text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors mt-6 inline-block">
            See full pricing including Employer plans →
          </a>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#1a56a0] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Don&apos;t let your license lapse.
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join healthcare professionals across Qatar and the GCC who track their CME compliance with Hayya Med PRO.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-[#1a56a0] px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
          >
            Create your free account
          </a>
          <p className="text-white/50 text-sm mt-4">No credit card · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#e2e8f0] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#94a3b8]">
          <p className="font-semibold text-[#1a56a0]">Hayya Med PRO</p>
          <div className="flex items-center gap-6">
            <a href="/pricing" className="hover:text-[#111] transition-colors">Pricing</a>
            <a href="/login" className="hover:text-[#111] transition-colors">Sign in</a>
            <a href="/register" className="hover:text-[#111] transition-colors">Register</a>
          </div>
          <p>© {new Date().getFullYear()} Hayya Med. All rights reserved.</p>
        </div>
        <p className="text-center text-xs text-[#94a3b8] mt-4 max-w-2xl mx-auto">
          Hayya Med PRO is a compliance tracking tool. It does not issue licenses and does not replace official
          licensing authorities. Always verify requirements with your relevant regulatory body (QCHP, SCFHS, DHA, etc.).
        </p>
      </footer>
    </div>
  );
}
