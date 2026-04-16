import api from "./api";

export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  grade?: string | null;
  grade_point?: number | null;
  credits: number;
  notes?: string | null;
  created_at: string;
}

export interface GpaSummary {
  gpa?: number | null;
  credits: number;
  courses: number;
  semester_gpas: Record<string, number>;
}

export async function getCourses(): Promise<Course[]> {
  const res = await api.get("/api/gpa/courses");
  return res.data;
}

export async function addCourse(data: Omit<Course, "id" | "created_at" | "grade_point">): Promise<Course> {
  const res = await api.post("/api/gpa/courses", data);
  return res.data;
}

export async function deleteCourse(id: string): Promise<void> {
  await api.delete(`/api/gpa/courses/${id}`);
}

export async function getGpaSummary(): Promise<GpaSummary> {
  const res = await api.get("/api/gpa/summary");
  return res.data;
}
