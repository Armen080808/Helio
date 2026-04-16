import { useEffect, useState } from "react";
import { getDeadlines, type RecruitingDeadline } from "@/services/deadlines";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDays, ExternalLink } from "lucide-react";

const CYCLES = ["All", "Summer 2026", "Full-time 2026", "Summer 2027", "Full-time 2027"];

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatus(deadlineStr: string | null | undefined): {
  label: string;
  variant: "destructive" | "default" | "secondary";
  className: string;
} {
  if (!deadlineStr) {
    return { label: "Open", variant: "default", className: "bg-green-100 text-green-800 border-green-200" };
  }
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    return { label: "Closed", variant: "destructive", className: "bg-red-100 text-red-800 border-red-200" };
  }
  if (diffDays <= 30) {
    return { label: "Closing Soon", variant: "default", className: "bg-orange-100 text-orange-800 border-orange-200" };
  }
  return { label: "Open", variant: "default", className: "bg-green-100 text-green-800 border-green-200" };
}

export default function Deadlines() {
  const [deadlines, setDeadlines] = useState<RecruitingDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCycle, setActiveCycle] = useState("All");

  useEffect(() => {
    setLoading(true);
    getDeadlines()
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          if (!a.application_deadline) return 1;
          if (!b.application_deadline) return -1;
          return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
        });
        setDeadlines(sorted);
      })
      .catch(() => setError("Failed to load deadlines. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCycle === "All"
      ? deadlines
      : deadlines.filter((d) => d.cycle === activeCycle);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Recruiting Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bay Street application timelines
          </p>
        </div>
      </div>

      {/* Cycle filters */}
      <div className="flex flex-wrap gap-2">
        {CYCLES.map((cycle) => (
          <button
            key={cycle}
            onClick={() => setActiveCycle(cycle)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
              activeCycle === cycle
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {cycle}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="rounded-lg border bg-card overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="flex flex-col gap-3 p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No deadlines found</p>
              <p className="text-xs text-muted-foreground/70">
                {activeCycle !== "All"
                  ? `No entries for the ${activeCycle} cycle yet.`
                  : "Check back soon — deadlines are added as firms announce them."}
              </p>
            </div>
          ) : (
            <Table className="min-w-[560px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Firm</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold">Type</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">App Opens</TableHead>
                  <TableHead className="font-semibold">Deadline</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => {
                  const status = getStatus(row.application_deadline);
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.firm_name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{row.role}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {row.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(row.application_open)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatDate(row.application_deadline)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {row.source_url && (
                          <a
                            href={row.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="View posting"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {!loading && !error && (
          <>
            Showing {filtered.length} deadline{filtered.length !== 1 ? "s" : ""}.{" "}
            Dates are approximate — always confirm on the firm&apos;s official careers page.
          </>
        )}
      </p>
    </div>
  );
}
