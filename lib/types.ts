export type UserRole =
  | "healthcare_professional"
  | "employer_admin"
  | "training_provider_admin"
  | "university_admin"
  | "master_admin"
  | "super_admin";

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type EmployerLinkStatus = "pending" | "approved" | "rejected";

export type ComplianceStatus = "compliant" | "at_risk" | "non_compliant";

export type VerificationStatus = "pending" | "verified" | "rejected";

// ── professional_profiles ──────────────────────────────────────────────────

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
  subspecialty: string | null;
  license_number: string | null;
  licensing_authority: string | null;
  license_expiry: string | null;
  onboarding_step: OnboardingStep;
  onboarding_complete: boolean;
  profile_completion_pct: number;
  created_at: string;
  updated_at: string;
}

// ── organizations ──────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "university" | "lab" | "other";
  country: string | null;
  city: string | null;
  verified: boolean;
  created_at: string;
}

// ── organization_members ───────────────────────────────────────────────────

export interface OrganizationMember {
  id: string;
  organization_id: string;
  auth_id: string;
  role: UserRole;
  created_at: string;
}

// ── employer_link_requests ─────────────────────────────────────────────────

export interface EmployerLinkRequest {
  id: string;
  professional_id: string;
  organization_id: string | null;
  unverified_employer_name: string | null;
  status: EmployerLinkStatus;
  requested_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

// ── profile_privacy_settings ───────────────────────────────────────────────

export interface ProfilePrivacySettings {
  id: string;
  professional_id: string;
  employer_can_view_cme_summary: boolean;
  employer_can_view_certificates: boolean;
  employer_can_view_license_expiry: boolean;
  employer_can_view_detailed_cme_activities: boolean;
  employer_can_view_profile_details: boolean;
  updated_at: string;
}

// ── cme_wallets ────────────────────────────────────────────────────────────

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
  updated_at: string;
}

// ── cme_activities ─────────────────────────────────────────────────────────

export interface CmeActivity {
  id: string;
  wallet_id: string;
  professional_id: string;
  title: string;
  provider: string | null;
  activity_date: string;
  credits: number;
  certificate_url: string | null;
  verification_status: VerificationStatus;
  employer_visible: boolean;
  created_at: string;
}

// ── audit_logs ─────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  actor_auth_id: string;
  action: string;
  target_table: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ── training_providers ─────────────────────────────────────────────────────

export type ProviderStatus = "pending" | "active" | "suspended";

export interface TrainingProvider {
  id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  country_code: string;
  is_accredited: boolean;
  accreditor: string | null;
  logo_url: string | null;
  contact_email: string | null;
  status: ProviderStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ── courses ────────────────────────────────────────────────────────────────

export type CourseStatus = "draft" | "active" | "closed" | "cancelled";
export type DeliveryMode = "online" | "in_person" | "hybrid";

export interface Course {
  id: string;
  provider_id: string;
  title: string;
  description: string | null;
  category: string;
  credits: number;
  credit_type: string;
  delivery_mode: DeliveryMode;
  duration_hours: number | null;
  price_usd: number | null;
  is_free: boolean;
  country_codes: string[];
  professions: string[];
  start_date: string | null;
  end_date: string | null;
  enrollment_deadline: string | null;
  max_enrollments: number | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

// ── course_enrollments ─────────────────────────────────────────────────────

export type EnrollmentStatus = "enrolled" | "in_progress" | "completed" | "cancelled";

export interface CourseEnrollment {
  id: string;
  course_id: string;
  professional_id: string;
  enrolled_at: string;
  completed_at: string | null;
  credits_issued: number | null;
  status: EnrollmentStatus;
  certificate_url: string | null;
}
