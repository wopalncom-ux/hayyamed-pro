import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 h-64" />}>
      <LoginForm />
    </Suspense>
  );
}
