import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import type { BillingInterval, EmployerTier } from "./types";

// Lazy-initialized — prevents build failure when PADDLE_API_KEY is not yet configured
let _paddle: Paddle | null = null;

export function getPaddle(): Paddle {
  if (!_paddle) {
    _paddle = new Paddle(process.env.PADDLE_API_KEY ?? "not-configured", {
      environment:
        process.env.NODE_ENV === "production"
          ? Environment.production
          : Environment.sandbox,
    });
  }
  return _paddle;
}

// ── Individual plan ────────────────────────────────────────────────────────

export const PRO_PLAN = {
  name: "Pro",
  currency: "USD",
  monthly: { price: 6, paddlePriceId: process.env.PADDLE_PRO_MONTHLY_PRICE_ID ?? "" },
  annual:  { price: 61.20, paddlePriceId: process.env.PADDLE_PRO_ANNUAL_PRICE_ID ?? "" },
  annualDiscountPct: 15,
  features: [
    "Unlimited CME activities",
    "PDF compliance reports (QCHP-ready)",
    "AI compliance chatbot (Claude)",
    "AI gap analysis & recommendations",
    "Certificate storage & verification",
    "Email reminders & license alerts",
    "License expiry warnings (30 & 7 days)",
    "Priority support",
  ],
} as const;

// ── Employer tiers ─────────────────────────────────────────────────────────

export type EmployerTierKey = Exclude<EmployerTier, "enterprise">;

export interface EmployerTierConfig {
  label: string;
  maxStaff: number;
  monthly: { price: number; paddlePriceId: string };
  annual:  { price: number; paddlePriceId: string };
}

export const EMPLOYER_TIERS: Record<EmployerTierKey, EmployerTierConfig> = {
  clinic: {
    label: "Clinic",
    maxStaff: 10,
    monthly: { price: 50,   paddlePriceId: process.env.PADDLE_EMPLOYER_CLINIC_MONTHLY_PRICE_ID ?? "" },
    annual:  { price: 510,  paddlePriceId: process.env.PADDLE_EMPLOYER_CLINIC_ANNUAL_PRICE_ID  ?? "" },
  },
  growth: {
    label: "Growth",
    maxStaff: 25,
    monthly: { price: 100,  paddlePriceId: process.env.PADDLE_EMPLOYER_GROWTH_MONTHLY_PRICE_ID ?? "" },
    annual:  { price: 1020, paddlePriceId: process.env.PADDLE_EMPLOYER_GROWTH_ANNUAL_PRICE_ID  ?? "" },
  },
  department: {
    label: "Department",
    maxStaff: 50,
    monthly: { price: 180,  paddlePriceId: process.env.PADDLE_EMPLOYER_DEPT_MONTHLY_PRICE_ID ?? "" },
    annual:  { price: 1836, paddlePriceId: process.env.PADDLE_EMPLOYER_DEPT_ANNUAL_PRICE_ID  ?? "" },
  },
  hospital: {
    label: "Hospital",
    maxStaff: 200,
    monthly: { price: 350,  paddlePriceId: process.env.PADDLE_EMPLOYER_HOSP_MONTHLY_PRICE_ID ?? "" },
    annual:  { price: 3570, paddlePriceId: process.env.PADDLE_EMPLOYER_HOSP_ANNUAL_PRICE_ID  ?? "" },
  },
};

export const EMPLOYER_ANNUAL_DISCOUNT_PCT = 15;

export const EMPLOYER_FEATURES = [
  "Employer admin gets Pro plan FREE",
  "Team compliance dashboard",
  "Bulk staff compliance reporting",
  "Staff link management & approvals",
  "Dedicated account manager",
  "Department grouping & analytics",
];

// ── Legacy PLANS export (kept for backward compat with existing checkout route) ──

export const PLANS = {
  pro: {
    name: "Pro",
    price: PRO_PLAN.annual.price,
    currency: "USD",
    interval: "year" as const,
    paddlePriceId: PRO_PLAN.annual.paddlePriceId,
    features: PRO_PLAN.features,
  },
  employer: {
    name: "Employer (Growth)",
    price: EMPLOYER_TIERS.growth.annual.price,
    currency: "USD",
    interval: "year" as const,
    paddlePriceId: EMPLOYER_TIERS.growth.annual.paddlePriceId,
    features: EMPLOYER_FEATURES,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// ── Helper: resolve Paddle price ID from plan+interval+tier ───────────────

export function resolvePaddlePriceId(
  plan: "pro" | "employer",
  interval: BillingInterval,
  employerTier?: EmployerTierKey,
): string {
  if (plan === "pro") {
    return interval === "monthly"
      ? PRO_PLAN.monthly.paddlePriceId
      : PRO_PLAN.annual.paddlePriceId;
  }
  const tier = employerTier ?? "growth";
  return interval === "monthly"
    ? EMPLOYER_TIERS[tier].monthly.paddlePriceId
    : EMPLOYER_TIERS[tier].annual.paddlePriceId;
}
