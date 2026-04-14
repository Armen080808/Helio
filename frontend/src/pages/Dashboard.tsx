import { useEffect, useState } from "react";
import { getDashboard, type DashboardStats } from "@/services/dashboard";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileCheck, DollarSign, CalendarDays } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
}

function StatCard({ label, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
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
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  const cards: StatCardProps[] = [
    {
      label: "Active Proposals",
      value: stats?.active_proposals ?? 0,
      icon: FileText,
      description: "Proposals awaiting response",
    },
    {
      label: "Unsigned Contracts",
      value: stats?.unsigned_contracts ?? 0,
      icon: FileCheck,
      description: "Contracts pending signature",
    },
    {
      label: "Outstanding Amount",
      value: `$${(stats?.outstanding_amount ?? 0).toLocaleString()}`,
      icon: DollarSign,
      description: "Total unpaid invoices",
    },
    {
      label: "Upcoming Calls",
      value: stats?.upcoming_calls ?? 0,
      icon: CalendarDays,
      description: "Scheduled in the next 7 days",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.name ? `Welcome back, ${user.name.split(" ")[0]}.` : "Overview of your freelance business."}
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
