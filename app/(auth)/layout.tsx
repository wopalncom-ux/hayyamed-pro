export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a56a0]">Hayya Med PRO</h1>
          <p className="text-sm text-[#64748b] mt-1">Healthcare Professional Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}
