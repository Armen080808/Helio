import api from "./api";

export interface Proposal {
  id: string;
  title: string;
  client_id: string;
  client_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface ProposalInput {
  client_id: string;
  title: string;
  body: string;
  amount: number;
  currency?: string;
  valid_until?: string;
}

export async function getProposals(): Promise<Proposal[]> {
  const res = await api.get("/api/proposals/");
  return res.data;
}

export async function createProposal(data: ProposalInput): Promise<Proposal> {
  const res = await api.post("/api/proposals/", data);
  return res.data;
}

export async function updateProposalStatus(id: string, status: string): Promise<Proposal> {
  const res = await api.put(`/api/proposals/${id}/status`, { status });
  return res.data;
}

export async function deleteProposal(id: string): Promise<void> {
  await api.delete(`/api/proposals/${id}`);
}
