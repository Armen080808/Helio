import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard, Kanban, Users, CalendarDays, BookOpen, Building2,
  GraduationCap, CalendarCheck, TrendingUp, Newspaper, Briefcase,
  MessageSquare, LogOut, PanelLeftClose, PanelLeftOpen, TrendingUp as Logo,
  Menu, X, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Recruiting",
    items: [
      { to: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
      { to: "/pipeline",   icon: Kanban,          label: "Pipeline" },
      { to: "/contacts",   icon: Users,           label: "Contacts" },
      { to: "/deadlines",  icon: CalendarDays,    label: "Deadlines" },
      { to: "/events",     icon: CalendarCheck,   label: "Events" },
    ],
  },
  {
    label: "Research",
    items: [
      { to: "/firms",      icon: Building2,       label: "Firms" },
      { to: "/questions",  icon: BookOpen,        label: "Interview Prep" },
      { to: "/alumni",     icon: Award,           label: "Alumni Outcomes" },
      { to: "/community",  icon: MessageSquare,   label: "Community" },
    ],
  },
  {
    label: "Markets",
    items: [
      { to: "/market",     icon: TrendingUp,      label: "Markets" },
      { to: "/news",       icon: Newspaper,       label: "News" },
      { to: "/jobs",       icon: Briefcase,       label: "Jobs" },
    ],
  },
  {
    label: "Tools",
    items: [
      { to: "/gpa",        icon: GraduationCap,   label: "GPA Calculator" },
    ],
  },
];

// Primary 4 items shown in mobile bottom bar
const BOTTOM_NAV = [
  { to: "/dashboard",  icon: LayoutDashboard, label: "Home" },
  { to: "/pipeline",   icon: Kanban,          label: "Pipeline" },
  { to: "/questions",  icon: BookOpen,        label: "Prep" },
  { to: "/news",       icon: Newspaper,       label: "News" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  async function handleLogout() {
    await logout();
    navigate("/login");
    setMenuOpen(false);
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-[100dvh] overflow-hidden bg-background">

        {/* ── Desktop sidebar ─────────────────────────────────────── */}
        <aside className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-300",
          collapsed ? "w-14" : "w-56"
        )}>
          {/* Brand + collapse */}
          <div className={cn(
            "flex h-14 items-center border-b",
            collapsed ? "justify-center px-3" : "justify-between px-4"
          )}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <Logo className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-base font-bold tracking-tight">Helio</span>
              </div>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"
              onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-2 pt-3">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                {!collapsed && (
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                )}
                <div className="flex flex-col gap-0.5">
                  {group.items.map(({ to, icon: Icon, label }) =>
                    collapsed ? (
                      <Tooltip key={to}>
                        <TooltipTrigger asChild>
                          <NavLink to={to} className={({ isActive }) => cn(
                            "mx-auto flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                            isActive ? "bg-accent text-accent-foreground font-medium"
                                     : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}>
                            <Icon className="h-4 w-4" />
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">{label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <NavLink key={to} to={to} className={({ isActive }) => cn(
                        "flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                        isActive ? "bg-accent text-accent-foreground font-medium"
                                 : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}>
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </NavLink>
                    )
                  )}
                </div>
              </div>
            ))}
          </nav>

          {/* User */}
          <div className="border-t p-2">
            <Separator className="mb-2" />
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="mx-auto flex h-9 w-9"
                    onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign out</TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium leading-none">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleLogout}>
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content ────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Mobile top bar */}
          <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Logo className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold tracking-tight">Helio</span>
            </div>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </header>

          {/* Page */}
          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            <Outlet />
          </main>

          {/* ── Mobile bottom nav ─────────────────────────────────── */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-card/95 backdrop-blur-sm lg:hidden">
            {BOTTOM_NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      isActive ? "bg-primary/10" : ""
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
            {/* More button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-medium text-muted-foreground transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                <Menu className="h-4 w-4" />
              </div>
              More
            </button>
          </nav>
        </div>

        {/* ── Mobile full-screen menu overlay ─────────────────────── */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

            {/* drawer */}
            <div className="absolute inset-y-0 right-0 flex w-72 flex-col bg-card shadow-xl">
              {/* header */}
              <div className="flex h-14 items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                    <Logo className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-base font-bold">Helio</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* nav */}
              <nav className="flex-1 overflow-y-auto p-3 space-y-4">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {group.items.map(({ to, icon: Icon, label }) => (
                        <NavLink key={to} to={to}
                          onClick={() => setMenuOpen(false)}
                          className={({ isActive }) => cn(
                            "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                            isActive ? "bg-accent text-accent-foreground font-medium"
                                     : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}>
                          <Icon className="h-4 w-4 shrink-0" />
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              {/* user + logout */}
              <div className="border-t p-3 space-y-2">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-muted/50">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden flex-1">
                    <span className="truncate text-sm font-medium">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full h-10 items-center gap-3 rounded-lg px-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
