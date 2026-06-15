import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import TasksPageClient from "@/components/dashboard/TasksPageClient";
import type { EmployerTask } from "@/components/dashboard/EmployerTasksWidget";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tasks — Hayya Med Pro",
  robots: { index: false },
};

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: raw } = await admin
    .from("employer_tasks")
    .select("id, organization_id, title, message, category, credits_target, due_date, status, organizations(name)")
    .eq("assigned_to", user.id)
    .order("status", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  const tasks: EmployerTask[] = (raw ?? []).map((t) => {
    const orgRaw = t.organizations as { name: string }[] | { name: string } | null;
    const orgName = (Array.isArray(orgRaw) ? orgRaw[0]?.name : (orgRaw as { name: string } | null)?.name) ?? "Your employer";
    return {
      id: t.id,
      organization_id: t.organization_id,
      title: t.title,
      message: t.message,
      category: t.category,
      credits_target: t.credits_target,
      due_date: t.due_date,
      status: t.status as EmployerTask["status"],
      orgName,
    };
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <TasksPageClient initialTasks={tasks} />
    </div>
  );
}
