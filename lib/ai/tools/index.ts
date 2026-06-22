import type Anthropic from "@anthropic-ai/sdk";

// Tool definitions passed to Claude for agentic compliance chat
export const HAYYA_TOOLS: Anthropic.Tool[] = [
  {
    name: "lookup_compliance_rules",
    description:
      "Look up the official CME/CPD requirements for a country and profession from the Hayya Med database. Use this when the user asks about requirements, rules, credit limits, or category caps for any country.",
    input_schema: {
      type: "object" as const,
      properties: {
        country_code: {
          type: "string",
          enum: ["QA", "SA", "AE", "KW", "BH", "OM", "GB", "AU", "IN"],
          description: "ISO 3166-1 alpha-2 country code",
        },
        profession: {
          type: "string",
          description: "e.g. Physician, Nurse, Pharmacist, Dentist",
        },
      },
      required: ["country_code"],
    },
  },
  {
    name: "calculate_credit_gap",
    description:
      "Calculate exactly how many CME credits the professional still needs, broken down by category. Use when asked about gaps, remaining credits, or what is still needed.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "search_marketplace_courses",
    description:
      "Find accredited CME courses in the Hayya Med marketplace. Use when the user asks for course recommendations, wants to find training, or needs to fill a specific category gap.",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string",
          description: "CME category to filter by, e.g. patient_safety, ethics, clinical",
        },
        delivery_mode: {
          type: "string",
          enum: ["online", "in_person", "hybrid", "self_paced"],
        },
        free_only: {
          type: "boolean",
          description: "Return only free courses",
        },
      },
      required: [],
    },
  },
  {
    name: "check_license_status",
    description:
      "Return the professional's current license number, issuing country, and days until expiry. Use when asked about license status, renewal deadline, or license validity.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "log_cme_activity",
    description:
      "Log a new CME activity on behalf of the professional after they have confirmed all details. Always confirm with the user before calling this tool.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string" },
        credits: { type: "number" },
        category: { type: "string" },
        activity_date: { type: "string", description: "YYYY-MM-DD" },
        provider: { type: "string" },
      },
      required: ["title", "credits", "activity_date"],
    },
  },
];

export type ToolName = typeof HAYYA_TOOLS[number]["name"];
