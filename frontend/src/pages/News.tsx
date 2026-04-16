import { useEffect, useState } from "react";
import { getNews, type NewsArticle } from "@/services/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const CATEGORIES = ["All", "Markets", "Banking", "Economy"] as const;
type Category = (typeof CATEGORIES)[number];

function categoryBadgeClass(category: string): string {
  switch (category.toLowerCase()) {
    case "markets":
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case "banking":
      return "bg-purple-100 text-purple-700 hover:bg-purple-100";
    case "economy":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function sourceBadgeClass(source: string): string {
  switch (source.toLowerCase()) {
    case "financial post":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case "globe & mail":
    case "globe and mail":
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
    case "reuters":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100";
    case "bloomberg":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function ArticleRow({ article }: { article: NewsArticle }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge variant="outline" className={sourceBadgeClass(article.source)}>
            {article.source}
          </Badge>
          <Badge variant="outline" className={categoryBadgeClass(article.category ?? "")}>
            {article.category}
          </Badge>
          <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
            {timeAgo(article.published_at ?? article.fetched_at)}
          </span>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-start gap-1 text-sm font-medium hover:underline leading-snug"
        >
          {article.title}
          <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
        </a>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex flex-col gap-2 py-3 border-b last:border-b-0">
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-muted rounded animate-pulse" />
        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
        <div className="h-5 w-12 bg-muted rounded animate-pulse ml-auto" />
      </div>
      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
    </div>
  );
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  useEffect(() => {
    getNews({ limit: 50 })
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter(
          (a) => (a.category ?? "").toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Finance News</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aggregated from Financial Post, Globe &amp; Mail, Reuters, Bloomberg
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border bg-card">
        {loading ? (
          <div className="px-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No articles found in this category.
          </p>
        ) : (
          <div className="px-4">
            {filtered.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
