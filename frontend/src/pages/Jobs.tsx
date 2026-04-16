import { useEffect, useState } from "react";
import { getJobs, type JobPosting } from "@/services/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, ExternalLink } from "lucide-react";

const TYPES = ["All", "IBD", "Markets", "AM", "Consulting", "Other"] as const;
type JobType = (typeof TYPES)[number];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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

function sourceBadgeClass(source: string): string {
  switch (source.toLowerCase()) {
    case "linkedin":
      return "bg-sky-100 text-sky-700 hover:bg-sky-100";
    case "indeed":
      return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function JobCard({ job }: { job: JobPosting }) {
  return (
    <div className="flex flex-col gap-3 py-4 border-b last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{job.company}</span>
          {job.job_type && (
            <Badge variant="outline" className={typeBadgeClass(job.job_type)}>
              {job.job_type}
            </Badge>
          )}
          <Badge variant="outline" className={sourceBadgeClass(job.source)}>
            {job.source}
          </Badge>
        </div>
        <p className="text-sm text-foreground mb-1.5">{job.title}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
          )}
          {job.posted_at && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {timeAgo(job.posted_at)}
            </span>
          )}
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 gap-1.5 w-full sm:w-auto"
        onClick={() => window.open(job.url, "_blank", "noopener,noreferrer")}
      >
        <ExternalLink className="h-3 w-3" />
        View Posting
      </Button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b last:border-b-0">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="h-5 w-28 bg-muted rounded animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-8 w-28 bg-muted rounded animate-pulse shrink-0" />
    </div>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<JobType>("All");

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeType === "All"
      ? jobs
      : jobs.filter(
          (j) => (j.job_type ?? "Other").toLowerCase() === activeType.toLowerCase()
        );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Job Board</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Finance &amp; consulting roles curated for UofT students
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TYPES.map((type) => (
          <Button
            key={type}
            variant={activeType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveType(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border bg-card">
        {loading ? (
          <div className="px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No postings found for this category.
          </p>
        ) : (
          <div className="px-4">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
