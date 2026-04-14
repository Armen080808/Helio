import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [proposals, contracts, invoices, bookings] = await Promise.all([
    db.proposal.count({ where: { userId, status: { in: ["DRAFT", "SENT", "VIEWED"] } } }),
    db.contract.count({ where: { userId, status: { not: "SIGNED" } } }),
    db.invoice.findMany({
      where: { userId, status: { in: ["SENT", "VIEWED", "PARTIAL", "OVERDUE"] } },
      select: { total: true, currency: true },
    }),
    db.booking.count({
      where: { userId, status: "CONFIRMED", startAt: { gte: new Date() } },
    }),
  ]);

  const outstandingAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

  const cards = [
    { label: "Active proposals", value: String(proposals) },
    { label: "Unsigned contracts", value: String(contracts) },
    {
      label: "Outstanding invoices",
      value: outstandingAmount > 0 ? `$${outstandingAmount.toLocaleString()}` : "$0",
    },
    { label: "Upcoming calls", value: String(bookings) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">
        Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-zinc-500">Here&apos;s what&apos;s happening with your business.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-zinc-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
