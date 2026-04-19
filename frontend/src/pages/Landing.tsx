import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Kanban,
  Users,
  CalendarDays,
  BookOpen,
  TrendingUp,
  GraduationCap,
  Newspaper,
  Briefcase,
  Building2,
  MessageSquare,
} from "lucide-react";
import { HelioLogo } from "@/components/HelioLogo";

const features = [
  {
    icon: Kanban,
    title: "Application Pipeline",
    desc: "Track every application from wishlist to offer. Kanban-style board built for Bay Street recruiting.",
  },
  {
    icon: Users,
    title: "Networking CRM",
    desc: "Log contacts, track warmth, and set follow-up reminders so no connection goes cold.",
  },
  {
    icon: CalendarDays,
    title: "Recruiting Calendar",
    desc: "Never miss a deadline. Bay Street recruiting timelines — TD, RBC, Goldman, McKinsey and more.",
  },
  {
    icon: BookOpen,
    title: "Interview Prep Bank",
    desc: "Community-sourced technical, behavioral, and market questions with model answers.",
  },
  {
    icon: TrendingUp,
    title: "Live Market Data",
    desc: "TSX Composite, Big 6 Canadian banks, Brookfield, Shopify, and Suncor — updated daily.",
  },
  {
    icon: GraduationCap,
    title: "GPA Calculator",
    desc: "UofT 4.0 scale CGPA tracker. Know exactly where you stand against Bay Street cutoffs.",
  },
  {
    icon: Newspaper,
    title: "Finance News Feed",
    desc: "Aggregated from Financial Post, Globe & Mail, Reuters, and Bloomberg. One feed, no tabs.",
  },
  {
    icon: Building2,
    title: "Firm Directory",
    desc: "27 top employers with GPA requirements, insider tips, and direct application links.",
  },
  {
    icon: MessageSquare,
    title: "Community Insights",
    desc: "Anonymous interview reviews and offer reports from UofT students who've been through it.",
  },
];

const stats = [
  { value: "27", label: "Top firms profiled" },
  { value: "16", label: "Bay Street deadlines" },
  { value: "21+", label: "Interview questions" },
  { value: "Free", label: "Always" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <HelioLogo size={28} />
            <span className="text-base font-bold tracking-tight">Helio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <Badge variant="outline" className="mb-6">
          Built for Canadian students
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          The recruiting platform{" "}
          <span className="text-primary">finance students</span> actually
          need
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          One dashboard to track applications, network contacts, recruiting
          deadlines, interview prep, live markets, and community insights.
          Everything CLNx forgot to build.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Start for free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y border-x sm:grid-cols-4 sm:divide-y-0">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-6 py-8">
              <span className="text-3xl font-bold">{value}</span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything in one place
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built specifically for the Bay Street recruiting cycle
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to land your offer?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Free to use. No credit card. Just sign up and start tracking.
          </p>
          <Link to="/register">
            <Button size="lg" className="mt-6 gap-2">
              Create your account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Briefcase className="h-3 w-3" />
          © 2026 Helio · Built for UofT St. George finance students
        </div>
      </footer>
    </div>
  );
}
