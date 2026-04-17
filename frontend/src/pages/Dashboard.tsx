import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getDashboard, type DashboardStats } from "@/services/dashboard";
import { getApplications, type Application } from "@/services/pipeline";
import { getEvents, type RecruitingEvent } from "@/services/events";
import { getDeadlines, type RecruitingDeadline } from "@/services/deadlines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip } from "recharts";
import {
  Kanban, Users, CalendarDays, Clock, MapPin,
  ChevronRight, CalendarCheck, Briefcase, Building2, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Config ───────────────────────────────────────────────────────────────────

const STAGES = [
  { key: "Wishlist",      short: "Wishlist",  color: "#94a3b8" },
  { key: "Applied",       short: "Applied",   color: "#3b82f6" },
  { key: "OA",            short: "OA",        color: "#6366f1" },
  { key: "Phone Screen",  short: "Phone",     color: "#8b5cf6" },
  { key: "Superday",      short: "Superday",  color: "#f59e0b" },
  { key: "Offer",         short: "Offer",     color: "#10b981" },
  { key: "Rejected",      short: "Rejected",  color: "#ef4444" },
];

const STAGE_BADGE: Record<string, string> = {
  Wishlist:       "bg-slate-100 text-slate-600",
  Applied:        "bg-blue-100 text-blue-700",
  OA:             "bg-indigo-100 text-indigo-700",
  "Phone Screen": "bg-violet-100 text-violet-700",
  Superday:       "bg-amber-100 text-amber-700",
  Offer:          "bg-emerald-100 text-emerald-700",
  Rejected:       "bg-red-100 text-red-600",
};

const EVENT_TYPE_BADGE: Record<string, string> = {
  "Info Session": "bg-blue-100 text-blue-700",
  "Networking":   "bg-purple-100 text-purple-700",
  "Workshop":     "bg-amber-100 text-amber-700",
  "Superday":     "bg-orange-100 text-orange-700",
  "Other":        "bg-slate-100 text-slate-600",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function greeting(name: string): string {
  const h = new Date().getHours();
  const first = name?.split(" ")[0] ?? "there";
  if (h < 12) return `Good morning, ${first}`;
  if (h < 17) return `Good afternoon, ${first}`;
  return `Good evening, ${first}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function fmtEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-CA", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, colorClass }: {
  icon: React.ElementType; label: string; value: number | string; sub?: string; colorClass: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PipelineTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { fullStage: string; color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const { fullStage, color } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-xl">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-semibold">{fullStage}</span>
      </div>
      <p className="text-muted-foreground mt-0.5">
        {payload[0].value} application{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function Pulse({ className }: { className?: string }) {
  return <div className={cn("bg-muted rounded-lg animate-pulse", className)} />;
}

// ─── Main page ────────────────────────────────────────────────────────────────

const REFRESH_MS = 30 * 60 * 1000;

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]         = useState<DashboardStats | null>(null);
  const [apps, setApps]           = useState<Application[]>([]);
  const [events, setEvents]       = useState<RecruitingEvent[]>([]);
  const [deadlines, setDeadlines] = useState<RecruitingDeadline[]>([]);
  const [loading, setLoading]     = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = useCallback(async () => {
    try {
      const [s, a, e, d] = await Promise.all([
        getDashboard(), getApplications(), getEvents(), getDeadlines(),
      ]);
      setStats(s);
      setApps(a);
      const now = new Date();
      setEvents(
        e.filter((ev) => new Date(ev.date) >= now)
          .sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime())
          .slice(0, 6)
      );
      setDeadlines(
        d.filter((dl) => dl.application_deadline && new Date(dl.application_deadline) >= now)
          .sort((x, y) =>
            new Date(x.application_deadline!).getTime() -
            new Date(y.application_deadline!).getTime()
          )
          .slice(0, 6)
      );
      setLastRefresh(new Date());
    } catch { /* keep stale */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => clearInterval(t);
  }, [load]);

  const totalApps  = stats?.applications_total ?? apps.length;
  const activeApps = STAGES
    .filter((s) => !["Wishlist", "Rejected"].includes(s.key))
    .reduce((n, s) => n + (stats?.applications_by_stage?.[s.key] ?? 0), 0);

  const pipelineData = STAGES.map(({ key, short, color }) => ({
    stage: short, fullStage: key,
    count: stats?.applications_by_stage?.[key] ?? 0,
    color,
  }));

  const recentApps = [...apps]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const today = new Date().toLocaleDateString("en-CA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto w-full">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {user?.name ? greeting(user.name) : "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 shrink-0">
          Auto-refreshes every 30 min · Last{" "}
          {lastRefresh.toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* ── Stat cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5 space-y-3">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-8 w-14" />
              <Pulse className="h-3 w-28" />
            </CardContent></Card>
          ))
        ) : (
          <>
            <StatCard icon={Kanban}       label="Applications"     value={totalApps}
              sub={`${activeApps} active`}  colorClass="bg-blue-100 text-blue-600" />
            <StatCard icon={Users}        label="Contacts"         value={stats?.contacts_total ?? 0}
              sub="In your network"         colorClass="bg-purple-100 text-purple-600" />
            <StatCard icon={CalendarDays} label="Deadlines"        value={stats?.upcoming_deadlines ?? 0}
              sub="Next 30 days"            colorClass="bg-amber-100 text-amber-600" />
            <StatCard icon={Clock}        label="Interviews"       value={stats?.interviews_this_week ?? 0}
              sub="This week"              colorClass="bg-emerald-100 text-emerald-600" />
          </>
        )}
      </div>

      {/* ── Pipeline chart ──────────────────────────────── */}
      <Card>
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base font-semibold">Application Pipeline</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalApps} total · {activeApps} actively progressing
              </p>
            </div>
            <NavLink to="/pipeline" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Manage pipeline <ArrowUpRight className="h-3 w-3" />
            </NavLink>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          {loading ? (
            <Pulse className="h-[190px] w-full" />
          ) : totalApps === 0 ? (
            <div className="flex flex-col items-center justify-center h-[140px] rounded-xl border border-dashed gap-2">
              <Briefcase className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No applications yet</p>
              <NavLink to="/pipeline" className="text-xs text-primary hover:underline">
                Add your first application →
              </NavLink>
            </div>
          ) : (
            <>
              <ChartContainer config={{}} className="h-[210px] w-full">
                <BarChart
                  data={pipelineData}
                  layout="vertical"
                  margin={{ left: 4, right: 36, top: 4, bottom: 4 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number" allowDecimals={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    type="category" dataKey="stage" width={58}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<PipelineTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 4 }} />
                  <Bar dataKey="count" radius={[0, 5, 5, 0]} maxBarSize={20}>
                    {pipelineData.map((e) => (
                      <Cell key={e.stage} fill={e.color} fillOpacity={0.88} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
              <div className="mt-3 pt-3 border-t flex flex-wrap gap-x-4 gap-y-1.5">
                {STAGES.map(({ key, short, color }) => (
                  <span key={key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {short}
                    <span className="font-bold text-foreground">
                      {stats?.applications_by_stage?.[key] ?? 0}
                    </span>
                  </span>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Events + Deadlines ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming events */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary shrink-0" />
                <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
              </div>
              <NavLink to="/events" className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                View all <ChevronRight className="h-3 w-3" />
              </NavLink>
            </div>
            <p className="text-xs text-muted-foreground">Recruiting &amp; networking · auto-refreshed</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2.5">{Array.from({ length: 4 }).map((_, i) => <Pulse key={i} className="h-[60px]" />)}</div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[120px] rounded-xl border border-dashed gap-2">
                <CalendarCheck className="h-7 w-7 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((ev) => {
                  const d = daysUntil(ev.date);
                  return (
                    <div key={ev.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                      <div className="shrink-0 flex flex-col items-center justify-center rounded-lg bg-primary/10 text-primary w-10 h-10">
                        <span className="text-[9px] font-bold uppercase leading-none">
                          {new Date(ev.date).toLocaleDateString("en-CA", { month: "short" })}
                        </span>
                        <span className="text-base font-bold leading-tight tabular-nums">
                          {new Date(ev.date).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight truncate">{ev.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {ev.firm_name} · {fmtEventTime(ev.date)}
                        </p>
                        {ev.location && (
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 truncate">
                            <MapPin className="h-2.5 w-2.5 shrink-0" />{ev.location}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          EVENT_TYPE_BADGE[ev.event_type] ?? "bg-muted text-muted-foreground")}>
                          {ev.event_type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `${d}d`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-amber-500 shrink-0" />
                <CardTitle className="text-base font-semibold">Upcoming Deadlines</CardTitle>
              </div>
              <NavLink to="/deadlines" className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
                View all <ChevronRight className="h-3 w-3" />
              </NavLink>
            </div>
            <p className="text-xs text-muted-foreground">Application deadlines · next 60 days</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2.5">{Array.from({ length: 4 }).map((_, i) => <Pulse key={i} className="h-[60px]" />)}</div>
            ) : deadlines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[120px] rounded-xl border border-dashed gap-2">
                <CalendarDays className="h-7 w-7 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              </div>
            ) : (
              <div className="space-y-2">
                {deadlines.map((dl) => {
                  const d = daysUntil(dl.application_deadline!);
                  const urgent = d <= 7;
                  return (
                    <div key={dl.id} className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/40 transition-colors",
                      urgent && "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20"
                    )}>
                      <div className={cn(
                        "shrink-0 flex flex-col items-center justify-center rounded-lg w-10 h-10",
                        urgent ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                      )}>
                        <span className="text-[9px] font-bold uppercase leading-none">
                          {new Date(dl.application_deadline!).toLocaleDateString("en-CA", { month: "short" })}
                        </span>
                        <span className="text-base font-bold leading-tight tabular-nums">
                          {new Date(dl.application_deadline!).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight truncate">{dl.firm_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{dl.role} · {dl.type}</p>
                        <p className="text-[11px] text-muted-foreground">{dl.cycle}</p>
                      </div>
                      <span className={cn(
                        "shrink-0 self-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                        urgent ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"
                      )}>
                        {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `${d}d`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Applications ──────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-500 shrink-0" />
              <CardTitle className="text-base font-semibold">Recent Applications</CardTitle>
            </div>
            <NavLink to="/pipeline" className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0">
              View all <ChevronRight className="h-3 w-3" />
            </NavLink>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Pulse key={i} className="h-12" />)}</div>
          ) : recentApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[100px] rounded-xl border border-dashed gap-2">
              <Briefcase className="h-7 w-7 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No applications yet</p>
              <NavLink to="/pipeline" className="text-xs text-primary hover:underline">Start tracking →</NavLink>
            </div>
          ) : (
            <div className="divide-y">
              {recentApps.map((app) => (
                <div key={app.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold leading-tight">{app.firm_name}</p>
                      <span className="text-muted-foreground text-xs">·</span>
                      <p className="text-xs text-muted-foreground truncate">{app.role}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {app.type} · Added {fmtDate(app.created_at)}
                    </p>
                  </div>
                  <span className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    STAGE_BADGE[app.stage] ?? "bg-muted text-muted-foreground"
                  )}>
                    {app.stage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
