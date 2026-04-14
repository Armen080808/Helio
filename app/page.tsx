import WaitlistForm from "@/app/ui/waitlist-form";

const FEATURES = [
  {
    icon: "📄",
    title: "Proposals",
    description:
      "AI drafts winning proposals in seconds. Customize, send, and get notified the moment a client opens it.",
  },
  {
    icon: "✍️",
    title: "Contracts",
    description:
      "Legally sound contracts generated from your proposal — signed digitally without leaving Helio.",
  },
  {
    icon: "💳",
    title: "Invoicing",
    description:
      "Automatic invoices tied to milestones. Accept cards, bank transfers, and crypto in one click.",
  },
  {
    icon: "📅",
    title: "Scheduling",
    description:
      "Share your availability link. Clients book calls that land straight into your calendar.",
  },
  {
    icon: "👥",
    title: "Client CRM",
    description:
      "Every conversation, project, and payment in one place. Never lose context on a client again.",
  },
  {
    icon: "🤖",
    title: "AI Copilot",
    description:
      "Ask Helio to follow up on an overdue invoice, draft a scope-change email, or summarize a client history.",
  },
];

const PAIN_POINTS = [
  "Proposal tool",
  "E-signature app",
  "Invoicing software",
  "Scheduling link",
  "CRM spreadsheet",
  "Email follow-ups",
  "Payment processor",
];

const STATS = [
  { value: "200M+", label: "freelancers worldwide" },
  { value: "7+", label: "tools replaced by Helio" },
  { value: "40%", label: "of time lost to admin" },
  { value: "36×", label: "LTV-to-CAC ratio" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight text-indigo-600">
            helio
          </span>
          <a
            href="#waitlist"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get early access
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Now accepting early access signups
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
          Run your freelance{" "}
          <span className="text-indigo-600">business on autopilot</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
          Stop juggling 7 different tools. Helio replaces them all — proposals,
          contracts, invoices, scheduling, and CRM — powered by AI that handles
          the admin so you can focus on the work.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <WaitlistForm />
          <p className="text-xs text-zinc-400">
            Free during beta · No credit card required
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-100 bg-zinc-50 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <span className="text-4xl font-bold text-indigo-600">{s.value}</span>
              <span className="mt-1 text-sm text-zinc-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            You didn&apos;t become a freelancer to manage software
          </h2>
          <p className="mt-4 max-w-xl text-zinc-500">
            The average freelancer cobbles together 7+ tools and loses nearly
            half their productive time to admin. Every tool is another login,
            another subscription, another thing to learn.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {PAIN_POINTS.map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {p}
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-indigo-100 bg-indigo-50 px-6 py-3 text-sm font-semibold text-indigo-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Helio replaces all of them
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything in one place
            </h2>
            <p className="mt-4 max-w-xl text-zinc-500">
              Built AI-native from day one — not AI bolted onto legacy software.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof placeholder */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
            Built in Armenia, used worldwide
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            The tools you use were built for Silicon Valley.<br />
            Helio is built for everyone.
          </h2>
          <p className="mt-4 text-indigo-200">
            HoneyBook and Dubsado are US-centric, have no real AI, and feel
            dated. We&apos;re building the platform they should have been.
          </p>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section id="waitlist" className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Be first in line
          </h2>
          <p className="mt-4 max-w-md text-zinc-500">
            We&apos;re onboarding early users now. Join the waitlist and get
            free access during beta plus a founding-member discount.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <WaitlistForm />
            <p className="text-xs text-zinc-400">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-zinc-400">
          <span className="font-semibold text-indigo-600">helio</span>
          <span>© {new Date().getFullYear()} Helio. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
