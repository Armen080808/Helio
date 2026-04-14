import { useEffect, useState } from "react";
import {
  getProposals,
  createProposal,
  updateProposalStatus,
  deleteProposal,
  type Proposal,
} from "@/services/proposals";
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
import { FileText, Plus, Trash2 } from "lucide-react";

const PROPOSAL_STATUSES = ["DRAFT", "SENT", "VIEWED", "ACCEPTED", "DECLINED"] as const;

type ProposalStatus = typeof PROPOSAL_STATUSES[number];

const statusVariant: Record<ProposalStatus, BadgeProps["variant"]> = {
  DRAFT: "secondary",
  SENT: "info",
  VIEWED: "warning",
  ACCEPTED: "success",
  DECLINED: "destructive",
};

function ProposalBadge({ status }: { status: string }) {
  const variant = statusVariant[status as ProposalStatus] ?? "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

function NewProposalDialog({
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      await createProposal({
        client_id: clientId,
        title: fd.get("title") as string,
        body: fd.get("body") as string,
        amount: parseFloat(fd.get("amount") as string),
        currency,
        valid_until: (fd.get("valid_until") as string) || undefined,
      });
      onCreated();
      onOpenChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail ?? "Failed to create proposal.");
      } else {
        setError("Failed to create proposal.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New proposal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Label htmlFor="p-title">Title *</Label>
            <Input id="p-title" name="title" required placeholder="Proposal title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-body">Body *</Label>
            <textarea
              id="p-body"
              name="body"
              required
              rows={4}
              placeholder="Describe your proposal..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label htmlFor="p-amount">Amount *</Label>
              <Input id="p-amount" name="amount" type="number" required min="0" step="0.01" placeholder="0.00" />
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
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-valid">Valid until</Label>
            <Input id="p-valid" name="valid_until" type="date" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={pending || !clientId}>
              {pending ? "Creating..." : "Create proposal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

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

  useEffect(() => { fetchData(); }, []);

  async function handleStatusChange(id: string, status: string) {
    try {
      await updateProposalStatus(id, status);
      fetchData();
    } catch { /* silently fail */ }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this proposal? This cannot be undone.")) return;
    try {
      await deleteProposal(id);
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
          <h1 className="text-2xl font-bold">Proposals</h1>
          <p className="mt-1 text-sm text-muted-foreground">{proposals.length} proposal{proposals.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New proposal
        </Button>
      </div>

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium text-muted-foreground">No proposals yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first proposal to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.client_name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.currency} {p.amount.toLocaleString()}</TableCell>
                  <TableCell><ProposalBadge status={p.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select value={p.status} onValueChange={(v) => handleStatusChange(p.id, v)}>
                        <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PROPOSAL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
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

      <NewProposalDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        clients={clients}
        onCreated={fetchData}
      />
    </div>
  );
}
