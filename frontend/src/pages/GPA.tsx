import { useEffect, useState } from "react";
import {
  getCourses,
  addCourse,
  deleteCourse,
  getGpaSummary,
  type Course,
  type GpaSummary,
} from "@/services/gpa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Trash2, GraduationCap } from "lucide-react";

const GRADE_MAP: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

const GPA_SCALE_ROWS = [
  { letter: "A+ / A", numeric: "4.0" },
  { letter: "A-", numeric: "3.7" },
  { letter: "B+", numeric: "3.3" },
  { letter: "B", numeric: "3.0" },
  { letter: "B-", numeric: "2.7" },
  { letter: "C+", numeric: "2.3" },
  { letter: "C", numeric: "2.0" },
  { letter: "C-", numeric: "1.7" },
  { letter: "D+", numeric: "1.3" },
  { letter: "D", numeric: "1.0" },
  { letter: "D-", numeric: "0.7" },
  { letter: "F", numeric: "0.0" },
];

const LETTER_GRADES = Object.keys(GRADE_MAP);
const CREDIT_WEIGHTS = ["0.5", "1.0"];

function cgpaColor(cgpa: number): string {
  if (cgpa >= 3.5) return "text-green-600";
  if (cgpa >= 3.0) return "text-yellow-600";
  return "text-red-600";
}

interface FormState {
  course_code: string;
  course_name: string;
  credit_weight: string;
  letter_grade: string;
  semester: string;
}

const EMPTY_FORM: FormState = {
  course_code: "",
  course_name: "",
  credit_weight: "0.5",
  letter_grade: "A",
  semester: "",
};

export default function GPA() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [summary, setSummary] = useState<GpaSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    try {
      const [c, s] = await Promise.all([getCourses(), getGpaSummary()]);
      setCourses(c);
      setSummary(s);
    } catch {
      setError("Failed to load GPA data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!form.course_code.trim()) {
      setFormError("Course code is required.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const numeric_grade = GRADE_MAP[form.letter_grade] ?? null;
      await addCourse({
        code: form.course_code.trim(),
        name: form.course_name.trim() || null,
        credit_weight: parseFloat(form.credit_weight),
        letter_grade: form.letter_grade || null,
        numeric_grade,
        semester: form.semester.trim() || null,
      });
      setForm(EMPTY_FORM);
      setDialogOpen(false);
      await load();
    } catch {
      setFormError("Failed to add course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteCourse(id);
      await load();
    } catch {
      // silently ignore — user can retry
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">GPA Calculator</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track your UofT CGPA — Bay Street GPA cutoffs start at 3.0+
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setForm(EMPTY_FORM); setFormError(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCourse} className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="course_code">Course Code <span className="text-destructive">*</span></Label>
                <Input
                  id="course_code"
                  placeholder="ECO101H1"
                  value={form.course_code}
                  onChange={(e) => setForm((f) => ({ ...f, course_code: e.target.value }))}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="course_name">Course Name</Label>
                <Input
                  id="course_name"
                  placeholder="Introduction to Economics"
                  value={form.course_name}
                  onChange={(e) => setForm((f) => ({ ...f, course_name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Credit Weight</Label>
                  <Select
                    value={form.credit_weight}
                    onValueChange={(v) => setForm((f) => ({ ...f, credit_weight: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CREDIT_WEIGHTS.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Letter Grade</Label>
                  <Select
                    value={form.letter_grade}
                    onValueChange={(v) => setForm((f) => ({ ...f, letter_grade: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LETTER_GRADES.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  placeholder="Fall 2025"
                  value={form.semester}
                  onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
                />
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setDialogOpen(false); setForm(EMPTY_FORM); setFormError(null); }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Adding…" : "Add Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg border bg-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">CGPA</CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={`text-4xl font-bold tabular-nums ${cgpaColor(summary?.cgpa ?? 0)}`}
              >
                {summary ? summary.cgpa.toFixed(2) : "—"}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">out of 4.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold tabular-nums">
                {summary ? summary.total_credits.toFixed(1) : "—"}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">credit hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-4xl font-bold tabular-nums">
                {summary ? summary.course_count : "—"}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">added</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GPA Scale reference */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          UofT 4.0 GPA Scale
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {GPA_SCALE_ROWS.map((row) => (
            <span key={row.letter} className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{row.letter}</span> = {row.numeric}
            </span>
          ))}
        </div>
      </div>

      {/* Courses table */}
      {!error && (
        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="flex flex-col gap-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
              <GraduationCap className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No courses yet</p>
              <p className="text-xs text-muted-foreground/70">
                Add your first course to start tracking your CGPA.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Code</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Credits</TableHead>
                  <TableHead className="font-semibold">Semester</TableHead>
                  <TableHead className="font-semibold">Grade</TableHead>
                  <TableHead className="font-semibold">GPA Points</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-mono font-medium text-sm">
                      {course.code}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.name ?? <span className="text-muted-foreground/40">—</span>}
                    </TableCell>
                    <TableCell className="tabular-nums">{course.credit_weight}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {course.semester ?? <span className="text-muted-foreground/40">—</span>}
                    </TableCell>
                    <TableCell>
                      {course.letter_grade ? (
                        <Badge variant="outline" className="font-mono">
                          {course.letter_grade}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums font-medium">
                      {course.numeric_grade != null
                        ? course.numeric_grade.toFixed(1)
                        : <span className="text-muted-foreground/40">—</span>}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete course"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {!loading && !error && (
        <p className="text-xs text-muted-foreground">
          {courses.length} course{courses.length !== 1 ? "s" : ""} tracked.{" "}
          CGPA is weighted by credit hours.
        </p>
      )}
    </div>
  );
}
