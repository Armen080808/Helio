import { useEffect, useState } from "react";
import {
  getBookings,
  createBooking,
  deleteBooking,
  type Booking,
} from "../services/bookings";
import { getClients, type Client } from "../services/clients";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import axios from "axios";

function formatDateTime(dt: string) {
  try {
    return new Date(dt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dt;
  }
}

export default function Schedule() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formPending, setFormPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const [b, c] = await Promise.all([getBookings(), getClients()]);
      setBookings(b);
      setClients(c);
    } catch {
      setError("Failed to load schedule.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    setFormPending(true);
    try {
      await createBooking({
        title: fd.get("title") as string,
        start_at: fd.get("start_at") as string,
        end_at: fd.get("end_at") as string,
        client_id: (fd.get("client_id") as string) || undefined,
        location: (fd.get("location") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
      });
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      fetchData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.detail ?? "Failed to create booking.");
      } else {
        setFormError("Failed to create booking.");
      }
    } finally {
      setFormPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await deleteBooking(id);
      fetchData();
    } catch {
      // silently fail
    }
  }

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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Schedule</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + New booking
          </button>
        )}
      </div>

      {/* New booking form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New booking</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Title</label>
                <input name="title" required placeholder="Booking title" className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Client (optional)</label>
                <select name="client_id" className="input">
                  <option value="">No client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Start</label>
                <input name="start_at" type="datetime-local" required className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">End</label>
                <input name="end_at" type="datetime-local" required className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Location (optional)</label>
                <input name="location" placeholder="Zoom, Office, etc." className="input" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Notes (optional)</label>
              <textarea name="notes" rows={2} placeholder="Any notes…" className="input resize-none" />
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null); }}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" disabled={formPending} className="btn-primary">
                {formPending ? "Booking…" : "Create booking"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="mt-6">
        {bookings.length === 0 && !showForm ? (
          <EmptyState icon="📅" title="No bookings yet" description="Schedule your first call or meeting." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["Title", "Client", "Start", "End", "Location", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="transition hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{b.title}</td>
                    <td className="px-4 py-3 text-zinc-500">{b.client_name ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">{formatDateTime(b.start_at)}</td>
                    <td className="px-4 py-3 text-zinc-500">{formatDateTime(b.end_at)}</td>
                    <td className="px-4 py-3 text-zinc-500">{b.location ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
