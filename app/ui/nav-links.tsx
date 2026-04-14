"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/proposals", label: "Proposals", icon: "📄" },
  { href: "/contracts", label: "Contracts", icon: "✍️" },
  { href: "/invoices", label: "Invoices", icon: "💳" },
  { href: "/schedule", label: "Schedule", icon: "📅" },
  { href: "/clients", label: "Clients", icon: "👥" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 flex-1">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-indigo-50 text-indigo-600 font-medium"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
