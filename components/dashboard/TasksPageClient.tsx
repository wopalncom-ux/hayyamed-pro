"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { EmployerTask } from "./EmployerTasksWidget";

type Filter = "pending" | "completed" | "all";

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86_400_000);
}

function StatusIcon({ status }: { status: EmployerTask["status"] }) {
  if (status === "completed") {
    return (
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
        </svg>
      </span>
    );
  }
  if (status === "acknowledged") {
    return (
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#1d4ed8]">
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1a6 6 0 1 0 0 12A6 6 0 0 0 10 1zm0 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm.75-6.75a.75.75 0 0 0-1.5 0v3.25H5.75a.75.75 0 0 0 0 1.5H10a.75.75 0 0 0 .75-.75V5.25z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#e2e8f0] bg-[#f8fafc]" />
  );
}

function TaskCard({
  task,
  onUpdate,
}: {
  task: EmployerTask;
  onUpdate: (id: string, status: "acknowledged" | "completed") => void;
}) {
  const [isPending, startTransition] = useTransition();
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
    <div className={`bg-white rounded-xl border border-[#e2e8f0] p-5 ${isPending ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-4">
        <StatusIcon status={task.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <p className={`text-sm font-semibold ${task.status === "completed" ? "line-through text-[#64748b]" : "text-[#111]"}`}>
              {task.title}
            </p>
            {task.due_date && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                task.status === "completed" ? "bg-[#f1f5f9] text-[#64748b]" :
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

          <p className="text-xs text-[#64748b] mt-0.5">
            {task.orgName}
            {task.category && <> · <span className="capitalize">{task.category.replace(/_/g, " ")}</span></>}
            {task.credits_target && <> · {task.credits_target} credits</>}
          </p>

          {task.message && (
            <p className="text-sm text-[#374151] mt-2 whitespace-pre-line">{task.message}</p>
          )}

          {task.status !== "completed" && (
            <div className="flex items-center gap-2 mt-3">
              {task.status === "pending" && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => update("acknowledged")}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors disabled:opacity-50"
                >
                  Acknowledge
                </button>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => update("completed")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors disabled:opacity-50"
              >
                Mark complete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksPageClient({ initialTasks }: { initialTasks: EmployerTask[] }) {
  const [tasks, setTasks] = useState<EmployerTask[]>(initialTasks);
  const [filter, setFilter] = useState<Filter>("pending");

  function handleUpdate(id: string, status: "acknowledged" | "completed") {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  const filtered =
    filter === "all"
      ? tasks
      : filter === "pending"
      ? tasks.filter((t) => t.status !== "completed")
      : tasks.filter((t) => t.status === "completed");

  const pendingCount = tasks.filter((t) => t.status !== "completed").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-[#64748b] hover:text-[#1a56a0] flex items-center gap-1 mb-2 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Back to dashboard
          </Link>
          <h1 className="text-xl font-bold text-[#111]">Employer Tasks</h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            {pendingCount > 0 ? `${pendingCount} task${pendingCount !== 1 ? "s" : ""} to complete` : "All tasks complete"}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-[#f1f5f9] p-1 rounded-lg w-fit">
        {(["pending", "completed", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? "bg-white text-[#111] shadow-sm"
                : "text-[#64748b] hover:text-[#374151]"
            }`}
          >
            {f === "pending" ? `Pending (${pendingCount})` : f === "completed" ? `Completed (${completedCount})` : `All (${tasks.length})`}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#64748b]">
          <p className="text-sm">No {filter === "all" ? "" : filter} tasks</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
