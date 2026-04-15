import api from "./api";

export interface JobPosting {
  id: number;
  title: string;
  company: string;
  location?: string | null;
  url: string;
  type?: string | null;
  source: string;
  posted_at?: string | null;
  fetched_at: string;
}

export async function getJobs(params?: { type?: string }): Promise<JobPosting[]> {
  const res = await api.get("/api/jobs", { params });
  return res.data;
}
