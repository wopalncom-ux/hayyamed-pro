"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  MotionConfig,
} from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { triggerAppDownloadModal } from "@/components/AppDownloadModal";

// ── Reduced-motion hook ──────────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

// ── Neural particle canvas ───────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number };
    let animId: number;
    let particles: Particle[] = [];
    // Tuned down from 55/hypot-per-pair/uncapped-fps — this is a slow-drifting
    // ambient background effect, so none of that precision is visible, but the
    // O(n^2) pairwise distance check was measured as a meaningful chunk of
    // ongoing main-thread cost (Lighthouse ~2026-07-22 audit).
    const COUNT = 36;
    const DIST = 95;
    const DIST_SQ = DIST * DIST;
    const FRAME_INTERVAL = 1000 / 30; // cap at 30fps regardless of display refresh rate
    let lastFrameTime = 0;

    const init = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.3 + 0.4,
      }));
    };

    init();
    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    const draw = (now: number) => {
      if (now - lastFrameTime < FRAME_INTERVAL) { animId = requestAnimationFrame(draw); return; }
      lastFrameTime = now;

      if (!canvas.width || !canvas.height) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.55)";
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dSq = dx * dx + dy * dy; // compare squared distances — skip sqrt for the common (out-of-range) case
          if (dSq < DIST_SQ) {
            const d = Math.sqrt(dSq);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96,165,250,${0.13 * (1 - d / DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 1800 }: {
  target: number; suffix?: string; duration?: number;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setValue(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration, reduced]);

  return <span ref={ref}>{value}{suffix}</span>;
}

// ── FadeUp ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── TiltCard ─────────────────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });
  const reduced = useReducedMotion();

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my, reduced]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── MagneticButton ───────────────────────────────────────────────────────────
function MagneticButton({ children, href, className = "" }: {
  children: React.ReactNode; href: string; className?: string;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 350, damping: 25 });
  const sy = useSpring(my, { stiffness: 350, damping: 25 });
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) * 0.25);
        my.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const AUTHORITIES = [
  "QCHP Qatar", "SCFHS Saudi Arabia", "DHA Dubai", "DOH Abu Dhabi",
  "NHRA Bahrain", "OMSB Oman", "MOH Kuwait",
];

const FEATURES = [
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />,
    title: "CME Wallet",
    desc: "Log every conference, workshop, and online course. Auto-enforces category caps per authority.",
    badge: "Core",
  },
  {
    icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    title: "License Wallet",
    desc: "Visual countdown to expiry. Alerts at 90, 30, and 7 days — across every license you hold.",
    badge: "Core",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />,
    title: "Hayya AI",
    desc: "Ask \"Am I on track?\" and get a personalised answer grounded in your actual activity history and authority rules.",
    badge: "Pro",
  },
  {
    icon: <polyline strokeLinecap="round" strokeLinejoin="round" points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    title: "Analytics",
    desc: "Monthly credit pace, projected completion, gap analysis by category — at a glance.",
    badge: "Core",
  },
  {
    icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
    title: "Employer Dashboard",
    desc: "Hospitals view staff compliance in real time — with professionals in full control of their privacy.",
    badge: "Employer",
  },
  {
    icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    title: "PDF Reports",
    desc: "One-click QCHP-ready compliance PDF. Attach to your renewal submission — no manual formatting.",
    badge: "Pro",
  },
];

const BADGE_COLORS: Record<string, string> = {
  Core: "bg-[#e8f0fe] text-[#1a56a0]",
  Pro: "bg-[#fdf4ff] text-[#7c3aed]",
  Employer: "bg-[#fff7ed] text-[#d97706]",
};

const COUNTRIES = [
  { name: "Qatar", body: "QCHP", cycle: "2-year · 80 CPD credits", flag: "🇶🇦", href: "/qchp" },
  { name: "Saudi Arabia", body: "SCFHS", cycle: "1–3 yr · 40–60 credits", flag: "🇸🇦", href: "/scfhs" },
  { name: "UAE (Dubai)", body: "DHA", cycle: "2-year · 40 credits", flag: "🇦🇪", href: "/dha" },
  { name: "UAE (Abu Dhabi)", body: "DOH", cycle: "1–2 yr · 30–50 CPD", flag: "🇦🇪", href: "/doh" },
  { name: "Kuwait", body: "MOH", cycle: "1-year · 30 credits", flag: "🇰🇼", href: "/moh-kuwait" },
  { name: "Bahrain", body: "NHRA", cycle: "2-year · 40 CPD", flag: "🇧🇭", href: "/nhra" },
  { name: "Oman", body: "OMSB", cycle: "2-year · 40 credits", flag: "🇴🇲", href: "/omsb" },
];

const CHAT_MESSAGES = [
  { role: "user", text: "Am I on track for my QCHP renewal?" },
  { role: "ai", text: "You have 52 of 80 required CPD credits — 65% complete with 9 months left. At 5.2 credits/month you'll reach 80 in ~5.4 months. You are on track." },
  { role: "user", text: "Which categories am I missing?" },
  { role: "ai", text: "Category 2 needs 8 more credits. One online CME course (3–5 credits) plus the upcoming QCHP-approved webinar series would close the gap." },
];

const MOB_NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#ai", label: "Hayya AI" },
  { href: "/employers", label: "For Employers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "#", label: "📲 Download App", download: true },
];

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 30);
      if (window.scrollY > 80) setMobileOpen(false);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled || mobileOpen ? "rgba(255,255,255,0.97)" : "transparent",
        borderBottomColor: scrolled || mobileOpen ? "rgba(226,232,240,1)" : "transparent",
        boxShadow: scrolled || mobileOpen ? "0 1px 20px rgba(0,0,0,0.06)" : "none",
      }}
      transition={{ duration: 0.25 }}
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      role="banner"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Hayya Med Pro — home">
          <motion.div
            className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="text-white text-sm font-bold" aria-hidden="true">H</span>
          </motion.div>
          <span className={`font-bold text-base tracking-tight transition-colors duration-300 ${scrolled || mobileOpen ? "text-[#111]" : "text-white"}`}>
            Hayya Med <span className={scrolled || mobileOpen ? "text-[#1a56a0]" : "text-[#60a5fa]"}>Pro</span>
          </span>
        </Link>

        <nav
          className={`hidden sm:flex items-center gap-7 text-sm transition-colors duration-300 ${scrolled ? "text-[#64748b]" : "text-white/75"}`}
          aria-label="Main navigation"
        >
          <a href="#features" className="hover:text-[#1a56a0] transition-colors">{t("features")}</a>
          <a href="#ai" className="hover:text-[#1a56a0] transition-colors">{t("hayya_ai")}</a>
          <Link href="/employers" className="hover:text-[#1a56a0] transition-colors">{t("for_employers")}</Link>
          <Link href="/pricing" className="hover:text-[#1a56a0] transition-colors">{t("pricing")}</Link>
          <Link href="/about" className="hover:text-[#1a56a0] transition-colors">About</Link>
          <button
            type="button"
            onClick={() => triggerAppDownloadModal()}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${scrolled ? "border-[#1a56a0] text-[#1a56a0] hover:bg-[#1a56a0] hover:text-white" : "border-white/50 text-white hover:border-white hover:bg-white/10"}`}
            aria-label="Download Hayya Med Pro app"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 3v12" />
            </svg>
            Download App
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher variant={scrolled ? "light" : "dark"} />
          <Link
            href="/login"
            className={`text-sm transition-colors duration-300 ${scrolled ? "text-[#64748b] hover:text-[#111]" : "text-white/75 hover:text-white"}`}
          >
            {t("sign_in")}
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/25"
            >
              {t("get_started_free")}
            </Link>
          </motion.div>
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <Link href="/register" className="text-sm bg-[#1a56a0] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors">
            {t("start_free")}
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? t("close_menu") : t("open_menu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`w-5 h-5 ${scrolled ? "text-[#374151]" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden sm:hidden border-t border-[#e2e8f0] bg-white"
          >
            <nav className="px-6 py-4 flex flex-col" aria-label="Mobile navigation">
              {MOB_NAV_LINKS.map(({ href, label, download }) => (
                <a
                  key={label}
                  href={download ? undefined : href}
                  className="text-sm text-[#374151] hover:text-[#1a56a0] py-3 border-b border-[#f1f5f9] last:border-0 transition-colors font-medium cursor-pointer"
                  onClick={(e) => {
                    if (download) { e.preventDefault(); triggerAppDownloadModal(); }
                    setMobileOpen(false);
                  }}
                >
                  {label}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/register"
                  className="block text-center text-sm bg-[#1a56a0] text-white py-3 rounded-xl font-semibold hover:bg-[#1547a0] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("get_started_free")} {locale === "ar" ? "←" : "→"}
                </Link>
                <Link
                  href="/login"
                  className="block text-center text-sm text-[#64748b] hover:text-[#111] py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("sign_in")}
                </Link>
                <div className="flex justify-center pt-1">
                  <LanguageSwitcher variant="light" />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const t = useTranslations("hero");
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let gsapInstance: typeof import("gsap").gsap | null = null;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        gsapInstance = gsap;
        if (!orb1.current || !orb2.current) return;
        gsap.to(orb1.current, { x: 35, y: -25, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(orb2.current, { x: -25, y: 20, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
        ScrollTrigger.create({
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            if (!orb1.current || !orb2.current) return;
            gsap.set(orb1.current, { y: self.progress * -100 });
            gsap.set(orb2.current, { y: self.progress * -50 });
          },
        });
      });
    });

    return () => {
      if (gsapInstance) {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) =>
          ScrollTrigger.getAll().forEach((t: { kill: () => void }) => t.kill())
        );
        [orb1.current, orb2.current].forEach((el) => { if (el) gsapInstance!.killTweensOf(el); });
      }
    };
  }, [reduced]);

  const headline = t("headline").split(" ");

  return (
    <section id="hero" className="relative bg-[#060d1f] min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 overflow-hidden">
      {/* Neural particle network */}
      <NeuralCanvas />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "44px 44px" }}
        aria-hidden="true"
      />

      {/* Gradient orbs */}
      <div ref={orb1} className="absolute pointer-events-none" style={{ left: "5%", top: "10%", width: 650, height: 650, background: "radial-gradient(circle, rgba(26,86,160,0.38) 0%, transparent 65%)", filter: "blur(80px)", borderRadius: "50%" }} aria-hidden="true" />
      <div ref={orb2} className="absolute pointer-events-none" style={{ right: "3%", top: "25%", width: 480, height: 480, background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 65%)", filter: "blur(70px)", borderRadius: "50%" }} aria-hidden="true" />
      <div className="absolute pointer-events-none" style={{ left: "35%", bottom: "0%", width: 700, height: 280, background: "radial-gradient(ellipse, rgba(26,86,160,0.25) 0%, transparent 65%)", filter: "blur(80px)" }} aria-hidden="true" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Hayya Med AI badge */}
        <motion.div
          initial={{ y: 12, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 border border-white/10 bg-white/5 backdrop-blur-sm text-[#93c5fd] text-xs font-semibold px-4 py-2.5 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ animation: reduced ? "none" : "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }} aria-hidden="true" />
          {t("badge")}
        </motion.div>

        {/* Headline — rendered visible in SSR; y-only animation after hydration (LCP fix) */}
        <h1 className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6 text-white">
          {headline.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block me-[0.27em] ${word === "AI." ? "text-[#60a5fa]" : ""}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.5, ease: "easeOut" }}
          className="text-lg sm:text-xl text-white/72 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          {t("subheading")}
        </motion.p>

        {/* Authority pills */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mb-10">
          {AUTHORITIES.map((auth) => (
            <span key={auth} className="text-[11px] font-semibold text-white/60 tracking-widest uppercase">
              {auth}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <MagneticButton
            href="/register"
            className="bg-white text-[#1a56a0] px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-2xl shadow-black/30 cursor-pointer inline-block"
          >
            {t("cta_primary")}
          </MagneticButton>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/pricing"
              className="border border-white/12 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-base hover:border-white/25 hover:bg-white/8 transition-all inline-block"
            >
              {t("cta_secondary")}
            </Link>
          </motion.div>
        </motion.div>

        <p className="text-white/70 text-sm mt-3">
          {t("trust_text")}
        </p>
      </div>

      {/* Floating dashboard card */}
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto mt-12"
        style={reduced ? {} : { animation: "floatCard 6s ease-in-out infinite" }}
      >
        <div
          className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl"
          style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-white/30 mb-0.5">{t("dashboard_label")}</p>
              <p className="text-[11px] text-white/20">{t("dashboard_specialty")}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ animation: reduced ? "none" : "pulse 2s infinite" }} aria-hidden="true" />
              {t("dashboard_status")}
            </div>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-white tabular-nums">52</span>
            <span className="text-xl text-white/30 mb-0.5">{t("dashboard_credits")}</span>
            <span className="text-sm text-white/22 mb-0.5 ms-auto">65%</span>
          </div>
          <div className="w-full bg-white/8 rounded-full h-2 mb-4" dir="ltr">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.4, delay: 1.2, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] h-2 rounded-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t("dashboard_stat_activities"), val: "21" },
              { label: t("dashboard_stat_avg"), val: "5.2 crd" },
              { label: t("dashboard_stat_days"), val: "274" },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/[0.04] rounded-lg p-3 border border-white/[0.05]">
                <p className="text-[10px] text-white/22 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-semibold text-white">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Trust Signals ────────────────────────────────────────────────────────────
const TRUST_AUTHORITIES = [
  { flag: "🇶🇦", abbr: "QCHP", country: "Qatar", href: "/qchp" },
  { flag: "🇸🇦", abbr: "SCFHS", country: "Saudi Arabia", href: "/scfhs" },
  { flag: "🇦🇪", abbr: "DHA", country: "Dubai", href: "/dha" },
  { flag: "🇦🇪", abbr: "DOH", country: "Abu Dhabi", href: "/doh" },
  { flag: "🇰🇼", abbr: "MOH", country: "Kuwait", href: "/moh-kuwait" },
  { flag: "🇧🇭", abbr: "NHRA", country: "Bahrain", href: "/nhra" },
  { flag: "🇴🇲", abbr: "OMSB", country: "Oman", href: "/omsb" },
];

const TRUST_ITEMS = [
  {
    label: "Qatar PDPL compliant",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    ),
  },
  {
    label: "Application hosted in Doha, Qatar",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Z" />
    ),
  },
  {
    label: "Powered by Gemini AI",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
    ),
  },
  {
    label: "14-day Pro trial · No card",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    ),
  },
];

function TrustSignals() {
  const t = useTranslations("trust");
  const reduced = useReducedMotion();

  const trustItems = [
    { label: t("pdpl"), icon: TRUST_ITEMS[0].icon },
    { label: t("data_hosted"), icon: TRUST_ITEMS[1].icon },
    { label: t("claude_ai"), icon: TRUST_ITEMS[2].icon },
    { label: t("trial"), icon: TRUST_ITEMS[3].icon },
  ];

  return (
    <section
      aria-label="Supported licensing authorities and platform trust signals"
      className="bg-white border-b border-[#e2e8f0] px-6 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-center text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.18em] mb-7">
            {t("authority_text")}
          </p>

          {/* Authority chips */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            {TRUST_AUTHORITIES.map(({ flag, abbr, country, href }, i) => (
              <motion.div
                key={abbr}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.055, ease: "easeOut" }}
              >
                <Link
                  href={href}
                  className="flex items-center gap-2 border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#1a56a0]/30 hover:shadow-sm transition-all rounded-full px-4 py-2"
                >
                  <span className="text-sm leading-none" aria-hidden="true">{flag}</span>
                  <span className="text-xs font-bold text-[#1a56a0]">{abbr}</span>
                  <span className="text-xs text-[#64748b] hidden sm:inline">{country}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Trust divider + trust items */}
          <div className="border-t border-[#f1f5f9] pt-7">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {trustItems.map(({ label, icon }, i) => (
                <motion.div
                  key={label}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
                  className="flex items-center gap-2 text-[#64748b]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4 text-[#1a56a0] flex-shrink-0" aria-hidden="true">
                    {icon}
                  </svg>
                  <span className="text-xs font-medium">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Create your free account",
    desc: "Register in under 3 minutes. No credit card required. Choose your country, profession, and licensing authority.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    ),
    color: "#dbeafe",
    iconColor: "#1a56a0",
  },
  {
    step: "02",
    title: "Add your CME activities & licenses",
    desc: "Log completed activities, upload certificates, and add your medical license. Our AI verifies and tracks everything automatically.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    ),
    color: "#dcfce7",
    iconColor: "#16a34a",
  },
  {
    step: "03",
    title: "Track compliance & download your report",
    desc: "See your compliance status in real time. Download your official PDF report for QCHP, SCFHS, DHA, and all GCC authorities.",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    ),
    color: "#fef9c3",
    iconColor: "#d97706",
  },
];

function HowItWorks() {
  const reduced = useReducedMotion();
  return (
    <section className="bg-[#f8fafc] border-y border-[#e2e8f0] px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Get started in minutes</p>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
            How Hayya Med Pro works
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-lg leading-relaxed">
            Three simple steps — and you have a complete, accurate picture of your compliance status.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-[#e2e8f0] via-[#1a56a0]/20 to-[#e2e8f0]" aria-hidden="true" />

          {HOW_IT_WORKS_STEPS.map(({ step, title, desc, icon, color, iconColor }, i) => (
            <motion.div
              key={step}
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step circle */}
              <div className="relative mb-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={1.7} className="w-8 h-8" aria-hidden="true">
                    {icon}
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1a56a0] flex items-center justify-center shadow-md">
                  <span className="text-white text-[9px] font-bold">{step}</span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-[#0f1f3d] mb-2 leading-snug">{title}</h3>
              <p className="text-sm text-[#64748b] leading-relaxed max-w-[220px]">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <FadeUp delay={0.3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Register free — no card required
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 border border-[#e2e8f0] text-[#64748b] px-7 py-3.5 rounded-xl font-semibold text-sm hover:border-[#1a56a0]/30 hover:text-[#1a56a0] hover:bg-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
            See live demo
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const t = useTranslations("features");
  const BADGE_KEYS = ["Core", "Core", "Pro", "Core", "Employer", "Pro"] as const;
  const featureKeys = [
    { titleKey: "cme_wallet_title", descKey: "cme_wallet_desc" },
    { titleKey: "license_wallet_title", descKey: "license_wallet_desc" },
    { titleKey: "hayya_ai_title", descKey: "hayya_ai_desc" },
    { titleKey: "analytics_title", descKey: "analytics_desc" },
    { titleKey: "employer_title", descKey: "employer_desc" },
    { titleKey: "pdf_title", descKey: "pdf_desc" },
  ];
  const badgeLabel: Record<string, string> = {
    Core: t("badge_core"),
    Pro: t("badge_pro"),
    Employer: t("badge_employer"),
  };

  return (
    <section id="features" className="px-6 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">{t("section_label")}</p>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
            {t("section_title")}
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-lg leading-relaxed">
            {t("section_subtitle")}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon }, i) => {
            const badge = BADGE_KEYS[i];
            const title = t(featureKeys[i].titleKey as Parameters<typeof t>[0]);
            const desc = t(featureKeys[i].descKey as Parameters<typeof t>[0]);
            return (
            <motion.div
              key={featureKeys[i].titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="h-full">
                <motion.div
                  className="group h-full bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0] cursor-default"
                  whileHover={{
                    borderColor: "rgba(26,86,160,0.3)",
                    boxShadow: "0 8px 40px rgba(26,86,160,0.08), 0 0 0 1px rgba(26,86,160,0.1)",
                    backgroundColor: "#ffffff",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-[#e8f0fe] text-[#1a56a0] flex items-center justify-center"
                      whileHover={{ backgroundColor: "#1a56a0", color: "#ffffff", scale: 1.08 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
                        {icon}
                      </svg>
                    </motion.div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${BADGE_COLORS[badge]}`}>{badgeLabel[badge]}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3d] mb-2">{title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
                </motion.div>
              </TiltCard>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Vision + Mission ──────────────────────────────────────────────────────────
function VisionMission() {
  const t = useTranslations("vision");
  const stats = [
    { n: 7, suffix: "", label: t("stat_countries") },
    { n: 8, suffix: "", label: t("stat_authorities") },
    { n: 3, suffix: " min", label: t("stat_setup") },
    { n: 100, suffix: "%", label: t("stat_free") },
  ];

  const trust = [t("trust_1"), t("trust_2"), t("trust_3")];

  return (
    <section className="bg-[#0f1f3d] px-6 py-20 overflow-hidden relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(26,86,160,0.2) 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: vision + mission */}
          <FadeUp>
            <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-6">{t("label")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8 leading-tight">
              {t("title")}
            </h2>

            <div className="mb-7">
              <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest mb-2">{t("vision_label")}</p>
              <p className="text-white/65 text-base leading-relaxed">
                {t("vision_text")}
              </p>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest mb-2">{t("mission_label")}</p>
              <p className="text-white/65 text-base leading-relaxed">
                {t("mission_text")}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-white/8">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t("brand_name")}</p>
                <p className="text-xs text-white/30">{t("brand_tagline")}</p>
              </div>
            </div>
          </FadeUp>

          {/* Right: stats + trust */}
          <FadeUp delay={0.14}>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map(({ n, suffix, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white/[0.05] border border-white/8 rounded-2xl p-6 text-center"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
                >
                  <p className="text-4xl font-bold text-white tabular-nums mb-2">
                    <AnimatedCounter target={n} suffix={suffix} />
                  </p>
                  <p className="text-xs text-white/60 leading-tight">{label}</p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              {trust.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[#4ade80] text-sm mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-sm text-white/65 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── AI Demo + Countries ───────────────────────────────────────────────────────
function AIDemo() {
  const t = useTranslations("ai_demo");
  const locale = useLocale();
  const chatMessages = [
    { role: "user", text: t("chat_q1") },
    { role: "ai",   text: t("chat_a1") },
    { role: "user", text: t("chat_q2") },
    { role: "ai",   text: t("chat_a2") },
  ];
  const [visible, setVisible] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chatRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const tick = () => { i++; setVisible(i); if (i < CHAT_MESSAGES.length) setTimeout(tick, 900); };
    setTimeout(tick, 400);
  }, [inView]);

  return (
    <section id="ai" className="bg-[#060d1f] px-6 py-20 overflow-hidden relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 65% 45%, rgba(26,86,160,0.14) 0%, transparent 50%)" }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-3">{t("label")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
            {t("title")}<br className="hidden sm:block" /> {t("title_cont")}
          </h2>
          <p className="text-white/62 max-w-lg mx-auto text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* AI chat demo */}
          <FadeUp>
            <motion.div
              ref={chatRef}
              className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 space-y-3.5 shadow-2xl shadow-black/40"
              whileHover={{ borderColor: "rgba(96,165,250,0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 pb-3 border-b border-white/6">
                <span className="w-2 h-2 rounded-full bg-[#4ade80]" style={{ animation: "pulse 2s infinite" }} aria-hidden="true" />
                <span className="text-xs text-white/30 font-medium">{t("assistant_label")}</span>
                <span className="ms-auto text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Gemini Flash Lite</span>
              </div>

              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={visible > i ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex ${
                    msg.role === "user"
                      ? (locale === "ar" ? "justify-start" : "justify-end")
                      : (locale === "ar" ? "justify-end" : "justify-start")
                  }`}
                >
                  <div className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1a56a0] text-white"
                      : "bg-white/7 text-white/70 border border-white/6"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {visible < chatMessages.length && (
                <div className={`flex ${locale === "ar" ? "justify-end" : "justify-start"}`}>
                  <div className="bg-white/7 border border-white/6 rounded-xl px-4 py-3 flex items-center gap-1.5">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 bg-white/30 rounded-full" style={{ animation: `bounce 1s ease-in-out ${d}ms infinite` }} aria-hidden="true" />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-white/5">
                <div className="bg-white/4 border border-white/8 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                  <span className="text-sm text-white/18 flex-1">{t("ask_placeholder")}</span>
                  <span className="text-[10px] text-white/20 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">{t("pro_badge")}</span>
                </div>
              </div>
            </motion.div>

            <div className="mt-4 flex items-center gap-2 text-xs text-white/25 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]/50" aria-hidden="true" />
              {t("footer_text")}
            </div>
          </FadeUp>

          {/* GCC countries */}
          <FadeUp delay={0.12}>
            <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest mb-4">{t("gcc_coverage")}</p>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {COUNTRIES.map(({ name, body, cycle, flag, href }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.06 + i * 0.05 }}
                >
                  <Link href={href}>
                    <motion.div
                      className="bg-white/[0.04] border border-white/8 rounded-xl p-3.5"
                      whileHover={{ borderColor: "rgba(96,165,250,0.25)", backgroundColor: "rgba(255,255,255,0.06)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base leading-none">{flag}</span>
                        <span className="text-[10px] font-bold text-[#60a5fa] bg-[#60a5fa]/10 px-1.5 py-0.5 rounded">{body}</span>
                      </div>
                      <p className="text-sm font-semibold text-white/80 mb-0.5">{name}</p>
                      <p className="text-[11px] text-white/30">{cycle}</p>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.41 }}
                className="bg-white/[0.02] border border-dashed border-white/8 rounded-xl p-3.5"
              >
                <p className="text-xs font-semibold text-white/22 mb-0.5">{t("more_coming")}</p>
                <p className="text-[11px] text-white/15">{t("more_coming_countries")}</p>
              </motion.div>
            </div>
            <Link href="/countries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors">
              {t("compare_link")}
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Employer section ──────────────────────────────────────────────────────────
function EmployerSection() {
  const t = useTranslations("employer");

  const capabilities = [
    t("cap_1"), t("cap_2"), t("cap_3"), t("cap_4"), t("cap_5"),
  ];

  const staffRows = [
    { name: "Dr. Sarah Al-Mansoori", role: t("role_cardio"),     pct: 82,  status: "on_track" },
    { name: "Dr. Ahmed Khalid",      role: t("role_emergency"),  pct: 45,  status: "at_risk" },
    { name: "Nurse Fatima Hassan",   role: t("role_icu"),        pct: 100, status: "compliant" },
    { name: "Dr. Omar Saleh",        role: t("role_pediatrics"), pct: 20,  status: "non_compliant" },
  ];

  const statusStyle: Record<string, { bar: string; badge: string; label: string }> = {
    compliant:     { bar: "bg-[#16a34a]", badge: "bg-[#dcfce7] text-[#16a34a]", label: t("status_compliant") },
    on_track:      { bar: "bg-[#1a56a0]", badge: "bg-[#e8f0fe] text-[#1a56a0]", label: t("status_on_track") },
    at_risk:       { bar: "bg-[#d97706]", badge: "bg-[#fff7ed] text-[#d97706]", label: t("status_at_risk") },
    non_compliant: { bar: "bg-[#dc2626]", badge: "bg-[#fef2f2] text-[#dc2626]", label: t("status_non_compliant") },
  };

  return (
    <section className="bg-[#f0f6ff] border-y border-[#d0e4fa] px-6 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <FadeUp>
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-4">{t("label")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight">
            {t("title")}
          </h2>
          <p className="text-[#64748b] text-base leading-relaxed mb-6">{t("subtitle")}</p>
          <ul className="space-y-2.5 mb-7">
            {capabilities.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm text-[#374151]">
                <span className="w-4 h-4 rounded-full bg-[#1a56a0] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {c}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <Link href="/employers" className="inline-block bg-[#1a56a0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/20">
              {t("cta_features")}
            </Link>
            <Link href="/pricing#employer" className="inline-block border border-[#c7daf7] text-[#1a56a0] bg-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
              {t("cta_pricing")}
            </Link>
            <Link href="/request-demo" className="inline-block text-sm font-semibold text-[#1a56a0] hover:underline py-2.5">
              {t("cta_demo")}
            </Link>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <motion.div
            className="bg-white rounded-2xl border border-[#e2e8f0] shadow-lg shadow-blue-900/8 overflow-hidden"
            whileHover={{ boxShadow: "0 20px 60px rgba(26,86,160,0.12)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 py-3.5 border-b border-[#e2e8f0] flex items-center justify-between">
              <p className="text-sm font-semibold text-[#0f1f3d]">{t("dashboard_title")}</p>
              <span className="text-xs text-[#64748b]">{t("dashboard_org")}</span>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {staffRows.map(({ name, role, pct, status }, i) => {
                const s = statusStyle[status];
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    className="px-5 py-3.5 flex items-center gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-xs font-bold text-[#1a56a0] flex-shrink-0">
                      {name.split(" ")[1]?.[0] ?? name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0f1f3d] truncate">{name}</p>
                      <p className="text-[10px] text-[#64748b]">{role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-14 bg-[#f1f5f9] rounded-full h-1.5 hidden sm:block">
                        <div className={`h-1.5 rounded-full ${s.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Hayya Med Pro transformed how I track my CME. I used to spend hours searching for my certificates before renewal. Now everything is in one place and my QCHP renewal was the smoothest it has ever been.",
    name: "Dr. Ahmed Al-Rashidi",
    role: "Cardiologist",
    org: "Hamad Medical Corporation, Qatar",
    initials: "AR",
    color: "#dbeafe",
    textColor: "#1a56a0",
    country: "🇶🇦",
  },
  {
    quote: "As a nurse managing CPD across two hospitals, I was always worried about compliance gaps. The AI gap analysis showed me exactly what I was missing three months before my renewal deadline. Incredible tool.",
    name: "Fatima Al-Mansouri",
    role: "ICU Senior Nurse",
    org: "King Faisal Specialist Hospital, Saudi Arabia",
    initials: "FM",
    color: "#dcfce7",
    textColor: "#16a34a",
    country: "🇸🇦",
  },
  {
    quote: "I manage compliance for 120 staff across our clinic group. The employer dashboard gives me a real-time view of every doctor and nurse's status. We went from manual spreadsheets to full automation in one week.",
    name: "Dr. Sarah Hassan",
    role: "Chief Medical Officer",
    org: "Medcare Hospitals Group, UAE",
    initials: "SH",
    color: "#fef9c3",
    textColor: "#d97706",
    country: "🇦🇪",
  },
];

function Testimonials() {
  const reduced = useReducedMotion();
  return (
    <section className="bg-white px-6 py-20 border-t border-[#e2e8f0]">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Trusted by GCC healthcare professionals</p>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
            Doctors and nurses love Hayya Med Pro
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-lg leading-relaxed">
            From Doha to Dubai — healthcare professionals across the GCC trust us with their compliance.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, org, initials, color, textColor, country }, i) => (
            <motion.div
              key={name}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 hover:border-[#1a56a0]/20 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} className="w-4 h-4 text-[#f59e0b]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-[#374151] leading-relaxed flex-1 mb-6">
                &ldquo;{quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ backgroundColor: color, color: textColor }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0f1f3d] flex items-center gap-1.5">
                    {name} <span aria-hidden="true">{country}</span>
                  </p>
                  <p className="text-xs text-[#64748b] truncate">{role} · {org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <FadeUp delay={0.2} className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-[#e2e8f0] pt-12">
          {[
            { n: "7+", label: "GCC countries supported" },
            { n: "8", label: "licensing authorities" },
            { n: "3 min", label: "average setup time" },
            { n: "100%", label: "free to start" },
          ].map(({ n, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-[#1a56a0] mb-1">{n}</p>
              <p className="text-xs text-[#64748b] font-medium">{label}</p>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

// ── Mobile App Preview ────────────────────────────────────────────────────────
function MobileAppPreview() {
  const reduced = useReducedMotion();
  const appFeatures = [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />, title: "Offline access", desc: "Log CME activities without internet — syncs when back online" },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />, title: "Push reminders", desc: "License expiry and CME deadline alerts before it's too late" },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />, title: "Download PDF report", desc: "Official compliance report available instantly from your phone" },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />, title: "AI assistant on mobile", desc: "Ask compliance questions and get instant, accurate answers" },
  ];

  return (
    <section className="bg-[#060d1f] px-6 py-20 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(26,86,160,0.18) 0%, transparent 55%)" }} aria-hidden="true" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: Copy */}
          <FadeUp>
            <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-4">Available on all devices</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5 leading-tight">
              Your compliance platform,<br className="hidden sm:block" /> in your pocket
            </h2>
            <p className="text-white/62 text-base leading-relaxed mb-8">
              Install Hayya Med Pro as an app on iOS or Android — no App Store required. Works offline. Push notifications. Full CME tracking from your phone.
            </p>

            <div className="space-y-5 mb-10">
              {appFeatures.map(({ icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1a56a0]/30 border border-[#1a56a0]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth={1.8} className="w-4 h-4" aria-hidden="true">{icon}</svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Install buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("hmp:open-download")); }}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0f1f3d] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download App — Free
              </button>
              <a href="/demo" className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/80 px-6 py-3 rounded-xl font-semibold text-sm hover:border-white/30 hover:text-white transition-colors">
                See live demo
              </a>
            </div>
          </FadeUp>

          {/* Right: Phone mockup (CSS only) */}
          <FadeUp delay={0.15}>
            <div className="flex justify-center">
              <motion.div
                animate={reduced ? {} : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Phone frame */}
                <div className="w-[240px] sm:w-[270px] bg-[#0f1f3d] rounded-[2.5rem] border-2 border-white/10 shadow-2xl shadow-black/60 overflow-hidden" style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                  {/* Notch */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-20 h-5 bg-[#060d1f] rounded-full" aria-hidden="true" />
                  </div>

                  {/* Screen content */}
                  <div className="bg-[#f8fafc] mx-2 rounded-2xl overflow-hidden" style={{ minHeight: 420 }}>
                    {/* App header */}
                    <div className="bg-[#1a56a0] px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded bg-white/20 flex items-center justify-center">
                            <span className="text-white text-[8px] font-bold">H</span>
                          </div>
                          <span className="text-white text-[10px] font-bold">Hayya Med Pro</span>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-[#4ade80]/20 flex items-center justify-center">
                          <span className="text-[#4ade80] text-[6px]">●</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-[9px]">Dr. Ahmed Al-Rashidi · QCHP</p>
                    </div>

                    {/* Compliance ring */}
                    <div className="flex flex-col items-center py-4 bg-white border-b border-[#e2e8f0]">
                      <div className="relative w-20 h-20">
                        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90" aria-hidden="true">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                          <circle cx="40" cy="40" r="32" fill="none" stroke="#1a56a0" strokeWidth="8" strokeDasharray={`${2 * Math.PI * 32 * 0.65} ${2 * Math.PI * 32}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-[#0f1f3d]">65%</span>
                          <span className="text-[7px] text-[#64748b]">CME</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-[#64748b] mt-1">52 / 80 credits · QCHP</p>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-1.5 p-2">
                      {[
                        { label: "Add CME", color: "#dbeafe", text: "#1a56a0" },
                        { label: "Download PDF", color: "#dcfce7", text: "#16a34a" },
                        { label: "AI Chat", color: "#f3e8ff", text: "#7c3aed" },
                        { label: "Licenses", color: "#fef9c3", text: "#d97706" },
                      ].map(({ label, color, text }) => (
                        <div key={label} className="rounded-xl p-2 flex items-center justify-center text-center" style={{ backgroundColor: color }}>
                          <span className="text-[8px] font-semibold" style={{ color: text }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recent activity */}
                    <div className="px-2 pb-2">
                      <p className="text-[7px] font-semibold text-[#64748b] uppercase tracking-wide mb-1 px-1">Recent</p>
                      {["Cardiology Conference · 8 crd", "Online CME Module · 2 crd"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white border border-[#e2e8f0] mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" aria-hidden="true" />
                          <span className="text-[7px] text-[#374151]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="flex justify-center py-2">
                    <div className="w-16 h-1 bg-white/20 rounded-full" aria-hidden="true" />
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={reduced ? {} : { y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-8 top-16 bg-white rounded-xl px-3 py-2 shadow-xl border border-[#e2e8f0]"
                >
                  <p className="text-[9px] font-bold text-[#16a34a]">✓ Compliant</p>
                  <p className="text-[8px] text-[#64748b]">QCHP 2026</p>
                </motion.div>

                <motion.div
                  animate={reduced ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -left-10 bottom-24 bg-white rounded-xl px-3 py-2 shadow-xl border border-[#e2e8f0]"
                >
                  <p className="text-[9px] font-bold text-[#1a56a0]">+8 credits</p>
                  <p className="text-[8px] text-[#64748b]">Conference added</p>
                </motion.div>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const t = useTranslations("landing_pricing");

  const plans = [
    {
      name: t("free_name"), price: t("free_price"), period: t("free_period"), highlight: false,
      features: [t("free_f1"), t("free_f2"), t("free_f3"), t("free_f4"), t("free_f5")],
      cta: t("free_cta"), href: "/register",
    },
    {
      name: t("pro_name"), price: t("pro_price"), period: t("pro_period"), highlight: true,
      features: [t("pro_f1"), t("pro_f2"), t("pro_f3"), t("pro_f4"), t("pro_f5")],
      cta: t("pro_cta"), href: "/register",
    },
    {
      name: t("employer_name"), price: t("employer_price"), period: t("employer_period"), highlight: false,
      features: [t("employer_f1"), t("employer_f2"), t("employer_f3"), t("employer_f4"), t("employer_f5")],
      cta: t("employer_cta"), href: "/pricing",
    },
  ];

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">{t("label")}</p>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#0f1f3d] tracking-tight mb-4">
            {t("title")}
          </h2>
          <p className="text-[#64748b] text-lg">{t("subtitle")}</p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map(({ name, price, period, highlight, features, cta, href }, i) => (
            <FadeUp key={name} delay={i * 0.08}>
              <motion.div
                className={`h-full rounded-2xl p-7 flex flex-col border ${
                  highlight ? "bg-[#1a56a0] border-[#1a56a0] shadow-xl shadow-blue-900/20" : "bg-white border-[#e2e8f0]"
                }`}
                whileHover={!highlight ? { boxShadow: "0 8px 40px rgba(26,86,160,0.08)", borderColor: "rgba(26,86,160,0.3)" } : {}}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-5">
                  {highlight && (
                    <span className="text-[10px] font-bold tracking-widest text-[#60a5fa] uppercase bg-white/10 px-2.5 py-1 rounded-full mb-3 inline-block">
                      {t("most_popular")}
                    </span>
                  )}
                  <p className={`text-sm font-medium mb-1 ${highlight ? "text-white/65" : "text-[#64748b]"}`}>{name}</p>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className={`text-3xl font-bold ${highlight ? "text-white" : "text-[#0f1f3d]"}`}>{price}</span>
                    <span className={`text-sm ${highlight ? "text-white/65" : "text-[#64748b]"}`}>{period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {features.map((f) => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${highlight ? "text-white/80" : "text-[#374151]"}`}>
                      <span className={highlight ? "text-[#86efac]" : "text-[#16a34a]"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={href}
                    className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                      highlight
                        ? "bg-white text-[#1a56a0] hover:bg-blue-50"
                        : "border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {cta}
                  </Link>
                </motion.div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const t = useTranslations("faq_items");
  const [open, setOpen] = useState<number | null>(null);

  const faqItems = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
    { q: t("q7"), a: t("a7") },
  ];

  return (
    <section className="bg-[#f8fafc] px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">{t("label")}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1f3d] mb-3">{t("title")}</h2>
          <p className="text-[#64748b] text-base max-w-lg mx-auto">{t("subtitle")}</p>
        </FadeUp>

        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <FadeUp key={i} delay={Math.min(i * 0.04, 0.24)}>
              <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#f8fafc] transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-semibold text-[#111] text-sm leading-snug">{item.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 text-[#64748b]"
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 pt-3 text-sm text-[#374151] leading-relaxed border-t border-[#f1f5f9]">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.28} className="mt-8 text-center">
          <p className="text-sm text-[#64748b]">
            {t("still_questions")}{" "}
            <a href="/contact" className="text-[#1a56a0] font-medium hover:underline">{t("contact_link")}</a>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Resources / Guides ─────────────────────────────────────────────────────────
function ResourcesSection() {
  const RESOURCES = [
    { title: "CME Requirements", desc: "Credits required by country and authority", href: "/cme-requirements", icon: "📋" },
    { title: "CPD Requirements", desc: "UK, Australia, and GCC CPD guide", href: "/cpd-requirements", icon: "📚" },
    { title: "Medical License Renewal", desc: "Step-by-step renewal checklist", href: "/medical-license-renewal", icon: "🔄" },
    { title: "GCC CME Comparison", desc: "QCHP vs SCFHS vs DHA side by side", href: "/gcc-cme-requirements", icon: "🇶🇦" },
    { title: "Global CME Guide", desc: "20+ countries and authorities", href: "/global-cme-requirements", icon: "🌍" },
    { title: "CME Tracker", desc: "Free CME tracking for every authority", href: "/cme-tracker", icon: "📊" },
    { title: "CME vs CPD Explained", desc: "What's the difference?", href: "/cme-vs-cpd", icon: "💡" },
    { title: "License Renewal Guide", desc: "How to renew your medical licence", href: "/guides/license-renewal", icon: "✅" },
    { title: "Compare All Countries", desc: "All 26 countries and authorities", href: "/countries", icon: "🗺️" },
  ];

  return (
    <section className="bg-white border-t border-[#e2e8f0] px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="mb-10">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-2">CME &amp; CPD Knowledge Base</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f1f3d]">Healthcare compliance guides</h2>
          <p className="text-[#64748b] text-sm mt-2 max-w-xl">
            Everything you need to understand CME requirements, CPD targets, and medical licence renewal across GCC, UK, and global markets.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESOURCES.map(({ title, desc, href, icon }, i) => (
            <FadeUp key={href} delay={Math.min(i * 0.05, 0.3)}>
              <a
                href={href}
                className="group flex items-start gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:bg-[#f0f7ff] hover:shadow-sm transition-all"
              >
                <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-[#0f1f3d] text-sm group-hover:text-[#1a56a0] transition-colors">{title}</p>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  const t = useTranslations("final_cta");

  return (
    <section className="relative bg-[#060d1f] px-6 py-24 text-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(26,86,160,0.18) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      <FadeUp className="relative z-10 max-w-2xl mx-auto">
        <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-5">{t("label")}</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
          {t("title")}
        </h2>
        <p className="text-white/65 text-lg mb-10 leading-relaxed">{t("subtitle")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <MagneticButton
            href="/register"
            className="bg-white text-[#1a56a0] px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-2xl shadow-black/35 cursor-pointer inline-block"
          >
            {t("cta_primary")}
          </MagneticButton>
          <Link href="/pricing" className="text-white/65 text-sm hover:text-white/85 transition-colors">
            {t("cta_secondary")}
          </Link>
        </div>
        <p className="text-white/50 text-xs mt-5">{t("footer_1")}</p>
        <p className="text-white/40 text-xs mt-1.5">{t("footer_2")}</p>
      </FadeUp>
    </section>
  );
}

// ── Global CSS keyframes ──────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes floatCard { 0%,100% { transform: translateY(0px) } 50% { transform: translateY(-8px) } }
  @keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition-duration: 0.01ms !important; }
  }
`;

// ── Main export ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    import("lenis").then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      let rafId: number;
      function raf(time: number) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);
      cleanup = () => { cancelAnimationFrame(rafId); lenis.destroy(); };
    });

    return () => { cleanup?.(); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen bg-white">
          <Nav />
          <main id="main-content">
            <Hero />
            <TrustSignals />
            <HowItWorks />
            <Features />
            <VisionMission />
            <AIDemo />
            <EmployerSection />
            <MobileAppPreview />
            <Testimonials />
            <Pricing />
            <FAQ />
            <ResourcesSection />
            <FinalCTA />
            <div className="text-center py-4 px-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
              <p className="text-xs text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
                Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
                Users must verify final requirements with their relevant regulatory body.
              </p>
            </div>
          </main>
        </div>
      </MotionConfig>
    </>
  );
}
