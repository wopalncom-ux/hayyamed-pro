"use server";

import { sendSupportEmail, sendSupportConfirmationEmail } from "@/lib/email";

const SUBJECTS = [
  "CME or compliance question",
  "Technical issue",
  "Billing or subscription",
  "Account access",
  "Feature request",
  "Partnership inquiry",
  "Other",
];

export async function submitContactForm(formData: FormData): Promise<{ error?: string; success?: true }> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || name.length < 2) return { error: "Please enter your name." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (!SUBJECTS.includes(subject)) return { error: "Please select a subject." };
  if (!message || message.length < 10) return { error: "Please enter a message (at least 10 characters)." };
  if (message.length > 3000) return { error: "Message is too long (max 3000 characters)." };

  await sendSupportEmail({ name, email, subject, message });
  sendSupportConfirmationEmail({ to: email, name, subject }).catch(() => {});
  return { success: true };
}
