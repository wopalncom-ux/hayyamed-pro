import { requireAdminUser } from "@/lib/adminAuth";
import AssistantTrainingPanel from "@/components/admin/AssistantTrainingPanel";

export const metadata = { title: "AI Assistant Training — Hayya Med Pro Admin" };
export const dynamic = "force-dynamic";

export default async function AiTrainingPage() {
  await requireAdminUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a]">AI Assistant Training</h1>
        <p className="text-sm text-[#64748b] mt-0.5">
          Documents, websites, Q&amp;A, and behavior rules the Compliance Chat assistant draws on.
          For usage, cost, and failure-rate metrics see{" "}
          <a href="/admin/ai-costs" className="text-[#1a56a0] hover:underline">AI Costs</a>.
        </p>
      </div>

      <AssistantTrainingPanel />
    </div>
  );
}
