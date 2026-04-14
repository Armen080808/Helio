import { useEffect, useState } from "react";
import { getDashboard, type DashboardStats } from "../services/dashboard";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  description?: string;
}

function StatCard({ label, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-zinc-900">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-zinc-400">{description}</p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const cards = [
    {
      label: "Active Proposals",
      value: stats?.active_proposals ?? 0,
      icon: "📄",
      description: "Proposals awaiting response",
    },
    {
      label: "Unsigned Contracts",
      value: stats?.unsigned_contracts ?? 0,
      icon: "📝",
      description: "Contracts pending signature",
    },
    {
      label: "Outstanding Amount",
      value: `$${(stats?.outstanding_amount ?? 0).toLocaleString()}`,
      icon: "💳",
      description: "Total unpaid invoices",
    },
    {
      label: "Upcoming Calls",
      value: stats?.upcoming_calls ?? 0,
      icon: "📅",
      description: "Scheduled in the next 7 days",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Overview of your freelance business
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
