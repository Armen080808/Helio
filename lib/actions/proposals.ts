"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getProposals() {
  const user = await requireUser();
  return db.proposal.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProposal(data: {
  clientId: string;
  title: string;
  body: string;
  amount: number;
  currency?: string;
  validUntil?: Date;
}) {
  const user = await requireUser();
  const proposal = await db.proposal.create({
    data: { ...data, userId: user.id, status: "DRAFT" },
  });
  revalidatePath("/proposals");
  return proposal;
}

export async function updateProposalStatus(
  id: string,
  status: "DRAFT" | "SENT" | "VIEWED" | "ACCEPTED" | "DECLINED" | "EXPIRED"
) {
  const user = await requireUser();

  const timestamps: Record<string, Date | null> = {};
  if (status === "SENT") timestamps.sentAt = new Date();
  if (status === "VIEWED") timestamps.viewedAt = new Date();
  if (status === "ACCEPTED") timestamps.acceptedAt = new Date();
  if (status === "DECLINED") timestamps.declinedAt = new Date();

  await db.proposal.updateMany({
    where: { id, userId: user.id },
    data: { status, ...timestamps },
  });
  revalidatePath("/proposals");
}

export async function deleteProposal(id: string) {
  const user = await requireUser();
  await db.proposal.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/proposals");
}
