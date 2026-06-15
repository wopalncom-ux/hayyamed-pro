# Hayya Med Pro — AI Ecosystem Audit
_Generated: 2026-06-15_

---

## Overview

| Tool | Route | Status | Plan Gate | Model |
|------|-------|--------|-----------|-------|
| AI CME Categorizer | `/api/ai/categorize` | ✅ LIVE | Free (all) | Haiku 4.5 |
| AI Compliance Chatbot | `/api/ai/compliance-chat` | ✅ LIVE | Pro+ | Haiku 4.5 (stream) |
| AI Certificate OCR | `/api/ai/ocr-certificate` | ✅ LIVE | Pro+ | Sonnet 4.6 (vision) |
| AI Renewal Prediction | `/api/ai/renewal-prediction` | ✅ LIVE | Pro+ | Haiku 4.5 |
| AI CME Gap Analysis | `/api/ai/gap-analysis` | ✅ LIVE | Pro+ | Sonnet 4.6 |
| AI Learning Pathway | `/api/ai/learning-pathway` | ✅ LIVE | Pro+ | Haiku 4.5 |
| AI Employer Analyzer | `/api/ai/employer-analyzer` | ✅ LIVE | Employer+ | Sonnet 4.6 |
| AI Provider Analyzer | `/api/ai/provider-analyzer` | ✅ LIVE | Provider+ | Sonnet 4.6 |
| AI Voice Chat | `/api/ai/voice-chat` | ✅ LIVE | Pro+ | Haiku 4.5 |

**Infrastructure:** All AI routes use Google Cloud Vertex AI (AnthropicVertex ADC) — no direct Anthropic API key. Authentication via GCP Application Default Credentials on Cloud Run.

---

## Tool 1 — AI CME Categorizer

### Purpose
When a professional logs a CME activity, auto-suggests the activity category (conference, online, workshop, journal, etc.) based on the title they enter.

### Status: ✅ LIVE

### Data Inputs
- `title` (text) — activity title entered by user
- `provider` (text, optional)

### Data Outputs
```typescript
{
  category: "conference" | "online" | "workshop" | "journal" | "teaching" | "simulation" | "mandatory" | "patient_safety" | "other",
  confidence: "high" | "medium" | "low",
  creditSuggestion: number | null,
  notes: string
}
```

### Database Dependencies
- Reads: none (stateless)
- Writes: none (result used to pre-fill form only)

### API Dependencies
- Vertex AI → Haiku 4.5
- Rate limit: not explicitly set (low-cost, free tier)

### Remaining Development
- ⚠️ No call logged to `audit_logs` (only pro-tier AI tools log)
- ⚠️ No `ai_call_logs` table exists — cannot track usage or cost
- Consider adding country context to improve category suggestions

---

## Tool 2 — AI Compliance Chatbot

### Purpose
RAG-augmented conversational assistant for compliance questions. Pulls country rules and user's current CME data to answer "How many credits do I need?", "Am I on track?", etc.

### Status: ✅ LIVE (streaming)

### Data Inputs
- User's auth session → `professional_id`
- `messages[]` — conversation history (max 20 turns)
- Fetches from DB: `cme_wallets`, `cme_activities`, `country_compliance_rules`, `compliance_activity_categories`

### Data Outputs
- Server-Sent Event (SSE) text stream
- No structured schema (free-form conversational)

### Database Dependencies
- Reads: `cme_wallets`, `cme_activities`, `country_compliance_rules`, `compliance_activity_categories`, `professional_profiles`
- Writes: `audit_logs` (action: `ai_compliance_chat`)

### API Dependencies
- Vertex AI → Haiku 4.5 (streaming)
- Rate limit: 30 requests/hour per user

### Remaining Development
- ⚠️ No conversation persistence — users lose chat history on page refresh
- ⚠️ No session ID tracked — cannot reconstruct conversation flow for debugging
- Recommend: store conversation turns in `ai_conversation_sessions` table (missing)
- Arabic language support: prompt not yet bilingual

---

## Tool 3 — AI Certificate OCR

### Purpose
Extracts structured data from uploaded certificate images using Claude's vision capability. Pre-fills the CME activity form.

### Status: ✅ LIVE

### Data Inputs
- Certificate file (image/PDF, max 8MB) via multipart form
- Converted to base64 before sending to Claude

### Data Outputs (Zod-validated)
```typescript
{
  title: string,
  provider: string | null,
  date: string | null,        // ISO date
  credits: number | null,
  category: CMECategory | null
}
```

### Database Dependencies
- Reads: none
- Writes: `audit_logs` (action: `ai_ocr_certificate`)

### API Dependencies
- Vertex AI → Claude Sonnet 4.6 (vision)
- Rate limit: 5 requests/hour per user
- Max file size: 8MB enforced client and server

### Remaining Development
- ⚠️ No confidence score returned — cannot flag low-confidence extractions
- ⚠️ OCR result not stored — cannot audit extraction accuracy retrospectively
- Recommend: add `ocr_confidence` field to output schema
- PDF multi-page support: only first page sent (Claude vision limitation)

---

## Tool 4 — AI Renewal Prediction

### Purpose
Analyses a professional's CME activity cadence over the past 6 months and predicts: risk level, credits shortfall, required monthly pace, and personalised insights.

### Status: ✅ LIVE

### Data Inputs
- User's auth session → `professional_id`
- Fetches: `cme_wallets` (primary), `cme_activities` (last 6 months, grouped by month)
- Prompt: `lib/ai/prompts/renewal-prediction.ts`

### Data Outputs (Zod-validated)
```typescript
{
  risk_level: "on_track" | "at_risk" | "critical",
  credits_shortfall: number,
  projected_completion_date: string | null,
  required_monthly_pace: number,
  insights: string[],  // 1-5 items
  recommendation: string
}
```

### Database Dependencies
- Reads: `cme_wallets`, `cme_activities`
- Writes: `audit_logs` (action: `ai_renewal_prediction`)

### API Dependencies
- Vertex AI → Haiku 4.5
- Rate limit: 10/hour per user

### Remaining Development
- ✅ Fully functional
- Consider caching result in DB for 24h to reduce AI costs on repeated dashboard loads
- No multi-wallet support — uses `is_primary = true` wallet only

---

## Tool 5 — AI CME Gap Analysis

### Purpose
Deep analysis of a professional's CME portfolio against country-specific category requirements. Identifies shortfalls by category, prioritises actions, and suggests specific activity types.

### Status: ✅ LIVE

### Data Inputs
- User session → `professional_id`
- Fetches: `cme_wallets`, `cme_activities` (grouped by category), `compliance_activity_categories` (category caps/minimums for user's country)
- Prompt: `lib/ai/prompts/gap-analysis.ts`

### Data Outputs (Zod-validated)
```typescript
{
  overall_status: "on_track" | "at_risk" | "critical" | "complete",
  summary: string,
  category_gaps: Array<{
    category: string,
    earned: number,
    minimum: number,
    shortfall: number,
    priority: "high" | "medium" | "low",
    recommendation: string
  }>,
  priority_actions: string[],    // max 5
  suggested_activity_types: Array<{
    type: string,
    rationale: string,
    estimated_credits: number
  }>
}
```

### Database Dependencies
- Reads: `cme_wallets`, `cme_activities`, `compliance_activity_categories`
- Writes: `audit_logs` (action: `ai_gap_analysis`)

### API Dependencies
- Vertex AI → Claude Sonnet 4.6 (most capable for multi-category reasoning)
- Rate limit: 5/hour per user (expensive call)

### Remaining Development
- ✅ Fully functional
- ⚠️ Result not cached — expensive to call repeatedly; recommend 24h cache in DB
- No multi-wallet gap analysis (only primary wallet)

---

## Tool 6 — AI Learning Pathway

### Purpose
Generates a personalised 12-month CME learning plan based on the professional's specialty, current progress, and compliance requirements.

### Status: ✅ LIVE

### Data Inputs
- User session → `professional_id`
- Fetches: `professional_profiles` (profession/specialty/country), `cme_wallets` (primary), `cme_activities` (last 6 months)
- Prompt: `lib/ai/prompts/learning-pathway.ts`

### Data Outputs (Zod-validated)
```typescript
{
  plan_summary: string,
  yearly_target_credits: number,
  months: Array<{
    month: 1-12,
    month_name: string,
    target_credits: number,
    focus_area: string,
    activity_type: string,
    rationale: string
  }>,
  key_topics: string[],
  conference_tip: string | null,
  online_platform_tip: string | null
}
```

### Database Dependencies
- Reads: `professional_profiles`, `cme_wallets`, `cme_activities`
- Writes: `audit_logs`

### API Dependencies
- Vertex AI → Haiku 4.5
- Rate limit: 5/hour per user

### Remaining Development
- ⚠️ Pathway not saved to DB — user cannot retrieve previous pathway
- Recommend: `ai_learning_pathways` table (missing) to store generated plans
- No feedback loop — user cannot rate plan quality (needed for model improvement)

---

## Tool 7 — AI Employer Analyzer

### Purpose
Provides AI-powered workforce compliance analysis for employer_admin users. Three analysis types: heatmap insights, risk alerts, and full compliance reports.

### Status: ✅ LIVE

### Data Inputs
- Employer auth + `organizationId`
- `analysisType`: `heatmap` | `risk_alerts` | `full_report`
- Fetches: all staff compliance data via admin client (bypasses RLS)

### Data Outputs (Zod-validated)
```typescript
{
  summary: string,
  key_findings: string[],
  risk_alerts: Array<{ professional_id, severity, message }>,
  recommendations: string[],
  department_breakdown?: object
}
```

### Database Dependencies
- Reads: `employer_link_requests`, `professional_profiles`, `cme_wallets`, `organization_members` (via admin client)
- Writes: `audit_logs`

### API Dependencies
- Vertex AI → Claude Sonnet 4.6
- Rate limit: 10/hour per organisation

### Remaining Development
- ⚠️ Uses admin client — bypasses RLS; should be replaced with proper employer RLS policies
- ⚠️ No analysis result stored — employer cannot compare trend over time
- Recommend: `ai_employer_reports` table (missing)

---

## Tool 8 — AI Provider Analyzer

### Purpose
Training providers can request AI analysis of demand patterns, content gaps, and revenue opportunities in their marketplace listing.

### Status: ✅ LIVE

### Data Inputs
- Provider auth + `organizationId`
- `analysisType`: `demand_prediction` | `gap_analysis` | `revenue_report` | `full_report`

### Data Outputs
- Structured report with findings and recommendations

### Database Dependencies
- Reads: `courses`, `course_enrollments`, `training_providers`
- Writes: `audit_logs`

### API Dependencies
- Vertex AI → Claude Sonnet 4.6

### Remaining Development
- ⚠️ Enrollment data used without aggregation — sends individual professional IDs to AI (PII risk)
- **CRITICAL FIX NEEDED:** Aggregate enrollment data before sending to Claude (count only, no professional_id)

---

## Tool 9 — AI Voice Chat (HayyaVoice)

### Purpose
Conversational AI assistant accessible via the floating HayyaVoiceOrb on the dashboard. Simplified compliance Q&A with voice-like UX.

### Status: ✅ LIVE

### Data Inputs
- `message` (max 500 chars)
- `conversationId` (optional)
- User's country + profession from profile

### Data Outputs
- Structured response with `text` and optional `quick_actions[]`

### Database Dependencies
- Reads: `professional_profiles`, `cme_wallets` (summary only)
- Writes: `audit_logs`

### API Dependencies
- Vertex AI → Haiku 4.5 (fastest, lowest cost)
- Rate limit: 20/hour per user

### Remaining Development
- ⚠️ No conversation memory between sessions
- `conversationId` accepted but not persisted
- Arabic language: prompt not bilingual

---

## Missing AI Tools (Planned)

| Tool | Description | Priority |
|------|-------------|----------|
| AI Career Pathway Engine | Long-term career + CME planning for specialties | HIGH |
| AI Competency Analysis | Maps CME portfolio to specialty competency frameworks | HIGH |
| AI Executive Insights | Hospital/admin dashboard: trend analysis, workforce risk | MEDIUM |
| AI Recommendation Engine | "You might like this course" personalisation | MEDIUM |
| AI Credential Verifier | Cross-reference certificate claims against known accreditor databases | LOW |
| AI Regulatory Monitor | Alert when CME rules change in a country (RAG over regulatory updates) | LOW |

---

## Critical AI Security Issues

| Issue | Tool | Severity | Fix |
|-------|------|----------|-----|
| Individual `professional_id` sent in prompts | All tools | MEDIUM | Use anonymous aggregate IDs |
| Provider Analyzer sends enrollment professional_id list | `/api/ai/provider-analyzer` | HIGH | Aggregate before sending |
| No token budget enforcement | All tools | MEDIUM | Add max_tokens to every call |
| No AI call cost table | All tools | HIGH | Create `ai_call_logs` migration 041 |
| Prompt versions not tracked in DB | All prompts | MEDIUM | Add `prompt_version` column to ai_call_logs |

---

## AI Cost Estimates (Monthly at 1,000 Pro Users)

| Tool | Calls/User/Month | Model | Input Tokens | Output Tokens | Cost/Call | Monthly Total |
|------|-----------------|-------|--------------|---------------|-----------|---------------|
| Categorizer | 10 | Haiku | ~200 | ~100 | ~$0.00004 | $0.40 |
| Compliance Chat | 20 | Haiku | ~2,000 | ~500 | ~$0.00045 | $9.00 |
| Certificate OCR | 5 | Sonnet | ~3,000 | ~200 | ~$0.012 | $60.00 |
| Renewal Prediction | 4 | Haiku | ~1,500 | ~300 | ~$0.00023 | $0.92 |
| Gap Analysis | 3 | Sonnet | ~3,000 | ~800 | ~$0.018 | $54.00 |
| Learning Pathway | 2 | Haiku | ~2,000 | ~1,000 | ~$0.00045 | $0.90 |
| Voice Chat | 15 | Haiku | ~800 | ~200 | ~$0.00013 | $1.95 |
| **TOTAL** | | | | | | **~$127/month** |

At $6/user/month Pro revenue, 1,000 users = $6,000 MRR. AI cost = ~2.1% of MRR. ✅ Acceptable margin.

