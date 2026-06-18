// Shared types — kept in sync with web app lib/types.ts

export type ComplianceStatus = "compliant" | "at_risk" | "non_compliant";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ProfessionalProfile {
  id: string;
  auth_id: string;
  email: string;
  full_name: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  country_of_residence: string | null;
  mobile: string | null;
  profession: string | null;
  specialty: string | null;
  license_number: string | null;
  licensing_authority: string | null;
  license_expiry: string | null;
  onboarding_step: OnboardingStep;
  onboarding_complete: boolean;
  profile_completion_pct: number;
  referral_code: string | null;
  pro_trial_ends_at: string | null;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface CmeWallet {
  id: string;
  professional_id: string;
  country: string;
  profession: string;
  specialty: string | null;
  required_credits: number;
  completed_credits: number;
  renewal_cycle_years: number;
  cycle_start_date: string;
  cycle_end_date: string;
  compliance_status: ComplianceStatus;
  is_primary: boolean;
  label: string | null;
  updated_at: string;
}

export interface CmeActivity {
  id: string;
  wallet_id: string;
  professional_id: string;
  title: string;
  provider: string | null;
  activity_date: string;
  credits: number;
  category: string | null;
  accreditor: string | null;
  certificate_url: string | null;
  verification_status: VerificationStatus;
  rejection_reason: string | null;
  employer_visible: boolean;
  created_at: string;
}

export interface License {
  id: string;
  professional_id: string;
  license_type: string;
  license_number: string;
  issuing_authority: string;
  country: string;
  issued_date: string | null;
  expiry_date: string | null;
  status: "active" | "expired" | "pending" | "suspended";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionPlan = "free" | "pro" | "employer" | "university" | "government";

export interface Subscription {
  id: string;
  professional_id: string;
  plan: SubscriptionPlan;
  status: "active" | "trialing" | "past_due" | "canceled" | "incomplete";
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}
