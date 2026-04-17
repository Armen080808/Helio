import api from "./api";

export interface ConnectPayload {
  alumni_name: string;
  alumni_role: string;
  alumni_company: string;
  message: string;
}

export async function sendConnectRequest(payload: ConnectPayload): Promise<void> {
  await api.post("/api/alumni/connect", payload);
}
