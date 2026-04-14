"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBooking, cancelBooking, deleteBooking } from "@/lib/actions/bookings";
import { StatusBadge } from "@/app/ui/status-badge";
import { EmptyState } from "@/app/ui/empty-state";

type Client = { id: string; name: string };
type Booking = {
  id: string;
  title: string;
  status: string;
  startAt: Date;
  endAt: Date;
  location: string | null;
  notes: string | null;
  client: Client | null;
};

export function ScheduleShell({ bookings, clients }: { bookings: Booking[]; clients: Client[] }) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDone() {
    setShowForm(false);
    router.refresh();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createBooking({
        title: fd.get("title") as string,
        startAt: new Date(fd.get("startAt") as string),
        endAt: new Date(fd.get("endAt") as string),
        clientId: fd.get("clientId") as string || undefined,
        notes: fd.get("notes") as string || undefined,
        location: fd.get("location") as string || undefined,
      });
      handleDone();
    });
  }

  const upcoming = bookings.filter((b) => b.status === "CONFIRMED" && new Date(b.startAt) >= new Date());
  const past = bookings.filter((b) => b.status !== "CONFIRMED" || new Date(b.startAt) < new Date());

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Schedule</h1>
          <p className="mt-1 text-sm text-zinc-500">{upcoming.length} upcoming booking{upcoming.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New booking</button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New booking</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="title" required placeholder="Meeting title" className="input col-span-2" />
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Start</label>
                <input name="startAt" type="datetime-local" required className="input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">End</label>
                <input name="endAt" type="datetime-local" required className="input" />
              </div>
              <select name="clientId" className="input">
                <option value="">No client (optional)</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="location" placeholder="Location or video link (optional)" className="input" />
            </div>
            <textarea name="notes" placeholder="Notes (optional)" rows={2} className="input resize-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? "Creating…" : "Create booking"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-8">
        {upcoming.length === 0 && !showForm && past.length === 0 ? (
          <EmptyState icon="📅" title="No bookings yet" description="Create your first booking to manage your schedule." />
        ) : (
          <>
            {upcoming.length > 0 && (
              <Section title="Upcoming" bookings={upcoming} onRefresh={() => router.refresh()} />
            )}
            {past.length > 0 && (
              <Section title="Past & cancelled" bookings={past} onRefresh={() => router.refresh()} muted />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, bookings, onRefresh, muted }: { title: string; bookings: Booking[]; onRefresh: () => void; muted?: boolean }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">{title}</h2>
      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} onRefresh={onRefresh} muted={muted} />
        ))}
      </div>
    </div>
  );
}

function BookingCard({ booking: b, onRefresh, muted }: { booking: Booking; onRefresh: () => void; muted?: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      await cancelBooking(b.id);
      onRefresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteBooking(b.id);
      onRefresh();
    });
  }

  const start = new Date(b.startAt);
  const end = new Date(b.endAt);

  return (
    <div className={`flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition ${muted ? "border-zinc-100 opacity-60" : "border-zinc-200"}`}>
      {/* Date block */}
      <div className="flex w-14 flex-col items-center rounded-xl bg-indigo-50 py-2 text-center">
        <span className="text-xs font-semibold uppercase text-indigo-500">
          {start.toLocaleDateString("en", { month: "short" })}
        </span>
        <span className="text-2xl font-bold text-indigo-700">{start.getDate()}</span>
      </div>

      <div className="flex-1">
        <p className="font-semibold text-zinc-900">{b.title}</p>
        <p className="text-sm text-zinc-500">
          {start.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })} –{" "}
          {end.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
          {b.client && <span className="ml-2 text-zinc-400">· {b.client.name}</span>}
          {b.location && <span className="ml-2 text-zinc-400">· {b.location}</span>}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={b.status} />
        {b.status === "CONFIRMED" && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
