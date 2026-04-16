import api from "./api";

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  url: string;
  location?: string | null;
  job_type?: string | null;
  description?: string | null;
  posted_at?: string | null;
  source: string;
  is_finance_relevant?: boolean;
  fetched_at: string;
}

export async function getJobs(params?: { type?: string }): Promise<JobPosting[]> {
  const res = await api.get("/api/jobs", { params });
  return res.data;
}
