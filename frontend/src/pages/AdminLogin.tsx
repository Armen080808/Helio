import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Ban, AlertTriangle } from "lucide-react";
import { HelioLogo } from "@/components/HelioLogo";
import { loginAdmin } from "@/services/admin";

const MAX_ATTEMPTS = 3;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Remaining attempts shown client-side (mirrors server state)
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  // True once the server says this IP is blocked (429)
  const [ipBlocked, setIpBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (ipBlocked) return;
    setError("");
    setLoading(true);

    const result = await loginAdmin(email, password);
    setLoading(false);

    if (result.success) {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin");
      return;
    }

    // 429 — IP is blocked by the server
    if (result.status === 429) {
      setIpBlocked(true);
      setAttemptsLeft(0);
      setBlockMessage(result.error ?? "Your IP has been blocked.");
      return;
    }

    // 401 — wrong credentials, server tells us how many attempts remain
    const msg = result.error ?? "Invalid credentials.";
    setError(msg);

    // Parse "X attempt(s) remaining" from the server message
    const match = msg.match(/(\d+) attempt/);
    if (match) {
      const left = parseInt(match[1], 10);
      setAttemptsLeft(left);
      // If server says 0 remaining it will block on the next request — pre-emptively block UI
      if (left === 0) {
        setIpBlocked(true);
        setBlockMessage("Your IP has been blocked after too many failed attempts.");
      }
    } else {
      // Fallback: decrement locally if we can't parse
      setAttemptsLeft((prev) => (prev === null ? MAX_ATTEMPTS - 1 : Math.max(0, prev - 1)));
    }
  }

  // ── Blocked state ────────────────────────────────────────────────────────────
  if (ipBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative w-full max-w-md text-center">
          <div className="inline-flex items-center gap-2.5 mb-8">
            <HelioLogo size={40} />
            <span className="text-2xl font-bold text-white tracking-tight">Helio</span>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <Ban className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Access Blocked</h2>
            <p className="text-sm text-red-300 leading-relaxed mb-4">
              {blockMessage}
            </p>
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400 text-left">
              <p className="font-semibold mb-1">Security Notice</p>
              <p>
                Your IP address has been temporarily blocked due to{" "}
                <span className="font-bold">{MAX_ATTEMPTS} consecutive failed login attempts</span>.
                The block will lift automatically after 1 hour. If this was a mistake,
                contact the system administrator.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Helio Admin Panel · IP Security Lock
          </p>
        </div>
      </div>
    );
  }

  // ── Normal login form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <HelioLogo size={40} />
            <span className="text-2xl font-bold text-white tracking-tight">Helio</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Shield className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-400 font-medium tracking-wide uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Sign in to Admin</h2>
          <p className="text-sm text-slate-400 mb-6">
            Restricted access — administrators only.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-slate-300 text-sm">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-slate-300 text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className={`rounded-lg border px-3 py-2.5 text-sm flex items-start gap-2 ${
                attemptsLeft !== null && attemptsLeft <= 1
                  ? "bg-red-500/15 border-red-500/30 text-red-300"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-300"
              }`}>
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Attempts warning bar */}
            {attemptsLeft !== null && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Attempts remaining</span>
                  <span className={`font-bold tabular-nums ${
                    attemptsLeft <= 1 ? "text-red-400" : "text-amber-400"
                  }`}>
                    {attemptsLeft} / {MAX_ATTEMPTS}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      attemptsLeft <= 1 ? "bg-red-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${(attemptsLeft / MAX_ATTEMPTS) * 100}%` }}
                  />
                </div>
                {attemptsLeft === 1 && (
                  <p className="text-xs text-red-400 font-medium">
                    ⚠ One attempt left — your IP will be blocked on the next failure.
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={`w-full mt-1 h-10 font-semibold ${
                attemptsLeft !== null && attemptsLeft <= 1
                  ? "border-red-500/30"
                  : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Verifying…
                </span>
              ) : (
                "Sign in to Admin"
              )}
            </Button>
          </form>
        </div>

        {/* Security note */}
        <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="h-3.5 w-3.5 shrink-0" />
            <span>
              IP will be blocked for <strong className="text-slate-400">1 hour</strong> after{" "}
              {MAX_ATTEMPTS} failed attempts. All login attempts are logged server-side.
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          Helio Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  );
}
