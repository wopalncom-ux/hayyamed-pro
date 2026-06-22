import HealthClient from "./HealthClient";

export const metadata = { title: "System Health — Admin" };

export default function HealthPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">System Health</h1>
        <p className="text-[#64748b] mt-1">
          Live status of all platform integrations — checks run on page load and on demand.
        </p>
      </div>
      <HealthClient />
    </div>
  );
}
