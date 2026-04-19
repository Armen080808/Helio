import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { HelioLogo } from "@/components/HelioLogo";
import { cn } from "@/lib/utils";

const FEATURES = [
  "Pipeline tracker for every stage — Wishlist to Offer",
  "2,400+ curated interview questions with model answers",
  "180+ Bay Street firms with GPA cutoffs & recruiter contacts",
];

const QUOTE = {
  text: "Helio kept my recruiting season organised and my prep sharp. Landed my BB offer and I couldn't have done it without a system this clean.",
  author: "UofT Commerce '25 · Bulge Bracket IB",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Invalid email or password.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex">
        {/* subtle grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0,0%,100%) 1px,transparent 1px),linear-gradient(90deg,hsl(0,0%,100%) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Brand */}
        <div className="relative flex items-center gap-2.5">
          <HelioLogo size={36} />
          <span className="text-xl font-bold tracking-tight">Helio</span>
        </div>

        {/* Features */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <p className="text-sm leading-relaxed text-zinc-300">{f}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-12 bg-zinc-700" />

          {/* Quote */}
          <blockquote className="space-y-3">
            <p className="text-base font-medium leading-relaxed text-zinc-200">
              &ldquo;{QUOTE.text}&rdquo;
            </p>
            <footer className="text-sm text-zinc-500">— {QUOTE.author}</footer>
          </blockquote>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-zinc-600">© {new Date().getFullYear()} Helio</p>
      </div>

      {/* ── Right panel ────────────────────────────────────────────── */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <HelioLogo size={28} />
            <span className="font-bold">Helio</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Helio account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mail.utoronto.ca"
                className={cn(error && "border-destructive focus-visible:ring-destructive")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(error && "border-destructive focus-visible:ring-destructive")}
              />
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
