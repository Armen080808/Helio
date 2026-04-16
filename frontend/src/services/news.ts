import api from "./api";

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  summary?: string | null;
  published_at?: string | null;
  category?: string | null;
  fetched_at: string;
}

export async function getNews(params?: { category?: string; limit?: number }): Promise<NewsArticle[]> {
  const res = await api.get("/api/news", { params });
  return res.data;
}
