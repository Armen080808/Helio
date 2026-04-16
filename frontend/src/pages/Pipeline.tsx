import { useEffect, useState } from "react";
import {
  getApplications,
  createApplication,
  deleteApplication,
  type Application,
  type Stage,
  type ApplicationCreate,
} from "@/services/pipeline";
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
import { Plus, X, Calendar } from "lucide-react";

const STAGES: Stage[] = [
  "Wishlist",
  "Applied",
  "OA",
  "Phone Screen",
  "Superday",
  "Offer",
  "Rejected",
];

const APP_TYPES = ["IBD", "Markets", "AM", "Consulting", "Other"] as const;

function stageBadgeClass(stage: Stage): string {
  switch (stage) {
    case "Wishlist":
      return "";
    case "Applied":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "OA":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "Phone Screen":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "Superday":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100";
    case "Offer":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Rejected":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "";
  }
}

function stageBadgeVariant(stage: Stage): "secondary" | "outline" {
  return stage === "Wishlist" ? "secondary" : "outline";
}

function stageColumnColor(stage: Stage): string {
  switch (stage) {
    case "Wishlist":
      return "bg-muted/40";
    case "Applied":
      return "bg-blue-50/60";
    case "OA":
      return "bg-purple-50/60";
    case "Phone Screen":
      return "bg-yellow-50/60";
    case "Superday":
      return "bg-orange-50/60";
    case "Offer":
      return "bg-green-50/60";
    case "Rejected":
      return "bg-red-50/40";
    default:
      return "bg-muted/40";
  }
}

interface AddApplicationDialogProps {
  onCreated: (app: Application) => void;
}

function AddApplicationDialog({ onCreated }: AddApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<string>("IBD");
  const [stage, setStage] = useState<string>("Wishlist");

  function resetForm() {
    setType("IBD");
    setStage("Wishlist");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const deadline = fd.get("deadline") as string;
    const notes = fd.get("notes") as string;

    const data: ApplicationCreate = {
      firm_name: fd.get("firm_name") as string,
      role: fd.get("role") as string,
      type: type as ApplicationCreate["type"],
      stage: stage as Stage,
      deadline: deadline || null,
      notes: notes || null,
    };

    setPending(true);
    try {
      const created = await createApplication(data);
      onCreated(created);
      setOpen(false);
      resetForm();
    } catch {
      setError("Failed to create application. Please try again.");
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
          Add Application
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firm_name">Firm *</Label>
            <Input
              id="firm_name"
              name="firm_name"
              required
              placeholder="Goldman Sachs"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              name="role"
              required
              placeholder="Summer Analyst — IBD"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APP_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any relevant notes..."
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
              {pending ? "Adding..." : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ApplicationCardProps {
  app: Application;
  onDeleted: (id: string) => void;
}

function ApplicationCard({ app, onDeleted }: ApplicationCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteApplication(app.id);
      onDeleted(app.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="cursor-pointer hover:shadow-md transition-shadow rounded-lg border bg-card p-3 mb-2 group relative">
      <button
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Delete application"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <X className="h-3 w-3" />
      </button>
      <p className="font-medium text-sm leading-snug pr-5">{app.firm_name}</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{app.role}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Badge variant="outline" className="text-xs px-1.5 py-0">
          {app.type}
        </Badge>
        {app.deadline && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(app.deadline).toLocaleDateString("en-CA", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Pipeline() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError("Failed to load pipeline."))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(app: Application) {
    setApplications((prev) => [app, ...prev]);
  }

  function handleDeleted(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading pipeline...</p>
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
      <div className="border-b bg-background px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {applications.length} application{applications.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <AddApplicationDialog onCreated={handleCreated} />
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 pb-4 min-h-full">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((a) => a.stage === stage);
            return (
              <div key={stage} className="flex-shrink-0 w-64">
                {/* Column header */}
                <div
                  className={`rounded-t-lg px-3 py-2.5 flex items-center justify-between mb-1 ${stageColumnColor(stage)}`}
                >
                  <span className="text-sm font-semibold">{stage}</span>
                  <Badge
                    variant={stageBadgeVariant(stage)}
                    className={`text-xs ${stageBadgeClass(stage)}`}
                  >
                    {stageApps.length}
                  </Badge>
                </div>

                {/* Cards */}
                <div className="min-h-[200px]">
                  {stageApps.length === 0 ? (
                    <div className="flex items-center justify-center h-20 rounded-lg border border-dashed text-xs text-muted-foreground">
                      No applications
                    </div>
                  ) : (
                    stageApps.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        app={app}
                        onDeleted={handleDeleted}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
