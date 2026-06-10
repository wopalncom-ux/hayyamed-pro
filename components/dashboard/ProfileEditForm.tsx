"use client";

import { useState } from "react";
import { updateProfessionalProfile } from "@/app/(dashboard)/dashboard/settings/actions";
import { useToast } from "@/components/ui/toast";

interface Profile {
  full_name: string | null;
  mobile: string | null;
  profession: string | null;
  specialty: string | null;
  license_number: string | null;
  licensing_authority: string | null;
  license_expiry: string | null;
}

export default function ProfileEditForm({ profile }: { profile: Profile }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: profile.full_name ?? "",
    mobile: profile.mobile ?? "",
    profession: profile.profession ?? "",
    specialty: profile.specialty ?? "",
    licenseNumber: profile.license_number ?? "",
    licensingAuthority: profile.licensing_authority ?? "",
    licenseExpiry: profile.license_expiry ?? "",
  });

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await updateProfessionalProfile(form);
    setSaving(false);
    if (error) {
      toast(error, "error");
    } else {
      toast("Profile updated", "success");
      setEditing(false);
    }
  }

  const FIELDS: { key: keyof typeof form; label: string; type?: string; placeholder?: string }[] = [
    { key: "fullName", label: "Full name", placeholder: "Dr. Jane Smith" },
    { key: "mobile", label: "Mobile number", placeholder: "+974 5000 0000" },
    { key: "profession", label: "Profession", placeholder: "Medicine, Nursing, Pharmacy…" },
    { key: "specialty", label: "Specialty", placeholder: "Cardiology, Paediatrics…" },
    { key: "licenseNumber", label: "License number", placeholder: "QCHP-12345" },
    { key: "licensingAuthority", label: "Licensing authority", placeholder: "QCHP, SCFHS, DHA…" },
    { key: "licenseExpiry", label: "License expiry", type: "date" },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#111]">Professional Details</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-[#1a56a0] hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {FIELDS.map(({ key, label, type = "text", placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-[#374151] mb-1">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0]"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#1a56a0] text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setForm({
                  fullName: profile.full_name ?? "",
                  mobile: profile.mobile ?? "",
                  profession: profile.profession ?? "",
                  specialty: profile.specialty ?? "",
                  licenseNumber: profile.license_number ?? "",
                  licensingAuthority: profile.licensing_authority ?? "",
                  licenseExpiry: profile.license_expiry ?? "",
                });
              }}
              className="text-sm text-[#64748b] hover:text-[#111] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
          {[
            { label: "Full name", value: form.fullName },
            { label: "Mobile", value: form.mobile },
            { label: "Profession", value: form.profession },
            { label: "Specialty", value: form.specialty },
            { label: "License number", value: form.licenseNumber },
            { label: "Licensing authority", value: form.licensingAuthority },
            { label: "License expiry", value: form.licenseExpiry },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-[#94a3b8] font-medium uppercase tracking-wide mb-0.5">{label}</dt>
              <dd className="text-sm text-[#111] font-medium">{value || <span className="text-[#94a3b8]">Not set</span>}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
