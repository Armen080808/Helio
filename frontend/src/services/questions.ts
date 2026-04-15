import api from "./api";

export type QuestionCategory = "Technical" | "Behavioral" | "Market" | "Canadian Markets" | "Firm-Specific";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface InterviewQuestion {
  id: number;
  category: QuestionCategory;
  difficulty: Difficulty;
  question: string;
  answer: string;
  tags: string[];
  upvotes: number;
  created_at: string;
}

export async function getQuestions(params?: { category?: string; difficulty?: string }): Promise<InterviewQuestion[]> {
  const res = await api.get("/api/questions", { params });
  return res.data;
}

export async function upvoteQuestion(id: number): Promise<InterviewQuestion> {
  const res = await api.post(`/api/questions/${id}/upvote`);
  return res.data;
}
