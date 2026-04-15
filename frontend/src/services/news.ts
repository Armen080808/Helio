import api from "./api";

export interface NewsArticle {
  id: number;
  title: string;
  source: string;
  url: string;
  summary?: string | null;
  category: string;
  published_at: string;
  fetched_at: string;
}

export async function getNews(params?: { category?: string; limit?: number }): Promise<NewsArticle[]> {
  const res = await api.get("/api/news", { params });
  return res.data;
}
