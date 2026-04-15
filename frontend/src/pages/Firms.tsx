import { useEffect, useState } from "react";
import { getFirms, type Firm } from "@/services/firms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lightbulb } from "lucide-react";

const FIRM_TYPES = ["All", "IBD", "Markets", "AM", "Consulting", "PE", "Hedge Fund", "Pension"];

function FirmCardSkeleton() {
  return (
    <div className="rounded-xl border bg-muted animate-pulse h-64" />
  );
}

function FirmCard({ firm }: { firm: Firm }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">{firm.name}</CardTitle>
          <Badge variant="outline" className="shrink-0 text-xs">
            {firm.type}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
          {firm.location && (
            <span className="text-xs text-muted-foreground">{firm.location}</span>
          )}
          {firm.gpa_cutoff != null && (
            <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
              GPA &ge; {firm.gpa_cutoff.toFixed(2)}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 pt-0">
        {firm.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {firm.description}
          </p>
        )}

        {firm.insider_tip && (
          <div className="rounded-lg bg-muted/60 border border-border px-3 py-2.5 flex gap-2">
            <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
            <p className="text-xs text-muted-foreground leading-relaxed">{firm.insider_tip}</p>
          </div>
        )}

        <div className="mt-auto">
          {firm.website ? (
            <a
              href={firm.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visit careers page
            </a>
          ) : (
            <span className="text-xs text-muted-foreground/50">No website listed</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Firms() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState("All");

  useEffect(() => {
    setLoading(true);
    getFirms()
      .then(setFirms)
      .catch(() => setError("Failed to load firms. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeType === "All" ? firms : firms.filter((f) => f.type === activeType);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Firm Directory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          27 top Bay Street &amp; Wall Street employers
        </p>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {FIRM_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
              activeType === type
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Skeleton loading grid */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <FirmCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="text-sm font-medium text-muted-foreground">No firms found</p>
          <p className="text-xs text-muted-foreground/70">
            {activeType !== "All"
              ? `No ${activeType} firms in the directory yet.`
              : "Check back soon as firms are added."}
          </p>
          {activeType !== "All" && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setActiveType("All")}
            >
              Show all firms
            </Button>
          )}
        </div>
      )}

      {/* Firms grid */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((firm) => (
              <FirmCard key={firm.id} firm={firm} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} firm{filtered.length !== 1 ? "s" : ""}
            {activeType !== "All" ? ` in ${activeType}` : ""}.
          </p>
        </>
      )}
    </div>
  );
}
