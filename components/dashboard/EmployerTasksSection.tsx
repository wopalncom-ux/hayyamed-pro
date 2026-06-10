import { createAdminClient } from "@/lib/supabase/server";
import AcknowledgeTaskButton from "./AcknowledgeTaskButton";

export default async function EmployerTasksSection({ professionalId }: { professionalId: string }) {
  const admin = createAdminClient();

  const { data: tasks } = await admin
    .from("employer_tasks")
    .select("*, organizations(name)")
    .eq("assigned_to", professionalId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!tasks || tasks.length === 0) return null;

  const STATUS_STYLE: Record<string, string> = {
    pending:      "bg-[#fff7ed] text-[#d97706]",
    acknowledged: "bg-[#eff6ff] text-[#1a56a0]",
    completed:    "bg-[#dcfce7] text-[#16a34a]",
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
      <div className="px-6 py-4 border-b border-[#e2e8f0]">
        <h2 className="text-base font-semibold text-[#111]">Tasks from Your Employer</h2>
        <p className="text-xs text-[#64748b] mt-0.5">CPD goals assigned by your organization</p>
      </div>
      <div className="divide-y divide-[#e2e8f0]">
        {tasks.map((task) => {
          const org = task.organizations as { name: string } | null;
          const isCompleted = task.status === "completed";
          return (
            <div key={task.id} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-medium text-[#111]">{task.title}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLE[task.status] ?? STATUS_STYLE.pending}`}>
                    {task.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#64748b] mb-1">
                  {org?.name && <span>{org.name}</span>}
                  {task.category && (
                    <span className="bg-[#f1f5f9] text-[#374151] px-1.5 py-0.5 rounded capitalize">
                      {(task.category as string).replace("_", " ")}
                    </span>
                  )}
                  {task.credits_target && (
                    <span className="text-[#1a56a0] font-medium">{task.credits_target} credits</span>
                  )}
                  {task.due_date && (
                    <span className="text-[#d97706]">
                      Due: {new Date(task.due_date as string).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  )}
                </div>
                {task.message && (
                  <p className="text-xs text-[#374151] italic mt-1">&ldquo;{task.message}&rdquo;</p>
                )}
              </div>
              {!isCompleted && (
                <AcknowledgeTaskButton taskId={task.id} currentStatus={task.status as string} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
