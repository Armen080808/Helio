import { useEffect, useState } from "react";
import { getDashboard, type DashboardStats } from "@/services/dashboard";
import { getApplications, type Application } from "@/services/pipeline";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, CalendarDays, TrendingUp } from "lucide-react";

type Stage =
  | "Wishlist"
  | "Applied"
  | "OA"
  | "Phone Screen"
  | "Superday"
  | "Offer"
  | "Rejected";

const STAGES: Stage[] = [
  "Wishlist",
  "Applied",
  "OA",
  "Phone Screen",
  "Superday",
  "Offer",
  "Rejected",
];

function stageBadgeClass(stage: Stage): string {
  switch (stage) {
    case "Wishlist":
      return "";
    case "Applied":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "OA":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "Phone Screen":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Superday":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100";
    case "Offer":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Rejected":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "";
  }
}

function stageBadgeVariant(stage: Stage): "secondary" | "outline" {
  return stage === "Wishlist" ? "secondary" : "outline";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashData, appsData] = await Promise.all([
          getDashboard(),
          getApplications(),
        ]);
        setStats(dashData);
        setApplications(appsData);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeCount = applications.filter(
    (a) => a.stage !== "Rejected" && a.stage !== "Offer" && a.stage !== "Wishlist"
  ).length;

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const statCards = [
    {
      label: "Total Applications",
      value: stats?.applications_total ?? "—",
      icon: Briefcase,
      desc: "All tracked applications",
    },
    {
      label: "Contacts",
      value: stats?.contacts_total ?? "—",
      icon: Users,
      desc: "Networking contacts",
    },
    {
      label: "Upcoming Deadlines",
      value: stats?.upcoming_deadlines ?? "—",
      icon: CalendarDays,
      desc: "In the next 7 days",
    },
    {
      label: "Active Pipeline",
      value: activeCount,
      icon: TrendingUp,
      desc: "In-progress applications",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your finance recruiting pipeline.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, desc }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline stage breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {STAGES.map((stage) => {
              const count =
                stats?.applications_by_stage?.[stage] ??
                applications.filter((a) => a.stage === stage).length;
              return (
                <div key={stage} className="flex flex-col items-center gap-1">
                  <Badge
                    variant={stageBadgeVariant(stage)}
                    className={stageBadgeClass(stage)}
                  >
                    {stage}
                  </Badge>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet. Start by adding one in the Pipeline.
            </p>
          ) : (
            <div className="flex flex-col divide-y">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{app.firm_name}</span>
                    <span className="text-xs text-muted-foreground">{app.role}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={stageBadgeVariant(app.stage as Stage)}
                      className={stageBadgeClass(app.stage as Stage)}
                    >
                      {app.stage}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {timeAgo(app.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
