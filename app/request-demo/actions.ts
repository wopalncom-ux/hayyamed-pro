"use server";

import { sendDemoRequestEmail, sendDemoRequestConfirmationEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/server";

const ORG_TYPES = [
  "Private clinic",
  "Hospital department",
  "Multi-site healthcare group",
  "University / medical school",
  "Government health authority",
  "Other",
];

const STAFF_RANGES = [
  "1–10",
  "11–25",
  "26–50",
  "51–200",
  "200+",
];

const COUNTRIES = [
  "Qatar",
  "Saudi Arabia",
  "UAE (Dubai)",
  "UAE (Abu Dhabi)",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Multiple GCC countries",
  "Other",
];

export async function submitDemoRequest(
  formData: FormData,
): Promise<{ error?: string; success?: true }> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const jobTitle = (formData.get("jobTitle") as string | null)?.trim() ?? "";
  const orgName = (formData.get("orgName") as string | null)?.trim() ?? "";
  const orgType = (formData.get("orgType") as string | null)?.trim() ?? "";
  const staffCount = (formData.get("staffCount") as string | null)?.trim() ?? "";
  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || name.length < 2) return { error: "Please enter your full name." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Please enter a valid email address." };
  if (!jobTitle || jobTitle.length < 2) return { error: "Please enter your job title." };
  if (!orgName || orgName.length < 2) return { error: "Please enter your organisation name." };
  if (!ORG_TYPES.includes(orgType)) return { error: "Please select an organisation type." };
  if (!STAFF_RANGES.includes(staffCount)) return { error: "Please select a staff count range." };
  if (!COUNTRIES.includes(country)) return { error: "Please select your country." };
  if (message.length > 2000) return { error: "Message is too long (max 2000 characters)." };

  // Persist to DB first — email is fire-and-forget; DB is the source of truth for pipeline
  const admin = createAdminClient();
  const { error: dbError } = await admin.from("demo_requests").insert({
    name, email, job_title: jobTitle, org_name: orgName,
    org_type: orgType, staff_count: staffCount, country,
    message: message || null,
  });
  if (dbError) return { error: "Something went wrong. Please email us at support@hayyamed.pro." };

  sendDemoRequestEmail({ name, email, jobTitle, orgName, orgType, staffCount, country, message }).catch(() => {});
  sendDemoRequestConfirmationEmail({ to: email, name, orgName }).catch(() => {});
  return { success: true };
}
