"use server";

import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.json");

async function readWaitlist(): Promise<string[]> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeWaitlist(emails: string[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(emails, null, 2));
}

export async function joinWaitlist(
  email: string
): Promise<{ ok: boolean; message: string }> {
  if (!email || !email.includes("@")) {
    return { ok: false, message: "Please enter a valid email." };
  }

  const emails = await readWaitlist();

  if (emails.includes(email.toLowerCase())) {
    return { ok: true, message: "You're already on the list!" };
  }

  emails.push(email.toLowerCase());
  await writeWaitlist(emails);

  console.log(`[Helio waitlist] New signup: ${email} (total: ${emails.length})`);

  return { ok: true, message: "You're on the list!" };
}
