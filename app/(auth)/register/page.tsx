import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import Link from "next/link";

export default function RegisterPage() {
  async function register(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password || password.length < 8) return;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) return;

    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.create({ data: { name, email, passwordHash } });

    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-indigo-600">helio</span>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900">Create account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form action={register} className="flex flex-col gap-3">
            <input
              name="name"
              type="text"
              required
              placeholder="Full name"
              className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Password (min 8 chars)"
              className="rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
