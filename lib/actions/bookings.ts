"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getBookings() {
  const user = await requireUser();
  return db.booking.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { startAt: "asc" },
  });
}

export async function createBooking(data: {
  title: string;
  startAt: Date;
  endAt: Date;
  clientId?: string;
  notes?: string;
  location?: string;
}) {
  const user = await requireUser();
  const booking = await db.booking.create({
    data: { ...data, userId: user.id, status: "CONFIRMED" },
  });
  revalidatePath("/schedule");
  return booking;
}

export async function cancelBooking(id: string) {
  const user = await requireUser();
  await db.booking.updateMany({
    where: { id, userId: user.id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/schedule");
}

export async function deleteBooking(id: string) {
  const user = await requireUser();
  await db.booking.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/schedule");
}
