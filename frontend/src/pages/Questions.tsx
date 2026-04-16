import { useEffect, useState } from "react";
import {
  getQuestions,
  upvoteQuestion,
  type InterviewQuestion,
} from "@/services/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ThumbsUp, Calculator, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Technical", "Behavioral", "Market", "Exercise"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;
type DifficultyFilter = (typeof DIFFICULTIES)[number];

function difficultyClass(difficulty: string): string {
  switch (difficulty) {
    case "Easy":   return "bg-green-100 text-green-800 border-green-200";
    case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Hard":   return "bg-red-100 text-red-800 border-red-200";
    default:       return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function categoryClass(category: string): string {
  switch (category) {
    case "Technical":  return "bg-blue-50 text-blue-700 border-blue-200";
    case "Behavioral": return "bg-purple-50 text-purple-700 border-purple-200";
    case "Market":     return "bg-amber-50 text-amber-700 border-amber-200";
    case "Exercise":   return "bg-violet-50 text-violet-700 border-violet-200";
    default:           return "";
  }
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

function QuestionCard({ question }: { question: InterviewQuestion }) {
  const [expanded, setExpanded] = useState(false);
  const [upvotes, setUpvotes] = useState(question.upvotes);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  const isExercise = question.category === "Exercise";

  async function handleUpvote(e: React.MouseEvent) {
    e.stopPropagation();
    if (upvoted || upvoting) return;
    setUpvoted(true);
    setUpvotes((prev) => prev + 1);
    setUpvoting(true);
    try {
      const updated = await upvoteQuestion(question.id);
      setUpvotes(updated.upvotes);
    } catch {
      setUpvoted(false);
      setUpvotes((prev) => prev - 1);
    } finally {
      setUpvoting(false);
    }
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-shadow hover:shadow-md",
        isExercise && "border-violet-200 dark:border-violet-800"
      )}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          {/* Left: badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs gap-1", categoryClass(question.category))}
            >
              {isExercise && <Calculator className="h-3 w-3" />}
              {question.category}
            </Badge>
            {question.subcategory && (
              <span className="text-xs text-muted-foreground">
                {question.subcategory}
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                difficultyClass(question.difficulty)
              )}
            >
              {question.difficulty}
            </span>
          </div>

          {/* Right: upvote + expand */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={handleUpvote}
              disabled={upvoted || upvoting}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors border",
                upvoted
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
              title="Upvote this question"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              {upvotes}
            </button>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Question text */}
        <p className={cn(
          "mt-2 text-sm font-medium leading-snug whitespace-pre-wrap",
          isExercise && "font-mono text-xs leading-relaxed"
        )}>
          {question.question}
        </p>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          {isExercise ? (
            /* Exercise: monospace worked solution */
            <div className="rounded-lg border border-violet-200 bg-slate-50 dark:bg-slate-900/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5" />
                Worked Solution
              </p>
              <pre className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap font-mono overflow-x-auto">
                {question.answer ?? "No solution provided."}
              </pre>
            </div>
          ) : (
            /* Regular: standard answer block */
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Model Answer
              </p>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {question.answer ?? "No answer provided."}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Questions() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyFilter>("All");

  useEffect(() => {
    setLoading(true);
    getQuestions()
      .then(setQuestions)
      .catch(() => setError("Failed to load questions. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = questions.filter((q) => {
    const categoryMatch = activeCategory === "All" || q.category === activeCategory;
    const difficultyMatch = activeDifficulty === "All" || q.difficulty === activeDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const exerciseCount = questions.filter((q) => q.category === "Exercise").length;

  // Count by category for filter pills
  const counts: Record<string, number> = { All: questions.length };
  for (const q of questions) {
    counts[q.category] = (counts[q.category] ?? 0) + 1;
  }

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Interview Prep</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {questions.length > 0 ? (
            <>
              {questions.length} questions &middot;{" "}
              <span className="text-violet-600 font-medium">{exerciseCount} worked exercises</span>
            </>
          ) : (
            "Community-sourced questions and worked exercises with model answers"
          )}
        </p>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count = counts[cat] ?? 0;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors border",
                  active
                    ? cat === "Exercise"
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                )}
              >
                {cat === "Exercise" && <Calculator className="h-3.5 w-3.5" />}
                {cat}
                {count > 0 && (
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                    active ? "bg-white/20 text-current" : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 shrink-0">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                activeDifficulty === diff
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              )}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Loading ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Empty ───────────────────────────────────────────────────── */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="text-sm font-medium text-muted-foreground">No questions found</p>
          <p className="text-xs text-muted-foreground/70">
            Try adjusting your filters or check back later.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => {
              setActiveCategory("All");
              setActiveDifficulty("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* ── Questions list ──────────────────────────────────────────── */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {filtered.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" || activeDifficulty !== "All" ? " (filtered)" : ""}.
          </p>
        </>
      )}
    </div>
  );
}
