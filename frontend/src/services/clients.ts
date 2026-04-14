import api from "./api";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
}

export interface ClientInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export async function getClients(): Promise<Client[]> {
  const res = await api.get("/api/clients/");
  return res.data;
}

export async function createClient(data: ClientInput): Promise<Client> {
  const res = await api.post("/api/clients/", data);
  return res.data;
}

export async function updateClient(id: string, data: ClientInput): Promise<Client> {
  const res = await api.put(`/api/clients/${id}`, data);
  return res.data;
}

export async function deleteClient(id: string): Promise<void> {
  await api.delete(`/api/clients/${id}`);
}
