// Maps the display name stored in professional_profiles.country_of_residence
// and cme_wallets.country to the ISO 3166-1 alpha-2 code used in the rules engine tables.
// Always add new entries here — never hardcode codes elsewhere.

const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  Qatar: "QA",
  "Saudi Arabia": "SA",
  UAE: "AE",
  "United Arab Emirates": "AE",
  Kuwait: "KW",
  Bahrain: "BH",
  Oman: "OM",
  Egypt: "EG",
  Jordan: "JO",
  UK: "GB",
  "United Kingdom": "GB",
  India: "IN",
  Australia: "AU",
  USA: "US",
  "United States": "US",
  Canada: "CA",
};

/** Returns the ISO code for a country name, or the input unchanged if already a code / unknown. */
export function toCountryCode(nameOrCode: string): string {
  return COUNTRY_NAME_TO_CODE[nameOrCode] ?? nameOrCode;
}
