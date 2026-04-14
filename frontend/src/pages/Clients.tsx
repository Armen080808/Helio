import { useEffect, useState } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  type Client,
  type ClientInput,
} from "../services/clients";
import EmptyState from "../components/EmptyState";
import axios from "axios";

// ---- Edit row ----
function EditRow({
  client,
  onDone,
  onRefresh,
}: {
  client: Client;
  onDone: () => void;
  onRefresh: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data: ClientInput = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      company: (fd.get("company") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
    };
    setPending(true);
    try {
      await updateClient(client.id, data);
      onRefresh();
      onDone();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail ?? "Update failed.");
      } else {
        setError("Update failed.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <tr className="bg-indigo-50/50">
      <td colSpan={6} className="px-4 py-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2">
            <input name="name" required defaultValue={client.name} placeholder="Full name" className="input" />
            <input name="email" type="email" required defaultValue={client.email} placeholder="Email" className="input" />
            <input name="phone" defaultValue={client.phone ?? ""} placeholder="Phone (optional)" className="input" />
            <input name="company" defaultValue={client.company ?? ""} placeholder="Company (optional)" className="input" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <textarea
              name="notes"
              defaultValue={client.notes ?? ""}
              placeholder="Notes (optional)"
              rows={1}
              className="input flex-1 resize-none"
            />
            <button type="button" onClick={onDone} className="btn-ghost shrink-0">
              Cancel
            </button>
            <button type="submit" disabled={pending} className="btn-primary shrink-0">
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

// ---- Client row ----
function ClientRow({
  client,
  onEdit,
  onRefresh,
}: {
  client: Client;
  onEdit: () => void;
  onRefresh: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete ${client.name}? This cannot be undone.`)) return;
    setPending(true);
    try {
      await deleteClient(client.id);
      onRefresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <tr className="transition hover:bg-zinc-50">
      <td className="px-4 py-3 font-medium text-zinc-900">{client.name}</td>
      <td className="px-4 py-3 text-zinc-500">{client.email}</td>
      <td className="px-4 py-3 text-zinc-500">{client.company ?? "—"}</td>
      <td className="px-4 py-3 text-zinc-500">{client.phone ?? "—"}</td>
      <td className="px-4 py-3 text-zinc-400">
        {new Date(client.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={pending}
            className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// ---- Page ----
export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formPending, setFormPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchClients() {
    try {
      const data = await getClients();
      setClients(data);
    } catch {
      setError("Failed to load clients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const fd = new FormData(e.currentTarget);
    const data: ClientInput = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      company: (fd.get("company") as string) || undefined,
      notes: (fd.get("notes") as string) || undefined,
    };
    setFormPending(true);
    try {
      await createClient(data);
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      fetchClients();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.detail ?? "Failed to create client.");
      } else {
        setFormError("Failed to create client.");
      }
    } finally {
      setFormPending(false);
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
          <h1 className="text-2xl font-bold text-zinc-900">Clients</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + Add client
          </button>
        )}
      </div>

      {/* New client form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New client</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="name" required placeholder="Full name" className="input" />
              <input name="email" type="email" required placeholder="Email" className="input" />
              <input name="phone" placeholder="Phone (optional)" className="input" />
              <input name="company" placeholder="Company (optional)" className="input" />
            </div>
            <textarea
              name="notes"
              placeholder="Notes (optional)"
              rows={2}
              className="input resize-none"
            />
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
                {formPending ? "Adding…" : "Add client"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="mt-6">
        {clients.length === 0 && !showForm ? (
          <EmptyState icon="👥" title="No clients yet" description="Add your first client to get started." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["Name", "Email", "Company", "Phone", "Added", "Actions"].map((h) => (
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
                {clients.map((c) =>
                  editingId === c.id ? (
                    <EditRow
                      key={c.id}
                      client={c}
                      onDone={() => setEditingId(null)}
                      onRefresh={fetchClients}
                    />
                  ) : (
                    <ClientRow
                      key={c.id}
                      client={c}
                      onEdit={() => setEditingId(c.id)}
                      onRefresh={fetchClients}
                    />
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
