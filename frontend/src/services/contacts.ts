import api from "./api";

export type Warmth = "Cold" | "Warm" | "Hot";

export interface Contact {
  id: number;
  name: string;
  title?: string | null;
  firm?: string | null;
  email?: string | null;
  linkedin?: string | null;
  warmth: Warmth;
  notes?: string | null;
  follow_up_date?: string | null;
  created_at: string;
}

export interface ContactCreate {
  name: string;
  title?: string | null;
  firm?: string | null;
  email?: string | null;
  linkedin?: string | null;
  warmth?: Warmth;
  notes?: string | null;
  follow_up_date?: string | null;
}

export async function getContacts(): Promise<Contact[]> {
  const res = await api.get("/api/contacts");
  return res.data;
}

export async function createContact(data: ContactCreate): Promise<Contact> {
  const res = await api.post("/api/contacts", data);
  return res.data;
}

export async function updateContact(id: number, data: Partial<ContactCreate>): Promise<Contact> {
  const res = await api.patch(`/api/contacts/${id}`, data);
  return res.data;
}

export async function deleteContact(id: number): Promise<void> {
  await api.delete(`/api/contacts/${id}`);
}
