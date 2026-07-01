// Canonical profession taxonomy for Hayya Med Pro.
// Stored verbatim in professional_profiles.profession (set during onboarding step 3).
// Used by onboarding and by authority announcement profession-targeting so the
// stored value and the target list always match exactly.
export const PROFESSIONS = [
  "Doctor (MD/MBBS)",
  "Dentist",
  "Pharmacist",
  "Nurse",
  "Physiotherapist",
  "Dietitian",
  "Radiologist",
  "Lab Technician",
  "Other",
] as const;

export type Profession = (typeof PROFESSIONS)[number];

export function isProfession(v: string): v is Profession {
  return (PROFESSIONS as readonly string[]).includes(v);
}
