"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createContract, signContract, deleteContract } from "@/lib/actions/contracts";
import { StatusBadge } from "@/app/ui/status-badge";
import { EmptyState } from "@/app/ui/empty-state";

type Client = { id: string; name: string };
type Proposal = { id: string; title: string; clientId: string };
type Contract = {
  id: string;
  title: string;
  status: string;
  signedAt: Date | null;
  clientSignedAt: Date | null;
  createdAt: Date;
  client: Client;
};

export function ContractsShell({
  contracts,
  clients,
  proposals,
}: {
  contracts: Contract[];
  clients: Client[];
  proposals: Proposal[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
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
      await createContract({
        clientId: fd.get("clientId") as string,
        title: fd.get("title") as string,
        body: fd.get("body") as string,
        proposalId: fd.get("proposalId") as string || undefined,
      });
      handleDone();
    });
  }

  const filteredProposals = selectedClientId
    ? proposals.filter((p) => p.clientId === selectedClientId)
    : proposals;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Contracts</h1>
          <p className="mt-1 text-sm text-zinc-500">{contracts.length} contract{contracts.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New contract</button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New contract</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <select
                name="clientId"
                required
                className="input"
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="">Select client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="title" required placeholder="Contract title" className="input" />
              <select name="proposalId" className="input col-span-2">
                <option value="">Link to proposal (optional)</option>
                {filteredProposals.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <textarea
              name="body"
              required
              placeholder="Contract terms and conditions…"
              rows={6}
              className="input resize-none"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? "Creating…" : "Create contract"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6">
        {contracts.length === 0 && !showForm ? (
          <EmptyState icon="✍️" title="No contracts yet" description="Create a contract to send to a client for signature." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["Title", "Client", "Status", "Your signature", "Client signature", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {contracts.map((c) => (
                  <ContractRow key={c.id} contract={c} onRefresh={() => router.refresh()} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ContractRow({ contract: c, onRefresh }: { contract: Contract; onRefresh: () => void }) {
  const [isPending, startTransition] = useTransition();

  function sign(party: "user" | "client") {
    startTransition(async () => {
      await signContract(c.id, party);
      onRefresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteContract(c.id);
      onRefresh();
    });
  }

  return (
    <tr className="hover:bg-zinc-50 transition">
      <td className="px-4 py-3 font-medium text-zinc-900">{c.title}</td>
      <td className="px-4 py-3 text-zinc-500">{c.client.name}</td>
      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
      <td className="px-4 py-3">
        {c.signedAt
          ? <span className="text-green-600 text-xs">✓ {new Date(c.signedAt).toLocaleDateString()}</span>
          : <button onClick={() => sign("user")} disabled={isPending} className="text-xs text-indigo-600 hover:underline disabled:opacity-50">Sign now</button>}
      </td>
      <td className="px-4 py-3">
        {c.clientSignedAt
          ? <span className="text-green-600 text-xs">✓ {new Date(c.clientSignedAt).toLocaleDateString()}</span>
          : <button onClick={() => sign("client")} disabled={isPending} className="text-xs text-indigo-600 hover:underline disabled:opacity-50">Mark signed</button>}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition disabled:opacity-50"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
