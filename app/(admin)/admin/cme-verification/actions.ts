"use server";

// Delegate to the canonical cme-activities actions — same underlying data, same audit trail.
export { verifyCmeActivity as approveCmeActivity, rejectCmeActivity } from "@/app/(admin)/admin/cme-activities/actions";
