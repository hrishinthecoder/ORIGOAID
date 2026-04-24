import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Flame, TrendingUp, Clock, Sparkles, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useStore } from "@/lib/store";
import { CampaignCategory } from "@/data/campaigns";
import { cn } from "@/lib/utils";
import { formatBDT, percent } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES: ("All" | CampaignCategory)[] = [
  "All", "Education", "Healthcare", "Community", "Emergency", "Startup",
  "Agriculture", "Environment", "Technology", "Sports", "Arts", "Charity", "Religious"
];

type SortKey = "trending" | "newest" | "ending" | "most_funded";

const SORTS: { id: SortKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "trending", label: "Trending", icon: Flame },
  { id: "newest", label: "Newest", icon: Sparkles },
  { id: "ending", label: "Ending soon", icon: Clock },
  { id: "most_funded", label: "Most Funded", icon: TrendingUp },
];

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const campaigns = useStore((s) => s.campaigns);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("trending");
  const [maxGoal, setMaxGoal] = useState(3000000);
  const activeCat = (params.get("category") || "All") as typeof CATEGORIES[number];

  const setCat = (c: string) => {
    const next = new URLSearchParams(params);
    if (c === "All") next.delete("category");
    else next.set("category", c);
    setParams(next);
  };

  const filtered = useMemo(() => {
    let list = [...campaigns];
    if (activeCat !== "All") list = list.filter((c) => c.category === activeCat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.location || "").toLowerCase().includes(q) ||
          (c.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    list = list.filter((c) => c.goal <= maxGoal);
    if (sort === "ending") list.sort((a, b) => a.daysLeft - b.daysLeft);
    else if (sort === "newest")
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    else if (sort === "most_funded") list.sort((a, b) => b.raised - a.raised);
    else list.sort((a, b) => percent(b.raised, b.goal) - percent(a.raised, a.goal));
    return list;
  }, [campaigns, activeCat, query, sort, maxGoal]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="relative mb-12">
          {/* Liveliness: Ambient Background - Theme Adaptive */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[50%] h-[300px] bg-brand-emerald/10 blur-[120px] rounded-full opacity-30 md:opacity-40" />
          </div>

          <div className="container relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-tighter"
            >
              Discover <span className="text-brand-emerald italic">Impact</span>.
            </motion.h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              Every campaign is verified by our Board of Trustees. Start your journey of giving today.
            </p>

            <div className="bg-card/50 backdrop-blur-3xl border border-border p-2 rounded-[32px] flex items-center gap-3 max-w-3xl shadow-xl focus-within:border-brand-emerald/30 transition-all">
              <Search className="w-5 h-5 ml-4 text-muted-foreground/30 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search districts, organizations, or keywords..."
                className="flex-1 border-0 focus-visible:ring-0 bg-transparent h-12 text-base outline-none placeholder:text-muted-foreground/20 px-2"
              />
              {query && (
                <Button variant="ghost" size="icon" onClick={() => setQuery("")} className="rounded-2xl h-10 w-10 hover:bg-muted">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container relative z-10">
          {/* Category Chips - Modern Redesign - Theme Adaptive */}
          <div className="flex items-center gap-2.5 mb-10 overflow-x-auto no-scrollbar pb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "shrink-0 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border",
                  activeCat === c
                    ? "bg-brand-emerald border-brand-emerald text-white shadow-xl shadow-brand-emerald/20 scale-105"
                    : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
            {/* Sort Chips - Theme Adaptive */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mr-2">Sort by</span>
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={cn(
                    "px-5 py-3 rounded-2xl text-[11px] font-bold flex items-center gap-3 transition-all border",
                    sort === s.id
                      ? "bg-muted text-brand-emerald border-brand-emerald/50 shadow-sm"
                      : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50"
                  )}
                >
                  <s.icon className={cn("w-4 h-4", sort === s.id ? "text-brand-emerald" : "text-muted-foreground/30")} /> {s.label}
                </button>
              ))}
            </div>

            {/* Premium Slider UI - Theme Adaptive */}
            <div className="flex items-center gap-6 bg-card/50 border border-border p-4 md:p-6 rounded-[32px] md:min-w-[340px] shadow-sm">
              <SlidersHorizontal className="w-5 h-5 text-brand-emerald shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-3">
                  <span>Goal Ceiling</span>
                  <span className="font-mono text-brand-emerald">{formatBDT(maxGoal, { short: true })}</span>
                </div>
                <Slider
                  value={[maxGoal]}
                  max={3000000}
                  min={50000}
                  step={50000}
                  onValueChange={(v) => setMaxGoal(v[0])}
                  className="[&_[role=slider]]:bg-brand-emerald [&_[role=slider]]:border-brand-emerald"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
              Found <span className="text-foreground">{filtered.length}</span> Active Campaigns
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-32 rounded-[48px] bg-muted/20 border-2 border-dashed border-border"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-muted-foreground/20" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">No matches found</h3>
                <p className="text-muted-foreground/40 text-sm max-w-sm mx-auto leading-relaxed">
                  Adjust your search or filters to discover other amazing campaigns.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filtered.map((c) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={c.id}
                  >
                    <CampaignCard {...c} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
