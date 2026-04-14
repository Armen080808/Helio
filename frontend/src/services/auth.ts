import axios from "axios";

const BASE_URL = "http://localhost:8000";

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
  const res = await axios.post(
    `${BASE_URL}/api/auth/login`,
    { email, password },
    { withCredentials: true }
  );
  return res.data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await axios.post(
    `${BASE_URL}/api/auth/register`,
    { name, email, password },
    { withCredentials: true }
  );
  return res.data;
}

export async function logoutRequest(): Promise<void> {
  await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
}

export async function getMeRequest(token: string): Promise<AuthUser> {
  const res = await axios.get(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
}
