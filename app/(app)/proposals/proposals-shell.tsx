"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProposal, updateProposalStatus, deleteProposal } from "@/lib/actions/proposals";
import { StatusBadge } from "@/app/ui/status-badge";
import { EmptyState } from "@/app/ui/empty-state";

type Client = { id: string; name: string };
type Proposal = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  client: Client;
};

export function ProposalsShell({
  proposals,
  clients,
}: {
  proposals: Proposal[];
  clients: Client[];
}) {
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
      await createProposal({
        clientId: fd.get("clientId") as string,
        title: fd.get("title") as string,
        body: fd.get("body") as string,
        amount: parseFloat(fd.get("amount") as string),
        currency: fd.get("currency") as string,
        validUntil: fd.get("validUntil") ? new Date(fd.get("validUntil") as string) : undefined,
      });
      handleDone();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Proposals</h1>
          <p className="mt-1 text-sm text-zinc-500">{proposals.length} proposal{proposals.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New proposal</button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New proposal</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <select name="clientId" required className="input">
                <option value="">Select client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input name="title" required placeholder="Proposal title" className="input" />
              <input name="amount" type="number" step="0.01" min="0" required placeholder="Amount" className="input" />
              <select name="currency" className="input">
                {["USD", "EUR", "GBP", "AMD"].map((c) => <option key={c}>{c}</option>)}
              </select>
              <input name="validUntil" type="date" className="input" placeholder="Valid until (optional)" />
            </div>
            <textarea name="body" required placeholder="Describe the scope of work…" rows={4} className="input resize-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? "Creating…" : "Create proposal"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6">
        {proposals.length === 0 && !showForm ? (
          <EmptyState icon="📄" title="No proposals yet" description="Create your first proposal to get started." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["Title", "Client", "Amount", "Status", "Created", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {proposals.map((p) => (
                  <ProposalRow key={p.id} proposal={p} onRefresh={() => router.refresh()} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ProposalRow({ proposal: p, onRefresh }: { proposal: Proposal; onRefresh: () => void }) {
  const [isPending, startTransition] = useTransition();

  function setStatus(status: Parameters<typeof updateProposalStatus>[1]) {
    startTransition(async () => {
      await updateProposalStatus(p.id, status);
      onRefresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteProposal(p.id);
      onRefresh();
    });
  }

  const nextActions: Record<string, { label: string; status: Parameters<typeof updateProposalStatus>[1] }[]> = {
    DRAFT:    [{ label: "Mark sent", status: "SENT" }],
    SENT:     [{ label: "Mark viewed", status: "VIEWED" }, { label: "Accept", status: "ACCEPTED" }, { label: "Decline", status: "DECLINED" }],
    VIEWED:   [{ label: "Accept", status: "ACCEPTED" }, { label: "Decline", status: "DECLINED" }],
    ACCEPTED: [],
    DECLINED: [],
    EXPIRED:  [],
  };

  return (
    <tr className="hover:bg-zinc-50 transition">
      <td className="px-4 py-3 font-medium text-zinc-900">{p.title}</td>
      <td className="px-4 py-3 text-zinc-500">{p.client.name}</td>
      <td className="px-4 py-3 font-medium text-zinc-900">
        {p.currency} {p.amount.toLocaleString()}
      </td>
      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
      <td className="px-4 py-3 text-zinc-400">{new Date(p.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {(nextActions[p.status] ?? []).map((a) => (
            <button
              key={a.status}
              onClick={() => setStatus(a.status)}
              disabled={isPending}
              className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition disabled:opacity-50"
            >
              {a.label}
            </button>
          ))}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
