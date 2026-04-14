import api from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res.data;
}

export async function logoutRequest(): Promise<void> {
  await api.post("/api/auth/logout");
}

export async function getMeRequest(token: string): Promise<AuthUser> {
  const res = await api.get("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
