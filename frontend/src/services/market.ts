import api from "./api";

export interface MarketSnapshot {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
  volume?: number | null;
  market_cap?: number | null;
  snapshot_date: string;
  fetched_at: string;
}

export async function getMarket(): Promise<MarketSnapshot[]> {
  const res = await api.get("/api/market");
  return res.data;
}

export async function refreshMarket(): Promise<void> {
  await api.post("/api/market/refresh");
}
