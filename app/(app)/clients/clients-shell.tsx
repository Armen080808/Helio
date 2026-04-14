"use client";

import { useState } from "react";
import { AddClientForm } from "@/app/ui/client-form";
import { EmptyState } from "@/app/ui/empty-state";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  function handleDone() {
    setShowForm(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Clients</h1>
          <p className="mt-1 text-sm text-zinc-500">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add client
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New client</h2>
          <AddClientForm onDone={handleDone} />
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
                  {["Name", "Email", "Company", "Phone", "Added"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition">
                    <td className="px-4 py-3 font-medium text-zinc-900">{c.name}</td>
                    <td className="px-4 py-3 text-zinc-500">{c.email}</td>
                    <td className="px-4 py-3 text-zinc-500">{c.company ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-500">{c.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString()}
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
