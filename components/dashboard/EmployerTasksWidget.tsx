"use client";

import { useState, useTransition } from "react";

export type EmployerTask = {
  id: string;
  organization_id: string;
  title: string;
  message: string | null;
  category: string | null;
  credits_target: number | null;
  due_date: string | null;
  status: "pending" | "acknowledged" | "completed";
  orgName: string;
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86_400_000);
}

function TaskRow({ task, onUpdate }: { task: EmployerTask; onUpdate: (id: string, status: "acknowledged" | "completed") => void }) {
  const [pending, startTransition] = useTransition();
  const daysLeft = task.due_date ? daysUntil(task.due_date) : null;
  const overdue = daysLeft !== null && daysLeft < 0;
  const urgent = !overdue && daysLeft !== null && daysLeft <= 3;

  function update(status: "acknowledged" | "completed") {
    startTransition(async () => {
      await fetch(`/api/employer/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onUpdate(task.id, status);
    });
  }

  return (
    <div className={`px-5 py-4 flex items-start gap-4 ${pending ? "opacity-60" : ""}`}>
      {/* Status icon */}
      <div className="flex-shrink-0 mt-0.5">
        {task.status === "completed" ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
            </svg>
          </span>
        ) : task.status === "acknowledged" ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 1a6 6 0 1 0 0 12A6 6 0 0 0 10 1zm0 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm.75-6.75a.75.75 0 0 0-1.5 0v3.25H5.75a.75.75 0 0 0 0 1.5H10a.75.75 0 0 0 .75-.75V5.25z" />
            </svg>
          </span>
        ) : (
          <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${overdue ? "border-[#dc2626] bg-[#fef2f2]" : urgent ? "border-[#d97706] bg-[#fff7ed]" : "border-[#e2e8f0] bg-[#f8fafc]"}`} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${task.status === "completed" ? "line-through text-[#94a3b8]" : "text-[#111]"}`}>
              {task.title}
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">
              {task.orgName}
              {task.category && <> · <span className="capitalize">{task.category.replace(/_/g, " ")}</span></>}
              {task.credits_target && <> · {task.credits_target} credits</>}
            </p>
          </div>

          {/* Due date badge */}
          {task.due_date && (
            <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
              task.status === "completed" ? "bg-[#f1f5f9] text-[#94a3b8]" :
              overdue ? "bg-[#fef2f2] text-[#dc2626]" :
              urgent ? "bg-[#fff7ed] text-[#d97706]" :
              "bg-[#f1f5f9] text-[#64748b]"
            }`}>
              {task.status === "completed" ? "Done" :
               overdue ? `${Math.abs(daysLeft!)}d overdue` :
               daysLeft === 0 ? "Due today" :
               daysLeft === 1 ? "Due tomorrow" :
               `${daysLeft}d left`}
            </span>
          )}
        </div>

        {task.message && (
          <p className="text-xs text-[#64748b] mt-1.5 line-clamp-2">{task.message}</p>
        )}

        {/* Actions */}
        {task.status !== "completed" && (
          <div className="flex items-center gap-2 mt-2.5">
            {task.status === "pending" && (
              <button
                type="button"
                disabled={pending}
                onClick={() => update("acknowledged")}
                className="text-xs font-medium px-3 py-1 rounded-lg border border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors disabled:opacity-50"
              >
                Acknowledge
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => update("completed")}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors disabled:opacity-50"
            >
              Mark complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmployerTasksWidget({ initialTasks }: { initialTasks: EmployerTask[] }) {
  const [tasks, setTasks] = useState<EmployerTask[]>(initialTasks);

  function handleUpdate(id: string, status: "acknowledged" | "completed") {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  }

  const pending = tasks.filter((t) => t.status !== "completed");
  const completed = tasks.filter((t) => t.status === "completed");

  if (tasks.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
      <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#111]">Employer Tasks</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {pending.length > 0
              ? `${pending.length} task${pending.length !== 1 ? "s" : ""} to complete`
              : "All tasks complete"}
          </p>
        </div>
        {pending.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dc2626] text-white text-[10px] font-bold">
            {pending.length}
          </span>
        )}
      </div>

      <div className="divide-y divide-[#f8fafc]">
        {/* Pending / acknowledged first */}
        {pending.map((t) => (
          <TaskRow key={t.id} task={t} onUpdate={handleUpdate} />
        ))}
        {/* Completed tasks collapsed */}
        {completed.length > 0 && (
          <div className="px-5 py-3">
            <p className="text-xs text-[#94a3b8]">{completed.length} completed task{completed.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}
