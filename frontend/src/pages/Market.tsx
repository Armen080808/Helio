import { useEffect, useState } from "react";
import { getMarket, type MarketSnapshot } from "@/services/market";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Symbol metadata ─────────────────────────────────────────────────────────

const INDEX_SYMBOLS = new Set(["^GSPTSE"]);
const BANK_SYMBOLS  = new Set(["TD.TO", "RY.TO", "BMO.TO", "BNS.TO", "CM.TO", "NA.TO"]);

function sectionFor(symbol: string): "index" | "bank" | "other" {
  if (INDEX_SYMBOLS.has(symbol)) return "index";
  if (BANK_SYMBOLS.has(symbol))  return "bank";
  return "other";
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtPrice(price: number, isIndex = false): string {
  if (isIndex) {
    return new Intl.NumberFormat("en-CA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function fmtChange(change: number, isIndex = false): string {
  const sign = change >= 0 ? "+" : "";
  if (isIndex) return `${sign}${change.toFixed(0)} pts`;
  return `${sign}${change.toFixed(2)}`;
}

function fmtChangePct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

function fmtMarketCap(cap: number | null | undefined): string {
  if (!cap) return "";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(1)}T`;
  if (cap >= 1e9)  return `$${(cap / 1e9).toFixed(1)}B`;
  if (cap >= 1e6)  return `$${(cap / 1e6).toFixed(0)}M`;
  return `$${cap.toLocaleString("en-CA")}`;
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function IndexCard({ snap }: { snap: MarketSnapshot }) {
  const up      = snap.change >= 0;
  const color   = up ? "text-emerald-600" : "text-red-500";
  const bg      = up ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-red-50 dark:bg-red-950/20";
  const Icon    = up ? TrendingUp : TrendingDown;

  return (
    <Card className={cn("border-2", up ? "border-emerald-200" : "border-red-200")}>
      <CardContent className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
              <BarChart2 className={cn("h-4 w-4", color)} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {snap.symbol}
            </span>
          </div>
          <Icon className={cn("h-5 w-5", color)} />
        </div>

        <p className="text-base font-semibold">{snap.name}</p>
        <p className={cn("text-3xl font-bold tabular-nums tracking-tight")}>
          {fmtPrice(snap.price, true)}
        </p>
        <div className={cn("flex items-center gap-2 text-sm font-semibold", color)}>
          <span>{fmtChange(snap.change, true)}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-xs", bg)}>
            {fmtChangePct(snap.change_pct)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function TickerCard({ snap }: { snap: MarketSnapshot }) {
  const up    = snap.change >= 0;
  const color = up ? "text-emerald-600" : "text-red-500";
  const bg    = up ? "bg-emerald-50 dark:bg-emerald-950/20" : "bg-red-50 dark:bg-red-950/20";
  const Icon  = up ? TrendingUp : TrendingDown;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
            {snap.symbol.replace(".TO", "")}
          </span>
          <Icon className={cn("h-4 w-4", color)} />
        </div>

        <p className="text-sm font-semibold leading-tight">{snap.name}</p>

        <p className="text-xl font-bold tabular-nums tracking-tight">
          {fmtPrice(snap.price)}
        </p>

        <div className={cn("flex items-center gap-1.5 text-xs font-medium", color)}>
          <span>{fmtChange(snap.change)}</span>
          <span className={cn("rounded-full px-1.5 py-0.5", bg)}>
            {fmtChangePct(snap.change_pct)}
          </span>
        </div>

        {snap.market_cap && (
          <p className="text-xs text-muted-foreground">
            Cap: {fmtMarketCap(snap.market_cap)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SkeletonIndexCard() {
  return (
    <div className="rounded-xl border-2 border-border bg-card animate-pulse h-40" />
  );
}

function SkeletonTickerCard() {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="h-3 w-14 bg-muted rounded animate-pulse" />
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-6 w-20 bg-muted rounded animate-pulse" />
        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Market() {
  const [snapshots, setSnapshots]     = useState<MarketSnapshot[]>([]);
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    getMarket()
      .then((data) => {
        setSnapshots(data);
        setLastUpdated(
          new Date().toLocaleString("en-CA", {
            month: "short", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const indices = snapshots.filter((s) => sectionFor(s.symbol) === "index");
  const banks   = snapshots.filter((s) => sectionFor(s.symbol) === "bank");
  const others  = snapshots.filter((s) => sectionFor(s.symbol) === "other");

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Canadian Markets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            TSX index, Big 6 banks &amp; top Canadian companies — updated weekdays at 4:30 PM ET
          </p>
        </div>
        {lastUpdated && (
          <span className="shrink-0 text-xs text-muted-foreground mt-1 hidden sm:inline">
            As of {lastUpdated}
          </span>
        )}
      </div>

      {/* ── TSX Composite Index ──────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Index
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkeletonIndexCard />
          </div>
        ) : indices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No index data available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {indices.map((s) => (
              <IndexCard key={s.id} snap={s} />
            ))}
          </div>
        )}
      </section>

      {/* ── Big 6 Canadian Banks ─────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Big 6 Banks
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonTickerCard key={i} />
            ))}
          </div>
        ) : banks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bank data available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {banks.map((s) => (
              <TickerCard key={s.id} snap={s} />
            ))}
          </div>
        )}
      </section>

      {/* ── Other Canadian Companies ─────────────────────────────── */}
      {(loading || others.length > 0) && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Other Canadian
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonTickerCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {others.map((s) => (
                <TickerCard key={s.id} snap={s} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Footer note */}
      {!loading && (
        <p className="text-xs text-muted-foreground">
          Market data sourced directly from Yahoo Finance. Prices reflect last trading session close.
          Not financial advice.
        </p>
      )}
    </div>
  );
}
