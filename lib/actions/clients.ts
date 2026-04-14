"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getClients() {
  const user = await requireUser();
  return db.client.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createClient(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}) {
  const user = await requireUser();
  const client = await db.client.create({
    data: { ...data, userId: user.id },
  });
  revalidatePath("/clients");
  return client;
}

export async function updateClient(
  id: string,
  data: Partial<{ name: string; email: string; phone: string; company: string; notes: string }>
) {
  const user = await requireUser();
  const client = await db.client.updateMany({
    where: { id, userId: user.id },
    data,
  });
  revalidatePath("/clients");
  return client;
}

export async function deleteClient(id: string) {
  const user = await requireUser();
  await db.client.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/clients");
}
