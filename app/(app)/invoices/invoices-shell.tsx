"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createInvoice, markInvoicePaid, deleteInvoice, type LineItem } from "@/lib/actions/invoices";
import { StatusBadge } from "@/app/ui/status-badge";
import { EmptyState } from "@/app/ui/empty-state";

type Client = { id: string; name: string };
type Invoice = {
  id: string;
  number: string;
  title: string;
  total: number;
  currency: string;
  status: string;
  dueDate: Date | null;
  createdAt: Date;
  client: Client;
};

export function InvoicesShell({ invoices, clients }: { invoices: Invoice[]; clients: Client[] }) {
  const [showForm, setShowForm] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: "", qty: 1, unitPrice: 0 }]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const subtotal = lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  function handleDone() {
    setShowForm(false);
    setLineItems([{ description: "", qty: 1, unitPrice: 0 }]);
    router.refresh();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createInvoice({
        clientId: fd.get("clientId") as string,
        title: fd.get("title") as string,
        lineItems,
        tax: parseFloat(fd.get("tax") as string) || 0,
        currency: fd.get("currency") as string,
        dueDate: fd.get("dueDate") ? new Date(fd.get("dueDate") as string) : undefined,
      });
      handleDone();
    });
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    setLineItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  const outstanding = invoices
    .filter((i) => ["SENT", "VIEWED", "PARTIAL", "OVERDUE"].includes(i.status))
    .reduce((s, i) => s + i.total, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
            {outstanding > 0 && <span className="ml-2 text-amber-600 font-medium">${outstanding.toLocaleString()} outstanding</span>}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New invoice</button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New invoice</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <select name="clientId" required className="input">
                <option value="">Select client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input name="title" required placeholder="Invoice title" className="input" />
              <select name="currency" className="input">
                {["USD", "EUR", "GBP", "AMD"].map((c) => <option key={c}>{c}</option>)}
              </select>
              <input name="dueDate" type="date" className="input" />
            </div>

            {/* Line items */}
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">Line items</p>
              <div className="flex flex-col gap-2">
                {lineItems.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center">
                    <input
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Description"
                      className="input"
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateItem(i, "qty", parseInt(e.target.value) || 1)}
                      placeholder="Qty"
                      className="input text-center"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(i, "unitPrice", parseFloat(e.target.value) || 0)}
                      placeholder="Unit price"
                      className="input"
                    />
                    <button
                      type="button"
                      onClick={() => setLineItems((p) => p.filter((_, j) => j !== i))}
                      disabled={lineItems.length === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setLineItems((p) => [...p, { description: "", qty: 1, unitPrice: 0 }])}
                className="mt-2 text-sm text-indigo-600 hover:underline"
              >
                + Add line item
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-600">Tax %</label>
                <input name="tax" type="number" min="0" max="100" step="0.1" defaultValue="0" className="input w-24" />
              </div>
              <p className="text-lg font-semibold text-zinc-900">
                Subtotal: ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? "Creating…" : "Create invoice"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-6">
        {invoices.length === 0 && !showForm ? (
          <EmptyState icon="💳" title="No invoices yet" description="Create your first invoice to start getting paid." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["#", "Title", "Client", "Amount", "Due", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {invoices.map((inv) => (
                  <InvoiceRow key={inv.id} invoice={inv} onRefresh={() => router.refresh()} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InvoiceRow({ invoice: inv, onRefresh }: { invoice: Invoice; onRefresh: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handlePaid() {
    startTransition(async () => {
      await markInvoicePaid(inv.id);
      onRefresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteInvoice(inv.id);
      onRefresh();
    });
  }

  const isOverdue = inv.dueDate && new Date(inv.dueDate) < new Date() && inv.status !== "PAID";

  return (
    <tr className="hover:bg-zinc-50 transition">
      <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{inv.number}</td>
      <td className="px-4 py-3 font-medium text-zinc-900">{inv.title}</td>
      <td className="px-4 py-3 text-zinc-500">{inv.client.name}</td>
      <td className="px-4 py-3 font-semibold text-zinc-900">
        {inv.currency} {inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className={`px-4 py-3 text-xs ${isOverdue ? "text-red-500 font-medium" : "text-zinc-400"}`}>
        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
      </td>
      <td className="px-4 py-3"><StatusBadge status={isOverdue && inv.status !== "PAID" ? "OVERDUE" : inv.status} /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {inv.status !== "PAID" && inv.status !== "VOID" && (
            <button
              onClick={handlePaid}
              disabled={isPending}
              className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition disabled:opacity-50"
            >
              Mark paid
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
      </td>
    </tr>
  );
}
