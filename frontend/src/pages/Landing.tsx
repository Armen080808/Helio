import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Users, Receipt, CalendarDays, Zap, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Proposals & Contracts",
    desc: "Send professional proposals and get contracts signed fast.",
  },
  {
    icon: Receipt,
    title: "Invoicing",
    desc: "Create and send invoices with automatic calculations.",
  },
  {
    icon: Users,
    title: "Client Management",
    desc: "Keep all your client info and history in one place.",
  },
  {
    icon: CalendarDays,
    title: "Scheduling",
    desc: "Book calls and manage your availability effortlessly.",
  },
  {
    icon: Zap,
    title: "Fast & Lightweight",
    desc: "Purpose-built for freelancers. No bloat, no fluff.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "JWT auth, encrypted storage, and email verification.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">alyo</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">
                Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-40 pb-24 text-center">
        <Badge variant="secondary" className="mb-6">
          Now in beta · Free to try
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          The freelancer OS.
          <br />
          <span className="text-muted-foreground">Built for how you work.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Proposals, contracts, invoices, clients, and scheduling — all in one clean, fast platform.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/register">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Clock className="h-3 w-3" /> Set up in under 2 minutes · No credit card required
        </p>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
          <p className="mt-3 text-muted-foreground">
            One platform to run your freelance business end to end.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="mt-3 text-muted-foreground">
            Join freelancers using alyo to run their business smarter.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link to="/register">
              Create free account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="font-medium text-foreground">alyo</span>
          </div>
          <span>© 2026 alyo. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
