import { getProposals } from "@/lib/actions/proposals";
import { getClients } from "@/lib/actions/clients";
import { ProposalsShell } from "./proposals-shell";

export default async function ProposalsPage() {
  const [proposals, clients] = await Promise.all([getProposals(), getClients()]);
  return <ProposalsShell proposals={proposals} clients={clients} />;
}
