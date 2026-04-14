import { useEffect, useState } from "react";
import {
  getInvoices,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  type Invoice,
  type LineItem,
} from "@/services/invoices";
import { getClients, type Client } from "@/services/clients";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt, Plus, Trash2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const INVOICE_STATUSES = ["DRAFT", "SENT", "PAID", "OVERDUE"] as const;
type InvoiceStatus = typeof INVOICE_STATUSES[number];

const statusVariant: Record<InvoiceStatus, BadgeProps["variant"]> = {
  DRAFT: "secondary",
  SENT: "info",
  PAID: "success",
  OVERDUE: "destructive",
};

function InvoiceBadge({ status }: { status: string }) {
  const variant = statusVariant[status as InvoiceStatus] ?? "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

const emptyLine = (): LineItem => ({ description: "", qty: 1, unit_price: 0 });

function NewInvoiceDialog({
  open,
  onOpenChange,
  clients,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  clients: Client[];
  onCreated: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLine()]);
  const [tax, setTax] = useState("");

  const subtotal = lineItems.reduce((s, l) => s + l.qty * l.unit_price, 0);
  const taxAmount = tax ? (subtotal * parseFloat(tax)) / 100 : 0;
  const total = subtotal + taxAmount;

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (lineItems.length === 0) { setError("Add at least one line item."); return; }
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      await createInvoice({
        client_id: clientId,
        title: fd.get("title") as string,
        line_items: lineItems,
        tax: tax ? parseFloat(tax) : undefined,
        currency,
        due_date: (fd.get("due_date") as string) || undefined,
      });
      onCreated();
      onOpenChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail ?? "Failed to create invoice.");
      } else {
        setError("Failed to create invoice.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Client *</Label>
              <Select value={clientId} onValueChange={setClientId} required>
                <SelectTrigger><SelectValue placeholder="Select client..." /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-title">Title *</Label>
              <Input id="inv-title" name="title" required placeholder="Invoice title" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="inv-tax">Tax %</Label>
              <Input id="inv-tax" type="number" value={tax} onChange={(e) => setTax(e.target.value)} min="0" max="100" step="0.01" placeholder="0" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="inv-due">Due date</Label>
              <Input id="inv-due" name="due_date" type="date" />
            </div>
          </div>

          <Separator />

          {/* Line items */}
          <div>
            <div className="mb-2 grid grid-cols-12 gap-2">
              <div className="col-span-5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</div>
              <div className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Qty</div>
              <div className="col-span-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit price</div>
              <div className="col-span-1 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">Sub</div>
              <div className="col-span-1" />
            </div>
            <div className="flex flex-col gap-2">
              {lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input value={item.description} onChange={(e) => handleLineChange(i, "description", e.target.value)} placeholder="Description" required />
                  </div>
                  <div className="col-span-2">
                    <Input type="number" value={item.qty} onChange={(e) => handleLineChange(i, "qty", parseFloat(e.target.value) || 0)} placeholder="Qty" min="0" step="0.01" required />
                  </div>
                  <div className="col-span-3">
                    <Input type="number" value={item.unit_price} onChange={(e) => handleLineChange(i, "unit_price", parseFloat(e.target.value) || 0)} placeholder="0.00" min="0" step="0.01" required />
                  </div>
                  <div className="col-span-1 text-right text-sm text-muted-foreground">
                    ${(item.qty * item.unit_price).toFixed(2)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {lineItems.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleLineRemove(i)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={() => setLineItems((p) => [...p, emptyLine()])}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add line item
            </Button>
          </div>

          <Separator />

          {/* Totals */}
          <div className="rounded-md bg-muted/50 p-4 text-sm space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            {tax && (
              <div className="flex justify-between text-muted-foreground">
                <span>Tax ({tax}%)</span><span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-1.5 mt-1.5">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={pending || !clientId}>
              {pending ? "Creating..." : "Create invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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

  useEffect(() => { fetchData(); }, []);

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateInvoiceStatus(id, status);
      fetchData();
    } catch { /* silently fail */ }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      await deleteInvoice(id);
      fetchData();
    } catch { /* silently fail */ }
  }

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>;
  }

  if (error) {
    return <div className="rounded-md border border-destructive/20 bg-destructive/10 p-6"><p className="text-sm text-destructive">{error}</p></div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="mt-1 text-sm text-muted-foreground">{invoices.length} invoice{invoices.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <Receipt className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium text-muted-foreground">No invoices yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first invoice to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inv.number}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.client_name}</TableCell>
                  <TableCell className="font-medium">{inv.title}</TableCell>
                  <TableCell className="text-muted-foreground">${inv.total.toLocaleString()}</TableCell>
                  <TableCell><InvoiceBadge status={inv.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select value={inv.status} onValueChange={(v) => handleStatusChange(inv.id, v)}>
                        <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {INVOICE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(inv.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <NewInvoiceDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        clients={clients}
        onCreated={fetchData}
      />
    </div>
  );
}
