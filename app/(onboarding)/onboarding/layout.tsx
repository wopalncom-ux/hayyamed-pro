export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-[#1a56a0]">Hayya Med PRO</span>
          <span className="text-sm text-[#64748b]">Profile Setup</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
