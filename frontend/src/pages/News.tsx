import { useEffect, useState, useCallback } from "react";
import { getNews, type NewsArticle } from "@/services/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Newspaper, ExternalLink, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

const CATEGORIES = ["All", "Bay Street", "Markets", "Deals", "Macro"] as const;
type Category = (typeof CATEGORIES)[number];

// ─── Source / Category colours ───────────────────────────────────────────────

function categoryStyles(cat: string): string {
  switch (cat) {
    case "Bay Street": return "bg-violet-100 text-violet-700 border-violet-200";
    case "Markets":    return "bg-blue-100 text-blue-700 border-blue-200";
    case "Deals":      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Macro":      return "bg-amber-100 text-amber-700 border-amber-200";
    default:           return "bg-secondary text-secondary-foreground";
  }
}

function categoryDot(cat: string): string {
  switch (cat) {
    case "Bay Street": return "bg-violet-500";
    case "Markets":    return "bg-blue-500";
    case "Deals":      return "bg-emerald-500";
    case "Macro":      return "bg-amber-500";
    default:           return "bg-muted-foreground";
  }
}

function sourceStyles(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("financial post"))  return "bg-red-50 text-red-700 border-red-200";
  if (s.includes("globe"))           return "bg-slate-100 text-slate-700 border-slate-200";
  if (s.includes("bay street"))      return "bg-slate-100 text-slate-700 border-slate-200";
  if (s.includes("reuters"))         return "bg-orange-100 text-orange-700 border-orange-200";
  if (s.includes("bloomberg"))       return "bg-green-100 text-green-700 border-green-200";
  if (s.includes("marketwatch"))     return "bg-blue-100 text-blue-700 border-blue-200";
  if (s.includes("bank of canada"))  return "bg-red-100 text-red-700 border-red-200";
  if (s.includes("deal law"))        return "bg-violet-100 text-violet-700 border-violet-200";
  return "bg-secondary text-secondary-foreground";
}

// ─── Article cards ───────────────────────────────────────────────────────────

function FeaturedCard({ article }: { article: NewsArticle }) {
  const dateStr = article.published_at ?? article.fetched_at;
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md cursor-pointer border-border/60">
      {/* colour accent bar */}
      <div className={cn("h-1 w-full", categoryDot(article.category ?? ""))} />
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* badges + time */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn("text-xs font-medium", sourceStyles(article.source))}
          >
            {article.source}
          </Badge>
          {article.category && (
            <Badge
              variant="outline"
              className={cn("text-xs font-medium", categoryStyles(article.category))}
            >
              {article.category}
            </Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo(dateStr)}
          </span>
        </div>

        {/* headline */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-start gap-1 font-semibold leading-snug text-sm hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {article.title}
          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60 group-hover/link:text-foreground transition-colors" />
        </a>

        {/* summary */}
        {article.summary && (
          <p className="line-clamp-3 text-xs text-muted-foreground leading-relaxed flex-1">
            {article.summary}
          </p>
        )}

        {/* footer */}
        <p className="text-xs text-muted-foreground/60">{formatDate(dateStr)}</p>
      </CardContent>
    </Card>
  );
}

function ArticleRow({ article }: { article: NewsArticle }) {
  const dateStr = article.published_at ?? article.fetched_at;
  return (
    <div className="group flex items-start gap-3 py-3.5 border-b last:border-b-0">
      {/* category indicator */}
      <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", categoryDot(article.category ?? ""))} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <Badge
            variant="outline"
            className={cn("text-xs", sourceStyles(article.source))}
          >
            {article.source}
          </Badge>
          {article.category && (
            <Badge
              variant="outline"
              className={cn("text-xs", categoryStyles(article.category))}
            >
              {article.category}
            </Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo(dateStr)}
          </span>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-start gap-1 text-sm font-medium hover:underline leading-snug"
        >
          {article.title}
          <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/60 group-hover/link:text-foreground transition-colors" />
        </a>

        {article.summary && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
            {article.summary}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card animate-pulse overflow-hidden">
      <div className="h-1 w-full bg-muted" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="h-5 w-24 bg-muted rounded-full" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-5/6 bg-muted rounded" />
        <div className="h-3 w-4/6 bg-muted rounded" />
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b last:border-b-0 animate-pulse">
      <div className="mt-1.5 h-2 w-2 rounded-full bg-muted shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="h-4 w-20 bg-muted rounded-full" />
          <div className="h-4 w-14 bg-muted rounded-full" />
          <div className="h-4 w-10 bg-muted rounded-full ml-auto" />
        </div>
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-3 w-4/5 bg-muted rounded" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const load = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const data = await getNews({ limit: 60 });
      setArticles(data);
    } catch {
      // silent — show empty state
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 60 * 60 * 1000); // refresh every hour
    return () => clearInterval(interval);
  }, [load]);

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter(
          (a) => (a.category ?? "").toLowerCase() === activeCategory.toLowerCase()
        );

  // Count by category for badges
  const counts: Record<string, number> = { All: articles.length };
  for (const a of articles) {
    const c = a.category ?? "Other";
    counts[c] = (counts[c] ?? 0) + 1;
  }

  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Newspaper className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Finance News</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Bay Street, markets &amp; macro — updated every 4 hours
            </p>
          </div>
        </div>

      </div>

      {/* ── Category tabs ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const count = counts[cat] ?? 0;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
              {count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Loading: featured skeletons ────────────────────────────── */}
      {loading && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
          <div className="rounded-lg border bg-card px-4">
            {[0, 1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
          </div>
        </>
      )}

      {/* ── Empty state ────────────────────────────────────────────── */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Newspaper className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <div>
            <p className="font-medium text-sm">No articles yet</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
              {activeCategory !== "All"
                ? `No ${activeCategory} articles found. Try a different category.`
                : "News articles are fetched from RSS feeds every 4 hours. Check back soon."}
            </p>
          </div>
          {activeCategory !== "All" && (
            <Button variant="ghost" size="sm" onClick={() => setActiveCategory("All")}>
              Show all categories
            </Button>
          )}
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────── */}
      {!loading && filtered.length > 0 && (
        <>
          {/* Featured cards grid */}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((a) => (
                <FeaturedCard key={a.id} article={a} />
              ))}
            </div>
          )}

          {/* Rest as compact list */}
          {rest.length > 0 && (
            <>
              {featured.length > 0 && (
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    More stories
                  </span>
                  <Separator className="flex-1" />
                </div>
              )}
              <div className="rounded-lg border bg-card px-4">
                {rest.map((a) => (
                  <ArticleRow key={a.id} article={a} />
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}.
            {" "}Aggregated from Financial Post, Globe &amp; Mail, Reuters, Bloomberg &amp; more.
          </p>
        </>
      )}

      {/* ── Sources legend ─────────────────────────────────────────── */}
      {!loading && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Live sources
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Financial Post", "Globe and Mail", "Bay Street Bull",
              "Reuters", "Bloomberg Markets", "MarketWatch", "Bank of Canada",
            ].map((s) => (
              <Badge key={s} variant="outline" className={cn("text-xs", sourceStyles(s))}>
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
