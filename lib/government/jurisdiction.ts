import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { toCountryCode, countryValuesForCode } from "@/lib/countryCode";
import { logAudit } from "@/lib/audit";

// ════════════════════════════════════════════════════════════════════════════
// Jurisdiction engine — single source of truth for the regulator portal.
//
// A regulatory authority (e.g. DHP Qatar) oversees EVERY professional whose
// country of residence falls in its jurisdiction — not an opt-in linked subset.
// Legal basis: licensing-authority statutory mandate (PDPL / GDPR Art. 6(1)(e)).
// Every read is audit-logged. Certificate files are never surfaced here.
// ════════════════════════════════════════════════════════════════════════════

export type ComplianceZone = "compliant" | "at_risk" | "non_compliant" | "unknown";

export type JurisdictionProfessional = {
  professionalId: string;
  name: string;
  profession: string;
  specialty: string;
  email: string | null;
  employer: string | null;          // hospital/clinic name, or null if unaffiliated
  employerId: string | null;
  licenseNumber: string | null;
  licenseExpiry: string | null;
  daysToExpiry: number | null;
  completedCredits: number | null;
  requiredCredits: number | null;
  progressPct: number | null;
  complianceStatus: ComplianceZone;
  onboardingComplete: boolean;
};

export type JurisdictionAuthority = {
  organizationId: string;
  orgName: string;
  verified: boolean;
  jurisdictionCountry: string;       // ISO-2 code, e.g. "QA"
  authorityCode: string | null;      // e.g. "DHP", "QCHP"
  authoritySubtype: string | null;
};

export type JurisdictionStats = {
  total: number;
  compliant: number;
  atRisk: number;
  nonCompliant: number;
  unknown: number;
  expiringSoon: number;              // license ≤ 30 days
  expired: number;
  complianceRate: number;            // % compliant of those with data
  onboardingComplete: number;
};

/** Resolve the authority context for a government_admin / government_staff user. */
export async function getAuthorityForUser(authId: string): Promise<JurisdictionAuthority | null> {
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name, verified)")
    .eq("auth_id", authId)
    .in("role", ["government_admin", "government_staff"])
    .limit(1)
    .maybeSingle();

  if (!member) return null;

  const orgId = member.organization_id as string;
  const _orgs = member.organizations as { name: string; verified: boolean }[] | { name: string; verified: boolean } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : _orgs;

  const { data: settings } = await admin
    .from("government_settings")
    .select("jurisdiction_country, authority_code, authority_subtype")
    .eq("organization_id", orgId)
    .maybeSingle();

  return {
    organizationId: orgId,
    orgName: org?.name ?? "Your Authority",
    verified: org?.verified ?? false,
    jurisdictionCountry: (settings?.jurisdiction_country ?? "QA").toUpperCase(),
    authorityCode: settings?.authority_code ?? null,
    authoritySubtype: settings?.authority_subtype ?? null,
  };
}

function zoneOf(status: string | null | undefined): ComplianceZone {
  if (status === "compliant" || status === "at_risk" || status === "non_compliant") return status;
  return "unknown";
}

/**
 * All professionals in the authority's jurisdiction, joined to employer + CME + license.
 * `audit` defaults to true — pass false only for internal aggregations that re-use a
 * read already logged in the same request.
 */
export async function getJurisdictionProfessionals(
  authority: JurisdictionAuthority,
  actorAuthId: string,
  audit = true,
): Promise<JurisdictionProfessional[]> {
  const admin = createAdminClient();
  const code = authority.jurisdictionCountry;
  const countryValues = countryValuesForCode(code);

  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, full_name, email, profession, specialty, license_number, license_expiry, onboarding_complete, country_of_residence")
    .in("country_of_residence", countryValues);

  const rows = profiles ?? [];
  const ids = rows.map((p) => p.auth_id);
  if (ids.length === 0) return [];

  // CME wallets (may be multi-country) and employer links, in parallel.
  const [walletsRes, linksRes] = await Promise.all([
    admin.from("cme_wallets")
      .select("professional_id, country, completed_credits, required_credits, compliance_status, is_primary")
      .in("professional_id", ids),
    admin.from("employer_link_requests")
      .select("professional_id, organization_id, status, organizations(name, type)")
      .in("professional_id", ids)
      .eq("status", "approved"),
  ]);

  // Wallet: prefer the wallet matching the jurisdiction country, else the primary.
  const walletsByPro = new Map<string, { completed: number; required: number; status: string }>();
  for (const w of walletsRes.data ?? []) {
    const wCode = toCountryCode(String(w.country ?? ""));
    const existing = walletsByPro.get(w.professional_id);
    const isMatch = wCode === code;
    if (!existing || isMatch || w.is_primary) {
      // jurisdiction match wins; otherwise primary; otherwise first seen
      if (isMatch || !existing) {
        walletsByPro.set(w.professional_id, {
          completed: w.completed_credits ?? 0,
          required: w.required_credits ?? 50,
          status: w.compliance_status as string,
        });
      }
    }
  }

  // Employer: first approved link to a non-regulatory organization.
  const employerByPro = new Map<string, { id: string; name: string }>();
  for (const l of linksRes.data ?? []) {
    if (!l.organization_id) continue;
    const _org = l.organizations as { name: string; type: string }[] | { name: string; type: string } | null;
    const org = Array.isArray(_org) ? _org[0] : _org;
    if (!org || org.type === "regulatory_body") continue;
    if (!employerByPro.has(l.professional_id)) {
      employerByPro.set(l.professional_id, { id: l.organization_id, name: org.name });
    }
  }

  const now = Date.now();
  const result: JurisdictionProfessional[] = rows.map((p) => {
    const wallet = walletsByPro.get(p.auth_id);
    const employer = employerByPro.get(p.auth_id) ?? null;
    const licenseExpiry = p.license_expiry ?? null;
    const daysToExpiry = licenseExpiry
      ? Math.ceil((new Date(licenseExpiry).getTime() - now) / 86400000)
      : null;
    const completed = wallet?.completed ?? null;
    const required = wallet?.required ?? null;
    const progressPct = completed !== null && required
      ? Math.min(Math.round((completed / required) * 100), 100)
      : null;

    return {
      professionalId: p.auth_id,
      name: p.full_name ?? "Unknown",
      profession: p.profession ?? "—",
      specialty: p.specialty ?? "—",
      email: p.email ?? null,
      employer: employer?.name ?? null,
      employerId: employer?.id ?? null,
      licenseNumber: p.license_number ?? null,
      licenseExpiry,
      daysToExpiry,
      completedCredits: completed,
      requiredCredits: required,
      progressPct,
      complianceStatus: zoneOf(wallet?.status),
      onboardingComplete: p.onboarding_complete ?? false,
    };
  });

  if (audit) {
    logAudit({
      actorAuthId,
      action: "government.jurisdiction_view",
      targetTable: "professional_profiles",
      targetId: authority.organizationId,
      metadata: { jurisdiction: code, authority: authority.authorityCode, professionals_returned: result.length },
    });
  }

  return result;
}

/** Aggregate compliance stats from a professional list. */
export function computeStats(professionals: JurisdictionProfessional[]): JurisdictionStats {
  const total = professionals.length;
  const compliant = professionals.filter((p) => p.complianceStatus === "compliant").length;
  const atRisk = professionals.filter((p) => p.complianceStatus === "at_risk").length;
  const nonCompliant = professionals.filter((p) => p.complianceStatus === "non_compliant").length;
  const unknown = professionals.filter((p) => p.complianceStatus === "unknown").length;
  const expiringSoon = professionals.filter((p) => p.daysToExpiry !== null && p.daysToExpiry <= 30 && p.daysToExpiry >= 0).length;
  const expired = professionals.filter((p) => p.daysToExpiry !== null && p.daysToExpiry < 0).length;
  const withData = total - unknown;
  const complianceRate = withData > 0 ? Math.round((compliant / withData) * 100) : 0;
  const onboardingComplete = professionals.filter((p) => p.onboardingComplete).length;

  return { total, compliant, atRisk, nonCompliant, unknown, expiringSoon, expired, complianceRate, onboardingComplete };
}

/** The "red zone": professionals a regulator must act on. */
export function redZone(professionals: JurisdictionProfessional[]): JurisdictionProfessional[] {
  return professionals
    .filter((p) =>
      p.complianceStatus === "non_compliant" ||
      p.complianceStatus === "at_risk" ||
      (p.daysToExpiry !== null && p.daysToExpiry <= 30)
    )
    .sort((a, b) => {
      const rank = (p: JurisdictionProfessional) =>
        p.complianceStatus === "non_compliant" ? 0 : p.complianceStatus === "at_risk" ? 1 : 2;
      const r = rank(a) - rank(b);
      if (r !== 0) return r;
      return (a.daysToExpiry ?? 9999) - (b.daysToExpiry ?? 9999);
    });
}
