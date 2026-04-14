import "server-only";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaSqlite } from "prisma-adapter-sqlite";
import path from "path";

const url =
  process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "prisma/dev.db")}`;

const adapter = new PrismaSqlite({ url });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
