import api from "./api";

export interface Course {
  id: number;
  code: string;
  name?: string | null;
  credit_weight: number;
  letter_grade?: string | null;
  numeric_grade?: number | null;
  semester?: string | null;
}

export interface GpaSummary {
  cgpa: number;
  total_credits: number;
  course_count: number;
}

export async function getCourses(): Promise<Course[]> {
  const res = await api.get("/api/gpa/courses");
  return res.data;
}

export async function addCourse(data: Omit<Course, "id">): Promise<Course> {
  const res = await api.post("/api/gpa/courses", data);
  return res.data;
}

export async function deleteCourse(id: number): Promise<void> {
  await api.delete(`/api/gpa/courses/${id}`);
}

export async function getGpaSummary(): Promise<GpaSummary> {
  const res = await api.get("/api/gpa/summary");
  return res.data;
}
