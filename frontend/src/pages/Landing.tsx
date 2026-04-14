import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Receipt, CalendarDays } from "lucide-react";

const features = [
  { icon: FileText, label: "Proposals", desc: "Send polished proposals that win clients" },
  { icon: Users, label: "Clients", desc: "Manage all your client relationships in one place" },
  { icon: Receipt, label: "Invoices", desc: "Get paid faster with professional invoices" },
  { icon: CalendarDays, label: "Schedule", desc: "Book calls and track upcoming meetings" },
];

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-5">
        <span className="text-xl font-bold tracking-tight">alyo</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button className="bg-white text-slate-900 hover:bg-slate-100" asChild>
            <Link to="/register">Get started free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          The freelancer OS.
        </h1>
        <p className="mt-5 max-w-lg text-xl text-slate-300">
          Proposals, contracts, invoices — all in one place.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-10" asChild>
            <Link to="/register">Get started free</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white px-10"
            asChild
          >
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-8 pb-24">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <Card key={label} className="border-white/10 bg-white/5 text-white backdrop-blur-sm">
              <CardContent className="flex flex-col items-start gap-3 p-6">
                <div className="rounded-md bg-white/10 p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="mt-1 text-sm text-slate-400">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-5 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} alyo. Built for modern freelancers.
      </footer>
    </div>
  );
}
