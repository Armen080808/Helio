import { getBookings } from "@/lib/actions/bookings";
import { getClients } from "@/lib/actions/clients";
import { ScheduleShell } from "./schedule-shell";

export default async function SchedulePage() {
  const [bookings, clients] = await Promise.all([getBookings(), getClients()]);
  return <ScheduleShell bookings={bookings} clients={clients} />;
}
