import api from "./api";

export interface Contract {
  id: string;
  title: string;
  client_id: string;
  client_name: string;
  status: string;
  created_at: string;
  signed_at: string | null;
}

export interface ContractInput {
  client_id: string;
  title: string;
  body: string;
  proposal_id?: string;
}

export async function getContracts(): Promise<Contract[]> {
  const res = await api.get("/api/contracts/");
  return res.data;
}

export async function createContract(data: ContractInput): Promise<Contract> {
  const res = await api.post("/api/contracts/", data);
  return res.data;
}

export async function signContract(id: string): Promise<Contract> {
  const res = await api.put(`/api/contracts/${id}/sign`);
  return res.data;
}

export async function deleteContract(id: string): Promise<void> {
  await api.delete(`/api/contracts/${id}`);
}
