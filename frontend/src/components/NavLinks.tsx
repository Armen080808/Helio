import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FileText, FileCheck, Receipt, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/proposals", icon: FileText, label: "Proposals" },
  { to: "/contracts", icon: FileCheck, label: "Contracts" },
  { to: "/invoices", icon: Receipt, label: "Invoices" },
  { to: "/schedule", icon: CalendarDays, label: "Schedule" },
];

export default function NavLinks() {
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
