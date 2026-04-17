import { useCallback, useEffect, useState } from "react";
import { getEvents, createEvent, type RecruitingEvent } from "@/services/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, MapPin, Plus } from "lucide-react";

const REFRESH_MS = 30 * 60 * 1000; // 30 minutes

const EVENT_TYPES = ["Info Session", "Superday", "Networking", "Workshop", "Other"] as const;
type EventTypeFilter = "All" | (typeof EVENT_TYPES)[number];
const FILTER_TABS: EventTypeFilter[] = ["All", ...EVENT_TYPES];

const TYPE_COLORS: Record<string, string> = {
  "Info Session": "bg-blue-100 text-blue-800 border-blue-200",
  Superday: "bg-purple-100 text-purple-800 border-purple-200",
  Networking: "bg-green-100 text-green-800 border-green-200",
  Workshop: "bg-orange-100 text-orange-800 border-orange-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isPast(dateStr: string): boolean {
  return new Date(dateStr).getTime() < Date.now();
}

interface FormState {
  title: string;
  firm_name: string;
  event_type: string;
  date: string;
  location: string;
  notes: string;
  is_public: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  firm_name: "",
  event_type: "Info Session",
  date: "",
  location: "",
  notes: "",
  is_public: true,
};

export default function Events() {
  const [events, setEvents] = useState<RecruitingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventTypeFilter>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getEvents();
      const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sorted);
    } catch {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, REFRESH_MS);
    return () => clearInterval(t);
  }, [load]);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.date) {
      setFormError("Event date is required.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      await createEvent({
        title: form.title.trim(),
        firm_name: form.firm_name.trim() || "",
        event_type: form.event_type,
        date: form.date,
        location: form.location.trim() || null,
        notes: form.notes.trim() || null,
        is_public: form.is_public,
      });
      setForm(EMPTY_FORM);
      setDialogOpen(false);
      await load();
    } catch {
      setFormError("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const filtered =
    activeFilter === "All"
      ? events
      : events.filter((ev) => ev.event_type === activeFilter);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Info sessions, superdays, and networking events
            </p>
          </div>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setForm(EMPTY_FORM);
              setFormError(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Goldman Sachs Info Session"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="firm_name">Firm</Label>
                  <Input
                    id="firm_name"
                    placeholder="Goldman Sachs"
                    value={form.firm_name}
                    onChange={(e) => setForm((f) => ({ ...f, firm_name: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Type</Label>
                  <Select
                    value={form.event_type}
                    onValueChange={(v) => setForm((f) => ({ ...f, event_type: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date">
                  Date &amp; Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Zoom / 200 Bay St, Toronto"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Dress code, what to bring, etc."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setForm(EMPTY_FORM);
                    setFormError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving…" : "Add Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
              activeFilter === tab
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Events list */}
      {!error && (
        <>
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-lg border bg-card animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No events found</p>
              <p className="text-xs text-muted-foreground/70">
                {activeFilter !== "All"
                  ? `No ${activeFilter} events yet.`
                  : "Add your first event to get started."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((ev) => {
                const past = isPast(ev.date);
                const typeColor =
                  TYPE_COLORS[ev.event_type] ?? "bg-gray-100 text-gray-700 border-gray-200";

                return (
                  <Card
                    key={ev.id}
                    className="transition-opacity"
                    style={{ opacity: past ? 0.6 : 1 }}
                  >
                    <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold leading-tight">{ev.title}</span>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${typeColor}`}
                          >
                            {ev.event_type}
                          </span>
                          {past && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              Past
                            </Badge>
                          )}
                        </div>

                        {ev.firm_name && (
                          <p className="text-sm text-muted-foreground">{ev.firm_name}</p>
                        )}

                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatEventDate(ev.date)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{ev.location ?? "Location TBD"}</span>
                        </div>

                        {ev.notes && (
                          <p className="text-xs text-muted-foreground/70 italic">{ev.notes}</p>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {!loading && !error && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
}
