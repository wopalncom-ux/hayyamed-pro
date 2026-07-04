import { SchemaType, type FunctionDeclaration, type FunctionDeclarationSchema, type Schema } from "@google-cloud/vertexai";

type JsonSchemaLike = {
  type?: string;
  description?: string;
  enum?: string[];
  properties?: Record<string, JsonSchemaLike>;
  required?: string[];
  items?: JsonSchemaLike;
};

type ToolDefinition = {
  name: string;
  description: string;
  input_schema: JsonSchemaLike;
};

// Tool definitions for the compliance-chat agentic loop (Gemini function calling)
export const HAYYA_TOOLS: ToolDefinition[] = [
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

// Gemini (Vertex) function-calling equivalent of HAYYA_TOOLS. Our input_schema
// is lowercase JSON Schema ("object"/"string"/...); Gemini's
// FunctionDeclaration.parameters needs the SchemaType enum ("OBJECT"/"STRING").
// Converted once here so there is a single source of truth for tool definitions.
const SCHEMA_TYPE_MAP: Record<string, SchemaType> = {
  string: SchemaType.STRING,
  number: SchemaType.NUMBER,
  integer: SchemaType.INTEGER,
  boolean: SchemaType.BOOLEAN,
  array: SchemaType.ARRAY,
  object: SchemaType.OBJECT,
};

function toGeminiSchema(schema: JsonSchemaLike): Schema {
  const out: Schema = { type: SCHEMA_TYPE_MAP[schema.type ?? "string"] ?? SchemaType.STRING };
  if (schema.description) out.description = schema.description;
  if (schema.enum) out.enum = schema.enum;
  if (schema.required) out.required = schema.required;
  if (schema.items) out.items = toGeminiSchema(schema.items);
  if (schema.properties) {
    out.properties = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      out.properties[key] = toGeminiSchema(value);
    }
  }
  return out;
}

// FunctionDeclaration.parameters requires `type` and `properties` (unlike the
// looser, fully-optional Schema used for nested properties/items), so wrap the
// recursive conversion to guarantee those two fields at the top level.
function toGeminiParameters(schema: JsonSchemaLike): FunctionDeclarationSchema {
  const converted = toGeminiSchema(schema);
  return {
    type: converted.type ?? SchemaType.OBJECT,
    properties: converted.properties ?? {},
    ...(converted.description ? { description: converted.description } : {}),
    ...(converted.required ? { required: converted.required } : {}),
  };
}

export const GEMINI_TOOLS: FunctionDeclaration[] = HAYYA_TOOLS.map((t) => ({
  name: t.name,
  description: t.description,
  parameters: toGeminiParameters(t.input_schema),
}));
