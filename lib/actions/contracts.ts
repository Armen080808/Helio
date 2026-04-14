"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getContracts() {
  const user = await requireUser();
  return db.contract.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createContract(data: {
  clientId: string;
  title: string;
  body: string;
  proposalId?: string;
}) {
  const user = await requireUser();
  const contract = await db.contract.create({
    data: { ...data, userId: user.id, status: "DRAFT" },
  });
  revalidatePath("/contracts");
  return contract;
}

export async function signContract(id: string, party: "user" | "client") {
  const user = await requireUser();
  const data =
    party === "user"
      ? { signedAt: new Date() }
      : { clientSignedAt: new Date() };

  const contract = await db.contract.findFirst({
    where: { id, userId: user.id },
  });
  if (!contract) return;

  const bothSigned =
    (party === "user" && contract.clientSignedAt) ||
    (party === "client" && contract.signedAt);

  await db.contract.updateMany({
    where: { id, userId: user.id },
    data: { ...data, status: bothSigned ? "SIGNED" : "PARTIALLY_SIGNED" },
  });
  revalidatePath("/contracts");
}

export async function deleteContract(id: string) {
  const user = await requireUser();
  await db.contract.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/contracts");
}
