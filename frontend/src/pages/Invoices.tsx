import { useEffect, useState } from "react";
import {
  getInvoices,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  type Invoice,
  type LineItem,
} from "../services/invoices";
import { getClients, type Client } from "../services/clients";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import axios from "axios";

const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE"];

function LineItemRow({
  index,
  item,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  item: LineItem;
  onChange: (i: number, field: keyof LineItem, value: string | number) => void;
  onRemove: (i: number) => void;
  canRemove: boolean;
}) {
  const subtotal = item.qty * item.unit_price;
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-5">
        <input
          value={item.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          placeholder="Description"
          required
          className="input"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.qty}
          onChange={(e) => onChange(index, "qty", parseFloat(e.target.value) || 0)}
          placeholder="Qty"
          min="0"
          step="0.01"
          required
          className="input"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.unit_price}
          onChange={(e) => onChange(index, "unit_price", parseFloat(e.target.value) || 0)}
          placeholder="Unit price"
          min="0"
          step="0.01"
          required
          className="input"
        />
      </div>
      <div className="col-span-2 text-right text-sm text-zinc-600">
        ${subtotal.toFixed(2)}
      </div>
      <div className="col-span-1 flex justify-end">
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-zinc-400 transition hover:text-red-500"
            title="Remove line"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formPending, setFormPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const emptyLine = (): LineItem => ({ description: "", qty: 1, unit_price: 0 });
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLine()]);
  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    currency: "USD",
    tax: "",
    due_date: "",
  });

  async function fetchData() {
    try {
      const [inv, cl] = await Promise.all([getInvoices(), getClients()]);
      setInvoices(inv);
      setClients(cl);
    } catch {
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleLineChange(i: number, field: keyof LineItem, value: string | number) {
    setLineItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function handleLineRemove(i: number) {
    setLineItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  const subtotal = lineItems.reduce((s, l) => s + l.qty * l.unit_price, 0);
  const taxAmount = formData.tax ? (subtotal * parseFloat(formData.tax)) / 100 : 0;
  const total = subtotal + taxAmount;

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (lineItems.length === 0) {
      setFormError("Add at least one line item.");
      return;
    }
    setFormPending(true);
    try {
      await createInvoice({
        client_id: formData.client_id,
        title: formData.title,
        line_items: lineItems,
        tax: formData.tax ? parseFloat(formData.tax) : undefined,
        currency: formData.currency || undefined,
        due_date: formData.due_date || undefined,
      });
      setShowForm(false);
      setLineItems([emptyLine()]);
      setFormData({ client_id: "", title: "", currency: "USD", tax: "", due_date: "" });
      fetchData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setFormError(err.response?.data?.detail ?? "Failed to create invoice.");
      } else {
        setFormError("Failed to create invoice.");
      }
    } finally {
      setFormPending(false);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateInvoiceStatus(id, status);
      fetchData();
    } catch {
      // silently fail
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      await deleteInvoice(id);
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
          <h1 className="text-2xl font-bold text-zinc-900">Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + New invoice
          </button>
        )}
      </div>

      {/* New invoice form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">New invoice</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {/* Top fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Client</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData((p) => ({ ...p, client_id: e.target.value }))}
                  required
                  className="input"
                >
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
                <input
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="Invoice title"
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Currency</label>
                <input
                  value={formData.currency}
                  onChange={(e) => setFormData((p) => ({ ...p, currency: e.target.value }))}
                  placeholder="USD"
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Tax %</label>
                <input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData((p) => ({ ...p, tax: e.target.value }))}
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0"
                  className="input"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">Due date (optional)</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData((p) => ({ ...p, due_date: e.target.value }))}
                  className="input"
                />
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="mb-2 grid grid-cols-12 gap-2">
                <div className="col-span-5 text-xs font-medium text-zinc-500 uppercase tracking-wide">Description</div>
                <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">Qty</div>
                <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">Unit price</div>
                <div className="col-span-2 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide">Subtotal</div>
                <div className="col-span-1" />
              </div>
              <div className="flex flex-col gap-2">
                {lineItems.map((item, i) => (
                  <LineItemRow
                    key={i}
                    index={i}
                    item={item}
                    onChange={handleLineChange}
                    onRemove={handleLineRemove}
                    canRemove={lineItems.length > 1}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setLineItems((p) => [...p, emptyLine()])}
                className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                + Add line item
              </button>
            </div>

            {/* Totals */}
            <div className="rounded-xl bg-zinc-50 p-4 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {formData.tax && (
                <div className="flex justify-between text-zinc-600">
                  <span>Tax ({formData.tax}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-zinc-200 pt-2 font-semibold text-zinc-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormError(null);
                  setLineItems([emptyLine()]);
                  setFormData({ client_id: "", title: "", currency: "USD", tax: "", due_date: "" });
                }}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" disabled={formPending} className="btn-primary">
                {formPending ? "Creating…" : "Create invoice"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="mt-6">
        {invoices.length === 0 && !showForm ? (
          <EmptyState icon="💳" title="No invoices yet" description="Create your first invoice to get started." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50">
                <tr>
                  {["Number", "Client", "Title", "Total", "Status", "Due", "Actions"].map((h) => (
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
                {invoices.map((inv) => (
                  <tr key={inv.id} className="transition hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{inv.number}</td>
                    <td className="px-4 py-3 text-zinc-500">{inv.client_name}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{inv.title}</td>
                    <td className="px-4 py-3 text-zinc-500">${inv.total.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                          className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 focus:border-indigo-400 focus:outline-none"
                        >
                          {INVOICE_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDelete(inv.id)}
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
