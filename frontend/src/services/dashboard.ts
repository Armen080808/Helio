import api from "./api";

export interface DashboardStats {
  applications_total: number;
  applications_by_stage: Record<string, number>;
  contacts_total: number;
  upcoming_deadlines: number;
  interviews_this_week: number;
}

export async function getDashboard(): Promise<DashboardStats> {
  const res = await api.get("/api/dashboard/stats");
  return res.data;
}
