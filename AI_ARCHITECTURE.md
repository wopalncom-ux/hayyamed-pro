# Hayya Med Pro — AI Architecture

## AI Philosophy

AI features in Hayya Med Pro must be: clinically defensible, cost-efficient, explainable to a healthcare professional, and compliant with healthcare data privacy regulations. We do not use AI as a marketing feature — we use it to eliminate genuine compliance friction.

---

## AI Tools Inventory

| Tool | Purpose | Phase | Status |
|---|---|---|---|
| Certificate OCR | Auto-extract activity info from uploaded certificates | Phase 3 | Planned |
| CME Categorization | Auto-suggest category + credits for submitted activity | Phase 3 | Planned |
| Compliance Gap Analysis | "You need 12 more structured credits by June" | Phase 3 | Planned |
| AI Compliance Chatbot | In-dashboard Q&A about compliance status | Phase 3 | Planned |
| Recommendations Engine | Suggest relevant CME activities based on specialty + gap | Phase 3 | Planned |
| Document Classification | Classify uploaded files (certificate vs. attendance letter) | Phase 3 | Planned |
| Predictive Risk Scoring | Flag professionals likely to miss renewal deadline | Phase 4 | Planned |
| Workforce Intelligence | Aggregate compliance analytics for health authorities | Phase 4 | Planned |

---

## LLM Strategy

### Primary Model: Gemini Flash Lite (Google, via Vertex AI) — revised 2026-07-05, permanent policy

**Rationale:**
- Single model handles every task tier at ~10–50× lower cost than the original Claude-tiered plan
- Sufficient reasoning quality for compliance rule interpretation and gap analysis at current data volumes
- Strong multilingual support (Arabic + English)
- Runs on the same GCP service-account auth as the rest of the platform — no separate vendor account, one bill
- Available via Vertex AI (no infrastructure management)

Claude/Anthropic was fully removed from the codebase on 2026-07-04. This was evaluated and adopted as permanent architecture, not a temporary cost override — see EXECUTIVE_MANDATE.md Domain 5.

### Model Selection by Task

| Task | Model | Rationale |
|---|---|---|
| Compliance chatbot (simple queries) | Gemini Flash Lite | Fast, cheap, sufficient — streaming + agentic tool-use via Vertex function calling |
| Compliance gap analysis | Gemini Flash Lite | Reasoning quality sufficient |
| Document OCR interpretation | Gemini Flash Lite (multimodal) | Vision support built in |
| Rules engine configuration assistance | Gemini Flash Lite | Sufficient; escalate to a larger Gemini tier if regulatory complexity outgrows it |
| Workforce intelligence reports | Gemini Flash Lite | Long-context sufficient at current volumes |

### Fallback Strategy
- Primary: Gemini Flash Lite via Vertex AI
- Retry: one automatic retry on transient Vertex errors (see `app/api/ai/hayya-assistant/route.ts`)
- Emergency: Cached rule-based responses (no LLM dependency for compliance calculations)
- If a task's output quality is found lacking, escalate to a larger Gemini tier before reintroducing a second AI provider

---

## AI Agent Architecture (Phase 3)

```
User Query
    ↓
Compliance Agent (Gemini Flash Lite)
    ├── Tool: get_compliance_rules(country, profession)
    ├── Tool: get_cme_wallet(professional_id)
    ├── Tool: get_pending_activities(professional_id)
    ├── Tool: get_license_expiry(professional_id)
    └── Tool: get_recommendations(specialty, gap_analysis)
    ↓
Structured Response (JSON)
    ↓
Dashboard Display (formatted, actionable)
```

**Agent constraints:**
- Agents cannot modify data — read-only tool access
- All agent calls are logged in `audit_logs` with `action: 'ai.query'`
- Agent responses are not stored — computed on demand
- Maximum context window: 100,000 tokens (sufficient for full compliance history)

---

## Certificate OCR Pipeline

```
User uploads certificate (PDF/JPG/PNG)
    ↓
Stored in Supabase Storage (private bucket)
    ↓
OCR Trigger (Supabase Edge Function)
    ↓
Gemini Flash Lite (multimodal — extract: title, provider, date, credits, accreditor)
    ↓
Confidence score check
    ├── High confidence (>90%): Pre-fill CME submission form
    └── Low confidence (<90%): Show extracted data with "please verify" warning
    ↓
User reviews and submits
    ↓
Human admin verification (unchanged — AI is assist, not replace)
```

---

## Cost Optimization Strategy

### Caching
- Cache compliance rule interpretations (rules change rarely)
- Cache recommendations by specialty + country + gap profile
- TTL: 24 hours for rule cache, 1 hour for recommendations

### Tiering
- Free users: No AI features
- Pro users: Compliance chatbot, gap analysis (Gemini Flash Lite)
- Employer users: Workforce analytics, risk scoring (Gemini Flash Lite)
- Enterprise: Same model, no artificial ceiling on report scope — escalate to a larger Gemini tier only if a specific use case demands it

### Token Budget Targets (revised 2026-07-05 for Gemini Flash Lite pricing — ~10–50× cheaper than the original Claude-tiered plan)
| Feature | Max tokens/call | Target cost/call |
|---|---|---|
| Compliance chatbot | 2,000 | $0.0004 |
| Gap analysis | 5,000 | $0.001 |
| OCR extraction | 3,000 + image | $0.0006 |
| Workforce report | 50,000 | $0.01 |

### Monthly AI Cost Targets (revised 2026-07-05)
| ARR | Estimated AI cost | % of revenue |
|---|---|---|
| $50,000 | $20/month | 0.04% |
| $200,000 | $50/month | 0.03% |
| $1,000,000 | $150/month | 0.02% |

---

## Prompt Governance

### Rules
1. All prompts are versioned in `lib/ai/prompts/` directory
2. Prompts are reviewed before production deployment
3. System prompts must not expose internal data structures
4. No PII included in prompts — use anonymized identifiers
5. All prompts include: role context, output format constraint, fallback instruction

### Example System Prompt (Compliance Chatbot)
```
You are a CME compliance advisor for Hayya Med Pro. 
You help healthcare professionals understand their compliance status.
You have access to the professional's CME wallet, activities, and country rules.
Always be accurate, concise, and direct. 
If you are uncertain, say so explicitly — do not guess about regulatory requirements.
Format responses in plain language, not legal language.
Respond in the same language as the user's question (Arabic or English).
Never recommend specific CME providers or courses (conflicts of interest).
```

---

## AI Security Requirements

| Requirement | Standard |
|---|---|
| Data sent to LLM | Anonymized by default — use professional_id not name/license |
| PII in prompts | Prohibited for external LLM APIs |
| Prompt injection prevention | Input sanitization before prompt construction |
| Output validation | Structured JSON output with schema validation |
| Audit logging | Every AI call logged: model, token count, action, professional_id |
| Data retention | AI logs retained 90 days, then purged |
| Regional compliance | For EU expansion: evaluate Azure OpenAI (EU data residency) |

---

## AI Monitoring Requirements

| Metric | Alert Threshold |
|---|---|
| AI call latency | > 5 seconds → alert |
| API error rate | > 2% → alert |
| Monthly AI cost | > $500 → review |
| Confidence score distribution | < 70% avg → review prompt |
| User feedback (thumbs down) | > 10% → review output quality |
