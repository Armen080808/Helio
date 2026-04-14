import { useEffect, useState } from "react";
import {
  getProposals,
  createProposal,
  updateProposalStatus,
  deleteProposal,
  type Proposal,
} from "../services/proposals";
import { getClients, type Client } from "../services/clients";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import axios from "axios";

const PROPOSAL_STATUSES = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "DECLINED"];

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formPending, setFormPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const [p, c] = await Promise.all([getProposals(), getClients()]);
      setProposals(p);
      setClients(c);
    } catch {
      setError("Failed to load proposals.");
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
      await createProposal({
        client_id: fd.get("client_id") as string,
        title: fd.get("title") as string,
        body: fd.get("body") as string,
        amount: parseFloat(fd.get("amount") as string),
        currency: (fd.get("currency") as string) || undefined,
        valid_until: (fd.get("valid_until") as string) || undefined,
      });
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      fetchData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.detail ?? "Failed to create proposal.");
      } else {
        setFormError("Failed to create proposal.");
      }
    } finally {
      setFormPending(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateProposalStatus(id, status);
      fetchData();
    } catch {
      // silently fail; could add toast
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this proposal? This cannot be undone.")) return;
    try {
      await deleteProposal(id);
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
          <h1 className="text-2xl font-bold text-zinc-900">Proposals</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {proposals.length} proposal{proposals.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + New proposal
          </button>
        )}
      </div>

      {/* New proposal form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New proposal</h2>
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
                <input name="title" required placeholder="Proposal title" className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Amount</label>
                <input
                  name="amount"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Currency</label>
                <input name="currency" defaultValue="USD" placeholder="USD" className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Valid until (optional)</label>
                <input name="valid_until" type="date" className="input" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">Body</label>
              <textarea
                name="body"
                required
                rows={4}
                placeholder="Describe your proposal…"
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
                {formPending ? "Creating…" : "Create proposal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="mt-6">
        {proposals.length === 0 && !showForm ? (
          <EmptyState icon="📄" title="No proposals yet" description="Create your first proposal to get started." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["Title", "Client", "Amount", "Status", "Created", "Actions"].map((h) => (
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
                {proposals.map((p) => (
                  <tr key={p.id} className="transition hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{p.title}</td>
                    <td className="px-4 py-3 text-zinc-500">{p.client_name}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {p.currency} {p.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={p.status}
                          onChange={(e) => handleStatusChange(p.id, e.target.value)}
                          className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 focus:border-indigo-400 focus:outline-none"
                        >
                          {PROPOSAL_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDelete(p.id)}
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
