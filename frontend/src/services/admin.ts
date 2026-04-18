import axios from "axios";

const BASE = (import.meta.env.VITE_API_URL as string) || "";
const ADMIN_KEY = "helio-admin-2026";

// Unauthenticated instance — used only for the login endpoint
const openApi = axios.create({ baseURL: BASE });

// Authenticated instance — requires x-admin-key header
const api = axios.create({
  baseURL: BASE,
  headers: { "x-admin-key": ADMIN_KEY },
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResult {
  /** true on success */
  success?: boolean;
  /** error message from the server */
  error?: string;
  /** HTTP status code (401 = wrong creds, 429 = IP blocked) */
  status?: number;
}

export async function loginAdmin(email: string, password: string): Promise<LoginResult> {
  try {
    await openApi.post("/api/admin/auth/login", { email, password });
    return { success: true };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      return {
        error: err.response.data?.detail ?? "Login failed.",
        status: err.response.status,
      };
    }
    return { error: "Network error — could not reach the server.", status: 0 };
  }
}

export interface AdminStats {
  total_users: number;
  verified_users: number;
  new_users_week: number;
  new_users_month: number;
  total_applications: number;
  new_apps_week: number;
  total_jobs: number;
  total_events: number;
  public_events: number;
  total_news: number;
  total_contacts: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  applications: number;
  contacts: number;
  created_at: string | null;
}

export interface AdminApplication {
  id: string;
  firm_name: string;
  role: string;
  type: string;
  stage: string;
  applied_date: string | null;
  created_at: string | null;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  location: string | null;
  job_type: string | null;
  source: string;
  url: string;
  posted_at: string | null;
}

export interface AdminEvent {
  id: string;
  title: string;
  firm_name: string | null;
  event_type: string;
  date: string | null;
  location: string | null;
}

export const getAdminStats = (): Promise<AdminStats> =>
  api.get("/api/admin/stats").then((r) => r.data);

export const getAdminRegistrations = (): Promise<{ date: string; users: number }[]> =>
  api.get("/api/admin/registrations").then((r) => r.data);

export const getAdminUsers = (): Promise<AdminUser[]> =>
  api.get("/api/admin/users").then((r) => r.data);

export const getAdminApplications = (): Promise<{
  recent: AdminApplication[];
  by_stage: { stage: string; count: number }[];
  by_type: { type: string; count: number }[];
  top_firms: { firm: string; count: number }[];
}> => api.get("/api/admin/applications").then((r) => r.data);

export const getAdminJobs = (): Promise<AdminJob[]> =>
  api.get("/api/admin/jobs").then((r) => r.data);

export const getAdminEvents = (): Promise<AdminEvent[]> =>
  api.get("/api/admin/events").then((r) => r.data);
