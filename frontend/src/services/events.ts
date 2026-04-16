import api from "./api";

export interface RecruitingEvent {
  id: string;
  firm_id?: string | null;
  firm_name: string;
  event_type: string;
  title: string;
  date: string;
  location?: string | null;
  description?: string | null;
  rsvp_status?: string | null;
  notes?: string | null;
  is_public: boolean;
  created_at: string;
}

export interface EventCreate {
  firm_name: string;
  event_type: string;
  title: string;
  date: string;
  location?: string | null;
  description?: string | null;
  notes?: string | null;
  is_public?: boolean;
}

export async function getEvents(): Promise<RecruitingEvent[]> {
  const res = await api.get("/api/events");
  return res.data;
}

export async function createEvent(data: EventCreate): Promise<RecruitingEvent> {
  const res = await api.post("/api/events", data);
  return res.data;
}
