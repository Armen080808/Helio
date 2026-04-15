import api from "./api";

export interface Firm {
  id: number;
  name: string;
  type: string;
  location?: string | null;
  website?: string | null;
  description?: string | null;
  gpa_cutoff?: number | null;
  insider_tip?: string | null;
  logo_url?: string | null;
}

export async function getFirms(params?: { type?: string }): Promise<Firm[]> {
  const res = await api.get("/api/firms", { params });
  return res.data;
}
