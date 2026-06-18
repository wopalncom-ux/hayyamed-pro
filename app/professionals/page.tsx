import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Healthcare Professional Directory | Hayya Med Pro",
  description:
    "Browse GCC healthcare professionals on Hayya Med Pro. Search by specialty, profession, and country.",
  openGraph: {
    title: "Healthcare Professional Directory | Hayya Med Pro",
    description:
      "Browse GCC healthcare professionals on Hayya Med Pro. Search by specialty, profession, and country.",
  },
};

type SearchParams = Promise<{
  q?: string;
  profession?: string;
  specialty?: string;
  country?: string;
}>;

const PROFESSIONS = [
  "physician", "nurse", "pharmacist", "dentist", "physiotherapist",
  "radiographer", "dietitian", "occupational_therapist", "paramedic",
  "speech_therapist", "optometrist", "midwife",
];

const COUNTRIES = [
  "Qatar", "Saudi Arabia", "UAE", "Kuwait", "Bahrain", "Oman",
  "UK", "India", "Australia", "Egypt", "Jordan",
];

function fmt(val: string): string {
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function anonName(fullName: string | null): string {
  if (!fullName) return "Healthcare Professional";
  const parts = fullName.trim().split(" ");
  if (parts.length < 2) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export default async function ProfessionalsDirectoryPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q          = (sp.q ?? "").trim().toLowerCase();
  const profession = sp.profession ?? "";
  const specialty  = sp.specialty ?? "";
  const country    = sp.country ?? "";

  const admin = createAdminClient();

  // Fetch opted-in professionals with their profiles
  let profileQuery = admin
    .from("professional_profiles")
    .select(`
      auth_id,
      full_name,
      profession,
      specialty,
      country_of_residence,
      profile_privacy_settings!inner ( public_directory_opt_in )
    `)
    .eq("profile_privacy_settings.public_directory_opt_in", true)
    .eq("onboarding_complete", true)
    .order("full_name", { ascending: true })
    .limit(200);

  if (profession) profileQuery = profileQuery.eq("profession", profession);
  if (country)    profileQuery = profileQuery.eq("country_of_residence", country);

  const { data: rows } = await profileQuery;

  let professionals = (rows ?? []).map((r) => ({
    id:         r.auth_id,
    name:       anonName(r.full_name),
    profession: r.profession ?? "",
    specialty:  r.specialty ?? "",
    country:    r.country_of_residence ?? "",
  }));

  // Client-side text filter for search and specialty (no DB index on specialty text)
  if (q) {
    professionals = professionals.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.profession.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q)
    );
  }
  if (specialty) {
    professionals = professionals.filter((p) =>
      p.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0f1f3d] mb-2">Healthcare Professional Directory</h1>
          <p className="text-[#475569]">
            Browse verified GCC healthcare professionals on Hayya Med Pro.
            Only professionals who have opted in to public visibility are listed.
          </p>
        </div>

        {/* Filters */}
        <form method="GET" className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            type="search"
            placeholder="Search by name, specialty, or country…"
            className="flex-1 text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
          />
          <select
            name="profession"
            defaultValue={profession}
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="">All professions</option>
            {PROFESSIONS.map((p) => (
              <option key={p} value={p}>{fmt(p)}</option>
            ))}
          </select>
          <select
            name="country"
            defaultValue={country}
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="">All countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="submit"
            className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] transition-colors whitespace-nowrap"
          >
            Search
          </button>
          {(q || profession || specialty || country) && (
            <a
              href="/professionals"
              className="text-sm font-medium px-5 py-2 rounded-lg border border-[#e2e8f0] text-[#64748b] hover:text-[#111] transition-colors whitespace-nowrap"
            >
              Clear
            </a>
          )}
        </form>

        <p className="text-xs text-[#64748b] mb-4">
          {professionals.length} professional{professionals.length !== 1 ? "s" : ""} listed
          {(q || profession || country) && " matching your filters"}
        </p>

        {professionals.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-[#e2e8f0] px-6 py-16 text-center">
            <p className="text-sm font-medium text-[#374151] mb-1">No professionals match your search</p>
            <p className="text-xs text-[#64748b]">Try adjusting your filters or clearing the search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionals.map((pro) => (
              <a
                key={pro.id}
                href={`/p/${pro.id}`}
                className="group bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#1a56a0] hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0f7ff] flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-bold text-[#1a56a0]">
                      {pro.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors truncate">
                      {pro.name}
                    </p>
                    {pro.country && (
                      <p className="text-xs text-[#64748b] truncate">{pro.country}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pro.profession && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0f7ff] text-[#1a56a0] border border-[#bfdbfe]">
                      {fmt(pro.profession)}
                    </span>
                  )}
                  {pro.specialty && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f8fafc] text-[#475569] border border-[#e2e8f0]">
                      {pro.specialty}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Opt-in CTA for logged-in users */}
        <div className="mt-12 bg-[#0f1f3d] rounded-xl p-6 text-center">
          <h2 className="text-base font-semibold text-white mb-2">Are you a healthcare professional?</h2>
          <p className="text-sm text-[#64748b] mb-4">
            Join Hayya Med Pro to track your CME credits and optionally list yourself in this directory.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-[#1a56a0] text-white hover:bg-[#1547a0] transition-colors"
            >
              Create free account
            </a>
            <a
              href="/dashboard/settings"
              className="text-sm font-medium px-5 py-2.5 rounded-xl border border-[#374151] text-[#64748b] hover:border-[#64748b] hover:text-white transition-colors"
            >
              Manage visibility settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
