import { getContracts } from "@/lib/actions/contracts";
import { getClients } from "@/lib/actions/clients";
import { getProposals } from "@/lib/actions/proposals";
import { ContractsShell } from "./contracts-shell";

export default async function ContractsPage() {
  const [contracts, clients, proposals] = await Promise.all([
    getContracts(),
    getClients(),
    getProposals(),
  ]);
  return <ContractsShell contracts={contracts} clients={clients} proposals={proposals} />;
}
