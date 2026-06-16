export interface BadgeDefinition {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: "first_activity",
    title: "First Step",
    description: "Logged your first CME activity",
    icon: "🌱",
    color: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
  },
  {
    key: "ten_credits",
    title: "10 Credits",
    description: "Earned 10 or more CME credits",
    icon: "⚡",
    color: "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  },
  {
    key: "twentyfive_credits",
    title: "25 Credits",
    description: "Earned 25 or more CME credits",
    icon: "🎯",
    color: "bg-[#f5f3ff] text-[#6d28d9] border-[#ddd6fe]",
  },
  {
    key: "fifty_credits",
    title: "50 Credits",
    description: "Earned 50 or more CME credits",
    icon: "🏆",
    color: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]",
  },
  {
    key: "first_certificate",
    title: "Certified",
    description: "Uploaded your first CME certificate",
    icon: "📜",
    color: "bg-[#fdf4ff] text-[#7e22ce] border-[#e9d5ff]",
  },
  {
    key: "compliant",
    title: "Fully Compliant",
    description: "Reached 100% compliance for the first time",
    icon: "✅",
    color: "bg-[#f0fdf4] text-[#15803d] border-[#86efac]",
  },
  {
    key: "streak_4",
    title: "4-Week Streak",
    description: "Logged CME activities for 4 consecutive weeks",
    icon: "🔥",
    color: "bg-[#fff7ed] text-[#d97706] border-[#fde68a]",
  },
  {
    key: "first_reflection",
    title: "Reflective Practitioner",
    description: "Written your first CPD reflection",
    icon: "📝",
    color: "bg-[#eff6ff] text-[#1d4ed8] border-[#93c5fd]",
  },
  {
    key: "portfolio_generated",
    title: "Portfolio Ready",
    description: "Generated your CPD revalidation portfolio",
    icon: "📋",
    color: "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd]",
  },
  {
    key: "hundred_credits",
    title: "Century",
    description: "Earned 100 or more CME credits",
    icon: "💯",
    color: "bg-[#fef9c3] text-[#92400e] border-[#fde68a]",
  },
];

export const BADGE_MAP = Object.fromEntries(
  BADGE_DEFINITIONS.map((b) => [b.key, b])
);

