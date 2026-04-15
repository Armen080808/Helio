import api from "./api";

export interface RecruitingDeadline {
  id: number;
  firm_name: string;
  role: string;
  type: string;
  cycle: string;
  application_open?: string | null;
  application_deadline?: string | null;
  networking_season_start?: string | null;
  notes?: string | null;
  source_url?: string | null;
  is_verified: boolean;
}

export async function getDeadlines(): Promise<RecruitingDeadline[]> {
  const res = await api.get("/api/deadlines");
  return res.data;
}

export async function submitDeadline(data: Partial<RecruitingDeadline>): Promise<RecruitingDeadline> {
  const res = await api.post("/api/deadlines", data);
  return res.data;
}
