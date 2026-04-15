import api from "./api";

export interface MarketSnapshot {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
  snapshot_date: string;
}

export async function getMarket(): Promise<MarketSnapshot[]> {
  const res = await api.get("/api/market");
  return res.data;
}
