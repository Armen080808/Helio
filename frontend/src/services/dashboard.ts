import api from "./api";

export interface DashboardStats {
  active_proposals: number;
  unsigned_contracts: number;
  outstanding_amount: number;
  upcoming_calls: number;
}

export async function getDashboard(): Promise<DashboardStats> {
  const res = await api.get("/api/dashboard/");
  return res.data;
}
