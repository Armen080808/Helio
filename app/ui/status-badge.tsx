const COLORS: Record<string, string> = {
  DRAFT:            "bg-zinc-100 text-zinc-600",
  SENT:             "bg-blue-100 text-blue-700",
  VIEWED:           "bg-purple-100 text-purple-700",
  ACCEPTED:         "bg-green-100 text-green-700",
  DECLINED:         "bg-red-100 text-red-700",
  EXPIRED:          "bg-orange-100 text-orange-700",
  PARTIALLY_SIGNED: "bg-yellow-100 text-yellow-700",
  SIGNED:           "bg-green-100 text-green-700",
  VOIDED:           "bg-red-100 text-red-700",
  PAID:             "bg-green-100 text-green-700",
  OVERDUE:          "bg-red-100 text-red-700",
  PARTIAL:          "bg-yellow-100 text-yellow-700",
  VOID:             "bg-zinc-100 text-zinc-400",
  CONFIRMED:        "bg-green-100 text-green-700",
  PENDING:          "bg-yellow-100 text-yellow-700",
  CANCELLED:        "bg-red-100 text-red-700",
  COMPLETED:        "bg-blue-100 text-blue-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[status] ?? "bg-zinc-100 text-zinc-600"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
