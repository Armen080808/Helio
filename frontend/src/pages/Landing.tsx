import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-700 px-4 text-white">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-4xl font-extrabold tracking-tight">helio</span>
        <span className="mt-1 rounded-full bg-indigo-400/30 px-2.5 py-0.5 text-xs font-medium text-indigo-200">
          beta
        </span>
      </div>

      {/* Headline */}
      <h1 className="max-w-xl text-center text-4xl font-bold leading-tight sm:text-5xl">
        AI-native platform for freelancers
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-indigo-200">
        Proposals, contracts, invoices, and scheduling — all in one place.
        Close deals faster and get paid on time.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/register"
          className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 active:scale-95"
        >
          Get started free
        </Link>
        <Link
          to="/login"
          className="rounded-xl border border-indigo-400/50 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          Log in
        </Link>
      </div>

      {/* Feature tiles */}
      <div className="mt-20 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: "📄", label: "Proposals" },
          { icon: "📝", label: "Contracts" },
          { icon: "💳", label: "Invoices" },
          { icon: "📅", label: "Schedule" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 px-6 py-5 backdrop-blur-sm"
          >
            <span className="text-3xl">{f.icon}</span>
            <span className="text-sm font-medium text-indigo-100">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-16 text-xs text-indigo-300/70">
        &copy; {new Date().getFullYear()} Helio. Built for modern freelancers.
      </p>
    </div>
  );
}
