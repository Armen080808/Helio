import api from "./api";

export type Stage = "Wishlist" | "Applied" | "OA" | "Phone Screen" | "Superday" | "Offer" | "Rejected";
export type AppType = "IBD" | "Markets" | "AM" | "Consulting" | "Other";

export interface Application {
  id: string;
  firm_id?: string | null;
  firm_name: string;
  role: string;
  type: string;
  stage: Stage;
  applied_date?: string | null;
  deadline?: string | null;
  next_step?: string | null;
  notes?: string | null;
  salary?: number | null;
  created_at: string;
  updated_at?: string | null;
}

export interface ApplicationCreate {
  firm_name: string;
  role: string;
  type: AppType;
  stage: Stage;
  deadline?: string | null;
  notes?: string | null;
  salary?: number | null;
}

export async function getApplications(): Promise<Application[]> {
  const res = await api.get("/api/pipeline");
  return res.data;
}

export async function createApplication(data: ApplicationCreate): Promise<Application> {
  const res = await api.post("/api/pipeline", data);
  return res.data;
}

export async function updateApplication(id: string, data: Partial<ApplicationCreate>): Promise<Application> {
  const res = await api.patch(`/api/pipeline/${id}`, data);
  return res.data;
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/api/pipeline/${id}`);
}
