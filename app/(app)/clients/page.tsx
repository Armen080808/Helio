import { getClients } from "@/lib/actions/clients";
import { EmptyState } from "@/app/ui/empty-state";
import { ClientsShell } from "./clients-shell";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsShell clients={clients} />;
}
