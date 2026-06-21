"use client";

import { useState, useTransition } from "react";
import {
  rotateQR,
  updateVisibility,
  setPassportActive,
} from "@/app/(dashboard)/dashboard/passport/actions";
import { RefreshCw, Eye, EyeOff, Power, Copy, Check } from "lucide-react";

type VisibilityConfig = {
  show_name: boolean;
  show_specialty: boolean;
  show_profession: boolean;
  show_cme_status: boolean;
  show_cme_credits: boolean;
  show_authority: boolean;
};

const VISIBILITY_LABELS: { key: keyof VisibilityConfig; label: string; description: string }[] = [
  { key: "show_name",        label: "Full Name",        description: "Display your name on the verification page" },
  { key: "show_profession",  label: "Profession",       description: "Show your profession (e.g. Physician)" },
  { key: "show_specialty",   label: "Specialty",        description: "Show your clinical specialty" },
  { key: "show_authority",   label: "License Authority", description: "Show your licensing authority (e.g. QCHP)" },
  { key: "show_cme_status",  label: "CME Status",       description: "Show Compliant / At Risk / Non-Compliant" },
  { key: "show_cme_credits", label: "CME Credit Count", description: "Show exact credit numbers (hidden by default)" },
];

export default function PassportControls({
  initialConfig,
  isActive,
  passportUrl,
}: {
  initialConfig: VisibilityConfig;
  isActive: boolean;
  passportUrl: string;
}) {
  const [config, setConfig] = useState<VisibilityConfig>(initialConfig);
  const [active, setActive] = useState(isActive);
  const [copied, setCopied] = useState(false);
  const [rotating, startRotate] = useTransition();
  const [saving, startSave] = useTransition();
  const [toggling, startToggle] = useTransition();

  function toggleField(key: keyof VisibilityConfig) {
    const next = { ...config, [key]: !config[key] };
    setConfig(next);
    startSave(() => updateVisibility(next));
  }

  function handleRotate() {
    if (!confirm("Rotate QR code? The current QR code will stop working immediately.")) return;
    startRotate(() => rotateQR());
  }

  function handleToggleActive() {
    const next = !active;
    setActive(next);
    startToggle(() => setPassportActive(next));
  }

  async function copyLink() {
    await navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Share link */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <h3 className="text-sm font-semibold text-[#111] mb-1">Verification Link</h3>
        <p className="text-xs text-[#64748b] mb-3">Anyone with this link can view your passport (subject to privacy settings below).</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs text-[#374151] font-mono truncate">
            {passportUrl}
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1a56a0] text-white text-xs font-medium rounded-lg hover:bg-[#1e40af] transition-colors flex-shrink-0"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Privacy settings */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <h3 className="text-sm font-semibold text-[#111] mb-1">Privacy Settings</h3>
        <p className="text-xs text-[#64748b] mb-4">Choose what verifiers see when they scan your QR code.</p>
        <div className="space-y-3">
          {VISIBILITY_LABELS.map(({ key, label, description }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#111] font-medium">{label}</p>
                <p className="text-xs text-[#64748b]">{description}</p>
              </div>
              <button
                onClick={() => toggleField(key)}
                disabled={saving}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  config[key]
                    ? "bg-[#1a56a0] text-white border-[#1a56a0]"
                    : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#cbd5e1]"
                }`}
              >
                {config[key] ? <Eye size={12} /> : <EyeOff size={12} />}
                {config[key] ? "Visible" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
        {saving && <p className="text-xs text-[#64748b] mt-3 animate-pulse">Saving…</p>}
      </div>

      {/* Management */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <h3 className="text-sm font-semibold text-[#111] mb-4">Manage Passport</h3>
        <div className="space-y-3">
          <button
            onClick={handleRotate}
            disabled={rotating}
            className="w-full flex items-center gap-2 px-4 py-2.5 border border-[#e2e8f0] rounded-lg text-sm text-[#374151] hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={rotating ? "animate-spin" : ""} />
            {rotating ? "Rotating…" : "Rotate QR Code"}
          </button>
          <p className="text-xs text-[#64748b] -mt-1 pl-0.5">
            Invalidates the current QR code and generates a new one. Use this if you believe your link has been shared unintentionally.
          </p>

          <button
            onClick={handleToggleActive}
            disabled={toggling}
            className={`w-full flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-colors disabled:opacity-50 ${
              active
                ? "border-red-200 text-red-600 hover:bg-red-50"
                : "border-green-200 text-green-700 hover:bg-green-50"
            }`}
          >
            <Power size={15} />
            {toggling ? "Updating…" : active ? "Deactivate Passport" : "Activate Passport"}
          </button>
          {!active && (
            <p className="text-xs text-[#64748b] pl-0.5">Passport is inactive. QR scans will show a deactivated message.</p>
          )}
        </div>
      </div>
    </div>
  );
}
