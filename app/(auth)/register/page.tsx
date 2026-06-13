import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 text-center">
        <div className="text-sm text-[#64748b]">Loading…</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
