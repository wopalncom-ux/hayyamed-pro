import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Healthcare Staff CME Compliance Software â€” Hayya Med Pro Employer",
  description:
    "Manage your entire team's CME compliance in one dashboard. Real-time staff compliance grid, bulk PDF reports, department grouping, and weekly digest emails. For clinics, hospitals, and medical departments across the GCC.",
  keywords: [
    "healthcare staff CME compliance",
    "medical staff compliance software",
    "hospital CME tracking",
    "healthcare team CPD management",
    "staff license compliance dashboard",
    "clinic CME software Qatar",
    "QCHP staff compliance",
    "GCC healthcare workforce compliance",
  ],
  openGraph: {
    title: "Healthcare Staff CME Compliance â€” Hayya Med Pro Employer",
    description:
      "Know your entire team's compliance status before QCHP renewal. Real-time dashboard, bulk PDF reports, and automated staff alerts. From $50/month.",
    url: `${APP_URL}/employers`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Healthcare+Staff+CME+Compliance+Software&s=Real-time+compliance+dashboard+%C2%B7+bulk+PDF+reports+%C2%B7+from+%2450%2Fmonth&a=%F0%9F%8F%A5+Employer&k=Employer`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthcare Staff CME Compliance â€” Hayya Med Pro Employer",
    description: "Manage staff CME compliance across the GCC. Real-time dashboard for clinics and hospitals.",
  },
  alternates: { canonical: `${APP_URL}/employers` },
};

const orgFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Hayya Med Pro help employers manage staff CME compliance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro gives employer admins a real-time compliance dashboard showing each staff member's CME credit progress, compliance status, and license expiry. You can generate bulk PDF compliance reports for the whole team, group staff by department, assign required courses, and receive a weekly digest email with compliance highlights.",
      },
    },
    {
      "@type": "Question",
      name: "How does staff linking work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Healthcare professionals create their own Hayya Med Pro account and either request to link to your organization, or you can bulk-import staff via CSV. Each professional controls their own privacy settings â€” they choose what compliance data is visible to their employer.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC licensing authorities does the employer dashboard support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The employer dashboard supports all GCC licensing authorities: QCHP (Qatar), SCFHS (Saudi Arabia), DHA and DOH (UAE), NHRA (Bahrain), OMSB (Oman), and MOH Kuwait. Staff with licenses in multiple countries have their compliance tracked separately per jurisdiction.",
      },
    },
    {
      "@type": "Question",
      name: "What is the pricing for the Employer plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Employer plans start at $50/month for up to 10 staff (Clinic plan). Growth: $100/month (up to 25 staff). Department: $180/month (up to 50 staff). Hospital: $350/month (up to 200 staff). All annual plans include a 15% discount. The employer admin's own Pro features are included free in every plan.",
      },
    },
  ],
};

const EMPLOYER_TIERS = [
  { label: "Clinic", maxStaff: 10, monthly: 50, annual: 510, highlight: false },
  { label: "Growth", maxStaff: 25, monthly: 100, annual: 1020, highlight: true },
  { label: "Department", maxStaff: 50, monthly: 180, annual: 1836, highlight: false },
  { label: "Hospital", maxStaff: 200, monthly: 350, annual: 3570, highlight: false },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h.008v.008h-.008v-.008Zm0 3.75h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    title: "Real-time staff compliance grid",
    desc: "See every team member's CME progress, compliance status, license expiry, and pending activities at a glance. Filter by department, status, or profession.",
    color: "#1a56a0",
    bg: "#eff6ff",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
      </svg>
    ),
    title: "Bulk PDF compliance reports",
    desc: "Download a single PDF showing every staff member's compliance status â€” ready for QCHP, JCI, or CBAHI accreditation audits.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    title: "Department grouping & analytics",
    desc: "Organise staff by department, ward, or specialty. See per-department compliance rates and identify which teams need immediate attention.",
    color: "#d97706",
    bg: "#fff7ed",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    title: "Weekly compliance digest",
    desc: "Every Monday, receive an automated email digest showing staff compliance changes, new at-risk professionals, and upcoming license renewals.",
    color: "#7c3aed",
    bg: "#faf5ff",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    title: "Required course assignment",
    desc: "Assign mandatory training to staff or departments. Track who has completed assigned courses and who still needs to act.",
    color: "#dc2626",
    bg: "#fef2f2",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: "Bulk staff CSV import",
    desc: "Import your entire team via CSV in minutes. Existing accounts are linked automatically; new staff receive an invitation email.",
    color: "#0891b2",
    bg: "#f0f9ff",
  },
];

function MockDashboard() {
  const staff = [
    { name: "Dr. Ahmed Al-Rashid", profession: "Physician", pct: 87, status: "compliant", dept: "Cardiology", days: 62 },
    { name: "Nurse Fatima Hassan", profession: "Nurse", pct: 45, status: "at_risk", dept: "ICU", days: 41 },
    { name: "Dr. Sara Mohammed", profession: "Pharmacist", pct: 100, status: "compliant", dept: "Pharmacy", days: 104 },
    { name: "Dr. Omar Al-Zaabi", profession: "Physician", pct: 23, status: "non_compliant", dept: "Emergency", days: 28 },
    { name: "Nurse Aisha Al-Qassim", profession: "Nurse", pct: 67, status: "at_risk", dept: "Pediatrics", days: 55 },
  ];
  const statusMap: Record<string, { label: string; cls: string }> = {
    compliant:     { label: "Compliant",     cls: "bg-[#dcfce7] text-[#16a34a]" },
    at_risk:       { label: "At Risk",        cls: "bg-[#fff7ed] text-[#d97706]" },
    non_compliant: { label: "Needs Action",   cls: "bg-[#fef2f2] text-[#dc2626]" },
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm select-none" aria-hidden="true">
      {/* Dashboard header */}
      <div className="bg-[#0f1f3d] px-5 py-3.5 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-semibold">Staff Compliance Dashboard</p>
          <p className="text-[rgba(255,255,255,0.5)] text-xs">Hamad Medical Centre â€” 18 staff linked</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[rgba(255,255,255,0.1)] text-white text-xs px-2.5 py-1 rounded-lg">Download PDF</div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 divide-x divide-[#f1f5f9] border-b border-[#f1f5f9]">
        {[
          { label: "Compliant", value: "11", color: "#16a34a" },
          { label: "At Risk", value: "5", color: "#d97706" },
          { label: "Needs Action", value: "2", color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className="px-5 py-3 text-center">
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] text-[#64748b]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Staff table */}
      <div className="divide-y divide-[#f8fafc]">
        {staff.map((s) => {
          const sc = statusMap[s.status];
          return (
            <div key={s.name} className="px-5 py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#e8f0fe] flex items-center justify-center text-xs font-bold text-[#1a56a0] flex-shrink-0">
                {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#111] truncate">{s.name}</p>
                <p className="text-[11px] text-[#64748b]">{s.profession} Â· {s.dept}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 w-20">
                <div className="flex-1 bg-[#e2e8f0] rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${s.pct}%`,
                      background: s.pct >= 80 ? "#16a34a" : s.pct >= 50 ? "#d97706" : "#dc2626",
                    }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-[#374151] w-8 text-right">{s.pct}%</span>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${sc.cls}`}>
                {sc.label}
              </span>
              <span className="text-[11px] text-[#94a3b8] hidden md:block w-16 text-right flex-shrink-0">
                {s.days}d left
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EmployersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgFaqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">
                Hayya Med <span className="text-[#1a56a0]">Pro</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">
                Sign in
              </Link>
              <Link
                href="/pricing#employer"
                className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
              >
                See plans â†’
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#fff7ed] border border-[#fed7aa] text-[#c2410c] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                For clinic admins, hospital HR, and medical directors
              </div>
              <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
                Know your team&apos;s compliance status before QCHP renewal
              </h1>
              <p className="text-lg text-[#64748b] mb-6">
                Stop chasing staff for CME certificates. Hayya Med Pro gives you a real-time dashboard showing every professional&apos;s compliance progress â€” automatically.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "See who is compliant, at risk, or non-compliant â€” at a glance",
                  "Download bulk PDF compliance reports for accreditation audits",
                  "Receive weekly digest emails with actionable compliance alerts",
                  "Staff link their own accounts â€” you never touch their certificates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#374151]">
                    <div className="w-4 h-4 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pricing#employer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#154890] transition-colors"
                >
                  See employer plans â€” from $50/month â†’
                </Link>
                <Link
                  href="/request-demo"
                  className="inline-flex items-center justify-center gap-2 border border-[#e2e8f0] text-[#374151] font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white transition-colors"
                >
                  Request a demo
                </Link>
              </div>
            </div>

            {/* Live dashboard mockup */}
            <div>
              <MockDashboard />
              <p className="text-xs text-[#94a3b8] text-center mt-2">Live staff compliance dashboard â€” example data</p>
            </div>
          </div>

          {/* Problem statement */}
          <div className="bg-[#0f1f3d] rounded-2xl p-8 mb-14 text-center">
            <p className="text-lg font-bold text-white mb-2">
              &ldquo;We found out two of our consultants had lapsed QCHP renewals during a JCI audit.&rdquo;
            </p>
            <p className="text-[rgba(255,255,255,0.5)] text-sm">
              A common scenario for clinic administrators managing staff compliance manually. Hayya Med Pro eliminates this risk.
            </p>
          </div>

          {/* Feature grid */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">Everything you need to manage team compliance</h2>
            <p className="text-sm text-[#64748b] text-center mb-8">Built for Qatar, Saudi Arabia, and UAE â€” QCHP, SCFHS, DHA, and DOH requirements supported.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-[#111] mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who uses it */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-14">
            <h2 className="text-lg font-bold text-[#111] mb-6">Who uses Hayya Med Pro Employer?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: "ðŸ¥",
                  title: "Private clinics",
                  desc: "Clinic medical directors and administrators managing 5â€“50 professionals. Keep every licence renewal on track without spreadsheets.",
                },
                {
                  icon: "ðŸ¢",
                  title: "Hospital departments",
                  desc: "Department heads and HR managers at hospitals who need to evidence staff compliance for JCI or CBAHI accreditation.",
                },
                {
                  icon: "ðŸ›ï¸",
                  title: "Healthcare groups",
                  desc: "Multi-site healthcare groups managing compliance across several clinics or hospitals with different licensing authorities.",
                },
              ].map((u) => (
                <div key={u.title} className="text-center">
                  <div className="text-3xl mb-2">{u.icon}</div>
                  <h3 className="text-sm font-semibold text-[#111] mb-1">{u.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-14" id="employer-pricing">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">Employer plan pricing</h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Employer admin gets their own Pro features free in every plan. Save 15% with annual billing.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {EMPLOYER_TIERS.map((t) => (
                <div
                  key={t.label}
                  className={`rounded-2xl border p-5 flex flex-col ${
                    t.highlight ? "bg-[#1a56a0] border-[#1a56a0]" : "bg-white border-[#e2e8f0]"
                  }`}
                >
                  {t.highlight && (
                    <span className="self-start mb-2 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Recommended
                    </span>
                  )}
                  <p className={`text-sm font-semibold mb-0.5 ${t.highlight ? "text-blue-200" : "text-[#64748b]"}`}>
                    {t.label}
                  </p>
                  <p className={`text-xs mb-3 ${t.highlight ? "text-blue-300" : "text-[#94a3b8]"}`}>
                    Up to {t.maxStaff} staff
                  </p>
                  <p className={`text-2xl font-black mb-0.5 ${t.highlight ? "text-white" : "text-[#111]"}`}>
                    ${t.monthly}
                  </p>
                  <p className={`text-xs mb-5 ${t.highlight ? "text-blue-300" : "text-[#94a3b8]"}`}>/month</p>
                  <Link
                    href="/pricing#employer"
                    className={`block w-full text-center py-2.5 rounded-xl text-xs font-semibold transition-colors mt-auto ${
                      t.highlight
                        ? "bg-white text-[#1a56a0] hover:bg-blue-50"
                        : "bg-[#1a56a0] text-white hover:bg-[#154890]"
                    }`}
                  >
                    Get started
                  </Link>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#111]">Hospital group or government authority?</p>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Unlimited staff Â· HRIS API integration Â· White-label Â· Dedicated SLA
                </p>
              </div>
              <Link
                href="/request-demo"
                className="flex-shrink-0 text-sm font-semibold bg-[#f1f5f9] text-[#1a56a0] px-5 py-2 rounded-xl hover:bg-[#e2e8f0] transition-colors"
              >
                Contact us for Enterprise â†’
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">Employer plan â€” frequently asked questions</h2>
            <div className="space-y-3">
              {orgFaqLd.mainEntity.map((item) => (
                <details key={item.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {item.name}
                    <svg className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] border-t border-[#f1f5f9] pt-3 leading-relaxed">
                    {item.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to take control of staff compliance?</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Join clinics and hospital departments across the GCC managing staff CME compliance with Hayya Med Pro. No contracts. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pricing#employer"
                className="bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3 rounded-xl hover:bg-[#f0f7ff] transition-colors"
              >
                See employer plans â€” from $50/month â†’
              </Link>
              <Link
                href="/request-demo"
                className="border border-[rgba(255,255,255,0.3)] text-white font-semibold text-sm px-7 py-3 rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                Request a demo
              </Link>
            </div>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              Individual professionals: <Link href="/register" className="underline hover:text-white/60">create a free account â†’</Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
