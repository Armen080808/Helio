import { useEffect, useState } from "react";
import {
  getReviews,
  submitReview,
  getOffers,
  submitOffer,
  type InterviewReview,
  type OfferReport,
} from "@/services/community";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Star } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSalary(amount: number): string {
  return `$${amount.toLocaleString("en-CA")} CAD`;
}

function outcomeBadgeClass(outcome: string): string {
  switch (outcome.toLowerCase()) {
    case "offer":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "rejected":
    case "rej":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "ongoing":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function outcomeBadgeLabel(outcome: string): string {
  switch (outcome.toLowerCase()) {
    case "rej":
      return "Rejected";
    default:
      return outcome.charAt(0).toUpperCase() + outcome.slice(1).toLowerCase();
  }
}

function typeBadgeClass(type: string): string {
  switch (type.toUpperCase()) {
    case "IBD":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "MARKETS":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "AM":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "CONSULTING":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </span>
  );
}

// ─── Review form ─────────────────────────────────────────────────────────────

interface ReviewFormState {
  firm_name: string;
  role: string;
  outcome: string;
  difficulty: string;
  rounds: string;
  questions_asked: string;
  tips: string;
  anonymous: boolean;
}

const defaultReviewForm: ReviewFormState = {
  firm_name: "",
  role: "",
  outcome: "",
  difficulty: "",
  rounds: "",
  questions_asked: "",
  tips: "",
  anonymous: true,
};

function SubmitReviewDialog({ onSubmitted }: { onSubmitted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ReviewFormState>(defaultReviewForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof ReviewFormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firm_name.trim() || !form.role.trim()) {
      setError("Firm name and role are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitReview({
        firm_name: form.firm_name.trim(),
        role: form.role.trim(),
        outcome: form.outcome,
        difficulty: form.difficulty ? parseInt(form.difficulty, 10) : undefined,
        rounds: form.rounds ? parseInt(form.rounds, 10) : undefined,
        questions_asked: form.questions_asked.trim() || undefined,
        tips: form.tips.trim() || undefined,
        anonymous: form.anonymous,
      });
      setForm(defaultReviewForm);
      setOpen(false);
      onSubmitted();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Submit Review</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Interview Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="grid gap-1.5">
            <Label htmlFor="r-firm">Firm Name *</Label>
            <Input
              id="r-firm"
              value={form.firm_name}
              onChange={(e) => handleChange("firm_name", e.target.value)}
              placeholder="e.g. Goldman Sachs"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-role">Role *</Label>
            <Input
              id="r-role"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g. Summer Analyst, IBD"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Outcome</Label>
            <Select value={form.outcome} onValueChange={(v) => handleChange("outcome", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rej">Rejected</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Difficulty</Label>
            <Select value={form.difficulty} onValueChange={(v) => handleChange("difficulty", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Rate difficulty (1–5)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 — Very Easy</SelectItem>
                <SelectItem value="2">2 — Easy</SelectItem>
                <SelectItem value="3">3 — Moderate</SelectItem>
                <SelectItem value="4">4 — Hard</SelectItem>
                <SelectItem value="5">5 — Very Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-rounds">Number of Rounds</Label>
            <Input
              id="r-rounds"
              type="number"
              min={1}
              value={form.rounds}
              onChange={(e) => handleChange("rounds", e.target.value)}
              placeholder="e.g. 3"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-questions">Questions Asked</Label>
            <textarea
              id="r-questions"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              value={form.questions_asked}
              onChange={(e) => handleChange("questions_asked", e.target.value)}
              placeholder="Share interview questions you were asked..."
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="r-tips">Tips</Label>
            <textarea
              id="r-tips"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              value={form.tips}
              onChange={(e) => handleChange("tips", e.target.value)}
              placeholder="Any advice for future applicants..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              checked={form.anonymous}
              onChange={(e) => handleChange("anonymous", e.target.checked)}
            />
            <span className="text-sm">Submit anonymously</span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Offer form ──────────────────────────────────────────────────────────────

interface OfferFormState {
  firm_name: string;
  role: string;
  type: string;
  base_salary: string;
  signing_bonus: string;
  cycle: string;
  notes: string;
  anonymous: boolean;
}

const defaultOfferForm: OfferFormState = {
  firm_name: "",
  role: "",
  type: "",
  base_salary: "",
  signing_bonus: "",
  cycle: "",
  notes: "",
  anonymous: true,
};

function SubmitOfferDialog({ onSubmitted }: { onSubmitted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OfferFormState>(defaultOfferForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(field: keyof OfferFormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firm_name.trim() || !form.role.trim()) {
      setError("Firm name and role are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitOffer({
        firm_name: form.firm_name.trim(),
        role: form.role.trim(),
        type: form.type || undefined,
        base_salary: form.base_salary ? parseFloat(form.base_salary) : undefined,
        signing_bonus: form.signing_bonus ? parseFloat(form.signing_bonus) : undefined,
        cycle: form.cycle.trim() || undefined,
        notes: form.notes.trim() || undefined,
        anonymous: form.anonymous,
      });
      setForm(defaultOfferForm);
      setOpen(false);
      onSubmitted();
    } catch {
      setError("Failed to submit offer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Submit Offer</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Offer Report</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="grid gap-1.5">
            <Label htmlFor="o-firm">Firm Name *</Label>
            <Input
              id="o-firm"
              value={form.firm_name}
              onChange={(e) => handleChange("firm_name", e.target.value)}
              placeholder="e.g. McKinsey & Company"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="o-role">Role *</Label>
            <Input
              id="o-role"
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="e.g. Business Analyst"
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => handleChange("type", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IBD">IBD</SelectItem>
                <SelectItem value="Markets">Markets</SelectItem>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="o-base">Base Salary (CAD)</Label>
            <Input
              id="o-base"
              type="number"
              min={0}
              value={form.base_salary}
              onChange={(e) => handleChange("base_salary", e.target.value)}
              placeholder="e.g. 95000"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="o-signing">Signing Bonus (CAD)</Label>
            <Input
              id="o-signing"
              type="number"
              min={0}
              value={form.signing_bonus}
              onChange={(e) => handleChange("signing_bonus", e.target.value)}
              placeholder="e.g. 10000"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="o-cycle">Cycle</Label>
            <Input
              id="o-cycle"
              value={form.cycle}
              onChange={(e) => handleChange("cycle", e.target.value)}
              placeholder="e.g. Summer 2025"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="o-notes">Notes</Label>
            <textarea
              id="o-notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional details..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input accent-primary"
              checked={form.anonymous}
              onChange={(e) => handleChange("anonymous", e.target.checked)}
            />
            <span className="text-sm">Submit anonymously</span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Reviews tab ─────────────────────────────────────────────────────────────

function ReviewsTab() {
  const [reviews, setReviews] = useState<InterviewReview[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getReviews()
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${reviews.length} review${reviews.length !== 1 ? "s" : ""}`}
        </p>
        <SubmitReviewDialog onSubmitted={load} />
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firm</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="max-w-[220px]">Tips</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.firm_name}</TableCell>
                  <TableCell className="text-sm">{r.role}</TableCell>
                  <TableCell>
                    {r.outcome ? (
                      <Badge variant="outline" className={outcomeBadgeClass(r.outcome)}>
                        {outcomeBadgeLabel(r.outcome)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.difficulty ? (
                      <StarRating rating={r.difficulty} />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[220px]">
                    <span className="line-clamp-2">{r.tips ?? "—"}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Offers tab ──────────────────────────────────────────────────────────────

function OffersTab() {
  const [offers, setOffers] = useState<OfferReport[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getOffers()
      .then(setOffers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading..." : `${offers.length} report${offers.length !== 1 ? "s" : ""}`}
        </p>
        <SubmitOfferDialog onSubmitted={load} />
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-lg border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No offer reports yet. Share your comp data anonymously.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firm</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Signing Bonus</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.firm_name}</TableCell>
                  <TableCell className="text-sm">{o.role}</TableCell>
                  <TableCell>
                    {o.type ? (
                      <Badge variant="outline" className={typeBadgeClass(o.type)}>
                        {o.type}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {o.base_salary != null ? formatSalary(o.base_salary) : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {o.signing_bonus != null ? formatSalary(o.signing_bonus) : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {o.cycle ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(o.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

type Tab = "reviews" | "offers";

export default function Community() {
  const [activeTab, setActiveTab] = useState<Tab>("reviews");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Community Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Anonymous interview reviews and offer data from UofT students
        </p>
      </div>

      <div className="flex border-b gap-1">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "reviews"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Interview Reviews
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "offers"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("offers")}
        >
          Offer Reports
        </button>
      </div>

      {activeTab === "reviews" ? <ReviewsTab /> : <OffersTab />}
    </div>
  );
}
