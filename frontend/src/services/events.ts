import api from "./api";

export interface RecruitingEvent {
  id: number;
  title: string;
  firm?: string | null;
  type: string;
  event_date: string;
  location?: string | null;
  virtual: boolean;
  registration_url?: string | null;
  notes?: string | null;
}

export async function getEvents(): Promise<RecruitingEvent[]> {
  const res = await api.get("/api/events");
  return res.data;
}

export async function createEvent(data: Partial<RecruitingEvent>): Promise<RecruitingEvent> {
  const res = await api.post("/api/events", data);
  return res.data;
}
