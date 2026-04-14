import { useEffect, useState } from "react";
import {
  getBookings,
  createBooking,
  deleteBooking,
  type Booking,
} from "@/services/bookings";
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
import { CalendarDays, Plus, Trash2, Search } from "lucide-react";

function formatDateTime(dt: string) {
  try {
    return new Date(dt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dt;
  }
}

function BookingStatusBadge({ status }: { status: string }) {
  if (status === "COMPLETED") return <Badge variant="success">COMPLETED</Badge>;
  if (status === "CANCELLED") return <Badge variant="destructive">CANCELLED</Badge>;
  if (status === "CONFIRMED") return <Badge variant="info">CONFIRMED</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

function NewBookingDialog({
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
  const [clientId, setClientId] = useState("__none__");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setPending(true);
    try {
      await createBooking({
        title: fd.get("title") as string,
        start_at: fd.get("start_at") as string,
        end_at: fd.get("end_at") as string,
        client_id: clientId !== "__none__" ? clientId : undefined,
        location: (fd.get("location") as string) || undefined,
        notes: (fd.get("notes") as string) || undefined,
      });
      onCreated();
      onOpenChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail ?? "Failed to create booking.");
      } else {
        setError("Failed to create booking.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bk-title">Title *</Label>
            <Input id="bk-title" name="title" required placeholder="Booking title" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Client (optional)</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="No client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No client</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bk-start">Start *</Label>
              <Input id="bk-start" name="start_at" type="datetime-local" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bk-end">End *</Label>
              <Input id="bk-end" name="end_at" type="datetime-local" required />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bk-location">Location</Label>
            <Input id="bk-location" name="location" placeholder="Zoom, office, etc." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bk-notes">Notes</Label>
            <textarea
              id="bk-notes"
              name="notes"
              rows={2}
              placeholder="Any notes..."
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
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Schedule() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  async function fetchData() {
    try {
      const [b, c] = await Promise.all([getBookings(), getClients()]);
      setBookings(b);
      setClients(c);
    } catch {
      setError("Failed to load schedule.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this booking? This cannot be undone.")) return;
    try {
      await deleteBooking(id);
      fetchData();
    } catch {
      /* silently fail */
    }
  }

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      (b.client_name ?? "").toLowerCase().includes(q) ||
      (b.location ?? "").toLowerCase().includes(q)
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
          <h1 className="text-xl font-semibold">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New booking
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium text-muted-foreground">
              {search ? "No bookings match your search" : "No bookings yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search
                ? "Try a different search term."
                : "Schedule your first call or meeting."}
            </p>
            {!search && (
              <Button className="mt-4" onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New booking
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
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {b.client_name ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(b.start_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(b.end_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {b.location ?? "—"}
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={b.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(b.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <NewBookingDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        clients={clients}
        onCreated={fetchData}
      />
    </div>
  );
}
