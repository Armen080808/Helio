import { useEffect, useState } from "react";
import {
  getQuestions,
  upvoteQuestion,
  type InterviewQuestion,
} from "@/services/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";

const CATEGORIES = ["All", "Technical", "Behavioral", "Market", "Canadian Markets", "Firm-Specific"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;
type DifficultyFilter = (typeof DIFFICULTIES)[number];

function difficultyClass(difficulty: string): string {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 border-green-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Hard":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function QuestionCard({ question }: { question: InterviewQuestion }) {
  const [expanded, setExpanded] = useState(false);
  const [upvotes, setUpvotes] = useState(question.upvotes);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

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
      // Revert optimistic update on failure
      setUpvoted(false);
      setUpvotes((prev) => prev - 1);
    } finally {
      setUpvoting(false);
    }
  }

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => setExpanded((prev) => !prev)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {question.category}
            </Badge>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${difficultyClass(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={handleUpvote}
              disabled={upvoted || upvoting}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors border ${
                upvoted
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              }`}
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
        <p className="mt-2 text-sm font-medium leading-snug">{question.question}</p>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Model Answer
            </p>
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {question.answer ?? "No answer provided."}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Interview Prep</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Community-sourced questions with model answers
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex gap-2 shrink-0">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${
                activeDifficulty === diff
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
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

      {/* Questions list */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {filtered.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} question{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" || activeDifficulty !== "All" ? " (filtered)" : ""}.
          </p>
        </>
      )}
    </div>
  );
}
