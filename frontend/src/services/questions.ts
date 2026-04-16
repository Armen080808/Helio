import api from "./api";

export interface InterviewQuestion {
  id: string;
  category: string;
  subcategory?: string | null;
  question: string;
  answer?: string | null;
  difficulty: string;
  firm_specific?: string | null;
  source?: string | null;
  upvotes: number;
  created_at: string;
}

export async function getQuestions(params?: { category?: string; difficulty?: string }): Promise<InterviewQuestion[]> {
  const res = await api.get("/api/questions", { params });
  return res.data;
}

export async function upvoteQuestion(id: string): Promise<InterviewQuestion> {
  const res = await api.post(`/api/questions/${id}/upvote`);
  return res.data;
}
