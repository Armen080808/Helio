import { getInvoices } from "@/lib/actions/invoices";
import { getClients } from "@/lib/actions/clients";
import { InvoicesShell } from "./invoices-shell";

export default async function InvoicesPage() {
  const [invoices, clients] = await Promise.all([getInvoices(), getClients()]);
  return <InvoicesShell invoices={invoices} clients={clients} />;
}
