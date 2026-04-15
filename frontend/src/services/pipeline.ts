import api from "./api";

export type Stage = "Wishlist" | "Applied" | "OA" | "Phone Screen" | "Superday" | "Offer" | "Rejected";
export type AppType = "IBD" | "Markets" | "AM" | "Consulting" | "Other";

export interface Application {
  id: number;
  firm_name: string;
  role: string;
  type: AppType;
  stage: Stage;
  deadline?: string | null;
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

export async function updateApplication(id: number, data: Partial<ApplicationCreate>): Promise<Application> {
  const res = await api.patch(`/api/pipeline/${id}`, data);
  return res.data;
}

export async function deleteApplication(id: number): Promise<void> {
  await api.delete(`/api/pipeline/${id}`);
}
