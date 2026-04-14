import { useEffect, useState } from "react";
import {
  getContracts,
  createContract,
  signContract,
  deleteContract,
  type Contract,
} from "../services/contracts";
import { getClients, type Client } from "../services/clients";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import axios from "axios";

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formPending, setFormPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const [c, cl] = await Promise.all([getContracts(), getClients()]);
      setContracts(c);
      setClients(cl);
    } catch {
      setError("Failed to load contracts.");
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
      await createContract({
        client_id: fd.get("client_id") as string,
        title: fd.get("title") as string,
        body: fd.get("body") as string,
        proposal_id: (fd.get("proposal_id") as string) || undefined,
      });
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      fetchData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.detail ?? "Failed to create contract.");
      } else {
        setFormError("Failed to create contract.");
      }
    } finally {
      setFormPending(false);
    }
  }

  async function handleSign(id: string) {
    if (!confirm("Mark this contract as signed?")) return;
    try {
      await signContract(id);
      fetchData();
    } catch {
      // silently fail
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contract? This cannot be undone.")) return;
    try {
      await deleteContract(id);
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
          <h1 className="text-2xl font-bold text-zinc-900">Contracts</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {contracts.length} contract{contracts.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + New contract
          </button>
        )}
      </div>

      {/* New contract form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New contract</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Client</label>
                <select name="client_id" required className="input">
                  <option value="">Select client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Title</label>
                <input name="title" required placeholder="Contract title" className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Proposal ID (optional)</label>
                <input name="proposal_id" placeholder="Link to proposal…" className="input" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Body</label>
              <textarea
                name="body"
                required
                rows={5}
                placeholder="Contract terms and conditions…"
                className="input resize-none"
              />
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
                {formPending ? "Creating…" : "Create contract"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="mt-6">
        {contracts.length === 0 && !showForm ? (
          <EmptyState icon="📝" title="No contracts yet" description="Create your first contract to get started." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["Title", "Client", "Status", "Created", "Signed", "Actions"].map((h) => (
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
                {contracts.map((c) => (
                  <tr key={c.id} className="transition hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{c.title}</td>
                    <td className="px-4 py-3 text-zinc-500">{c.client_name}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {c.signed_at ? new Date(c.signed_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!c.signed_at && (
                          <button
                            onClick={() => handleSign(c.id)}
                            className="rounded-lg border border-green-200 px-2.5 py-1 text-xs font-medium text-green-600 transition hover:bg-green-50"
                          >
                            Sign
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
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
