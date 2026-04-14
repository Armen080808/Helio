import api from "./api";

export interface Booking {
  id: string;
  title: string;
  client_id: string | null;
  client_name: string | null;
  start_at: string;
  end_at: string;
  location: string | null;
  status: string;
}

export interface BookingInput {
  title: string;
  start_at: string;
  end_at: string;
  client_id?: string;
  location?: string;
  notes?: string;
}

export async function getBookings(): Promise<Booking[]> {
  const res = await api.get("/api/bookings/");
  return res.data;
}

export async function createBooking(data: BookingInput): Promise<Booking> {
  const res = await api.post("/api/bookings/", data);
  return res.data;
}

export async function deleteBooking(id: string): Promise<void> {
  await api.delete(`/api/bookings/${id}`);
}
