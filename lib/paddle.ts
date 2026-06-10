import { Paddle, Environment } from "@paddle/paddle-node-sdk";

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

export const PLANS = {
  pro: {
    name: "Pro",
    price: 49,
    currency: "USD",
    interval: "year",
    paddlePriceId: process.env.PADDLE_PRO_PRICE_ID ?? "",
    features: [
      "Unlimited CME activities",
      "PDF compliance reports",
      "Email reminders & alerts",
      "License expiry warnings (30 & 7 days)",
      "Priority support",
    ],
  },
  employer: {
    name: "Employer",
    price: 199,
    currency: "USD",
    interval: "year",
    paddlePriceId: process.env.PADDLE_EMPLOYER_PRICE_ID ?? "",
    features: [
      "Everything in Pro",
      "Team compliance dashboard",
      "Bulk compliance reporting",
      "Staff link management",
      "Dedicated account manager",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
