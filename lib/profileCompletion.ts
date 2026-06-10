type Profile = Record<string, unknown>;

const FIELD_WEIGHTS: Array<{ key: string; weight: number }> = [
  { key: "full_name", weight: 10 },
  { key: "date_of_birth", weight: 5 },
  { key: "nationality", weight: 5 },
  { key: "mobile", weight: 5 },
  { key: "profession", weight: 15 },
  { key: "specialty", weight: 10 },
  { key: "license_number", weight: 10 },
  { key: "licensing_authority", weight: 10 },
  { key: "license_expiry", weight: 10 },
  { key: "country_of_residence", weight: 5 },
];
// Total from fields = 85. Remaining 15 = CME wallet (10) + employer link (5) — tracked separately.

export function calcProfileCompletion(
  profile: Profile,
  extras?: { hasCmeWallet?: boolean; hasEmployerLink?: boolean }
): number {
  let pct = FIELD_WEIGHTS.reduce((sum, { key, weight }) => {
    return sum + (profile[key] ? weight : 0);
  }, 0);

  if (extras?.hasCmeWallet) pct += 10;
  if (extras?.hasEmployerLink) pct += 5;

  return Math.min(pct, 100);
}
