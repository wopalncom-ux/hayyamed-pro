"use client";

import { useState, useMemo } from "react";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-static";

type CMEEvent = {
  id: string;
  name: string;
  organizer: string;
  location: string;
  country: string;
  month: number;
  dateLabel: string;
  specialties: string[];
  authority: string;
  estimatedCredits: string;
  type: "conference" | "congress" | "symposium" | "workshop" | "exhibition";
  website?: string;
};

const EVENTS: CMEEvent[] = [
  // UAE
  {
    id: "arab-health-2026",
    name: "Arab Health 2026",
    organizer: "Informa Markets",
    location: "DWTC, Dubai",
    country: "AE",
    month: 1,
    dateLabel: "26–29 Jan 2026",
    specialties: ["All Specialties", "Nursing", "Pharmacy", "Radiology"],
    authority: "DHA / DOH / HAAD",
    estimatedCredits: "8–15 CME",
    type: "exhibition",
    website: "https://www.arabhealthonline.com",
  },
  {
    id: "uae-medical-congress-2026",
    name: "UAE Medical Congress",
    organizer: "Emirates Medical Association",
    location: "Abu Dhabi",
    country: "AE",
    month: 3,
    dateLabel: "Mar 2026",
    specialties: ["Internal Medicine", "Surgery", "Cardiology"],
    authority: "DOH / DHA",
    estimatedCredits: "10–15 CME",
    type: "congress",
  },
  {
    id: "dubai-pharmacy-conference-2026",
    name: "Dubai International Pharmacy Conference",
    organizer: "Dubai Pharmacy College",
    location: "Dubai",
    country: "AE",
    month: 4,
    dateLabel: "Apr 2026",
    specialties: ["Pharmacy", "Clinical Pharmacy", "Oncology Pharmacy"],
    authority: "DHA",
    estimatedCredits: "8–12 CME",
    type: "conference",
  },
  {
    id: "emirates-oncology-2026",
    name: "Emirates Oncology Society Annual Meeting",
    organizer: "Emirates Oncology Society",
    location: "Dubai",
    country: "AE",
    month: 5,
    dateLabel: "May 2026",
    specialties: ["Oncology", "Haematology", "Radiology"],
    authority: "DHA / DOH",
    estimatedCredits: "10–14 CME",
    type: "conference",
  },
  {
    id: "uae-cardiology-2026",
    name: "UAE Cardiology Society Annual Congress",
    organizer: "UAE Cardiology Society",
    location: "Abu Dhabi",
    country: "AE",
    month: 10,
    dateLabel: "Oct 2026",
    specialties: ["Cardiology", "Cardiac Surgery", "Cardiac Nursing"],
    authority: "DOH / DHA",
    estimatedCredits: "12–18 CME",
    type: "congress",
  },

  // Saudi Arabia
  {
    id: "saudi-health-2026",
    name: "Saudi Health Exhibition & Conference",
    organizer: "Ministry of Health KSA / Riyadh Exhibitions",
    location: "Riyadh Front, Riyadh",
    country: "SA",
    month: 5,
    dateLabel: "4–7 May 2026",
    specialties: ["All Specialties", "Public Health", "Primary Care"],
    authority: "SCFHS / MOH KSA",
    estimatedCredits: "10–20 CME",
    type: "exhibition",
  },
  {
    id: "saudi-cardiology-2026",
    name: "Saudi Cardiology Society Annual Meeting",
    organizer: "Saudi Cardiology Society",
    location: "Riyadh",
    country: "SA",
    month: 2,
    dateLabel: "Feb 2026",
    specialties: ["Cardiology", "Interventional Cardiology", "Cardiac Surgery"],
    authority: "SCFHS",
    estimatedCredits: "12–18 CME",
    type: "conference",
  },
  {
    id: "saudi-surgical-2026",
    name: "Saudi Surgical Association Annual Conference",
    organizer: "Saudi Surgical Association",
    location: "Jeddah",
    country: "SA",
    month: 3,
    dateLabel: "Mar 2026",
    specialties: ["General Surgery", "HPB Surgery", "Vascular Surgery"],
    authority: "SCFHS",
    estimatedCredits: "10–15 CME",
    type: "conference",
  },
  {
    id: "saudi-radiology-2026",
    name: "Saudi Radiology Society Annual Congress",
    organizer: "Saudi Radiology Society",
    location: "Riyadh",
    country: "SA",
    month: 6,
    dateLabel: "Jun 2026",
    specialties: ["Radiology", "Interventional Radiology", "Nuclear Medicine"],
    authority: "SCFHS",
    estimatedCredits: "12–16 CME",
    type: "congress",
  },
  {
    id: "saudi-ortho-2026",
    name: "Saudi Orthopaedic Association Congress",
    organizer: "Saudi Orthopaedic Association",
    location: "Riyadh",
    country: "SA",
    month: 9,
    dateLabel: "Sep 2026",
    specialties: ["Orthopaedic Surgery", "Sports Medicine", "Physiotherapy"],
    authority: "SCFHS",
    estimatedCredits: "12–15 CME",
    type: "congress",
  },
  {
    id: "saudi-em-2026",
    name: "Saudi Society for Emergency Medicine Annual Conference",
    organizer: "Saudi Society for Emergency Medicine",
    location: "Riyadh",
    country: "SA",
    month: 11,
    dateLabel: "Nov 2026",
    specialties: ["Emergency Medicine", "Trauma Surgery", "Critical Care"],
    authority: "SCFHS",
    estimatedCredits: "10–14 CME",
    type: "conference",
  },
  {
    id: "saudi-anaesthesia-2026",
    name: "Saudi Anaesthesia Society Annual Meeting",
    organizer: "Saudi Anaesthesia Society",
    location: "Riyadh",
    country: "SA",
    month: 10,
    dateLabel: "Oct 2026",
    specialties: ["Anaesthesiology", "Critical Care", "Pain Medicine"],
    authority: "SCFHS",
    estimatedCredits: "10–14 CME",
    type: "conference",
  },

  // Qatar
  {
    id: "qchp-annual-2026",
    name: "QCHP Annual Scientific Conference",
    organizer: "Qatar Council for Healthcare Practitioners",
    location: "Doha",
    country: "QA",
    month: 4,
    dateLabel: "Apr 2026",
    specialties: ["All Specialties", "Healthcare Management", "Patient Safety"],
    authority: "QCHP",
    estimatedCredits: "12–20 CPD",
    type: "conference",
  },
  {
    id: "hmc-cardiology-2026",
    name: "HMC Qatar Cardiology Symposium",
    organizer: "Hamad Medical Corporation",
    location: "Doha",
    country: "QA",
    month: 2,
    dateLabel: "Feb 2026",
    specialties: ["Cardiology", "Cardiac Surgery", "Cardiac Nursing"],
    authority: "QCHP",
    estimatedCredits: "8–12 CPD",
    type: "symposium",
  },
  {
    id: "qatar-nursing-2026",
    name: "Qatar Nursing Day Scientific Symposium",
    organizer: "QCHP Nursing Division / HMC",
    location: "Doha",
    country: "QA",
    month: 5,
    dateLabel: "May 2026",
    specialties: ["Nursing", "Midwifery", "Critical Care Nursing"],
    authority: "QCHP",
    estimatedCredits: "6–10 CPD",
    type: "symposium",
  },
  {
    id: "qatar-pharmacy-2026",
    name: "Qatar Pharmacy Conference",
    organizer: "Qatar Pharmaceutical Association",
    location: "Doha",
    country: "QA",
    month: 9,
    dateLabel: "Sep 2026",
    specialties: ["Pharmacy", "Clinical Pharmacy", "Hospital Pharmacy"],
    authority: "QCHP",
    estimatedCredits: "8–12 CPD",
    type: "conference",
  },
  {
    id: "sidra-genomics-2026",
    name: "Sidra Medicine Genomics Symposium",
    organizer: "Sidra Medicine",
    location: "Doha",
    country: "QA",
    month: 11,
    dateLabel: "Nov 2026",
    specialties: ["Clinical Genetics", "Molecular Pathology", "Paediatrics"],
    authority: "QCHP",
    estimatedCredits: "8–12 CPD",
    type: "symposium",
  },

  // Kuwait
  {
    id: "kuwait-medical-congress-2026",
    name: "Kuwait Medical Congress",
    organizer: "Kuwait Medical Association",
    location: "Kuwait City",
    country: "KW",
    month: 3,
    dateLabel: "Mar 2026",
    specialties: ["All Specialties", "Internal Medicine", "Surgery"],
    authority: "MOH Kuwait",
    estimatedCredits: "10–16 CME",
    type: "congress",
  },
  {
    id: "kuwait-heart-2026",
    name: "Kuwait Heart Society Annual Congress",
    organizer: "Kuwait Heart Society",
    location: "Kuwait City",
    country: "KW",
    month: 6,
    dateLabel: "Jun 2026",
    specialties: ["Cardiology", "Interventional Cardiology", "Cardiac Surgery"],
    authority: "MOH Kuwait",
    estimatedCredits: "10–14 CME",
    type: "congress",
  },
  {
    id: "kuwait-oncology-2026",
    name: "Kuwait Cancer Control Centre Annual Symposium",
    organizer: "Kuwait Cancer Control Centre",
    location: "Kuwait City",
    country: "KW",
    month: 9,
    dateLabel: "Sep 2026",
    specialties: ["Oncology", "Haematology", "Radiation Oncology"],
    authority: "MOH Kuwait",
    estimatedCredits: "8–12 CME",
    type: "symposium",
  },

  // Bahrain
  {
    id: "bahrain-medical-2026",
    name: "Bahrain Medical International Conference",
    organizer: "Bahrain Medical Society",
    location: "Manama",
    country: "BH",
    month: 4,
    dateLabel: "Apr 2026",
    specialties: ["Internal Medicine", "General Practice", "Surgery"],
    authority: "NHRA",
    estimatedCredits: "10–15 CPD",
    type: "conference",
  },
  {
    id: "nhra-scientific-2026",
    name: "NHRA Annual Scientific Conference",
    organizer: "National Health Regulatory Authority Bahrain",
    location: "Manama",
    country: "BH",
    month: 10,
    dateLabel: "Oct 2026",
    specialties: ["All Specialties", "Patient Safety", "Healthcare Management"],
    authority: "NHRA",
    estimatedCredits: "8–14 CPD",
    type: "conference",
  },

  // Oman
  {
    id: "omsb-annual-2026",
    name: "OMSB Annual Scientific Conference",
    organizer: "Oman Medical Specialty Board",
    location: "Muscat",
    country: "OM",
    month: 5,
    dateLabel: "May 2026",
    specialties: ["All Specialties", "Medical Education", "Healthcare Quality"],
    authority: "OMSB",
    estimatedCredits: "10–16 CME",
    type: "conference",
  },
  {
    id: "squ-medical-2026",
    name: "Sultan Qaboos University Health Day Symposium",
    organizer: "Sultan Qaboos University Hospital",
    location: "Muscat",
    country: "OM",
    month: 3,
    dateLabel: "Mar 2026",
    specialties: ["Internal Medicine", "Surgery", "Nursing"],
    authority: "OMSB",
    estimatedCredits: "6–10 CME",
    type: "symposium",
  },
  {
    id: "oman-nursing-2026",
    name: "Oman Nursing Society Annual Conference",
    organizer: "Oman Nursing Society",
    location: "Muscat",
    country: "OM",
    month: 11,
    dateLabel: "Nov 2026",
    specialties: ["Nursing", "Midwifery", "Critical Care Nursing"],
    authority: "OMSB",
    estimatedCredits: "6–10 CME",
    type: "conference",
  },

  // GCC-wide / Online
  {
    id: "gulf-psychiatry-2026",
    name: "Gulf Psychiatry Congress",
    organizer: "GCC Psychiatric Association",
    location: "Riyadh / Virtual",
    country: "GCC",
    month: 7,
    dateLabel: "Jul 2026",
    specialties: ["Psychiatry", "Child Psychiatry", "Addiction Medicine"],
    authority: "SCFHS / QCHP / DHA",
    estimatedCredits: "10–14 CME",
    type: "congress",
  },
  {
    id: "gulf-radiology-2026",
    name: "Gulf Radiology Congress",
    organizer: "Gulf Radiology Society",
    location: "Dubai",
    country: "GCC",
    month: 8,
    dateLabel: "Aug 2026",
    specialties: ["Radiology", "Interventional Radiology", "Nuclear Medicine"],
    authority: "SCFHS / DHA / QCHP",
    estimatedCredits: "10–14 CME",
    type: "congress",
  },
  {
    id: "gcc-nursing-2026",
    name: "GCC Nursing Congress",
    organizer: "GCC Nursing Councils",
    location: "Manama",
    country: "GCC",
    month: 10,
    dateLabel: "Oct 2026",
    specialties: ["Nursing", "Midwifery", "Healthcare Management"],
    authority: "NHRA / QCHP / SCFHS / DHA",
    estimatedCredits: "10–16 CPD",
    type: "congress",
  },
  {
    id: "mena-diabetes-2026",
    name: "MENA Diabetes Forum",
    organizer: "Gulf & Middle East Diabetes Association",
    location: "Dubai",
    country: "GCC",
    month: 11,
    dateLabel: "Nov 2026",
    specialties: ["Endocrinology", "Diabetology", "Primary Care", "Nursing"],
    authority: "DHA / SCFHS / QCHP",
    estimatedCredits: "10–14 CME",
    type: "conference",
  },
];

const COUNTRIES: { code: string; label: string; flag: string }[] = [
  { code: "ALL", label: "All Countries", flag: "" },
  { code: "QA", label: "Qatar", flag: "🇶🇦" },
  { code: "SA", label: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", label: "UAE", flag: "🇦🇪" },
  { code: "KW", label: "Kuwait", flag: "🇰🇼" },
  { code: "BH", label: "Bahrain", flag: "🇧🇭" },
  { code: "OM", label: "Oman", flag: "🇴🇲" },
  { code: "GCC", label: "GCC-wide", flag: "🌍" },
];

const MONTHS: { num: number; label: string }[] = [
  { num: 0, label: "All months" },
  { num: 1, label: "Jan" }, { num: 2, label: "Feb" }, { num: 3, label: "Mar" },
  { num: 4, label: "Apr" }, { num: 5, label: "May" }, { num: 6, label: "Jun" },
  { num: 7, label: "Jul" }, { num: 8, label: "Aug" }, { num: 9, label: "Sep" },
  { num: 10, label: "Oct" }, { num: 11, label: "Nov" }, { num: 12, label: "Dec" },
];

const TYPE_COLORS: Record<string, string> = {
  conference:  "bg-[#eff6ff] text-[#1e40af]",
  congress:    "bg-[#faf5ff] text-[#6d28d9]",
  symposium:   "bg-[#f0fdf4] text-[#15803d]",
  workshop:    "bg-[#fff7ed] text-[#c2410c]",
  exhibition:  "bg-[#fdf4ff] text-[#9333ea]",
};

export default function CmeEventsPage() {
  const [country, setCountry] = useState("ALL");
  const [month, setMonth] = useState(0);

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      if (country !== "ALL" && e.country !== country) return false;
      if (month !== 0 && e.month !== month) return false;
      return true;
    }).sort((a, b) => a.month - b.month);
  }, [country, month]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GCC CME Events & Conferences 2026",
    description: "Upcoming CME conferences, congresses and symposia for healthcare professionals in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
    numberOfItems: EVENTS.length,
    itemListElement: EVENTS.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.name,
        organizer: { "@type": "Organization", name: e.organizer },
        location: { "@type": "Place", name: e.location },
        description: `${e.estimatedCredits} · Accepted by ${e.authority}. Specialties: ${e.specialties.join(", ")}.`,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Header */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">
                Hayya Med <span className="text-[#1a56a0]">Pro</span>
              </span>
            </a>
            <div className="flex items-center gap-3">
              <a href="/tools/compare-cme" className="text-sm text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">
                Compare CME requirements
              </a>
              <a
                href="/register"
                className="text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
              >
                Track your CME free
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Hero */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111] mb-3">
              GCC CME Events &amp; Conferences 2026
            </h1>
            <p className="text-[#64748b] text-base sm:text-lg max-w-2xl mx-auto">
              Upcoming accredited CME conferences, congresses, and symposia for healthcare professionals
              in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman. Credits accepted by QCHP,
              SCFHS, DHA, DOH, NHRA, and OMSB.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-[#111]">{EVENTS.length}</span> events listed
            </span>
            <span className="text-[#e2e8f0]">|</span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-[#111]">6</span> GCC countries
            </span>
            <span className="text-[#e2e8f0]">|</span>
            <span className="flex items-center gap-1.5">
              Updated <span className="font-bold text-[#111]">June 2026</span>
            </span>
          </div>

          {/* Filters */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-6 space-y-3">
            {/* Country filter */}
            <div>
              <p className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Country</p>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCountry(c.code)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      country === c.code
                        ? "bg-[#1a56a0] text-white"
                        : "bg-[#f1f5f9] text-[#374151] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {c.flag && <span className="mr-1">{c.flag}</span>}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Month filter */}
            <div>
              <p className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Month</p>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m) => (
                  <button
                    key={m.num}
                    onClick={() => setMonth(m.num)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      month === m.num
                        ? "bg-[#1a56a0] text-white"
                        : "bg-[#f1f5f9] text-[#374151] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-[#64748b] mb-4">
            Showing <span className="font-semibold text-[#111]">{filtered.length}</span> event{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Event cards */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
              <p className="text-[#64748b] text-sm">No events match the current filters. Try removing a filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((event) => {
                const countryInfo = COUNTRIES.find((c) => c.code === event.country);
                return (
                  <div key={event.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#1a56a0] transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Date column */}
                      <div className="flex-shrink-0 w-16 text-center hidden sm:block">
                        <div className="bg-[#1a56a0] text-white rounded-lg px-2 py-2 text-xs font-bold">
                          {MONTHS.find((m) => m.num === event.month)?.label}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h2 className="text-base font-bold text-[#111] group-hover:text-[#1a56a0] transition-colors">
                            {event.name}
                          </h2>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[event.type] ?? "bg-[#f1f5f9] text-[#374151]"}`}>
                            {event.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748b] mb-2">
                          <span className="flex items-center gap-1">
                            📅 {event.dateLabel}
                          </span>
                          <span className="flex items-center gap-1">
                            📍 {event.location}
                            {countryInfo && countryInfo.flag && (
                              <span className="ml-0.5">{countryInfo.flag}</span>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            🏛 {event.organizer}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {event.specialties.map((s) => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#374151]">
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748b]">
                          <span>
                            <strong className="text-[#16a34a]">{event.estimatedCredits}</strong>
                          </span>
                          <span>Accepted by: <strong className="text-[#374151]">{event.authority}</strong></span>
                        </div>
                      </div>

                      {/* Right CTA */}
                      <div className="flex-shrink-0 flex flex-col gap-2 sm:items-end">
                        {event.website ? (
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-[#1a56a0] border border-[#1a56a0] px-3 py-1.5 rounded-lg hover:bg-[#f0f4f8] transition-colors whitespace-nowrap"
                          >
                            Visit website →
                          </a>
                        ) : null}
                        <a
                          href="/register"
                          className="text-xs font-medium text-[#64748b] hover:text-[#1a56a0] transition-colors whitespace-nowrap"
                        >
                          Track CME free →
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-[#1a56a0] to-[#2563eb] rounded-2xl p-8 text-center text-white">
            <h2 className="text-xl font-bold mb-2">Track your CME credits from any event</h2>
            <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
              Log CME activities from any GCC-approved conference. Hayya Med Pro tracks credits against
              your QCHP, SCFHS, DHA, or NHRA requirements automatically.
            </p>
            <a
              href="/register"
              className="inline-block bg-white text-[#1a56a0] text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Start tracking free →
            </a>
          </div>

          <p className="mt-6 text-xs text-[#94a3b8] text-center">
            Event dates are estimates based on typical annual scheduling and may change. Verify exact
            dates and CME credit totals with the event organiser and your licensing authority before
            attending. Hayya Med Pro is not affiliated with any listed event organiser.
          </p>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
