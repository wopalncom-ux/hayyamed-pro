import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import CourseForm from "@/components/provider/CourseForm";

export const metadata = { title: "New Course — Provider Portal" };

export default async function NewCoursePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("created_by", user.id)
    .eq("status", "active")
    .single();

  if (!provider) redirect("/provider/register");

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/provider/courses" className="text-sm text-[#64748b] hover:text-[#111]">
          ← Courses
        </Link>
        <span className="text-[#e2e8f0]">/</span>
        <span className="text-sm text-[#111] font-medium">New Course</span>
      </div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Create New Course</h1>
      <CourseForm providerId={provider.id} />
    </div>
  );
}
