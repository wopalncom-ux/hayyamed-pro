"use client";

import { useState, useTransition } from "react";
import { saveAIModuleSettings } from "./actions";

// ── Model catalogue ───────────────────────────────────────────────────────────
type Provider = "anthropic" | "openai" | "google" | "disabled";

interface ModelOption {
  id: string;
  label: string;
  provider: Provider;
  costPer1k: number; // USD per 1K output tokens (approx)
  speed: "fast" | "medium" | "slow";
  capability: "basic" | "standard" | "advanced";
}

const MODEL_OPTIONS: ModelOption[] = [
  // Anthropic
  { id: "claude-haiku-4-5-20251001",  label: "Claude Haiku 4.5",   provider: "anthropic", costPer1k: 0.00125, speed: "fast",   capability: "basic" },
  { id: "claude-sonnet-4-6",          label: "Claude Sonnet 4.6",  provider: "anthropic", costPer1k: 0.015,   speed: "medium", capability: "standard" },
  { id: "claude-opus-4-8",            label: "Claude Opus 4.8",    provider: "anthropic", costPer1k: 0.075,   speed: "slow",   capability: "advanced" },
  // OpenAI
  { id: "gpt-4o-mini",                label: "GPT-4o Mini",        provider: "openai",    costPer1k: 0.0006,  speed: "fast",   capability: "basic" },
  { id: "gpt-4o",                     label: "GPT-4o",             provider: "openai",    costPer1k: 0.010,   speed: "medium", capability: "standard" },
  { id: "o1-mini",                    label: "OpenAI o1 Mini",     provider: "openai",    costPer1k: 0.0110,  speed: "slow",   capability: "advanced" },
  // Google
  { id: "gemini-1.5-flash",           label: "Gemini 1.5 Flash",   provider: "google",    costPer1k: 0.00035, speed: "fast",   capability: "basic" },
  { id: "gemini-1.5-pro",             label: "Gemini 1.5 Pro",     provider: "google",    costPer1k: 0.00525, speed: "medium", capability: "standard" },
  // Disabled
  { id: "disabled",                   label: "Disabled",           provider: "disabled",  costPer1k: 0,       speed: "fast",   capability: "basic" },
];

// ── Module definitions ────────────────────────────────────────────────────────
interface AIModule {
  key: string;
  label: string;
  description: string;
  icon: string;
  tier: "free" | "pro" | "employer" | "admin";
  defaultModel: string;
  recommendedModel: string;
  callsPerMonth: number; // estimated
}

const AI_MODULES: AIModule[] = [
  {
    key: "ai_compliance_chat",
    label: "Compliance Chat",
    description: "Answers professional questions about CME rules, credit gaps, and renewal requirements.",
    icon: "💬",
    tier: "pro",
    defaultModel: "claude-haiku-4-5-20251001",
    recommendedModel: "claude-haiku-4-5-20251001",
    callsPerMonth: 5000,
  },
  {
    key: "ai_gap_analysis",
    label: "Gap Analysis",
    description: "Deep compliance gap analysis — identifies missing credits by category and suggests activities.",
    icon: "📊",
    tier: "pro",
    defaultModel: "claude-sonnet-4-6",
    recommendedModel: "claude-sonnet-4-6",
    callsPerMonth: 1500,
  },
  {
    key: "ai_ocr_certificate",
    label: "OCR Certificate",
    description: "Extracts CME credit data from uploaded certificate images using vision AI.",
    icon: "🔍",
    tier: "pro",
    defaultModel: "claude-sonnet-4-6",
    recommendedModel: "claude-sonnet-4-6",
    callsPerMonth: 800,
  },
  {
    key: "ai_category_detect",
    label: "Category Detection",
    description: "Automatically classifies CME activities into the correct QCHP/SCFHS categories.",
    icon: "🏷️",
    tier: "pro",
    defaultModel: "claude-haiku-4-5-20251001",
    recommendedModel: "claude-haiku-4-5-20251001",
    callsPerMonth: 3000,
  },
  {
    key: "ai_compliance_recommendations",
    label: "Smart Recommendations",
    description: "Suggests specific CME activities to close gaps, personalised to profession and authority.",
    icon: "✨",
    tier: "pro",
    defaultModel: "claude-sonnet-4-6",
    recommendedModel: "claude-sonnet-4-6",
    callsPerMonth: 1200,
  },
  {
    key: "ai_country_rules",
    label: "Country Rules Config",
    description: "AI-assisted configuration of new country compliance rules via admin panel.",
    icon: "🌍",
    tier: "admin",
    defaultModel: "claude-opus-4-8",
    recommendedModel: "claude-opus-4-8",
    callsPerMonth: 50,
  },
  {
    key: "ai_voice_assistant",
    label: "Voice Assistant (Hayya AI)",
    description: "Floating voice orb — speech-to-text input, Claude reasoning, text-to-speech output.",
    icon: "🎙️",
    tier: "pro",
    defaultModel: "claude-haiku-4-5-20251001",
    recommendedModel: "claude-haiku-4-5-20251001",
    callsPerMonth: 2000,
  },
  {
    key: "ai_employer_analyzer",
    label: "Employer AI Analyzer",
    description: "Workforce compliance heatmaps, risk scoring, and PDF/voice reports for employers.",
    icon: "🏥",
    tier: "employer",
    defaultModel: "claude-sonnet-4-6",
    recommendedModel: "claude-sonnet-4-6",
    callsPerMonth: 400,
  },
  {
    key: "ai_provider_analyzer",
    label: "Provider AI Analyzer",
    description: "Demand prediction, gap analysis, and revenue opportunity reports for training providers.",
    icon: "🎓",
    tier: "employer",
    defaultModel: "claude-sonnet-4-6",
    recommendedModel: "claude-sonnet-4-6",
    callsPerMonth: 200,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const PROVIDER_COLORS: Record<Provider, string> = {
  anthropic: "bg-[#e8f0fe] text-[#1a56a0]",
  openai:    "bg-[#f0fdf4] text-[#16a34a]",
  google:    "bg-[#fef9c3] text-[#d97706]",
  disabled:  "bg-[#f1f5f9] text-[#64748b]",
};

const PROVIDER_LABELS: Record<Provider, string> = {
  anthropic: "Anthropic",
  openai:    "OpenAI",
  google:    "Google",
  disabled:  "Off",
};

const TIER_COLORS: Record<string, string> = {
  free:     "bg-[#f1f5f9] text-[#64748b]",
  pro:      "bg-[#fdf4ff] text-[#7c3aed]",
  employer: "bg-[#fff7ed] text-[#d97706]",
  admin:    "bg-[#fef2f2] text-[#dc2626]",
};

const SPEED_COLORS: Record<string, string> = {
  fast:   "text-[#16a34a]",
  medium: "text-[#d97706]",
  slow:   "text-[#dc2626]",
};

const CAP_COLORS: Record<string, string> = {
  basic:    "text-[#64748b]",
  standard: "text-[#1a56a0]",
  advanced: "text-[#7c3aed]",
};

function getModel(id: string): ModelOption {
  return MODEL_OPTIONS.find((m) => m.id === id) ?? MODEL_OPTIONS[0];
}

function estimateMonthlyCost(modelId: string, callsPerMonth: number): number {
  const model = getModel(modelId);
  const avgOutputTokens = 350; // rough average
  return (model.costPer1k / 1000) * avgOutputTokens * callsPerMonth;
}

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({
  module,
  selectedModel,
  enabled,
  onModelChange,
  onToggle,
}: {
  module: AIModule;
  selectedModel: string;
  enabled: boolean;
  onModelChange: (key: string, model: string) => void;
  onToggle: (key: string, enabled: boolean) => void;
}) {
  const model = getModel(selectedModel);
  const isRecommended = selectedModel === module.recommendedModel;
  const monthlyCost = enabled ? estimateMonthlyCost(selectedModel, module.callsPerMonth) : 0;

  return (
    <div className={`bg-white rounded-2xl border transition-all ${enabled ? "border-[#e2e8f0]" : "border-dashed border-[#e2e8f0] opacity-60"}`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{module.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-[#0f1f3d]">{module.label}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TIER_COLORS[module.tier]}`}>
                  {module.tier.charAt(0).toUpperCase() + module.tier.slice(1)}
                </span>
                {!isRecommended && enabled && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#d97706]">
                    Non-default
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{module.description}</p>
            </div>
          </div>

          {/* Enable/disable toggle */}
          <button
            type="button"
            onClick={() => onToggle(module.key, !enabled)}
            aria-label={enabled ? `Disable ${module.label}` : `Enable ${module.label}`}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${
              enabled ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                enabled ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Model selector */}
        <div className="mt-4 space-y-2">
          <label className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">AI Model</label>
          <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto">
            {MODEL_OPTIONS.map((opt) => {
              const isSelected = selectedModel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { if (enabled) onModelChange(module.key, opt.id); }}
                  disabled={!enabled}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-[#1a56a0] bg-[#f0f7ff]"
                      : enabled
                      ? "border-[#e2e8f0] hover:border-[#bfdbfe] hover:bg-[#f8fafc]"
                      : "border-[#e2e8f0] bg-[#f8fafc] cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className={`text-xs font-medium truncate ${isSelected ? "text-[#1a56a0]" : "text-[#374151]"}`}>
                      {opt.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${PROVIDER_COLORS[opt.provider]}`}>
                      {PROVIDER_LABELS[opt.provider]}
                    </span>
                    {opt.provider !== "disabled" && (
                      <>
                        <span className={`text-[10px] ${SPEED_COLORS[opt.speed]}`}>{opt.speed}</span>
                        <span className={`text-[10px] ${CAP_COLORS[opt.capability]}`}>{opt.capability}</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cost estimate */}
        {enabled && model.provider !== "disabled" && (
          <div className="mt-3 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Est. ~{module.callsPerMonth.toLocaleString()} calls/mo</span>
            <span className="font-semibold text-[#374151]">
              ~${monthlyCost.toFixed(2)}/mo
            </span>
          </div>
        )}
        {(!enabled || model.provider === "disabled") && (
          <div className="mt-3 pt-3 border-t border-[#f1f5f9]">
            <span className="text-xs text-[#94a3b8]">Module disabled — no AI cost</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AIModulesPage() {
  // State: modelId per module key
  const [models, setModels] = useState<Record<string, string>>(() =>
    Object.fromEntries(AI_MODULES.map((m) => [m.key, m.defaultModel]))
  );

  // State: enabled per module key
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(AI_MODULES.map((m) => [m.key, true]))
  );

  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleModelChange = (key: string, model: string) => {
    setModels((prev) => ({ ...prev, [key]: model }));
    setSaved(false);
  };

  const handleToggle = (key: string, val: boolean) => {
    setEnabled((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      // Build settings entries: ai_module_<key>_model and ai_module_<key>_enabled
      const entries: { key: string; value: string }[] = [];
      for (const module of AI_MODULES) {
        entries.push({ key: `${module.key}_model`,   value: models[module.key] });
        entries.push({ key: `${module.key}_enabled`, value: enabled[module.key] ? "true" : "false" });
      }
      await saveAIModuleSettings(entries);
      setSaved(true);
    });
  };

  // Total estimated monthly cost
  const totalCost = AI_MODULES.reduce((sum, module) => {
    if (!enabled[module.key]) return sum;
    return sum + estimateMonthlyCost(models[module.key], module.callsPerMonth);
  }, 0);

  const enabledCount = Object.values(enabled).filter(Boolean).length;

  // Provider breakdown
  const providerBreakdown = AI_MODULES.reduce<Record<Provider, number>>((acc, module) => {
    if (!enabled[module.key]) return acc;
    const provider = getModel(models[module.key]).provider;
    acc[provider] = (acc[provider] ?? 0) + 1;
    return acc;
  }, {} as Record<Provider, number>);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f3d] mb-1">AI Module Control Center</h1>
          <p className="text-sm text-[#64748b]">
            Configure models, enable/disable modules, and monitor estimated costs across all Hayya Med AI features.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-[#1a56a0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1547a0] disabled:opacity-60 transition-colors shadow-md shadow-blue-900/20 whitespace-nowrap"
        >
          {isPending ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
        </button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
          <p className="text-xs text-[#64748b] mb-1">Modules active</p>
          <p className="text-2xl font-bold text-[#0f1f3d]">{enabledCount} <span className="text-sm font-normal text-[#94a3b8]">/ {AI_MODULES.length}</span></p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
          <p className="text-xs text-[#64748b] mb-1">Est. monthly cost</p>
          <p className="text-2xl font-bold text-[#0f1f3d]">${totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
          <p className="text-xs text-[#64748b] mb-2">Providers in use</p>
          <div className="flex gap-1.5 flex-wrap">
            {(Object.entries(providerBreakdown) as [Provider, number][]).filter(([p]) => p !== "disabled").map(([p, n]) => (
              <span key={p} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PROVIDER_COLORS[p]}`}>
                {PROVIDER_LABELS[p]} ×{n}
              </span>
            ))}
            {Object.values(providerBreakdown).every((v) => v === 0) && (
              <span className="text-xs text-[#94a3b8]">None</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
          <p className="text-xs text-[#64748b] mb-1">Annual AI budget</p>
          <p className="text-2xl font-bold text-[#0f1f3d]">${(totalCost * 12).toFixed(0)}</p>
        </div>
      </div>

      {/* Provider key */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs text-[#64748b] self-center mr-1">Provider:</span>
        {(Object.entries(PROVIDER_LABELS) as [Provider, string][]).filter(([p]) => p !== "disabled").map(([p, label]) => (
          <span key={p} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${PROVIDER_COLORS[p]}`}>
            {label}
          </span>
        ))}
        <span className="text-[10px] text-[#64748b] self-center ml-2">Speed:</span>
        {(["fast", "medium", "slow"] as const).map((s) => (
          <span key={s} className={`text-[10px] font-semibold ${SPEED_COLORS[s]}`}>{s}</span>
        ))}
        <span className="text-[10px] text-[#64748b] self-center ml-2">Capability:</span>
        {(["basic", "standard", "advanced"] as const).map((c) => (
          <span key={c} className={`text-[10px] font-semibold ${CAP_COLORS[c]}`}>{c}</span>
        ))}
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {AI_MODULES.map((module) => (
          <ModuleCard
            key={module.key}
            module={module}
            selectedModel={models[module.key]}
            enabled={enabled[module.key]}
            onModelChange={handleModelChange}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Notes */}
      <div className="mt-8 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-5 py-4 space-y-1.5">
        <p className="text-sm font-semibold text-[#92400e]">Important notes</p>
        <ul className="text-xs text-[#92400e] space-y-1 list-disc list-inside">
          <li>Cost estimates are approximate based on ~350 average output tokens per call at current public pricing.</li>
          <li>OpenAI and Google providers require separate API keys configured in Secret Manager before enabling.</li>
          <li>Disabling a module removes the feature from the UI for all users in that tier.</li>
          <li>The recommended model for each module is selected based on cost/quality tradeoff and GCC compliance accuracy.</li>
          <li>All AI calls are logged in the audit log regardless of provider — no PII is sent to external AI APIs.</li>
        </ul>
      </div>
    </div>
  );
}
