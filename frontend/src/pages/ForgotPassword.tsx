import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelioLogo } from "@/components/HelioLogo";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email: email.trim().toLowerCase() });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <HelioLogo size={28} />
          <span className="font-bold text-base">Helio</span>
        </div>

        {sent ? (
          /* ── Success state ── */
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                If <span className="font-medium text-foreground">{email}</span> is registered,
                we've sent a 6-digit reset code. It expires in 15 minutes.
              </p>
            </div>
            <Link
              to="/reset-password"
              state={{ email }}
              className="block w-full"
            >
              <Button className="w-full">Enter reset code</Button>
            </Link>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          /* ── Request form ── */
          <div className="space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and we'll send you a reset code.
              </p>
            </div>

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
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending…" : "Send reset code"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
