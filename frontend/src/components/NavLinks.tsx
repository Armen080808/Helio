import { NavLink } from "react-router-dom";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/clients", label: "Clients", icon: "👥" },
  { href: "/proposals", label: "Proposals", icon: "📄" },
  { href: "/contracts", label: "Contracts", icon: "📝" },
  { href: "/invoices", label: "Invoices", icon: "💳" },
  { href: "/schedule", label: "Schedule", icon: "📅" },
];

export default function NavLinks() {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`
          }
        >
          <span className="text-base">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
