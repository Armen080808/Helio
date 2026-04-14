"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type LineItem = { description: string; qty: number; unitPrice: number };

export async function getInvoices() {
  const user = await requireUser();
  return db.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInvoice(data: {
  clientId: string;
  contractId?: string;
  title: string;
  lineItems: LineItem[];
  tax?: number;
  currency?: string;
  dueDate?: Date;
}) {
  const user = await requireUser();

  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
  const tax = data.tax ?? 0;
  const total = subtotal + (subtotal * tax) / 100;

  // Generate invoice number
  const count = await db.invoice.count({ where: { userId: user.id } });
  const number = `INV-${String(count + 1).padStart(4, "0")}`;

  const invoice = await db.invoice.create({
    data: {
      userId: user.id,
      clientId: data.clientId,
      contractId: data.contractId,
      title: data.title,
      lineItems: JSON.stringify(data.lineItems),
      subtotal,
      tax,
      total,
      currency: data.currency ?? "USD",
      dueDate: data.dueDate,
      number,
      status: "DRAFT",
    },
  });
  revalidatePath("/invoices");
  return invoice;
}

export async function markInvoicePaid(id: string) {
  const user = await requireUser();
  await db.invoice.updateMany({
    where: { id, userId: user.id },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/invoices");
}

export async function deleteInvoice(id: string) {
  const user = await requireUser();
  await db.invoice.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/invoices");
}
