"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient, updateClient, deleteClient } from "@/lib/actions/clients";
import { EmptyState } from "@/app/ui/empty-state";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  createdAt: Date;
};

export function ClientsShell({ clients }: { clients: Client[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDone() {
    setShowForm(false);
    setEditingId(null);
    router.refresh();
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createClient({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        phone: (fd.get("phone") as string) || undefined,
        company: (fd.get("company") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
      });
      handleDone();
    });
  }

  return (
    <div>
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
            <textarea name="notes" placeholder="Notes (optional)" rows={2} className="input resize-none" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? "Adding…" : "Add client"}
              </button>
            </div>
          </form>
        </div>
      )}

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
                      onDone={handleDone}
                    />
                  ) : (
                    <ClientRow
                      key={c.id}
                      client={c}
                      onEdit={() => setEditingId(c.id)}
                      onRefresh={() => router.refresh()}
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

function ClientRow({
  client: c,
  onEdit,
  onRefresh,
}: {
  client: Client;
  onEdit: () => void;
  onRefresh: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete ${c.name}? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteClient(c.id);
      onRefresh();
    });
  }

  return (
    <tr className="hover:bg-zinc-50 transition">
      <td className="px-4 py-3 font-medium text-zinc-900">{c.name}</td>
      <td className="px-4 py-3 text-zinc-500">{c.email}</td>
      <td className="px-4 py-3 text-zinc-500">{c.company ?? "—"}</td>
      <td className="px-4 py-3 text-zinc-500">{c.phone ?? "—"}</td>
      <td className="px-4 py-3 text-zinc-400">{new Date(c.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={isPending}
            className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition disabled:opacity-50"
          >
            Edit
          </button>
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

function EditRow({ client: c, onDone }: { client: Client; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateClient(c.id, {
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        phone: (fd.get("phone") as string) || undefined,
        company: (fd.get("company") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
      });
      onDone();
    });
  }

  return (
    <tr className="bg-indigo-50/50">
      <td colSpan={6} className="px-4 py-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2">
            <input name="name" required defaultValue={c.name} placeholder="Full name" className="input" />
            <input name="email" type="email" required defaultValue={c.email} placeholder="Email" className="input" />
            <input name="phone" defaultValue={c.phone ?? ""} placeholder="Phone (optional)" className="input" />
            <input name="company" defaultValue={c.company ?? ""} placeholder="Company (optional)" className="input" />
          </div>
          <div className="flex items-center gap-2">
            <textarea
              name="notes"
              defaultValue={c.notes ?? ""}
              placeholder="Notes (optional)"
              rows={1}
              className="input flex-1 resize-none"
            />
            <button type="button" onClick={onDone} className="btn-ghost shrink-0">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary shrink-0">
              {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}
