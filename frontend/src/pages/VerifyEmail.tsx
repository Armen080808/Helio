import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail } from "lucide-react";

export default function VerifyEmail() {
  const { state } = useLocation() as { state: { email?: string; name?: string } | null };
  const navigate = useNavigate();
  const email = state?.email ?? "";

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.length < 6) { setError("Enter the full 6-digit code"); return; }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/auth/verify-email", { email, code: value });
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail ?? "Invalid code. Try again.";
      setError(msg);
      setValue("");
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
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(val) => { setValue(val); setError(""); }}
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

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {resent && (
                <p className="text-sm text-emerald-600">New code sent!</p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Verifying..." : "Verify email"}
              </Button>

              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive it?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Resend code
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
