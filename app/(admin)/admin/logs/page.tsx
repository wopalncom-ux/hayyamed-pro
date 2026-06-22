import LogsClient from "./LogsClient";

export const metadata = { title: "Logs Center — Admin" };

export default function LogsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Logs Center</h1>
        <p className="text-[#64748b] mt-1">
          Unified log viewer — Audit Trail, AI Call Log, and Webhook Deliveries. Filter by time range, status, and keyword.
        </p>
      </div>
      <LogsClient />
    </div>
  );
}
