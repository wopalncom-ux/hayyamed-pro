import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Features — CME Tracking & Compliance Software for GCC | Hayya Med Pro",
  description:
    "Every feature of Hayya Med Pro — CME wallet, PDF compliance reports, Hayya AI, multi-license tracking, employer dashboard, and certificate storage. Built for QCHP, SCFHS, DHA, and all GCC licensing authorities.",
  keywords: [
    "CME tracking software features",
    "CPD tracking platform GCC",
    "CME compliance software features",
    "healthcare compliance tracking features",
    "QCHP CME software",
    "SCFHS CME tracker",
    "GCC medical license compliance features",
    "Hayya Med Pro features",
    "CME wallet software",
    "employer healthcare compliance dashboard",
  ],
  openGraph: {
    title: "Features — Hayya Med Pro CME & CPD Compliance Platform",
    description: "Every feature of Hayya Med Pro — CME wallet, PDF reports, AI compliance chat, employer dashboard, and certificate storage for GCC healthcare professionals.",
    url: `${APP_URL}/features`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/features` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What CME tracking features are free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Free plan includes full CME wallet tracking (unlimited in scope, capped at activity entries per our fair-use limit), compliance dashboard, analytics, license wallet, and employer linking. The core compliance tracking capability is free forever.",
      },
    },
    {
      "@type": "Question",
      name: "What does the Pro plan add over Free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pro adds: PDF compliance reports (one-click QCHP/SCFHS/DHA-formatted), Hayya AI compliance chat, license expiry email alerts at 90/60/30 days, behind-pace weekly alerts, unlimited CME activity entries, and multi-license tracking (e.g., QCHP + SCFHS simultaneously).",
      },
    },
    {
      "@type": "Question",
      name: "Can hospitals and employers use Hayya Med Pro for their whole team?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Employer plan gives hospital HR directors and compliance managers a real-time staff compliance dashboard, task assignment, bulk PDF export, and compliance reminders — while each professional retains full privacy control over their individual data.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC licensing authorities are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All 7 GCC licensing authorities: QCHP (Qatar), SCFHS (Saudi Arabia), DHA (Dubai), DOH (Abu Dhabi), MOH Kuwait, NHRA (Bahrain), and OMSB (Oman). Credit targets, cycle lengths, category caps, and accepted accreditors are all sourced directly from each authority's official guidelines.",
      },
    },
  ],
};

// ── Feature data ──────────────────────────────────────────────────────────────

const CORE_FEATURES = [
  {
    title: "CME Wallet",
    desc: "Log every conference, workshop, online course, and journal activity. Auto-enforces category caps, credit conversion factors, and minimum requirements per authority. Supports ACCME, EACCME, ANCC, ACPE, Royal College, and GCC-specific accreditors.",
    details: ["Category caps enforced automatically", "All major accreditors supported", "Attach certificate PDF to each entry", "Edit or delete entries at any time"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    ),
  },
  {
    title: "Compliance Dashboard",
    desc: "Real-time compliance ring showing percentage complete, credits earned vs. required, days remaining in cycle, and compliance status (On Track / At Risk / Non-Compliant). Computed directly from your logged activities against your authority's rules.",
    details: ["Visual compliance ring with percentage", "Days remaining countdown", "At-risk alert threshold configurable", "Updates instantly when you log activities"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    ),
  },
  {
    title: "License Wallet",
    desc: "Store and track all your GCC medical licenses in one place. Visual countdown to each expiry date. Supports physicians, nurses, pharmacists, dentists, and allied health professionals across all 7 GCC authorities.",
    details: ["Multi-license support (QCHP + SCFHS + DHA)", "Expiry countdown per license", "Profession-specific credit requirements", "Link each license to its CME wallet"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
    ),
  },
  {
    title: "CME Analytics",
    desc: "Monthly credit pace chart, projected completion date, category breakdown by type, and gap analysis. See exactly where you are in the cycle and whether your current pace will reach the target.",
    details: ["Monthly credit pace chart", "Projected completion date", "Category breakdown (Category 1 / 2 / 3)", "Gap analysis by credit type"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    ),
  },
  {
    title: "Certificate Storage",
    desc: "Upload completion certificates as PDFs to each CME activity entry. Stored securely in a private GCS bucket — never publicly accessible. Generate a signed URL for sharing on demand, valid for 1 hour.",
    details: ["Private GCS bucket storage", "Signed URL access (1-hour expiry)", "PDF, JPG, PNG supported", "Path traversal protection on all uploads"],
    icon: (
      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>
    ),
  },
  {
    title: "Employer Linking",
    desc: "Connect your profile to your hospital or clinic. You control visibility: share only your compliance status (compliant / at-risk / non-compliant) — or keep everything private. Your employer never sees individual CME activities without your explicit permission.",
    details: ["Professional controls all visibility settings", "Share compliance status only (not activity detail)", "Accept or reject employer link requests", "Disconnect at any time"],
    icon: (
      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
    ),
  },
];

const PRO_FEATURES = [
  {
    title: "PDF Compliance Reports",
    desc: "One-click PDF report showing all CME activities, credits earned, compliance status, and authority-specific formatting. Formatted to match what QCHP, SCFHS, DHA, and other GCC authorities require for renewal submission.",
    details: ["Authority-specific PDF formatting", "All activities listed with dates and credits", "Compliance status summary on cover page", "Download immediately — no waiting"],
    icon: (
      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /><line x1="9" y1="11" x2="15" y2="11" /></>
    ),
    highlight: true,
  },
  {
    title: "Hayya AI — Compliance Chat",
    desc: "Ask Hayya AI anything about your CME status. \"Am I on track for my QCHP renewal?\" \"Which categories do I still need?\" \"If I attend one more conference, will I be compliant?\" Answers grounded in your actual activity history and your authority's current rules.",
    details: ["Powered by Claude AI (Anthropic)", "Grounded in your logged activities", "GCC compliance rules database", "Every answer includes source authority"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    ),
    highlight: true,
  },
  {
    title: "License Expiry Alerts",
    desc: "Automated email alerts at 90, 60, and 30 days before each license renewal deadline — and a final 7-day urgent alert. Never miss a renewal because you forgot the date.",
    details: ["90/60/30/7-day email alerts", "Per-license alerts (QCHP, SCFHS, DHA separately)", "Behind-pace alerts (if monthly credit rate is too low)", "One-click unsubscribe from each alert type"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    ),
  },
  {
    title: "Multi-License Tracking",
    desc: "Track QCHP, SCFHS, DHA, and your home-country license simultaneously from a single dashboard. Each license maintains its own CME wallet with authority-specific credit targets and category caps.",
    details: ["Unlimited licenses on Pro plan", "Each license: own wallet, own compliance ring", "Cross-license activity credit allocation", "Ideal for physicians with multiple GCC licenses"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
    ),
  },
  {
    title: "Unlimited Activity Entries",
    desc: "Log as many CME activities as your renewal cycle requires — no artificial cap. The Free plan has a fair-use limit; Pro removes it entirely.",
    details: ["No cap on logged activities", "Bulk import coming soon", "Retroactive entry for past activities", "Full edit and delete history"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  {
    title: "Priority Support",
    desc: "Pro and Employer subscribers receive priority support with a guaranteed 24-hour response time for compliance questions, account issues, and technical support. Free plan has community support.",
    details: ["24-hour response SLA", "Compliance question support", "Account and billing support", "Email + in-app support channels"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    ),
  },
];

const EMPLOYER_FEATURES = [
  {
    title: "Staff Compliance Dashboard",
    desc: "Real-time view of compliance status for every member of your team — sorted by compliance status, profession, department, or renewal date. See who is compliant, on track, at risk, or non-compliant at a glance.",
    details: ["Filter by department, profession, authority", "Sort by compliance status or renewal date", "Bulk actions on selected staff members", "Export full compliance report as PDF"],
    icon: (
      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
    ),
  },
  {
    title: "CME Task Assignment",
    desc: "Assign required CME activities to individual staff or entire departments. Set credit targets, deadlines, and required accreditor types. Staff receive in-app and email notification of assigned tasks.",
    details: ["Assign to individual or department", "Set credit target and deadline", "Optional: specify accreditor type required", "Track completion status in real time"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    ),
  },
  {
    title: "Bulk PDF Export",
    desc: "Download a compliance report PDF for any individual staff member, or export a batch report for the entire team. Reports are formatted for JCI and CBAHI hospital accreditation review.",
    details: ["Single staff member PDF report", "Batch export for entire department", "JCI/CBAHI accreditation-ready format", "Includes compliance status, credits, and dates"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    ),
  },
  {
    title: "Compliance Reminders",
    desc: "Send renewal reminder emails to individual staff members or groups who are behind on credits or approaching expiry. Reminders are sent from your organization's name — not a generic system email.",
    details: ["Send to individual or group", "Custom message attached to reminder", "Reminder log tracks who was notified", "Staff receive renewal deadline + current credit count"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    ),
  },
  {
    title: "Professional Privacy Controls",
    desc: "Every professional on the platform retains full control over what information their employer sees. Compliance status (compliant/at-risk) can be shared without revealing individual CME activities. Employers cannot access activity detail without explicit professional consent.",
    details: ["Professional controls visibility settings", "Compliance status vs. activity detail: separate permissions", "Professional can disconnect at any time", "Audit log of all employer data access"],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    ),
  },
];

const SECURITY_FEATURES = [
  { label: "Row-Level Security (RLS) on every database table — database-enforced, not application-layer" },
  { label: "GCP Cloud Run infrastructure in me-central1 (Doha, Qatar) — GCC data residency guaranteed" },
  { label: "Private certificate storage — GCS private bucket, signed URLs with 1-hour expiry only" },
  { label: "Every API route authenticated — supabase.auth.getUser() on every request, no exceptions" },
  { label: "Admin routes additionally verify role via organization_members table" },
  { label: "Audit logs: append-only, 7-year retention, every admin and AI action logged" },
  { label: "Qatar Personal Data Protection Law (PDPL) compliant — no data leaves the GCC" },
  { label: "AI privacy: professional_id only in AI prompts — no name, license number, or PII sent to AI" },
  { label: "Path traversal protection on all file operations (blocks ../, null bytes, double slashes)" },
  { label: "Zod schema validation on every AI response before use in application" },
];

const COMPARISON_ROWS = [
  { feature: "CME wallet & activity logging", free: true, pro: true, employer: true },
  { feature: "Compliance dashboard & ring", free: true, pro: true, employer: true },
  { feature: "License wallet", free: true, pro: true, employer: true },
  { feature: "CME analytics & charts", free: true, pro: true, employer: true },
  { feature: "Certificate storage", free: true, pro: true, employer: true },
  { feature: "Employer linking", free: true, pro: true, employer: true },
  { feature: "Activity entries", free: "Up to 25", pro: "Unlimited", employer: "Unlimited" },
  { feature: "PDF compliance reports", free: false, pro: true, employer: true },
  { feature: "Hayya AI compliance chat", free: false, pro: true, employer: true },
  { feature: "License expiry email alerts", free: false, pro: true, employer: true },
  { feature: "Behind-pace weekly alerts", free: false, pro: true, employer: true },
  { feature: "Multi-license tracking", free: false, pro: true, employer: true },
  { feature: "Staff compliance dashboard", free: false, pro: false, employer: true },
  { feature: "CME task assignment", free: false, pro: false, employer: true },
  { feature: "Bulk PDF export (team)", free: false, pro: false, employer: true },
  { feature: "Compliance reminders to staff", free: false, pro: false, employer: true },
  { feature: "Support", free: "Community", pro: "Priority (24hr)", employer: "Priority + dedicated" },
];

const AUTHORITIES = [
  { flag: "🇶🇦", abbr: "QCHP", full: "Qatar Council for Healthcare Practitioners", href: "/qchp", note: "80 CPD / 2 years" },
  { flag: "🇸🇦", abbr: "SCFHS", full: "Saudi Commission for Health Specialties", href: "/scfhs", note: "30–60 CME / year" },
  { flag: "🇦🇪", abbr: "DHA", full: "Dubai Health Authority", href: "/dha", note: "40 CME / 2 years" },
  { flag: "🇦🇪", abbr: "DOH", full: "Department of Health — Abu Dhabi", href: "/doh", note: "30–50 CPD / 2 years" },
  { flag: "🇰🇼", abbr: "MOH", full: "Ministry of Health Kuwait", href: "/moh-kuwait", note: "30 CME / year" },
  { flag: "🇧🇭", abbr: "NHRA", full: "National Health Regulatory Authority — Bahrain", href: "/nhra", note: "40 CPD / 2 years" },
  { flag: "🇴🇲", abbr: "OMSB", full: "Oman Medical Specialty Board", href: "/omsb", note: "40 CME / 2 years" },
];

// ── Icon helper ───────────────────────────────────────────────────────────────
function Icon({ children, className = "w-5 h-5" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

function CheckIcon({ color = "text-[#16a34a]" }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${color} flex-shrink-0`} aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#d1d5db] flex-shrink-0" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  title, desc, details, icon, highlight = false,
}: {
  title: string; desc: string; details: string[]; icon: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 ${highlight ? "border-[#1a56a0]/30 bg-[#f0f6ff]" : "border-[#e2e8f0] bg-white"}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${highlight ? "bg-[#1a56a0] text-white" : "bg-[#e8f0fe] text-[#1a56a0]"}`}>
          <Icon>{icon}</Icon>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[#0f1f3d] mb-1">{title}</h3>
          <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
        </div>
      </div>
      <ul className="space-y-1.5 pl-14">
        {details.map((d) => (
          <li key={d} className="flex items-start gap-2 text-xs text-[#374151]">
            <CheckIcon color={highlight ? "text-[#1a56a0]" : "text-[#16a34a]"} />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({
  eyebrow, heading, subhead, badge,
}: {
  eyebrow: string; heading: string; subhead: string; badge?: string;
}) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-3">
        <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em]">{eyebrow}</p>
        {badge && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#1a56a0] text-white uppercase tracking-wide">
            {badge}
          </span>
        )}
      </div>
      <h2 className="text-3xl sm:text-[2.2rem] font-bold text-[#0f1f3d] tracking-tight mb-3 leading-tight">{heading}</h2>
      <p className="text-[#64748b] text-base max-w-xl mx-auto leading-relaxed">{subhead}</p>
    </div>
  );
}

// ── Cell helper for comparison table ─────────────────────────────────────────
function Cell({ value, highlight = false }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) return <CheckIcon color={highlight ? "text-[#1a56a0]" : "text-[#16a34a]"} />;
  if (value === false) return <XIcon />;
  return <span className={`text-xs font-semibold ${highlight ? "text-[#1a56a0]" : "text-[#374151]"}`}>{value}</span>;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-white">
        {/* Nav bar */}
        <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="Hayya Med Pro home">
              <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-xs font-bold" aria-hidden="true">H</span>
              </div>
              <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-[#64748b] hover:text-[#111] transition-colors hidden sm:inline">Pricing</Link>
              <Link href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors hidden sm:inline">Sign in</Link>
              <Link href="/register" className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors">
                Start free
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto">
              <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-[0.2em] mb-4">Platform Features</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight">
                Everything you need for CME compliance.<br className="hidden sm:block" />
                <span className="text-[#1a56a0]">Nothing you don&apos;t.</span>
              </h1>
              <p className="text-[#64748b] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Purpose-built for healthcare professionals across Qatar and the GCC — tracking CME credits, managing license renewals, and generating compliance reports with AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register" className="bg-[#1a56a0] text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/20">
                  Start tracking free →
                </Link>
                <Link href="/pricing" className="border border-[#e2e8f0] text-[#374151] px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#f8fafc] transition-colors">
                  View pricing
                </Link>
              </div>
              <p className="text-xs text-[#94a3b8] mt-4">Free forever · 14-day Pro trial · No credit card required</p>
            </div>
          </section>

          {/* Core features */}
          <section className="px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                eyebrow="Core — Free plan"
                heading="The essential compliance tools, free forever"
                subhead="Every healthcare professional gets these features at no cost — no trial, no expiry."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CORE_FEATURES.map((f) => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
            </div>
          </section>

          {/* Pro features */}
          <section className="bg-[#f8fafc] border-y border-[#e2e8f0] px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                eyebrow="Pro plan"
                heading="PDF reports, AI compliance chat, and renewal alerts"
                subhead="For healthcare professionals who need to submit compliance evidence and want AI-powered guidance."
                badge="$6/month"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRO_FEATURES.map((f) => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/register" className="inline-block bg-[#1a56a0] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/20">
                  Start 14-day Pro trial →
                </Link>
                <p className="text-xs text-[#94a3b8] mt-3">No credit card required · Cancel anytime</p>
              </div>
            </div>
          </section>

          {/* Employer features */}
          <section className="px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                eyebrow="Employer plan"
                heading="Compliance visibility for the whole team"
                subhead="For hospital HR directors, medical directors, and compliance teams managing staff CME renewal status."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EMPLOYER_FEATURES.map((f) => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
              <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/employers" className="inline-block bg-[#1a56a0] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/20">
                  See employer plans →
                </Link>
                <Link href="/request-demo" className="inline-block border border-[#e2e8f0] text-[#374151] px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#f8fafc] transition-colors">
                  Book a demo
                </Link>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="bg-[#f8fafc] border-y border-[#e2e8f0] px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <SectionHeader
                eyebrow="Compare plans"
                heading="Free vs Pro vs Employer"
                subhead="Everything in one view — see exactly what each plan includes."
              />
              <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0] shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left px-5 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wide bg-white w-1/2">Feature</th>
                      <th className="text-center px-4 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wide bg-white">Free</th>
                      <th className="text-center px-4 py-4 text-xs font-bold text-[#1a56a0] uppercase tracking-wide bg-[#f0f6ff]">Pro</th>
                      <th className="text-center px-4 py-4 text-xs font-semibold text-[#64748b] uppercase tracking-wide bg-white">Employer</th>
                    </tr>
                    <tr className="border-b border-[#e2e8f0]">
                      <td className="px-5 py-3 bg-white" />
                      <td className="px-4 py-3 text-center bg-white">
                        <span className="text-xs text-[#374151] font-medium">$0 / forever</span>
                      </td>
                      <td className="px-4 py-3 text-center bg-[#f0f6ff]">
                        <span className="text-xs text-[#1a56a0] font-bold">$6 / month</span>
                      </td>
                      <td className="px-4 py-3 text-center bg-white">
                        <span className="text-xs text-[#374151] font-medium">From $50 / mo</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr key={row.feature} className={`border-b border-[#f1f5f9] last:border-0 ${i % 2 === 0 ? "" : "bg-[#fafbfc]"}`}>
                        <td className="px-5 py-3.5 text-sm text-[#374151] font-medium">{row.feature}</td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex justify-center"><Cell value={row.free} /></div>
                        </td>
                        <td className="px-4 py-3.5 text-center bg-[#f0f6ff]/60">
                          <div className="flex justify-center"><Cell value={row.pro} highlight /></div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex justify-center"><Cell value={row.employer} /></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white border-t border-[#e2e8f0]">
                      <td className="px-5 py-4" />
                      <td className="px-4 py-4 text-center">
                        <Link href="/register" className="text-xs font-semibold text-[#1a56a0] hover:underline">Get started free</Link>
                      </td>
                      <td className="px-4 py-4 text-center bg-[#f0f6ff]">
                        <Link href="/register" className="text-xs font-bold text-white bg-[#1a56a0] px-3 py-1.5 rounded-lg hover:bg-[#1547a0] transition-colors">Start trial</Link>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Link href="/pricing" className="text-xs font-semibold text-[#1a56a0] hover:underline">View plans</Link>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </section>

          {/* GCC authority coverage */}
          <section className="px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <SectionHeader
                eyebrow="Authority Coverage"
                heading="All 7 GCC licensing authorities — rules sourced from official guidelines"
                subhead="Credit targets, cycle lengths, category caps, and accepted accreditors are configured directly from each authority's published requirements."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AUTHORITIES.map(({ flag, abbr, full, href, note }) => (
                  <Link key={abbr} href={href} className="flex items-start gap-3 border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:bg-[#f8fafc] transition-all group">
                    <span className="text-2xl leading-none mt-0.5">{flag}</span>
                    <div>
                      <p className="text-sm font-bold text-[#1a56a0] group-hover:text-[#1547a0] transition-colors">{abbr}</p>
                      <p className="text-xs text-[#374151] mb-1">{full}</p>
                      <p className="text-[11px] text-[#94a3b8] font-medium">{note}</p>
                    </div>
                  </Link>
                ))}
                <div className="flex items-start gap-3 border border-dashed border-[#e2e8f0] rounded-xl p-4">
                  <span className="text-2xl leading-none mt-0.5">🌍</span>
                  <div>
                    <p className="text-sm font-bold text-[#94a3b8]">More coming</p>
                    <p className="text-xs text-[#94a3b8]">UK (GMC) · India (NMC) · Australia (AHPRA)</p>
                    <p className="text-[11px] text-[#94a3b8] font-medium mt-1">Phase 2 expansion</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="bg-[#0f1f3d] px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs font-semibold text-[#60a5fa] uppercase tracking-[0.2em] mb-3">Security & Privacy</p>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Healthcare data deserves healthcare-grade security</h2>
                <p className="text-white/45 max-w-xl mx-auto text-base leading-relaxed">
                  Every architecture decision was made with healthcare data regulations in mind — Qatar PDPL, GCC data residency, and OWASP Top 10 mitigations baked in from day one.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECURITY_FEATURES.map((f) => (
                  <div key={f.label} className="flex items-start gap-3 bg-white/[0.04] border border-white/8 rounded-xl p-4">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#4ade80] flex-shrink-0 mt-0.5" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-white/55 leading-relaxed">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/security" className="inline-flex items-center gap-2 text-sm font-semibold text-[#60a5fa] hover:text-[#93c5fd] transition-colors">
                  Read our full security documentation →
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="px-6 py-20 bg-[#f8fafc]">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0f1f3d] text-center mb-8">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqLd.mainEntity.map((faq) => (
                  <div key={faq.name} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-[#0f1f3d] mb-2">{faq.name}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-[#1a56a0] px-6 py-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to track your CME compliance?</h2>
              <p className="text-white/70 text-base mb-8 leading-relaxed">
                Free to start. 14-day Pro trial on every new account. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register" className="bg-white text-[#1a56a0] px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg shadow-black/15">
                  Create your free account →
                </Link>
                <Link href="/how-it-works" className="border border-white/25 text-white px-8 py-4 rounded-xl font-semibold text-base hover:border-white/40 hover:bg-white/5 transition-all">
                  See how it works
                </Link>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
