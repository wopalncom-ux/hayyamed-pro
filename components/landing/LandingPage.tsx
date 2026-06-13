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
    const COUNT = 55;
    const DIST = 95;

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

    const draw = () => {
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
          const d = Math.hypot(dx, dy);
          if (d < DIST) {
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
    draw();
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
];

const FAQ_ITEMS = [
  {
    q: "Is Hayya Med Pro free to use?",
    a: "Yes. The Free plan is free forever — it includes CME activity tracking, a compliance dashboard, and analytics. The Pro plan ($6/month, or $61.20/year — 15% off) unlocks PDF compliance reports, Hayya AI gap analysis, unlimited activity entries, and license expiry alerts.",
  },
  {
    q: "Is there a free trial for the Pro plan?",
    a: "Yes — every new account automatically receives a 14-day Pro trial. No credit card required. You can explore every Pro feature before you pay anything.",
  },
  {
    q: "Is this platform recognised by QCHP, SCFHS, or DHA?",
    a: "Hayya Med Pro is a compliance tracking tool, not a licensing authority. Your official record lives with QCHP, SCFHS, DHA, or your local authority. Our PDF reports are formatted to match what these authorities require, making submission faster — but you must always verify final requirements directly with your authority.",
  },
  {
    q: "Which countries and licensing authorities are supported?",
    a: "Qatar (QCHP), Saudi Arabia (SCFHS), UAE Dubai (DHA), UAE Abu Dhabi (DOH), Kuwait (MOH), Bahrain (NHRA), and Oman (OMSB). Additional countries are added regularly.",
  },
  {
    q: "Can my employer or hospital see my CME records?",
    a: "Only if you explicitly approve the connection. Your profile is private by default. Privacy settings give you full control over what information — if any — is visible to your employer.",
  },
  {
    q: "Is my healthcare data stored securely in the GCC?",
    a: "Yes. All data is hosted on GCP infrastructure in Doha, Qatar, encrypted at rest and in transit, and processed under Qatar's Personal Data Protection Law (PDPL). Your data never leaves the GCC region.",
  },
  {
    q: "How does Hayya AI work?",
    a: "Hayya AI (Pro feature) answers questions about your country's CME requirements, identifies gaps in your compliance profile, and suggests activities to close those gaps. It is powered by Claude AI integrated with Hayya Med Pro's compliance rule database — and always recommends verifying final requirements with your licensing authority.",
  },
];

const FOOTER_COLS = [
  {
    heading: "Platform",
    links: [
      { label: "Features", href: "/#features" },
      { label: "For Employers", href: "/employers" },
      { label: "For Training Providers", href: "/for-providers" },
      { label: "For Universities", href: "/for-universities" },
      { label: "Compliance Software", href: "/healthcare-compliance-software" },
      { label: "CME Report PDF", href: "/cme-compliance-report" },
      { label: "Pricing", href: "/pricing" },
      { label: "CME Tracker", href: "/cme-tracker" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Help & FAQ", href: "/help" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "CME by Country",
    links: [
      { label: "QCHP — Qatar", href: "/qchp" },
      { label: "SCFHS — Saudi Arabia", href: "/scfhs" },
      { label: "DHA — Dubai", href: "/dha" },
      { label: "DOH — Abu Dhabi", href: "/doh" },
      { label: "MOH — Kuwait", href: "/moh-kuwait" },
      { label: "NHRA — Bahrain", href: "/nhra" },
      { label: "OMSB — Oman", href: "/omsb" },
      { label: "Compare all countries", href: "/countries" },
      { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
      { label: "GCC renewal guide", href: "/gcc-medical-license-renewal" },
    ],
  },
  {
    heading: "CME by Profession",
    links: [
      { label: "Physicians", href: "/physician-cme" },
      { label: "Nurses", href: "/nurse-cpd" },
      { label: "Pharmacists", href: "/pharmacist-cme" },
      { label: "Dentists", href: "/dentist-cme" },
      { label: "Allied Health", href: "/allied-health-cpd" },
      { label: "CME vs CPD explained", href: "/cme-vs-cpd" },
    ],
  },
  {
    heading: "CME by Specialty",
    links: [
      { label: "Cardiology", href: "/cardiology-cme" },
      { label: "Internal Medicine", href: "/internal-medicine-cme" },
      { label: "Emergency Medicine", href: "/emergency-medicine-cme" },
      { label: "Surgery", href: "/surgery-cme" },
      { label: "Pediatrics", href: "/pediatrics-cme" },
      { label: "Radiology", href: "/radiology-cme" },
      { label: "Psychiatry", href: "/psychiatry-cme" },
      { label: "OB / Gynecology", href: "/obstetrics-gynecology-cme" },
      { label: "Anesthesia", href: "/anesthesia-cme" },
      { label: "Orthopedics", href: "/orthopedics-cme" },
      { label: "Family Medicine", href: "/family-medicine-cme" },
      { label: "Dermatology", href: "/dermatology-cme" },
      { label: "Neurology", href: "/neurology-cme" },
      { label: "Nephrology", href: "/nephrology-cme" },
      { label: "Ophthalmology", href: "/ophthalmology-cme" },
    ],
  },
  {
    heading: "Renewal Guides",
    links: [
      { label: "QCHP renewal — Qatar", href: "/qchp-renewal" },
      { label: "SCFHS renewal — Saudi Arabia", href: "/scfhs-renewal" },
      { label: "DHA renewal — Dubai", href: "/dha-renewal" },
      { label: "DOH renewal — Abu Dhabi", href: "/doh-renewal" },
      { label: "All GCC renewals", href: "/gcc-medical-license-renewal" },
    ],
  },
  {
    heading: "International",
    links: [
      { label: "Global CME requirements", href: "/global-cme-requirements" },
      { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
      { label: "UK — GMC CPD", href: "/gmc-cpd" },
      { label: "Australia — AHPRA CPD", href: "/ahpra-cpd" },
      { label: "India — NMC CME", href: "/nmc-india-cme" },
      { label: "Egypt — EMS CME", href: "/egypt-cme" },
      { label: "Jordan — JMC CME", href: "/jordan-cme" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Data Processing Agreement", href: "/legal/dpa" },
      { label: "Sign in", href: "/login" },
      { label: "Register free", href: "/register" },
    ],
  },
];

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
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
          <a href="#features" className="hover:text-[#1a56a0] transition-colors">Features</a>
          <a href="#ai" className="hover:text-[#1a56a0] transition-colors">Hayya AI</a>
          <Link href="/employers" className="hover:text-[#1a56a0] transition-colors">For Employers</Link>
          <Link href="/pricing" className="hover:text-[#1a56a0] transition-colors">Pricing</Link>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className={`text-sm transition-colors duration-300 ${scrolled ? "text-[#64748b] hover:text-[#111]" : "text-white/75 hover:text-white"}`}
          >
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/25"
            >
              Get started free
            </Link>
          </motion.div>
        </div>

        <div className="flex sm:hidden items-center gap-2">
          <Link href="/register" className="text-sm bg-[#1a56a0] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors">
            Start free
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
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
              {MOB_NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm text-[#374151] hover:text-[#1a56a0] py-3 border-b border-[#f1f5f9] last:border-0 transition-colors font-medium"
                  onClick={() => setMobileOpen(false)}
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
                  Get started free →
                </Link>
                <Link
                  href="/login"
                  className="block text-center text-sm text-[#64748b] hover:text-[#111] py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
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

  const headline = ["Your", "CME", "compliance,", "powered", "by AI."];

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
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 border border-white/10 bg-white/5 backdrop-blur-sm text-[#93c5fd] text-xs font-semibold px-4 py-2.5 rounded-full mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ animation: reduced ? "none" : "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }} aria-hidden="true" />
          Powered by Hayya Med AI · Built in Qatar&nbsp;🇶🇦
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6 text-white">
          {headline.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block mr-[0.27em] ${word === "AI." ? "text-[#60a5fa]" : ""}`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Track CME credits, manage license renewals, and generate compliance reports —
          built for healthcare professionals across Qatar and the GCC.
        </motion.p>

        {/* Authority pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.72 }}
          className="flex flex-wrap justify-center gap-x-5 gap-y-1 mb-10"
        >
          {AUTHORITIES.map((auth) => (
            <span key={auth} className="text-[11px] font-semibold text-white/22 tracking-widest uppercase">
              {auth}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.82 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <MagneticButton
            href="/register"
            className="bg-white text-[#1a56a0] px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-2xl shadow-black/30 cursor-pointer inline-block"
          >
            Start tracking for free
          </MagneticButton>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/pricing"
              className="border border-white/12 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-base hover:border-white/25 hover:bg-white/8 transition-all inline-block"
            >
              View pricing →
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-white/22 text-sm mt-3"
        >
          Free forever · No credit card required · 14-day Pro trial
        </motion.p>
      </div>

      {/* Floating dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl mx-auto mt-12"
        style={reduced ? {} : { animation: "floatCard 6s ease-in-out infinite" }}
      >
        <div
          className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl"
          style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-white/30 mb-0.5">Hayya Med Pro · QCHP Compliance</p>
              <p className="text-[11px] text-white/20">Medicine · Cardiology · Qatar</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" style={{ animation: reduced ? "none" : "pulse 2s infinite" }} aria-hidden="true" />
              ON TRACK
            </div>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-bold text-white tabular-nums">52</span>
            <span className="text-xl text-white/30 mb-0.5">/ 80 CPD credits</span>
            <span className="text-sm text-white/22 mb-0.5 ml-auto">65%</span>
          </div>
          <div className="w-full bg-white/8 rounded-full h-2 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1.4, delay: 1.2, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] h-2 rounded-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Activities logged", val: "21" },
              { label: "Avg / month", val: "5.2 crd" },
              { label: "Days remaining", val: "274" },
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

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="px-6 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Platform</p>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight">
            Everything you need for renewal readiness
          </h2>
          <p className="text-[#64748b] max-w-lg mx-auto text-lg leading-relaxed">
            Purpose-built for GCC healthcare professionals who cannot afford to miss a renewal deadline.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc, badge }, i) => (
            <motion.div
              key={title}
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
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${BADGE_COLORS[badge]}`}>{badge}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0f1f3d] mb-2">{title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Vision + Mission ──────────────────────────────────────────────────────────
function VisionMission() {
  const stats = [
    { n: 7, suffix: "", label: "GCC Countries" },
    { n: 8, suffix: "", label: "Licensing Authorities" },
    { n: 3, suffix: " min", label: "Setup time" },
    { n: 100, suffix: "%", label: "Free to start" },
  ];

  const trust = [
    "Rules sourced directly from QCHP, SCFHS, DHA, NHRA, OMSB and MOH Kuwait",
    "Healthcare data stored in Doha, Qatar — never leaves the GCC",
    "Every AI call is logged, audited, and validated against a Zod schema",
  ];

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
            <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-6">Our Purpose</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-8 leading-tight">
              The AI infrastructure for healthcare compliance
            </h2>

            <div className="mb-7">
              <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest mb-2">Vision</p>
              <p className="text-white/65 text-base leading-relaxed">
                To become the AI infrastructure that powers healthcare workforce compliance across the GCC, MENA, and global markets.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest mb-2">Mission</p>
              <p className="text-white/65 text-base leading-relaxed">
                We build AI-powered tools that eliminate compliance uncertainty for healthcare professionals. Built in Qatar, trusted across borders, powered by intelligence that understands local regulations, speaks Arabic, and never sleeps.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-white/8">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Hayya Med AI</p>
                <p className="text-xs text-white/30">Registered in Qatar&nbsp;🇶🇦 · Qatar PDPL Compliant · GCC Data Residency</p>
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
                  <p className="text-xs text-white/35 leading-tight">{label}</p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              {trust.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[#4ade80] text-sm mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-sm text-white/45 leading-relaxed">{item}</span>
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
          <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-3">Hayya AI</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
            Ask anything about your compliance.<br className="hidden sm:block" /> Get a real answer.
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-base leading-relaxed">
            Hayya AI knows your activity history, your authority&apos;s rules, and your remaining cycle time.
            Grounded answers — not generic advice.
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
                <span className="text-xs text-white/30 font-medium">Hayya AI · Compliance Assistant</span>
                <span className="ml-auto text-[10px] text-white/20 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Claude Haiku</span>
              </div>

              {CHAT_MESSAGES.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={visible > i ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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

              {visible < CHAT_MESSAGES.length && (
                <div className="flex justify-start">
                  <div className="bg-white/7 border border-white/6 rounded-xl px-4 py-3 flex items-center gap-1.5">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 bg-white/30 rounded-full" style={{ animation: `bounce 1s ease-in-out ${d}ms infinite` }} aria-hidden="true" />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-white/5">
                <div className="bg-white/4 border border-white/8 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                  <span className="text-sm text-white/18 flex-1">Ask about your compliance...</span>
                  <span className="text-[10px] text-white/20 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">Pro</span>
                </div>
              </div>
            </motion.div>

            <div className="mt-4 flex items-center gap-2 text-xs text-white/25 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]/50" aria-hidden="true" />
              Available on Pro plan · Powered by Claude AI · GCC rules database
            </div>
          </FadeUp>

          {/* GCC countries */}
          <FadeUp delay={0.12}>
            <p className="text-[10px] font-bold text-[#60a5fa] uppercase tracking-widest mb-4">GCC Coverage</p>
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
                <p className="text-xs font-semibold text-white/22 mb-0.5">More coming</p>
                <p className="text-[11px] text-white/15">UK · India · Australia · EU</p>
              </motion.div>
            </div>
            <Link href="/countries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors">
              Compare all GCC CME requirements →
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Employer section ──────────────────────────────────────────────────────────
function EmployerSection() {
  const capabilities = [
    "Real-time staff compliance overview",
    "Assign CME tasks with credit targets",
    "Send compliance reminders to individuals",
    "Export team compliance report as PDF",
    "Professionals control their own privacy settings",
  ];

  const staffRows = [
    { name: "Dr. Sarah Al-Mansoori", role: "Cardiologist", pct: 82, status: "on_track" },
    { name: "Dr. Ahmed Khalid", role: "Emergency Med.", pct: 45, status: "at_risk" },
    { name: "Nurse Fatima Hassan", role: "ICU Nursing", pct: 100, status: "compliant" },
    { name: "Dr. Omar Saleh", role: "Pediatrics", pct: 20, status: "non_compliant" },
  ];

  const statusStyle: Record<string, { bar: string; badge: string; label: string }> = {
    compliant:     { bar: "bg-[#16a34a]", badge: "bg-[#dcfce7] text-[#16a34a]", label: "Compliant" },
    on_track:      { bar: "bg-[#1a56a0]", badge: "bg-[#e8f0fe] text-[#1a56a0]", label: "On Track" },
    at_risk:       { bar: "bg-[#d97706]", badge: "bg-[#fff7ed] text-[#d97706]", label: "At Risk" },
    non_compliant: { bar: "bg-[#dc2626]", badge: "bg-[#fef2f2] text-[#dc2626]", label: "Non-Compliant" },
  };

  return (
    <section className="bg-[#f0f6ff] border-y border-[#d0e4fa] px-6 py-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <FadeUp>
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-4">For Employers</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight">
            Compliance visibility for the whole team — without the spreadsheets.
          </h2>
          <p className="text-[#64748b] text-base leading-relaxed mb-6">
            Hospitals, clinics, and health networks get a live view of staff renewal status
            — with each professional keeping full control of their own data.
          </p>
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
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/employers" className="inline-block bg-[#1a56a0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/20">
              See employer features →
            </Link>
            <Link href="/pricing#employer" className="inline-block border border-[#c7daf7] text-[#1a56a0] bg-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
              View employer pricing →
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
              <p className="text-sm font-semibold text-[#0f1f3d]">Staff Compliance Overview</p>
              <span className="text-xs text-[#94a3b8]">Hamad General Hospital</span>
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
                      <p className="text-[10px] text-[#94a3b8]">{role}</p>
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

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Free", price: "$0", period: "Forever free", highlight: false,
      features: ["CME wallet & tracking", "Compliance dashboard", "Analytics & charts", "Employer linking", "License wallet"],
      cta: "Get started free", href: "/register",
    },
    {
      name: "Pro", price: "$6", period: "/month · $61.20/year", highlight: true,
      features: ["Everything in Free", "PDF compliance reports", "Hayya AI chat", "License expiry alerts", "Priority support"],
      cta: "Get Pro", href: "/pricing",
    },
    {
      name: "Employer", price: "From $50", period: "/month", highlight: false,
      features: ["Everything in Pro (per staff)", "Staff compliance dashboard", "Task assignment & reminders", "Bulk PDF export", "Up to 200 staff"],
      cta: "View employer plans", href: "/pricing",
    },
  ];

  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-[#0f1f3d] tracking-tight mb-4">
            Start free. Upgrade when you need more.
          </h2>
          <p className="text-[#64748b] text-lg">CME tracking is free forever. Upgrade for PDF reports, Hayya AI, and employer features.</p>
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
                      Most Popular
                    </span>
                  )}
                  <p className={`text-sm font-medium mb-1 ${highlight ? "text-white/65" : "text-[#64748b]"}`}>{name}</p>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className={`text-3xl font-bold ${highlight ? "text-white" : "text-[#0f1f3d]"}`}>{price}</span>
                    <span className={`text-sm ${highlight ? "text-white/45" : "text-[#94a3b8]"}`}>{period}</span>
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
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#f8fafc] px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <FadeUp className="text-center mb-12">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1f3d] mb-3">Common questions</h2>
          <p className="text-[#64748b] text-base max-w-lg mx-auto">From healthcare professionals across the GCC.</p>
        </FadeUp>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <FadeUp key={item.q} delay={Math.min(i * 0.04, 0.24)}>
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
            Still have questions?{" "}
            <a href="/contact" className="text-[#1a56a0] font-medium hover:underline">Contact our team →</a>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
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
        <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-5">Get started today</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
          Don&apos;t let your license lapse.
        </h2>
        <p className="text-white/40 text-lg mb-10 leading-relaxed">
          Join healthcare professionals across Qatar and the GCC who track their CME compliance with Hayya Med Pro — powered by Hayya Med AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <MagneticButton
            href="/register"
            className="bg-white text-[#1a56a0] px-10 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-2xl shadow-black/35 cursor-pointer inline-block"
          >
            Create your free account
          </MagneticButton>
          <Link href="/pricing" className="text-white/50 text-sm hover:text-white/75 transition-colors">
            See all plans →
          </Link>
        </div>
        <p className="text-white/20 text-xs mt-5">No credit card · Free forever · Cancel anytime</p>
        <p className="text-white/14 text-xs mt-1.5">Powered by Hayya Med AI · Registered in Qatar&nbsp;🇶🇦</p>
      </FadeUp>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#f8fafc] border-t border-[#e2e8f0] px-6 pt-12 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center" aria-hidden="true">
                <span className="text-white text-xs font-bold">H</span>
              </div>
              <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed max-w-[180px] mb-3">
              CME tracking and licensing compliance for GCC healthcare professionals.
            </p>
            <p className="text-[11px] text-[#94a3b8] leading-relaxed">
              Powered by{" "}
              <span className="font-semibold text-[#64748b]">Hayya Med AI</span>
              <br />
              Registered in Qatar&nbsp;🇶🇦
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-[#94a3b8] hover:text-[#1a56a0] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#e2e8f0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <p className="text-xs text-[#94a3b8]">© {new Date().getFullYear()} Hayya Med AI. All rights reserved.</p>
            <span className="hidden sm:inline text-[#e2e8f0]">·</span>
            <p className="hidden sm:block text-xs text-[#94a3b8]">Registered in Qatar&nbsp;🇶🇦</p>
          </div>
          <p className="text-xs text-[#94a3b8] text-center max-w-xl">
            Supports CME/CPD tracking. Does not issue licenses. Verify requirements with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait.
          </p>
        </div>
      </div>
    </footer>
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-[#1a56a0] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <div className="min-h-screen bg-white">
          <Nav />
          <main id="main-content">
            <Hero />
            <Features />
            <VisionMission />
            <AIDemo />
            <EmployerSection />
            <Pricing />
            <FAQ />
            <FinalCTA />
          </main>
          <Footer />
        </div>
      </MotionConfig>
    </>
  );
}
