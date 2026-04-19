import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { HelioLogo } from "@/components/HelioLogo";
import { CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const { state } = useLocation() as { state: { email?: string } | null };
  const navigate = useNavigate();

  const [email, setEmail] = useState(state?.email ?? "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (code.length < 6) { setError("Enter the full 6-digit code"); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords don't match"); return; }

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", {
        email: email.trim().toLowerCase(),
        code,
        new_password: newPassword,
      });
      setDone(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? "Invalid or expired code.";
      setError(msg);
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Password updated</h1>
            <p className="text-sm text-muted-foreground">
              Your password has been reset. You can now sign in with your new password.
            </p>
          </div>
          <Button className="w-full" onClick={() => navigate("/login", { replace: true })}>
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <HelioLogo size={28} />
          <span className="font-bold text-base">Helio</span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your email and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (editable in case they came here directly) */}
          {!state?.email && (
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mail.utoronto.ca"
              />
            </div>
          )}

          {/* OTP code */}
          <div className="space-y-2">
            <Label>Reset code</Label>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => { setCode(val); setError(""); }}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Updating…" : "Set new password"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t get a code?{" "}
          <Link to="/forgot-password" className="font-medium text-foreground underline-offset-4 hover:underline">
            Resend
          </Link>
          {" · "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
