import api from "./api";

export type Warmth = "Cold" | "Warm" | "Hot";

export interface Contact {
  id: string;
  firm_id?: string | null;
  name: string;
  title?: string | null;
  firm_name?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  how_met?: string | null;
  date_met?: string | null;
  last_contact?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  warmth: Warmth;
  created_at: string;
}

export interface ContactCreate {
  name: string;
  title?: string | null;
  firm_name?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  how_met?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  warmth?: Warmth;
}

export async function getContacts(): Promise<Contact[]> {
  const res = await api.get("/api/contacts");
  return res.data;
}

export async function createContact(data: ContactCreate): Promise<Contact> {
  const res = await api.post("/api/contacts", data);
  return res.data;
}

export async function updateContact(id: string, data: Partial<ContactCreate>): Promise<Contact> {
  const res = await api.patch(`/api/contacts/${id}`, data);
  return res.data;
}

export async function deleteContact(id: string): Promise<void> {
  await api.delete(`/api/contacts/${id}`);
}

export async function seedDemoContacts(): Promise<Contact[]> {
  const res = await api.post("/api/contacts/demo");
  return res.data;
}
