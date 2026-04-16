import { useEffect, useState } from "react";
import {
  getContacts,
  createContact,
  deleteContact,
  seedDemoContacts,
  type Contact,
  type ContactCreate,
  type Warmth,
} from "@/services/contacts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Trash2, Linkedin } from "lucide-react";

const WARMTH_OPTIONS: Warmth[] = ["Cold", "Warm", "Hot"];

function warmthBadgeClass(warmth: Warmth): string {
  switch (warmth) {
    case "Cold":
      return "bg-gray-100 text-gray-600 hover:bg-gray-100";
    case "Warm":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Hot":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "";
  }
}

interface AddContactDialogProps {
  onCreated: (contact: Contact) => void;
}

function AddContactDialog({ onCreated }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warmth, setWarmth] = useState<Warmth>("Cold");

  function resetForm() {
    setWarmth("Cold");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    const followUp = fd.get("follow_up_date") as string;
    const data: ContactCreate = {
      name: fd.get("name") as string,
      title: (fd.get("title") as string) || null,
      firm_name: (fd.get("firm") as string) || null,
      email: (fd.get("email") as string) || null,
      linkedin_url: (fd.get("linkedin") as string) || null,
      warmth,
      follow_up_date: followUp || null,
      notes: (fd.get("notes") as string) || null,
    };

    setPending(true);
    try {
      const created = await createContact(data);
      onCreated(created);
      setOpen(false);
      resetForm();
    } catch {
      setError("Failed to create contact. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-name">Name *</Label>
            <Input
              id="contact-name"
              name="name"
              required
              placeholder="Jane Smith"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-title">Title</Label>
              <Input
                id="contact-title"
                name="title"
                placeholder="Analyst"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-firm">Firm</Label>
              <Input
                id="contact-firm"
                name="firm"
                placeholder="Goldman Sachs"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="jane@gs.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-linkedin">LinkedIn URL</Label>
            <Input
              id="contact-linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/janesmith"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Warmth</Label>
              <Select
                value={warmth}
                onValueChange={(v) => setWarmth(v as Warmth)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WARMTH_OPTIONS.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contact-followup">Follow-up Date</Label>
              <Input id="contact-followup" name="follow_up_date" type="date" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-notes">Notes</Label>
            <textarea
              id="contact-notes"
              name="notes"
              rows={3}
              placeholder="How you met, talking points, etc."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding..." : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warmthFilter, setWarmthFilter] = useState<Warmth | "All">("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seedingDemo, setSeedingDemo] = useState(false);

  useEffect(() => {
    getContacts()
      .then(setContacts)
      .catch(() => setError("Failed to load contacts."))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(contact: Contact) {
    setContacts((prev) => [contact, ...prev]);
  }

  async function handleSeedDemo() {
    setSeedingDemo(true);
    try {
      const seeded = await seedDemoContacts();
      if (seeded.length > 0) {
        setContacts(seeded);
      }
    } catch {
      // silently ignore; user can retry
    } finally {
      setSeedingDemo(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // silently ignore, could show a toast in a fuller implementation
    } finally {
      setDeletingId(null);
    }
  }

  const filtered =
    warmthFilter === "All"
      ? contacts
      : contacts.filter((c) => c.warmth === warmthFilter);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading contacts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="border-b bg-background px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold">Contacts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {contacts.length} networking contact{contacts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <AddContactDialog onCreated={handleCreated} />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        {/* Warmth filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">Filter:</span>
          {(["All", ...WARMTH_OPTIONS] as const).map((w) => (
            <Button
              key={w}
              size="sm"
              variant={warmthFilter === w ? "default" : "outline"}
              className="h-7 px-3 text-xs"
              onClick={() => setWarmthFilter(w)}
            >
              {w}
            </Button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Linkedin className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium text-muted-foreground">
              {warmthFilter !== "All"
                ? `No ${warmthFilter} contacts`
                : "No contacts yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {warmthFilter !== "All"
                ? "Try a different warmth filter."
                : "Add your first networking contact to get started."}
            </p>
            {warmthFilter === "All" && contacts.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                disabled={seedingDemo}
                onClick={handleSeedDemo}
              >
                {seedingDemo ? "Loading..." : "Load sample contacts"}
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Title</TableHead>
                  <TableHead>Firm</TableHead>
                  <TableHead>Warmth</TableHead>
                  <TableHead className="hidden md:table-cell">Follow-up</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{contact.name}</span>
                        {contact.email && (
                          <span className="text-xs text-muted-foreground">
                            {contact.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {contact.title ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contact.firm_name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={warmthBadgeClass(contact.warmth)}
                      >
                        {contact.warmth}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {contact.follow_up_date
                        ? new Date(contact.follow_up_date).toLocaleDateString(
                            "en-CA",
                            { month: "short", day: "numeric", year: "numeric" }
                          )
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {contact.linkedin_url && (
                          <a
                            href={contact.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label="LinkedIn profile"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          disabled={deletingId === contact.id}
                          onClick={() => handleDelete(contact.id)}
                          aria-label="Delete contact"
                        >
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
      </div>
    </div>
  );
}
