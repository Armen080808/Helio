import api from "./api";

export interface InterviewReview {
  id: number;
  firm_name: string;
  role: string;
  type?: string | null;
  cycle?: string | null;
  outcome: string;
  difficulty: number;
  rounds?: number | null;
  questions_asked?: string | null;
  tips?: string | null;
  anonymous: boolean;
  created_at: string;
}

export interface OfferReport {
  id: number;
  firm_name: string;
  role: string;
  type?: string | null;
  cycle?: string | null;
  base_salary?: number | null;
  signing_bonus?: number | null;
  notes?: string | null;
  anonymous: boolean;
  created_at: string;
}

export async function getReviews(params?: { firm?: string }): Promise<InterviewReview[]> {
  const res = await api.get("/api/community/reviews", { params });
  return res.data;
}

export async function submitReview(data: Partial<InterviewReview>): Promise<InterviewReview> {
  const res = await api.post("/api/community/reviews", data);
  return res.data;
}

export async function getOffers(params?: { firm?: string }): Promise<OfferReport[]> {
  const res = await api.get("/api/community/offers", { params });
  return res.data;
}

export async function submitOffer(data: Partial<OfferReport>): Promise<OfferReport> {
  const res = await api.post("/api/community/offers", data);
  return res.data;
}
