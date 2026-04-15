import { useEffect, useState } from "react";
import { getMarket, type MarketSnapshot } from "@/services/market";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}`;
}

function formatChangePct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function TickerCard({ snapshot }: { snapshot: MarketSnapshot }) {
  const isPositive = snapshot.change >= 0;
  const colorClass = isPositive ? "text-emerald-600" : "text-red-500";
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
              {snapshot.symbol}
            </p>
            <CardTitle className="text-sm font-medium mt-0.5">{snapshot.name}</CardTitle>
          </div>
          <Icon className={`h-4 w-4 mt-1 ${colorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{formatPrice(snapshot.price)}</p>
        <p className={`text-sm font-medium mt-1 ${colorClass}`}>
          {formatChange(snapshot.change)}&nbsp;&nbsp;{formatChangePct(snapshot.change_pct)}
        </p>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse mt-1" />
      </CardHeader>
      <CardContent>
        <div className="h-7 w-28 bg-muted rounded animate-pulse" />
        <div className="h-4 w-20 bg-muted rounded animate-pulse mt-2" />
      </CardContent>
    </Card>
  );
}

export default function Market() {
  const [snapshots, setSnapshots] = useState<MarketSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    getMarket()
      .then((data) => {
        setSnapshots(data);
        setLastUpdated(new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit" }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const canadian = snapshots.filter((s) => s.symbol.endsWith(".TO"));
  const us = snapshots.filter((s) => !s.symbol.endsWith(".TO"));

  const skeletonCount = 7;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Markets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live market data — updated weekdays at 4:30 PM ET
          </p>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <RefreshCw className="h-3 w-3" />
            Last updated: {lastUpdated}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-base font-semibold mb-3">Canadian Markets</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: skeletonCount }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-base font-semibold mb-3">Canadian Markets</h2>
            {canadian.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data available.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {canadian.map((s) => (
                  <TickerCard key={s.id} snapshot={s} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold mb-3">US Markets</h2>
            {us.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data available.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {us.map((s) => (
                  <TickerCard key={s.id} snapshot={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
