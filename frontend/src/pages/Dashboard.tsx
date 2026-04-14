import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboard";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { FileText, FileCheck, DollarSign, CalendarDays, TrendingUp } from "lucide-react";

const chartData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 2100 },
  { month: "Mar", revenue: 1800 },
  { month: "Apr", revenue: 3200 },
  { month: "May", revenue: 2800 },
  { month: "Jun", revenue: 4100 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    active_proposals: number;
    unsigned_contracts: number;
    outstanding_amount: number;
    upcoming_calls: number;
  } | null>(null);

  useEffect(() => {
    getDashboard().then(setStats).catch(() => {});
  }, []);

  const statCards = [
    {
      label: "Active Proposals",
      value: stats?.active_proposals ?? "—",
      icon: FileText,
      desc: "Awaiting response",
    },
    {
      label: "Unsigned Contracts",
      value: stats?.unsigned_contracts ?? "—",
      icon: FileCheck,
      desc: "Needs signature",
    },
    {
      label: "Outstanding",
      value: stats ? `$${stats.outstanding_amount.toLocaleString()}` : "—",
      icon: DollarSign,
      desc: "Unpaid invoices",
    },
    {
      label: "Upcoming Calls",
      value: stats?.upcoming_calls ?? "—",
      icon: CalendarDays,
      desc: "This week",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Good morning, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, desc }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue overview</CardTitle>
              <CardDescription>Your income trend over the last 6 months</CardDescription>
            </div>
            <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
              <TrendingUp className="h-4 w-4" />
              +24.5%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                className="text-xs"
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
