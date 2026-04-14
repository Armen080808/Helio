"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/actions/clients";

export function AddClientForm({ onDone }: { onDone: () => void }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await createClient({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        phone: fd.get("phone") as string || undefined,
        company: fd.get("company") as string || undefined,
        notes: fd.get("notes") as string || undefined,
      });
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="name" required placeholder="Full name" className="input" />
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="phone" placeholder="Phone (optional)" className="input" />
        <input name="company" placeholder="Company (optional)" className="input" />
      </div>
      <textarea name="notes" placeholder="Notes (optional)" rows={2} className="input resize-none" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="btn-ghost">Cancel</button>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Adding…" : "Add client"}
        </button>
      </div>
    </form>
  );
}
