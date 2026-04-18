import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, LayoutDashboard, Briefcase, CalendarDays, FileText,
  TrendingUp, Shield, LogOut, ChevronRight, CheckCircle2,
  XCircle, ExternalLink, Search, MapPin, Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  getAdminStats, getAdminRegistrations, getAdminUsers,
  getAdminApplications, getAdminJobs, getAdminEvents,
  type AdminStats, type AdminUser, type AdminJob, type AdminEvent, type AdminApplication,
} from "@/services/admin";

// ─── Colours ─────────────────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  Wishlist: "#94a3b8",
  Applied: "#60a5fa",
  OA: "#a78bfa",
  "Phone Screen": "#fb923c",
  Superday: "#f472b6",
  Offer: "#4ade80",
  Rejected: "#f87171",
};

const TYPE_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const CHART_BLUE = "#6366f1";
const CHART_GRID = "#e2e8f0";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "overview" | "users" | "applications" | "jobs" | "events";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-CA", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function timeAgo(date: string | null): string {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return fmt(date);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${color.replace("bg-", "bg-").replace("/10", "/40")}`} />
    </Card>
  );
}

function Pulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold tracking-tight mb-4">{children}</h2>
  );
}

// ─── Custom tooltip for recharts ─────────────────────────────────────────────

function ChartTip({ active, payload, label }: {
  active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-xl text-xs">
      {label && <p className="font-medium text-foreground mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? CHART_BLUE }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Overview Section ─────────────────────────────────────────────────────────

function OverviewSection({
  stats, registrations, appData,
}: {
  stats: AdminStats | null;
  registrations: { date: string; users: number }[];
  appData: { by_stage: { stage: string; count: number }[]; by_type: { type: string; count: number }[]; top_firms: { firm: string; count: number }[] } | null;
}) {
  const loading = !stats;

  const stageData = (appData?.by_stage ?? []).map((d) => ({
    ...d,
    fill: STAGE_COLORS[d.stage] ?? "#94a3b8",
  }));

  const typeData = appData?.by_type ?? [];
  const firmData = (appData?.top_firms ?? []).slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5"><Pulse className="h-20 w-full" /></CardContent></Card>
          ))
        ) : (
          <>
            <StatCard
              label="Total Users"
              value={stats.total_users}
              sub={`+${stats.new_users_week} this week`}
              icon={Users}
              color="bg-indigo-500/10 text-indigo-600"
            />
            <StatCard
              label="Applications"
              value={stats.total_applications}
              sub={`+${stats.new_apps_week} this week`}
              icon={FileText}
              color="bg-sky-500/10 text-sky-600"
            />
            <StatCard
              label="Job Postings"
              value={stats.total_jobs}
              sub="Canadian roles"
              icon={Briefcase}
              color="bg-emerald-500/10 text-emerald-600"
            />
            <StatCard
              label="Public Events"
              value={stats.public_events}
              sub={`${stats.total_events} total events`}
              icon={CalendarDays}
              color="bg-amber-500/10 text-amber-600"
            />
          </>
        )}
      </div>

      {/* Secondary cards */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Verified Users</p>
              <p className="text-2xl font-bold mt-1">{stats.verified_users}</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: stats.total_users ? `${Math.round((stats.verified_users / stats.total_users) * 100)}%` : "0%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total_users ? Math.round((stats.verified_users / stats.total_users) * 100) : 0}% verified
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">New Users (30d)</p>
              <p className="text-2xl font-bold mt-1">{stats.new_users_month}</p>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Contacts Logged</p>
              <p className="text-2xl font-bold mt-1">{stats.total_contacts}</p>
              <p className="text-xs text-muted-foreground mt-1">Networking contacts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">News Articles</p>
              <p className="text-2xl font-bold mt-1">{stats.total_news}</p>
              <p className="text-xs text-muted-foreground mt-1">Seeded + scraped</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Area chart: registrations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">User Registrations — Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No registration data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={registrations} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_BLUE} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTip />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Signups"
                    stroke={CHART_BLUE}
                    strokeWidth={2}
                    fill="url(#adminBlue)"
                    dot={false}
                    activeDot={{ r: 4, fill: CHART_BLUE }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie chart: applications by stage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Applications by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            {stageData.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No application data yet
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={stageData}
                      dataKey="count"
                      nameKey="stage"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={2}
                    >
                      {stageData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v, "Applications"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {stageData.map((d) => (
                    <div key={d.stage} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.fill }} />
                        <span className="text-foreground truncate">{d.stage}</span>
                      </div>
                      <span className="font-semibold tabular-nums text-muted-foreground">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bar chart: by type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Applications by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {typeData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={typeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="type" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="count" name="Applications" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {typeData.map((_, i) => (
                      <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Horizontal bar: top firms */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Firms by Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {firmData.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">No data</div>
            ) : (
              <div className="flex flex-col gap-2">
                {firmData.map((f, i) => {
                  const max = firmData[0]?.count ?? 1;
                  const pct = Math.round((f.count / max) * 100);
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-28 truncate text-foreground">{f.firm}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right font-semibold tabular-nums text-muted-foreground">{f.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Users Section ────────────────────────────────────────────────────────────

function UsersSection({ users }: { users: AdminUser[] }) {
  const [q, setQ] = useState("");
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <SectionTitle>All Users ({users.length})</SectionTitle>
        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search name or email…"
            className="pl-8 h-8 text-sm w-64"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Email</th>
                <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Verified</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Apps</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Contacts</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground text-sm">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-center">
                      {u.email_verified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{u.applications}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{u.contacts}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{timeAgo(u.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Applications Section ─────────────────────────────────────────────────────

const STAGE_BADGE: Record<string, string> = {
  Wishlist: "bg-slate-100 text-slate-600 border-slate-200",
  Applied: "bg-blue-100 text-blue-700 border-blue-200",
  OA: "bg-violet-100 text-violet-700 border-violet-200",
  "Phone Screen": "bg-orange-100 text-orange-700 border-orange-200",
  Superday: "bg-pink-100 text-pink-700 border-pink-200",
  Offer: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-600 border-red-200",
};

function ApplicationsSection({ data }: {
  data: { recent: AdminApplication[]; by_stage: { stage: string; count: number }[]; by_type: { type: string; count: number }[] } | null;
}) {
  const [q, setQ] = useState("");
  const apps = data?.recent ?? [];
  const filtered = apps.filter(
    (a) =>
      a.firm_name.toLowerCase().includes(q.toLowerCase()) ||
      a.role.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <SectionTitle>All Applications ({apps.length})</SectionTitle>
        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search firm or role…"
            className="pl-8 h-8 text-sm w-64"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Firm</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Stage</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Applied</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No applications found</td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{a.firm_name}</td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{a.role}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground border">
                        {a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium border ${
                          STAGE_BADGE[a.stage] ?? "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {a.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{fmt(a.applied_date ?? a.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Jobs Section ─────────────────────────────────────────────────────────────

function JobsSection({ jobs }: { jobs: AdminJob[] }) {
  const [q, setQ] = useState("");
  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(q.toLowerCase()) ||
      j.company.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <SectionTitle>Job Postings ({jobs.length})</SectionTitle>
        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search title or company…"
            className="pl-8 h-8 text-sm w-64"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Company</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Location</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Link</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No jobs found</td>
                </tr>
              ) : (
                filtered.map((j) => (
                  <tr key={j.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{j.company}</td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[220px]">{j.title}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {j.location ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {j.job_type ? (
                        <Badge variant="outline" className={j.job_type === "Internship" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}>
                          {j.job_type}
                        </Badge>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={j.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Events Section ───────────────────────────────────────────────────────────

const EVENT_TYPE_COLORS: Record<string, string> = {
  Networking: "bg-green-100 text-green-700 border-green-200",
  "Info Session": "bg-blue-100 text-blue-700 border-blue-200",
  Workshop: "bg-orange-100 text-orange-700 border-orange-200",
  Superday: "bg-purple-100 text-purple-700 border-purple-200",
  Other: "bg-gray-100 text-gray-600 border-gray-200",
};

function EventsSection({ events }: { events: AdminEvent[] }) {
  const [q, setQ] = useState("");
  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      (e.firm_name ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <SectionTitle>Public Events ({events.length})</SectionTitle>
        <div className="ml-auto relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search event or firm…"
            className="pl-8 h-8 text-sm w-64"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Event</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Firm</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Location</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">No events found</td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium truncate max-w-[220px]">{e.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.firm_name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium border ${
                          EVENT_TYPE_COLORS[e.event_type] ?? "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {e.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{fmt(e.date)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.location ?? "TBD"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "events", label: "Events", icon: CalendarDays },
];

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

export default function AdminPanel() {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");

  // Data state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [registrations, setRegistrations] = useState<{ date: string; users: number }[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [appData, setAppData] = useState<{
    recent: AdminApplication[];
    by_stage: { stage: string; count: number }[];
    by_type: { type: string; count: number }[];
    top_firms: { firm: string; count: number }[];
  } | null>(null);
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, r, u, a, j, e] = await Promise.all([
        getAdminStats(),
        getAdminRegistrations(),
        getAdminUsers(),
        getAdminApplications(),
        getAdminJobs(),
        getAdminEvents(),
      ]);
      setStats(s);
      setRegistrations(r);
      setUsers(u);
      setAppData(a);
      setJobs(j);
      setEvents(e);
    } catch (err) {
      console.error("Admin data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleLogout() {
    localStorage.removeItem("admin_auth");
    navigate("/admin/login");
  }

  const currentSection = NAV.find((n) => n.id === section);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r bg-card">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="leading-none">
            <span className="text-sm font-bold tracking-tight">Helio</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Admin</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3">
          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Management
          </p>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-0.5 ${
                section === id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {section === id && <ChevronRight className="h-3 w-3 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 border-t pt-3">
          <div className="px-3 py-2 text-xs text-muted-foreground mb-2">
            <p className="font-medium text-foreground text-[11px]">Admin</p>
            <p className="truncate">armen08082008@gmail.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b bg-card px-6 shrink-0">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold">Helio Admin</span>
          </div>

          {/* Section title */}
          <div className="hidden lg:flex items-center gap-2">
            {currentSection && <currentSection.icon className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{currentSection?.label}</span>
          </div>

          {/* Mobile nav pills */}
          <div className="flex lg:hidden items-center gap-1 ml-2 overflow-x-auto scrollbar-none">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  section === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground hidden sm:block">Live</span>
            </div>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-8 text-xs gap-1.5">
              {loading ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : null}
              Refresh
            </Button>
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {section === "overview" && (
            <OverviewSection stats={stats} registrations={registrations} appData={appData} />
          )}
          {section === "users" && (
            loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 8 }).map((_, i) => <Pulse key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <UsersSection users={users} />
            )
          )}
          {section === "applications" && (
            loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 8 }).map((_, i) => <Pulse key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <ApplicationsSection data={appData} />
            )
          )}
          {section === "jobs" && (
            loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 8 }).map((_, i) => <Pulse key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <JobsSection jobs={jobs} />
            )
          )}
          {section === "events" && (
            loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 8 }).map((_, i) => <Pulse key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <EventsSection events={events} />
            )
          )}
        </main>
      </div>
    </div>
  );
}
