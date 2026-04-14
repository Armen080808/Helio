import { useEffect, useState } from "react";
import {
  getContracts,
  createContract,
  signContract,
  deleteContract,
  type Contract,
} from "@/services/contracts";
import { getClients, type Client } from "@/services/clients";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { FileCheck, Plus, Trash2, PenLine, Search } from "lucide-react";

function ContractStatusBadge({ status }: { status: string }) {
  if (status === "SIGNED") return <Badge variant="success">SIGNED</Badge>;
  if (status === "CANCELLED") return <Badge variant="destructive">CANCELLED</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

function NewContractDialog({
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      await createContract({
        client_id: clientId,
        title: fd.get("title") as string,
        body: fd.get("body") as string,
        proposal_id: (fd.get("proposal_id") as string) || undefined,
      });
      onCreated();
      onOpenChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail ?? "Failed to create contract.");
      } else {
        setError("Failed to create contract.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New contract</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={setClientId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ct-title">Title *</Label>
            <Input id="ct-title" name="title" required placeholder="Contract title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ct-proposal">Proposal ID (optional)</Label>
            <Input id="ct-proposal" name="proposal_id" placeholder="Link to proposal..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ct-body">Body *</Label>
            <textarea
              id="ct-body"
              name="body"
              required
              rows={5}
              placeholder="Contract terms and conditions..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending || !clientId}>
              {pending ? "Creating..." : "Create contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

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

  async function handleSign(id: string) {
    if (!confirm("Mark this contract as signed?")) return;
    try {
      await signContract(id);
      fetchData();
    } catch {
      /* silently fail */
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contract? This cannot be undone.")) return;
    try {
      await deleteContract(id);
      fetchData();
    } catch {
      /* silently fail */
    }
  }

  const filtered = contracts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.client_name ?? "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="border-b bg-background px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Contracts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {contracts.length} contract{contracts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New contract
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <FileCheck className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium text-muted-foreground">
              {search ? "No contracts match your search" : "No contracts yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try a different search term."
                : "Create your first contract to get started."}
            </p>
            {!search && (
              <Button className="mt-4" onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New contract
              </Button>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Signed</TableHead>
                    <TableHead className="w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell className="text-muted-foreground">{c.client_name}</TableCell>
                      <TableCell>
                        <ContractStatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {c.signed_at ? new Date(c.signed_at).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {!c.signed_at && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 h-8"
                              onClick={() => handleSign(c.id)}
                            >
                              <PenLine className="mr-1.5 h-3.5 w-3.5" />
                              Sign
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(c.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <NewContractDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        clients={clients}
        onCreated={fetchData}
      />
    </div>
  );
}
