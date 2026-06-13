import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "NMC India CME Requirements â€” Indian Doctor CME Guide 2025 | Hayya Med Pro",
  description:
    "Complete guide to NMC India CME requirements. Indian doctors need 30 CME credits per 5-year re-registration cycle. Track NMC India CME and GCC CME requirements in one compliance app.",
  keywords: [
    "NMC India CME requirements",
    "Indian doctor CME 2025",
    "National Medical Commission CME",
    "NMC CME credits India",
    "India doctor CME tracker",
    "NMC re-registration CME",
    "Indian medical council CME",
    "NMC CME portal India",
    "Indian doctor CME points",
    "NMC 30 CME credits",
    "India continuing medical education",
    "MCI CME requirements",
  ],
  openGraph: {
    title: "NMC India CME Requirements â€” Indian Doctor CME Guide 2025",
    description:
      "30 CME credits per 5-year cycle Â· NMC digital portal Â· Online CME up to 15 credits. Track NMC India and GCC CME in one app.",
    url: `${APP_URL}/nmc-india-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=NMC+India+CME+Requirements&s=30+CME+credits+per+5+years+%C2%B7+NMC+digital+portal+%C2%B7+Free+to+track&a=%F0%9F%87%AE%F0%9F%87%B3+NMC+India&k=Authority+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/nmc-india-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do Indian doctors need for NMC re-registration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The National Medical Commission (NMC) requires all registered allopathic doctors in India to complete 30 CME credits per 5-year re-registration cycle. A minimum of 10 credits per year is recommended to keep pace. Credits are earned through NMC-registered CME providers and logged in the NMC digital CPD portal launched in 2022.",
      },
    },
    {
      "@type": "Question",
      name: "What is the NMC CME portal and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The NMC launched a centralised digital CME portal (cpd.nmc.org.in) in 2022 to track CME credits for all registered doctors. Doctors log in with their NMC registration number, and accredited CME providers submit attendance data directly to the portal. Doctors can also manually upload certificates from approved providers. The portal replaced the earlier paper-based Medical Council of India (MCI) CME certificate system.",
      },
    },
    {
      "@type": "Question",
      name: "How much online CME can count toward NMC requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NMC allows up to 15 CME credits per 5-year cycle from online accredited e-learning programs. This means up to 50% of the 30-credit requirement can be earned online. The remaining credits must come from in-person or live CME events run by NMC-accredited providers such as medical colleges, professional societies, and hospitals.",
      },
    },
    {
      "@type": "Question",
      name: "Do Indian doctors practising in GCC countries need to maintain NMC CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Indian doctors who wish to maintain their NMC registration while practising abroad must continue to accumulate CME credits. Activities from internationally recognised providers may count if the provider is NMC-approved. GCC-based Indian doctors often attend CME events run by the Indian Medical Association (IMA) Gulf chapters, which may be submitted to both NMC and the relevant GCC authority (QCHP, SCFHS, DHA). Hayya Med Pro tracks both NMC and GCC requirements in parallel.",
      },
    },
    {
      "@type": "Question",
      name: "What happened to MCI CME requirements after NMC replaced MCI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Medical Council of India (MCI) was dissolved in 2020 and replaced by the National Medical Commission (NMC) under the National Medical Commission Act, 2019. NMC inherited and revised the CME framework. The new 30-credit per 5-year cycle replaced the older MCI system. Previously earned MCI CME certificates remain valid for re-registration purposes up to their respective cycle dates.",
      },
    },
  ],
};

const CME_TYPES = [
  { icon: "ðŸ›ï¸", title: "In-Person CME Events",      desc: "Conferences, symposia, workshops run by NMC-accredited medical colleges, professional societies (IMA, API, FOGSI, etc.), and hospitals. Most credits per activity." },
  { icon: "ðŸ’»", title: "Online / E-Learning CME",    desc: "Accredited e-learning platforms, webinars, and virtual conferences. Capped at 15 credits per 5-year cycle (50% of total). Must be from NMC-registered providers." },
  { icon: "ðŸ“–", title: "CME at Medical Colleges",    desc: "Grand rounds, case presentations, departmental seminars at NMC-recognised medical colleges. Commonly 1â€“2 credits per session, submitted by the institution." },
  { icon: "ðŸ”¬", title: "Research & Publications",    desc: "Presenting at peer-reviewed conferences, authoring published research. Credits vary â€” check with your State Medical Council for accepted research CME rules." },
  { icon: "ðŸŒ", title: "International Conferences",  desc: "International CME events from AHPRA, GMC, or GCC-accredited providers may count if the provider is on the NMC approved list. Verify before attending." },
  { icon: "ðŸ“‹", title: "State Medical Council CME",  desc: "Some State Medical Councils (Maharashtra, Karnataka, etc.) have additional CME requirements for state licence renewal. Check your state council's rules separately." },
];

export default function NmcIndiaCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ‡®ðŸ‡³ Authority Guide â€” India
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            NMC India CME Requirements<br />for Indian Doctors â€” 2025
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 640, margin: "0 auto 32px" }}>
            30 CME credits per 5-year cycle Â· NMC digital portal Â· Up to 15 credits online.
            Track NMC India CME and GCC CME in one dashboard.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              Start tracking free â†’
            </Link>
            <Link href="/pricing" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              View plans
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "#1a56a0", padding: "28px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            { n: "30",     label: "CME credits required" },
            { n: "5 yrs",  label: "Re-registration cycle" },
            { n: "10/yr",  label: "Recommended per year" },
            { n: "15",     label: "Max online credits" },
            { n: "2022",   label: "NMC portal launched" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>{s.n}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            NMC CME â€” What Indian Doctors Need to Know
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, maxWidth: 680, margin: "0 auto 40px" }}>
            The National Medical Commission replaced the MCI in 2020 and launched a new digital CME tracking framework.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 24 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Credit requirement</h3>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#1a56a0", margin: "0 0 4px" }}>30</p>
              <p style={{ color: "#64748b", fontSize: 14 }}>CME credits per 5-year re-registration cycle. Minimum 10 credits per year recommended to stay on track.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Online CME cap</h3>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#d97706", margin: "0 0 4px" }}>15</p>
              <p style={{ color: "#64748b", fontSize: 14 }}>Maximum 15 credits from online / e-learning activities per 5-year cycle. The remaining credits must be from in-person events.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>GCC connection</h3>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#16a34a", margin: "0 0 4px" }}>1.2M+</p>
              <p style={{ color: "#64748b", fontSize: 14 }}>Indian doctors practise across the GCC. Many hold both NMC and QCHP/SCFHS/DHA licences simultaneously.</p>
            </div>
          </div>
          <div style={{ background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 10, padding: "16px 20px" }}>
            <p style={{ color: "#92400e", fontSize: 14, margin: 0 }}>
              <strong>Working in GCC?</strong> Indian doctors are the largest expatriate medical workforce in the GCC. Hayya Med Pro tracks NMC India CME alongside QCHP, SCFHS, and DHA requirements â€” in one dashboard, with separate deadline alerts for each authority.
            </p>
          </div>
        </div>
      </section>

      {/* CME types */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            Accepted CME Activity Types
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            All activity types recognised under the NMC CME framework and State Medical Councils.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {CME_TYPES.map((c) => (
              <div key={c.title} style={{ background: "#f8fafc", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{c.title}</h3>
                <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            NMC India CME â€” Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqLd.mainEntity.map((q) => (
              <div key={q.name} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{q.name}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GCC cross-links */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 12 }}>
            Also licensed in GCC?
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>
            Indian doctors make up the largest medical workforce in Qatar, Saudi Arabia, and UAE. Track all requirements together.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {[
              { href: "/qchp", label: "ðŸ‡¶ðŸ‡¦ QCHP Qatar" },
              { href: "/scfhs", label: "ðŸ‡¸ðŸ‡¦ SCFHS Saudi" },
              { href: "/dha", label: "ðŸ‡¦ðŸ‡ª DHA Dubai" },
              { href: "/doh", label: "ðŸ‡¦ðŸ‡ª DOH Abu Dhabi" },
              { href: "/moh-kuwait", label: "ðŸ‡°ðŸ‡¼ MOH Kuwait" },
              { href: "/omsb", label: "ðŸ‡´ðŸ‡² OMSB Oman" },
              { href: "/gmc-cpd", label: "ðŸ‡¬ðŸ‡§ GMC UK" },
              { href: "/gcc-cme-requirements", label: "ðŸŒ All GCC" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 13 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Track NMC India CME â€” and your GCC requirements</h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            One dashboard for NMC India and every GCC authority. Free to start â€” never miss a CME deadline again.
          </p>
          <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}>
            Start tracking free â†’
          </Link>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>No credit card required Â· 14-day Pro trial included</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licences and does not replace official NMC India or State Medical Council requirements. Always verify final requirements at nmc.org.in and with your State Medical Council.
        </p>
      </section>
    </>
  );
}
