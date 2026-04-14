import api from "./api";

export interface Invoice {
  id: string;
  number: string;
  client_id: string;
  client_name: string;
  title: string;
  total: number;
  status: string;
  due_date: string | null;
  created_at: string;
}

export interface LineItem {
  description: string;
  qty: number;
  unit_price: number;
}

export interface InvoiceInput {
  client_id: string;
  title: string;
  line_items: LineItem[];
  tax?: number;
  currency?: string;
  due_date?: string;
}

export async function getInvoices(): Promise<Invoice[]> {
  const res = await api.get("/api/invoices/");
  return res.data;
}

export async function createInvoice(data: InvoiceInput): Promise<Invoice> {
  const res = await api.post("/api/invoices/", data);
  return res.data;
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  const res = await api.put(`/api/invoices/${id}/status`, { status });
  return res.data;
}

export async function deleteInvoice(id: string): Promise<void> {
  await api.delete(`/api/invoices/${id}`);
}
