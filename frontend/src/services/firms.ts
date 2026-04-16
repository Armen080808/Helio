import api from "./api";

export interface Firm {
  id: string;
  name: string;
  type: string;
  description: string;
  headquarters?: string | null;
  website?: string | null;
  avg_gpa_requirement?: number | null;
  recruits_uoft?: boolean;
  notes?: string | null;
  is_community_added?: boolean;
}

export async function getFirms(params?: { type?: string }): Promise<Firm[]> {
  const res = await api.get("/api/firms", { params });
  return res.data;
}
