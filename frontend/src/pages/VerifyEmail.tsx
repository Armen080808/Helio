import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
  const { state } = useLocation() as { state: { email?: string; name?: string } | null };
  const navigate = useNavigate();
  const email = state?.email ?? "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
    inputs.current[0]?.focus();
  }, [email, navigate]);

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setError("Enter the full 6-digit code"); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/verify-email", { email, code });
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? "Invalid code. Try again.";
      setError(msg);
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      await api.post("/api/auth/resend-verification");
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch {
      setError("Failed to resend. Try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-10 max-w-md w-full text-center">
        <div className="text-4xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Check your email</h1>
        <p className="text-zinc-500 text-sm mb-8">
          We sent a 6-digit code to <span className="font-medium text-zinc-700">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none
                           border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                           transition text-zinc-900"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {resent && <p className="text-green-600 text-sm mb-4">✓ New code sent!</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full mb-4">
            {loading ? "Verifying…" : "Verify Email"}
          </button>
        </form>

        <p className="text-zinc-400 text-sm">
          Didn't receive it?{" "}
          <button onClick={handleResend} className="text-indigo-600 hover:underline font-medium">
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}
