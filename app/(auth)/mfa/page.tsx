import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MFAChallengeClient from "./MFAChallengeClient";

export const metadata = { title: "Two-Factor Authentication — Hayya Med Pro" };

export default async function MFAChallengePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { next } = await searchParams;
  const destination =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return <MFAChallengeClient destination={destination} />;
}
