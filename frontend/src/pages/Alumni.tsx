import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import {
  GraduationCap, TrendingUp, DollarSign, Users, Search,
  Clock, MapPin, ChevronDown, ChevronUp, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Program = "bcom" | "econ" | "mba";

interface SubSector { name: string; value: number }
interface SectorDatum { name: string; value: number; color: string; sub?: SubSector[] }
interface FirmDatum   { firm: string; pct: number; category: string }

interface AlumniProfile {
  name: string; program: string; year: number;
  role: string; company: string; location: string;
  sector: string; bio: string; initials: string; avatarColor: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const PROGRAMS: { key: Program; label: string; short: string; desc: string }[] = [
  {
    key: "bcom", short: "BCom",
    label: "Rotman Commerce",
    desc: "BBA / Finance, Accounting & Economics specializations — 4-year undergraduate program",
  },
  {
    key: "econ", short: "Econ",
    label: "Economics (BA/MA)",
    desc: "Arts & Science Economics — undergraduate majors & MA placements",
  },
  {
    key: "mba", short: "MBA",
    label: "Rotman MBA",
    desc: "Full-time 2-year MBA — finance, consulting & general management tracks",
  },
];

const STATS: Record<Program, {
  employmentRate: number; salary: string; timeToOffer: string;
  classSize: number; topSector: string; year: string;
}> = {
  bcom: { employmentRate: 97, salary: "$68,000", timeToOffer: "2.1 mo", classSize: 520, topSector: "Financial Services", year: "2023" },
  econ: { employmentRate: 93, salary: "$62,000", timeToOffer: "3.2 mo", classSize: 890, topSector: "Financial Services", year: "2023" },
  mba:  { employmentRate: 96, salary: "$120,000", timeToOffer: "1.4 mo", classSize: 310, topSector: "Consulting", year: "2023" },
};

const SECTORS: Record<Program, SectorDatum[]> = {
  bcom: [
    {
      name: "Financial Services", value: 46, color: "#3b82f6",
      sub: [
        { name: "Investment Banking & Capital Markets", value: 14 },
        { name: "Asset Management & Equity Research",  value: 9  },
        { name: "Retail & Commercial Banking",         value: 11 },
        { name: "Private Equity & Venture Capital",    value: 5  },
        { name: "Insurance & Financial Planning",      value: 7  },
      ],
    },
    { name: "Consulting",           value: 19, color: "#8b5cf6" },
    { name: "Technology & Corp.",   value: 16, color: "#06b6d4" },
    { name: "Accounting & Audit",   value: 11, color: "#10b981" },
    { name: "Government & NPO",     value:  5, color: "#6b7280" },
    { name: "Other",                value:  3, color: "#94a3b8" },
  ],
  econ: [
    { name: "Financial Services",    value: 32, color: "#3b82f6" },
    { name: "Graduate / Prof. School", value: 28, color: "#f59e0b" },
    { name: "Government & Policy",   value: 14, color: "#6b7280" },
    { name: "Consulting",            value: 12, color: "#8b5cf6" },
    { name: "Technology",            value:  9, color: "#06b6d4" },
    { name: "Other",                 value:  5, color: "#94a3b8" },
  ],
  mba: [
    {
      name: "Financial Services", value: 38, color: "#3b82f6",
      sub: [
        { name: "Investment Banking",  value: 12 },
        { name: "Private Equity",      value: 8  },
        { name: "Asset Management",    value: 10 },
        { name: "Corporate Banking",   value: 8  },
      ],
    },
    {
      name: "Consulting", value: 32, color: "#8b5cf6",
      sub: [
        { name: "McKinsey, BCG & Bain (MBB)", value: 14 },
        { name: "Big 4 Strategy",             value: 9  },
        { name: "Boutique Strategy",          value: 9  },
      ],
    },
    { name: "Technology",          value: 16, color: "#06b6d4" },
    { name: "Corporate Management", value: 10, color: "#10b981" },
    { name: "Other",               value:  4, color: "#94a3b8" },
  ],
};

const FIRMS: Record<Program, FirmDatum[]> = {
  bcom: [
    { firm: "Deloitte",              pct: 9.2, category: "Accounting"  },
    { firm: "PwC",                   pct: 7.8, category: "Accounting"  },
    { firm: "KPMG",                  pct: 6.1, category: "Accounting"  },
    { firm: "EY",                    pct: 5.3, category: "Accounting"  },
    { firm: "TD Bank",               pct: 5.2, category: "Banking"     },
    { firm: "RBC Capital Markets",   pct: 4.7, category: "Banking"     },
    { firm: "BMO Capital Markets",   pct: 3.8, category: "Banking"     },
    { firm: "McKinsey & Company",    pct: 2.9, category: "Consulting"  },
    { firm: "CIBC",                  pct: 2.8, category: "Banking"     },
    { firm: "Scotiabank",            pct: 2.6, category: "Banking"     },
    { firm: "Boston Consulting Group", pct: 2.4, category: "Consulting"},
    { firm: "CPP Investments",       pct: 1.9, category: "Asset Mgmt" },
  ],
  econ: [
    { firm: "Bank of Canada",          pct: 8.4, category: "Government" },
    { firm: "Dept. of Finance Canada", pct: 6.2, category: "Government" },
    { firm: "TD Economics",            pct: 5.1, category: "Banking"    },
    { firm: "Deloitte",                pct: 4.8, category: "Consulting" },
    { firm: "RBC",                     pct: 4.3, category: "Banking"    },
    { firm: "McKinsey & Company",      pct: 3.7, category: "Consulting" },
    { firm: "KPMG",                    pct: 3.4, category: "Accounting" },
    { firm: "OMERS",                   pct: 3.1, category: "Asset Mgmt"},
    { firm: "Ontario Ministry of Finance", pct: 2.8, category: "Government" },
    { firm: "Brookfield Asset Mgmt",   pct: 2.4, category: "Asset Mgmt"},
  ],
  mba: [
    { firm: "McKinsey & Company",    pct: 8.5, category: "Consulting"  },
    { firm: "Boston Consulting Group", pct: 6.2, category: "Consulting"},
    { firm: "RBC Capital Markets",   pct: 5.8, category: "Banking"     },
    { firm: "Deloitte",              pct: 5.4, category: "Consulting"  },
    { firm: "Bain & Company",        pct: 4.9, category: "Consulting"  },
    { firm: "CPP Investments",       pct: 4.3, category: "Asset Mgmt" },
    { firm: "TD Securities",         pct: 4.1, category: "Banking"     },
    { firm: "OMERS",                 pct: 3.7, category: "Asset Mgmt" },
    { firm: "Amazon",                pct: 3.4, category: "Technology"  },
    { firm: "Ontario Teachers' PP",  pct: 2.5, category: "Asset Mgmt" },
  ],
};

const COMMUNITY: AlumniProfile[] = [
  {
    name: "Sarah Chen",      program: "BCom",      year: 2019,
    role: "VP, Investment Banking", company: "RBC Capital Markets",
    location: "Toronto, ON",        sector: "Banking",
    bio: "Leads M&A advisory for Canadian energy companies. Former IBD summer analyst at RBC in Year 3.",
    initials: "SC", avatarColor: "bg-blue-500",
  },
  {
    name: "James Park",      program: "Economics", year: 2020,
    role: "Associate",              company: "McKinsey & Company",
    location: "Toronto, ON",        sector: "Consulting",
    bio: "Financial services strategy practice. Completed MA Economics at UofT before joining McKinsey.",
    initials: "JP", avatarColor: "bg-purple-500",
  },
  {
    name: "Priya Sharma",    program: "BCom",      year: 2022,
    role: "Investment Analyst",     company: "CPP Investments",
    location: "Toronto, ON",        sector: "Asset Mgmt",
    bio: "Credit & private debt team. Rotman Finance specialization with a minor in Statistics.",
    initials: "PS", avatarColor: "bg-emerald-500",
  },
  {
    name: "Michael Huang",   program: "MBA",       year: 2021,
    role: "Vice President",         company: "Goldman Sachs",
    location: "Toronto, ON",        sector: "Banking",
    bio: "Technology M&A coverage. Transitioned from software engineering prior to Rotman MBA.",
    initials: "MH", avatarColor: "bg-amber-500",
  },
  {
    name: "Emily Watson",    program: "MBA",       year: 2020,
    role: "Director, Corporate Strategy", company: "Shopify",
    location: "Ottawa, ON",         sector: "Technology",
    bio: "Leads strategic growth initiatives for Shopify's merchant financial services division.",
    initials: "EW", avatarColor: "bg-rose-500",
  },
  {
    name: "David Kim",       program: "Economics", year: 2018,
    role: "Portfolio Manager",      company: "Ontario Teachers' PP",
    location: "Toronto, ON",        sector: "Asset Mgmt",
    bio: "Global macro & fixed income. Promoted from research analyst to PM within 3 years.",
    initials: "DK", avatarColor: "bg-cyan-500",
  },
  {
    name: "Aisha Okonkwo",   program: "BCom",      year: 2021,
    role: "Associate, IBD",         company: "BMO Capital Markets",
    location: "New York, NY",       sector: "Banking",
    bio: "Consumer & retail coverage out of NY. CFA Level II candidate. Joined BMO straight from campus.",
    initials: "AO", avatarColor: "bg-indigo-500",
  },
  {
    name: "Ryan Lee",        program: "BCom",      year: 2020,
    role: "Senior Analyst",         company: "OMERS",
    location: "Toronto, ON",        sector: "Asset Mgmt",
    bio: "Infrastructure equity team. Previously in CIBC investment banking; moved to OMERS after 2 years.",
    initials: "RL", avatarColor: "bg-teal-500",
  },
  {
    name: "Natalie Zhou",    program: "Economics", year: 2019,
    role: "Senior Economist",       company: "Bank of Canada",
    location: "Ottawa, ON",         sector: "Government",
    bio: "Researches monetary transmission mechanisms. Part-time PhD candidate at Queen's University.",
    initials: "NZ", avatarColor: "bg-violet-500",
  },
  {
    name: "Thomas Osei",     program: "MBA",       year: 2022,
    role: "Associate",              company: "Bain & Company",
    location: "Toronto, ON",        sector: "Consulting",
    bio: "Financial services & PE practice. Prior career in commercial banking at TD Bank.",
    initials: "TO", avatarColor: "bg-orange-500",
  },
  {
    name: "Jessica Tan",     program: "BCom",      year: 2023,
    role: "Analyst, Fixed Income",  company: "TD Securities",
    location: "Toronto, ON",        sector: "Banking",
    bio: "Rates & credit structuring. Interned at TD in Year 3 and converted to full-time offer.",
    initials: "JT", avatarColor: "bg-pink-500",
  },
  {
    name: "Alex Marchetti",  program: "Economics", year: 2021,
    role: "Senior Analyst",         company: "Brookfield Asset Mgmt",
    location: "Toronto, ON",        sector: "Asset Mgmt",
    bio: "Real assets valuation & deal underwriting. Joined Brookfield directly from UofT Honours Econ.",
    initials: "AM", avatarColor: "bg-lime-600",
  },
];

// ─── Category styling ─────────────────────────────────────────────────────────

const CAT_STYLE: Record<string, { bar: string; badge: string }> = {
  Accounting:  { bar: "#10b981", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
  Banking:     { bar: "#3b82f6", badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"             },
  Consulting:  { bar: "#8b5cf6", badge: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"     },
  "Asset Mgmt":{ bar: "#f59e0b", badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"         },
  Government:  { bar: "#6b7280", badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"            },
  Technology:  { bar: "#06b6d4", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400"             },
};

const SECTOR_BADGE: Record<string, string> = {
  Banking:     "bg-blue-100 text-blue-700",
  Consulting:  "bg-purple-100 text-purple-700",
  "Asset Mgmt":"bg-amber-100 text-amber-700",
  Technology:  "bg-cyan-100 text-cyan-700",
  Government:  "bg-slate-100 text-slate-600",
  Accounting:  "bg-emerald-100 text-emerald-700",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, highlight,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; highlight?: boolean;
}) {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", highlight && "border-primary/30 bg-primary/5")}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className={cn("mt-1.5 text-2xl font-bold tabular-nums tracking-tight",
              highlight ? "text-primary" : "")}>{value}</p>
            {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            highlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom pie tooltip
function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-xl">
      <p className="font-semibold">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value}% of graduates</p>
    </div>
  );
}

// Horizontal bar row for firms
function FirmBar({ firm, pct, category, maxPct, animate }: FirmDatum & { maxPct: number; animate: boolean }) {
  const style = CAT_STYLE[category] ?? CAT_STYLE["Banking"];
  return (
    <div className="flex items-center gap-3 group">
      <span className="w-44 shrink-0 text-right text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
        {firm}
      </span>
      <div className="relative flex-1 h-5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: animate ? `${(pct / maxPct) * 100}%` : "0%",
            backgroundColor: style.bar,
            opacity: 0.85,
          }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold tabular-nums leading-none text-foreground/70">
          {pct}%
        </span>
      </div>
      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", style.badge)}>
        {category}
      </span>
    </div>
  );
}

// Sector legend row
function SectorLegendRow({ sector, expanded, onToggle }: {
  sector: SectorDatum; expanded: boolean; onToggle: () => void;
}) {
  const hasSubsectors = (sector.sub?.length ?? 0) > 0;
  return (
    <div>
      <button
        onClick={hasSubsectors ? onToggle : undefined}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors",
          hasSubsectors ? "cursor-pointer hover:bg-muted/60" : "cursor-default"
        )}
      >
        <span
          className="h-3 w-3 shrink-0 rounded-sm"
          style={{ backgroundColor: sector.color }}
        />
        <span className="flex-1 text-left font-medium">{sector.name}</span>
        <span className="tabular-nums font-bold text-foreground">{sector.value}%</span>
        {hasSubsectors && (
          expanded
            ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {hasSubsectors && expanded && (
        <div className="ml-6 mt-1 mb-1.5 space-y-1 border-l-2 pl-3" style={{ borderColor: sector.color + "60" }}>
          {sector.sub!.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs text-muted-foreground py-0.5">
              <span>{s.name}</span>
              <span className="tabular-nums font-semibold text-foreground ml-4">{s.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Alumni profile card for spotlight
function SpotlightCard({ profile }: { profile: AlumniProfile }) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg group">
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarFallback className={cn("text-sm font-bold text-white", profile.avatarColor)}>
              {profile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">{profile.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{profile.role}</p>
            <p className="text-xs font-medium text-foreground/80 mt-0.5">{profile.company}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{profile.bio}</p>
        <div className="flex items-center justify-between gap-2 pt-1 border-t">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", SECTOR_BADGE[profile.sector] ?? "bg-muted text-muted-foreground")}>
              {profile.sector}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {profile.program} '{String(profile.year).slice(2)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {profile.location}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Alumni community card
function CommunityCard({ profile }: { profile: AlumniProfile }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4 flex gap-3">
        <Avatar className="h-10 w-10 shrink-0 mt-0.5">
          <AvatarFallback className={cn("text-xs font-bold text-white", profile.avatarColor)}>
            {profile.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold leading-tight">{profile.name}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                {profile.role} · {profile.company}
              </p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs px-2.5">
              Connect
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", SECTOR_BADGE[profile.sector] ?? "bg-muted text-muted-foreground")}>
              {profile.sector}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {profile.program} '{String(profile.year).slice(2)}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="h-2.5 w-2.5" />{profile.location}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Rotman-specific placement data ──────────────────────────────────────────

const ROTMAN_BCom_TOP_FIRMS = [
  { firm: "Deloitte",                division: "Audit & Advisory",          pct: 9.2,  year: 2023 },
  { firm: "PwC",                     division: "Assurance & Deals",         pct: 7.8,  year: 2023 },
  { firm: "KPMG",                    division: "Audit & Advisory",          pct: 6.1,  year: 2023 },
  { firm: "EY",                      division: "Assurance & Advisory",      pct: 5.3,  year: 2023 },
  { firm: "TD Bank / TD Securities", division: "IBD & Corporate Banking",   pct: 5.2,  year: 2023 },
  { firm: "RBC Capital Markets",     division: "IBD, ECM & DCM",            pct: 4.7,  year: 2023 },
  { firm: "BMO Capital Markets",     division: "IBD & Equity Research",     pct: 3.8,  year: 2023 },
  { firm: "McKinsey & Company",      division: "Strategy & Operations",     pct: 2.9,  year: 2023 },
  { firm: "CIBC Capital Markets",    division: "IBD & Treasury",            pct: 2.8,  year: 2023 },
  { firm: "Scotiabank GBM",          division: "Global Banking & Markets",  pct: 2.6,  year: 2023 },
  { firm: "Boston Consulting Group", division: "Strategy Consulting",       pct: 2.4,  year: 2023 },
  { firm: "CPP Investments",         division: "Credit & Private Assets",   pct: 1.9,  year: 2023 },
  { firm: "National Bank FM",        division: "Capital Markets",           pct: 1.7,  year: 2023 },
  { firm: "Bain & Company",          division: "Strategy Consulting",       pct: 1.6,  year: 2023 },
  { firm: "Goldman Sachs",           division: "IBD & Securities",          pct: 1.4,  year: 2023 },
];

const ROTMAN_MBA_TOP_FIRMS = [
  { firm: "McKinsey & Company",      division: "Financial Services Practice", pct: 8.5, year: 2023 },
  { firm: "Boston Consulting Group", division: "Private Equity & FS",         pct: 6.2, year: 2023 },
  { firm: "RBC Capital Markets",     division: "IBD & Debt Capital Markets",  pct: 5.8, year: 2023 },
  { firm: "Deloitte",                division: "Strategy & Transactions",     pct: 5.4, year: 2023 },
  { firm: "Bain & Company",          division: "FS & PE Practice",            pct: 4.9, year: 2023 },
  { firm: "CPP Investments",         division: "Infrastructure & Credit",     pct: 4.3, year: 2023 },
  { firm: "TD Securities",           division: "Corporate & Investment Bank", pct: 4.1, year: 2023 },
  { firm: "OMERS",                   division: "Infrastructure & PE",         pct: 3.7, year: 2023 },
  { firm: "Amazon",                  division: "Finance & Global Expansion",  pct: 3.4, year: 2023 },
  { firm: "Ontario Teachers' PP",    division: "Equities & Infrastructure",   pct: 2.5, year: 2023 },
  { firm: "Morgan Stanley",          division: "IBD Toronto Office",          pct: 2.3, year: 2023 },
  { firm: "EY-Parthenon",            division: "Strategy & Transactions",     pct: 2.1, year: 2023 },
];

const ROTMAN_CAREER_PATHS = [
  {
    track: "Investment Banking",
    color: "#3b82f6",
    icon: "🏦",
    steps: [
      { level: "Year 3 Summer", role: "IBD Summer Analyst", firms: "RBC, BMO, TD, CIBC, Scotiabank" },
      { level: "Year 0–1",      role: "Full-time IBD Analyst", firms: "Big 5 + Goldman / Morgan Stanley Toronto" },
      { level: "Year 2–4",      role: "Associate", firms: "After 2–3 yrs analyst or post-MBA" },
      { level: "Year 5–8",      role: "VP → Director", firms: "Promote-or-move-up track" },
    ],
    bcomPct: 14, mbaPct: 12,
    note: "Most BCom IBD roles come via Big 5 bank summer programs. US banks (GS, MS) recruit ~5% of IBD-bound students.",
  },
  {
    track: "Asset Management / Pensions",
    color: "#f59e0b",
    icon: "📈",
    steps: [
      { level: "Internship",  role: "Investment Analyst Intern", firms: "CPP, OMERS, Teachers', HOOPP" },
      { level: "Year 0–2",    role: "Investment Analyst",        firms: "CPP, OMERS, AIMCo, BCI, Teachers'" },
      { level: "Year 3–6",    role: "Senior Analyst / Manager",  firms: "Internal promotion common" },
      { level: "Year 7+",     role: "Director / VP / PM",        firms: "CFA Charter typically required" },
    ],
    bcomPct: 9, mbaPct: 10,
    note: "Canadian pension funds are world-class allocators. Competition is intense — GPA, CFA progress, and prior internships matter.",
  },
  {
    track: "Management Consulting",
    color: "#8b5cf6",
    icon: "🧠",
    steps: [
      { level: "Year 3 Summer / MBA Summer", role: "Summer Associate / Intern", firms: "McKinsey, BCG, Bain, Deloitte, PwC" },
      { level: "Year 0–2",   role: "Analyst (BCom) / Associate (MBA)", firms: "MBB + Big 4 Strategy" },
      { level: "Year 3–5",   role: "Senior Associate / Engagement Manager", firms: "~50% stay; 50% exit to PE / Corp." },
      { level: "Year 6–8",   role: "Manager / Principal / Partner Track", firms: "Long-haul consulting" },
    ],
    bcomPct: 19, mbaPct: 32,
    note: "MBA is the most direct path to MBB. BCom grads enter as analysts; many leverage 2–3 years consulting to pivot to PE or corp strategy.",
  },
  {
    track: "Private Equity & VC",
    color: "#ec4899",
    icon: "💼",
    steps: [
      { level: "IBD or Consulting",   role: "2-year analyst stint", firms: "Standard entry prerequisite" },
      { level: "Year 2–4",  role: "PE Associate", firms: "Onex, Brookfield, CPPIB, Caisse, AIMCo" },
      { level: "MBA (optional)", role: "Rotman MBA → re-entry", firms: "Some do MBA → associate at larger fund" },
      { level: "Year 5+",   role: "Senior Associate / VP",  firms: "Mid-market Canadian PE funds" },
    ],
    bcomPct: 5, mbaPct: 8,
    note: "Direct PE recruiting from campus is rare. Most Rotman Commerce grads spend 2 yrs in IBD first. MBA is often the 'second on-ramp'.",
  },
];

const ROTMAN_SALARY_BANDS = [
  { role: "IBD Analyst (Big 5)",        salary: "$80,000–$100,000",  bonus: "$20,000–$50,000",  total: "$100K–$150K" },
  { role: "IBD Analyst (Bulge Bracket)",salary: "$100,000–$120,000", bonus: "$50,000–$100,000", total: "$150K–$220K" },
  { role: "Big 4 Audit / Advisory",     salary: "$60,000–$75,000",   bonus: "$5,000–$10,000",   total: "$65K–$85K"  },
  { role: "MBB Consulting (BCom)",      salary: "$85,000–$105,000",  bonus: "$15,000–$25,000",  total: "$100K–$130K"},
  { role: "MBB Consulting (MBA)",       salary: "$140,000–$175,000", bonus: "$30,000–$50,000",  total: "$170K–$225K"},
  { role: "Asset Mgmt Analyst",         salary: "$70,000–$90,000",   bonus: "$10,000–$30,000",  total: "$80K–$120K" },
  { role: "Pension Fund Analyst",       salary: "$75,000–$95,000",   bonus: "$15,000–$35,000",  total: "$90K–$130K" },
  { role: "Corp. Finance / Treasury",   salary: "$62,000–$80,000",   bonus: "$5,000–$15,000",   total: "$67K–$95K"  },
];

function RotmanSection() {
  const [tab, setTab] = useState<"bcom" | "mba">("bcom");
  const firms = tab === "bcom" ? ROTMAN_BCom_TOP_FIRMS : ROTMAN_MBA_TOP_FIRMS;
  const maxPct = Math.max(...firms.map((f) => f.pct));
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, [tab]);

  return (
    <section className="space-y-6">
      <Separator />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold">Rotman Alumni — Where Are They Now?</h2>
        </div>
        <p className="text-xs text-muted-foreground ml-9">
          Detailed placement data for Rotman Commerce (BCom) and Rotman MBA graduates,
          including firm-level breakdowns, career paths, and salary bands — Class of 2023.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 rounded-xl border bg-muted/40 p-1 w-fit">
        {(["bcom", "mba"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-6 py-2 text-sm font-medium transition-all",
              tab === t ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "bcom" ? "Rotman Commerce (BCom)" : "Rotman MBA"}
          </button>
        ))}
      </div>

      {/* Employer table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {tab === "bcom" ? "Top 15" : "Top 12"} Hiring Firms — {tab === "bcom" ? "BCom 2023" : "MBA 2023"}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Firm · division · % of employed {tab === "bcom" ? "BCom" : "MBA"} graduates
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-6">#</th>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Firm</th>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Division / Function</th>
                <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-24">% of Grads</th>
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-40 hidden md:table-cell pl-4">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {firms.map(({ firm, division, pct }, i) => (
                <tr key={firm} className="group hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 pr-3 text-xs font-mono text-muted-foreground">{i + 1}</td>
                  <td className="py-2.5 pr-4">
                    <span className="font-semibold text-sm">{firm}</span>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground hidden sm:table-cell">{division}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-sm">{pct}%</td>
                  <td className="py-2.5 pl-4 hidden md:table-cell">
                    <div className="h-2 rounded-full bg-muted overflow-hidden w-32">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out bg-blue-500"
                        style={{ width: animate ? `${(pct / maxPct) * 100}%` : "0%" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Career paths */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          Common Career Tracks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROTMAN_CAREER_PATHS.map((track) => (
            <Card key={track.track} className="overflow-hidden">
              <div className="h-1.5 w-full" style={{ backgroundColor: track.color }} />
              <CardContent className="p-4 space-y-3">
                {/* Track header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{track.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{track.track}</p>
                      <p className="text-[11px] text-muted-foreground">
                        BCom: {track.bcomPct}% of grads · MBA: {track.mbaPct}% of grads
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold">BCom {track.bcomPct}%</span>
                    <span className="rounded-full bg-purple-100 text-purple-700 px-2 py-0.5 text-[10px] font-bold">MBA {track.mbaPct}%</span>
                  </div>
                </div>

                {/* Timeline steps */}
                <div className="relative pl-4 space-y-0">
                  <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />
                  {track.steps.map((step, i) => (
                    <div key={i} className="relative pb-3 last:pb-0">
                      <div
                        className="absolute -left-2.5 top-1.5 h-2 w-2 rounded-full border-2 border-background"
                        style={{ backgroundColor: track.color }}
                      />
                      <div className="pl-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{step.level}</p>
                        <p className="text-xs font-semibold leading-tight mt-0.5">{step.role}</p>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{step.firms}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <div className="rounded-lg bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground leading-relaxed">
                  {track.note}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Salary bands */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Compensation Bands — Toronto Market 2023–2024</CardTitle>
          <p className="text-xs text-muted-foreground">
            Base salary + typical first-year bonus by role type. CAD. Ranges reflect 25th–75th percentile.
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base Salary</th>
                <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Typical Bonus</th>
                <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Comp</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ROTMAN_SALARY_BANDS.map(({ role, salary, bonus, total }) => (
                <tr key={role} className="hover:bg-muted/40 transition-colors group">
                  <td className="py-2.5 pr-4 font-medium text-sm">{role}</td>
                  <td className="py-2.5 text-right tabular-nums text-muted-foreground text-sm">{salary}</td>
                  <td className="py-2.5 text-right tabular-nums text-muted-foreground text-sm hidden sm:table-cell">{bonus}</td>
                  <td className="py-2.5 text-right tabular-nums font-bold text-sm text-foreground">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[11px] text-muted-foreground">
            * US-listed firms (Goldman Sachs, Morgan Stanley) pay in USD; CAD equivalents vary with exchange rate.
            Figures are approximate and based on reported outcomes and publicly available data.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Alumni() {
  const [program, setProgram] = useState<Program>("bcom");
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set(["Financial Services"]));
  const [communitySearch, setCommunitySearch] = useState("");
  const [communityFilter, setCommunityFilter] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);

  // Animate bars when program changes
  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, [program]);

  const stats   = STATS[program];
  const sectors = SECTORS[program];
  const firms   = FIRMS[program];
  const maxPct  = Math.max(...firms.map((f) => f.pct));

  const toggleSector = (name: string) => {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filteredCommunity = useMemo(() => {
    const q = communitySearch.toLowerCase();
    return COMMUNITY.filter((p) => {
      const matchesSearch = !q || [p.name, p.role, p.company, p.sector].some((f) => f.toLowerCase().includes(q));
      const matchesFilter = !communityFilter || p.sector === communityFilter;
      return matchesSearch && matchesFilter;
    });
  }, [communitySearch, communityFilter]);

  const sectors_in_community = Array.from(new Set(COMMUNITY.map((c) => c.sector))).sort();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 max-w-6xl mx-auto w-full">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Alumni Outcomes</h1>
        </div>
      </div>

      {/* ── Program tabs ─────────────────────────────────────────── */}
      <div className="flex gap-1 rounded-xl border bg-muted/40 p-1 w-fit">
        {PROGRAMS.map(({ key, short, label }) => (
          <button
            key={key}
            onClick={() => setProgram(key)}
            className={cn(
              "relative rounded-lg px-5 py-2 text-sm font-medium transition-all",
              program === key
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Program description */}
      <p className="text-xs text-muted-foreground -mt-6 pl-1">
        {PROGRAMS.find((p) => p.key === program)?.desc}
      </p>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp} label="Employment Rate"
          value={`${stats.employmentRate}%`}
          sub={`Within 6 months — ${stats.year}`}
          highlight
        />
        <StatCard
          icon={DollarSign} label="Median Starting Salary"
          value={stats.salary}
          sub="CAD · base only"
        />
        <StatCard
          icon={Clock} label="Median Time to Offer"
          value={stats.timeToOffer}
          sub="After graduation"
        />
        <StatCard
          icon={Users} label="Graduating Class"
          value={stats.classSize}
          sub={`${stats.year} cohort`}
        />
      </div>

      {/* ── Charts row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Donut: sector breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Where Graduates Go</CardTitle>
            <p className="text-xs text-muted-foreground">Sector breakdown · % of employed graduates</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Donut */}
              <div className="shrink-0">
                <ChartContainer config={{}} className="h-[200px] w-[200px] aspect-square">
                  <PieChart>
                    <Pie
                      data={sectors}
                      dataKey="value"
                      nameKey="name"
                      cx="50%" cy="50%"
                      innerRadius={58} outerRadius={88}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {sectors.map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<PieTooltip />} />
                  </PieChart>
                </ChartContainer>
              </div>

              {/* Legend with expand */}
              <div className="flex-1 w-full space-y-0.5">
                {sectors.map((s) => (
                  <SectorLegendRow
                    key={s.name}
                    sector={s}
                    expanded={expandedSectors.has(s.name)}
                    onToggle={() => toggleSector(s.name)}
                  />
                ))}
              </div>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Info className="h-3 w-3 shrink-0" />
              Click a sector with an arrow to see sub-category breakdown
            </p>
          </CardContent>
        </Card>

        {/* Horizontal bars: top employers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Hiring Firms</CardTitle>
            <p className="text-xs text-muted-foreground">% of employed graduates · top {firms.length} employers</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {firms.map((f) => (
                <FirmBar
                  key={f.firm}
                  {...f}
                  maxPct={maxPct}
                  animate={animate}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
              {Object.entries(CAT_STYLE).map(([cat, s]) => (
                <span key={cat} className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", s.badge)}>
                  {cat}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Finance role breakdown (BCom & MBA) ─────────────────── */}
      {(program === "bcom" || program === "mba") && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Financial Services — Role Breakdown</CardTitle>
            <p className="text-xs text-muted-foreground">
              Of the {program === "bcom" ? "46%" : "38%"} entering Financial Services, distribution across roles
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {(SECTORS[program][0].sub ?? []).map((s, i) => {
                const total = SECTORS[program][0].value;
                const rolePct = Math.round((s.value / total) * 100);
                const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];
                const color = colors[i % colors.length];
                return (
                  <div key={s.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="tabular-nums font-bold ml-2 whitespace-nowrap">
                        {s.value}% of grads
                        <span className="text-muted-foreground font-normal ml-1">({rolePct}% of FS)</span>
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: animate ? `${(s.value / 20) * 100}%` : "0%",
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── MBA consulting breakdown ─────────────────────────────── */}
      {program === "mba" && SECTORS.mba[1].sub && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Consulting — Role Breakdown</CardTitle>
            <p className="text-xs text-muted-foreground">
              Of the 32% entering Consulting, distribution across firm tiers
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(SECTORS.mba[1].sub ?? []).map((s, i) => {
                const colors = ["#8b5cf6", "#a78bfa", "#c4b5fd"];
                return (
                  <div key={s.name} className="rounded-xl border p-4 text-center space-y-1">
                    <p className="text-2xl font-bold tabular-nums" style={{ color: colors[i] }}>
                      {s.value}%
                    </p>
                    <p className="text-xs font-medium text-foreground">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">of all graduates</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Alumni Spotlight ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Alumni Spotlight</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Notable graduates across programs — where they are now</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMUNITY.slice(0, 6).map((p) => (
            <SpotlightCard key={p.name} profile={p} />
          ))}
        </div>
      </section>

      <Separator />

      {/* ── Alumni Community ─────────────────────────────────────── */}
      <section>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Alumni Community</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect with UofT alumni across programs — reach out for coffee chats, referrals, or mentorship
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 mt-1">
            {COMMUNITY.length} members
          </Badge>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, firm, or sector…"
              value={communitySearch}
              onChange={(e) => setCommunitySearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCommunityFilter(null)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                !communityFilter ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
              )}
            >
              All
            </button>
            {sectors_in_community.map((sec) => (
              <button
                key={sec}
                onClick={() => setCommunityFilter(communityFilter === sec ? null : sec)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  communityFilter === sec
                    ? "bg-foreground text-background"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Community grid */}
        {filteredCommunity.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No alumni match your search</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different name or sector</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCommunity.map((p) => (
              <CommunityCard key={p.name} profile={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Rotman Alumni — Where Are They Now ──────────────────── */}
      <RotmanSection />

      {/* ── Data disclaimer ──────────────────────────────────────── */}
      <div className="rounded-lg border bg-muted/30 px-4 py-3 flex items-start gap-2">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="font-medium text-foreground">Data sources:</strong>{" "}
          Rotman Commerce Employment Report 2023, UofT Arts & Science Career Centre,
          and Rotman MBA Employment Statistics 2023. Employment rates reflect
          respondents employed within 6 months of graduation. Salary figures are
          median base salaries in CAD. Firm percentages represent share of employed
          graduates reporting that employer. Not all graduates responded to surveys.
        </p>
      </div>

    </div>
  );
}
